import { CartItem, Product } from '../types/api';
import { ApiService } from '../services/ApiService';

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
          <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          <button onclick="cart.removeItem('${item.id}')" class="remove-btn">Remove</button>
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
  }

  private closeCartModal(): void {
    document.getElementById('cartModal')?.remove();
  }

  private async checkout(): Promise<void> {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('You must login to place an order');
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
      await this.apiService.placeOrder(orderData);
      alert('Order placed successfully!');
      this.items = [];
      this.saveCart();
      this.updateCartDisplay();
      this.closeCartModal();
    } catch (error) {
      alert('Error placing order');
    }
  }

  private calculatePrice(product: Product, size: any, additives: any[]): number {
    let price = product.price;
    
    // Dodaj cenę za rozmiar
    if (size && size.price) {
      price += size.price;
    }
    
    // Dodaj cenę za dodatki
    if (additives && additives.length > 0) {
      price += additives.reduce((sum, additive) => sum + (additive.price || 0), 0);
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