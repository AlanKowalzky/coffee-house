import { CartItem, Product } from '../types/api';
import { ApiService } from '../services/ApiService';
import { apiLog } from '../services/DebugLog';
import { showToast } from './Toast';

export class Cart {
  private items: CartItem[] = [];
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.loadCart();
  }

  public addItem(product: Product, sizeId: string, additiveIds: string[]): void {
    const size = product.sizes.find(s => s.id === sizeId) || product.sizes[0];
    const additives = product.additives.filter(a => additiveIds.includes(a.id));
    
    const existingItem = this.items.find(item => 
      item.product.id === product.id && 
      item.size.id === size.id && 
      JSON.stringify(item.additives.map(a => a.id)) === JSON.stringify(additives.map(a => a.id))
    );

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = this.calculatePrice(product, size, additives) * existingItem.quantity;
    } else {
      this.items.push({
        id: Date.now().toString(),
        product,
        size,
        additives,
        quantity: 1,
        totalPrice: this.calculatePrice(product, size, additives)
      });
    }

    this.saveCart();
    this.updateCartDisplay();
  }

  public removeItem(itemId: string): void {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
  }

  public updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        const unitPrice = item.totalPrice / item.quantity;
        item.quantity = quantity;
        item.totalPrice = unitPrice * quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  public getTotal(): number {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  public getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  public renderCartModal(): string {
    const itemsHtml = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.product.name}</h4>
          <p>Size: ${item.size.name}</p>
          ${item.additives.length > 0 ? `<p>Additives: ${item.additives.map(a => a.name).join(', ')}</p>` : ''}
          <p class="cart-item-price">$${(item.totalPrice / item.quantity).toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="cart-decrease-btn" data-item-id="${item.id}" data-qty="${item.quantity}">-</button>
          <span>${item.quantity}</span>
          <button class="cart-increase-btn" data-item-id="${item.id}" data-qty="${item.quantity}">+</button>
          <button class="cart-remove-btn" data-item-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="cart-modal" id="cartModal">
        <div class="cart-content">
          <span class="cart-close">&times;</span>
          <h2>Cart</h2>
          <div class="cart-items">
            ${this.items.length > 0 ? itemsHtml : '<p>Cart is empty</p>'}
          </div>
          ${this.items.length > 0 ? `
            <div class="cart-total">
              <h3>Total: $${this.getTotal().toFixed(2)}</h3>
              <button id="checkoutBtn" class="checkout-btn">Order</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  public initializeCart(): void {
    this.addCartButton();
    this.bindEvents();
  }

  private addCartButton(): void {
    const header = document.querySelector('header .container');
    if (header) {
      const cartButton = document.createElement('div');
      cartButton.className = 'cart-button';
      cartButton.innerHTML = `
        <button id="cartBtn" class="cart-btn">
          🛒 Cart (<span id="cartCount">0</span>)
        </button>
      `;
      header.appendChild(cartButton);
    }
    this.updateCartDisplay();
  }

  private bindEvents(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.id === 'cartBtn') this.showCartModal();
      if (target.classList.contains('cart-close')) this.closeCartModal();
      if (target.id === 'checkoutBtn') this.checkout();
    });
  }

  private showCartModal(): void {
    document.body.insertAdjacentHTML('beforeend', this.renderCartModal());
    this.bindCartModalEvents();
  }

  private bindCartModalEvents(): void {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    cartModal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('cart-remove-btn')) {
        const itemId = target.getAttribute('data-item-id');
        if (itemId) {
          this.removeItem(itemId);
          this.refreshCartModal();
        }
      }
      
      if (target.classList.contains('cart-decrease-btn')) {
        const itemId = target.getAttribute('data-item-id');
        const currentQty = parseInt(target.getAttribute('data-qty') || '1');
        if (itemId) {
          this.updateQuantity(itemId, currentQty - 1);
          this.refreshCartModal();
        }
      }
      
      if (target.classList.contains('cart-increase-btn')) {
        const itemId = target.getAttribute('data-item-id');
        const currentQty = parseInt(target.getAttribute('data-qty') || '1');
        if (itemId) {
          this.updateQuantity(itemId, currentQty + 1);
          this.refreshCartModal();
        }
      }
    });
  }

  private refreshCartModal(): void {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.remove();
      this.showCartModal();
    }
  }

  private closeCartModal(): void {
    document.getElementById('cartModal')?.remove();
  }

  private async checkout(): Promise<void> {
    const user = localStorage.getItem('user');
    if (!user) {
      apiLog('Cart.checkout - not authenticated', 'User must login to place an order');
      console.warn('You must login to place an order');
      return;
    }

    try {
      const userData = JSON.parse(user);
      const orderData = {
        items: this.items,
        totalAmount: this.getTotal(),
        deliveryAddress: {
          city: userData.city || 'Default City',
          street: userData.street || 'Default Street',
          house: userData.house || 1
        }
      };
  apiLog('Cart.checkout - orderData', orderData);
      // show loader overlay
      this.showLoader();

      // attempt to place order (ApiService has internal retry for 5xx)
      const resp = await this.apiService.placeOrder(orderData);
  apiLog('Cart.checkout - placeOrder response', resp);
      apiLog('Cart.checkout - success', resp);
      console.log('Order placed successfully!', resp);
      // save to local order history
      this.saveOrderHistory(resp);
      showToast('Order placed successfully!', 'success');
      this.items = [];
      this.saveCart();
      this.updateCartDisplay();
      this.closeCartModal();
      this.hideLoader();
    } catch (error) {
      const e = error as unknown;
      let message = 'Unknown error';
      try {
        const maybeErr = e as { message?: string };
        message = maybeErr?.message || JSON.stringify(e);
      } catch {
        // keep fallback message
      }
      apiLog('Cart.checkout - error', error, message);
      console.error('Error placing order:', message);
      showToast(`Error placing order: ${message}`, 'error');
      this.hideLoader();
    }
  }

  // Loader overlay helpers
  private showLoader(): void {
    if (document.getElementById('cart-loader')) return;
    const overlay = document.createElement('div');
    overlay.id = 'cart-loader';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.3)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '100000';
    overlay.innerHTML = `<div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12);">Processing order...</div>`;
    document.body.appendChild(overlay);
  }

  private hideLoader(): void {
    document.getElementById('cart-loader')?.remove();
  }

  private saveOrderHistory(resp: unknown): void {
    try {
      const key = 'orderHistory';
      const existing = localStorage.getItem(key);
      const arr = existing ? JSON.parse(existing) : [];
      const respAny = resp as Record<string, unknown> | null;
      arr.unshift({ id: respAny?.['orderId'] || Date.now(), timestamp: new Date().toISOString(), response: resp });
      localStorage.setItem(key, JSON.stringify(arr.slice(0, 20)));
    } catch {
      console.warn('Failed to save order history');
    }
  }

  private calculatePrice(product: Product, size: { price?: number } | null, additives: Array<{ price?: number }> = []): number {
    let price = product.price;

    // Add size price
    if (size && typeof size.price === 'number') {
      price += size.price;
    }

    // Add additives price
    if (additives && additives.length > 0) {
      price += additives.reduce((sum, additive) => sum + (typeof additive.price === 'number' ? additive.price : 0), 0);
    }

    return price;
  }

  private updateCartDisplay(): void {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = this.getItemCount().toString();
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }
}