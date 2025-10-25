import { CartItem, Product } from '../types/api';
import { ApiService } from '../services/ApiService';

export class Cart {
  private items: CartItem[] = [];
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.loadCart();
  }

  public addItem(product: Product, size: string, additives: string[]): void {
    const existingItem = this.items.find(item => 
      item.productId === product.id && 
      item.size === size && 
      JSON.stringify(item.additives) === JSON.stringify(additives)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: this.calculatePrice(product, size, additives),
        size,
        additives,
        quantity: 1
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
        item.quantity = quantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  public getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  public getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  public renderCartModal(): string {
    const itemsHtml = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Rozmiar: ${item.size}</p>
          ${item.additives.length > 0 ? `<p>Dodatki: ${item.additives.join(', ')}</p>` : ''}
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          <button onclick="cart.removeItem('${item.id}')" class="remove-btn">Usuń</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="cart-modal" id="cartModal">
        <div class="cart-content">
          <span class="cart-close">&times;</span>
          <h2>Koszyk</h2>
          <div class="cart-items">
            ${this.items.length > 0 ? itemsHtml : '<p>Koszyk jest pusty</p>'}
          </div>
          ${this.items.length > 0 ? `
            <div class="cart-total">
              <h3>Razem: $${this.getTotal().toFixed(2)}</h3>
              <button id="checkoutBtn" class="checkout-btn">Zamów</button>
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
          🛒 Koszyk (<span id="cartCount">0</span>)
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
      alert('Musisz się zalogować, aby złożyć zamówienie');
      return;
    }

    try {
      await this.apiService.createOrder(this.items);
      alert('Zamówienie zostało złożone!');
      this.items = [];
      this.saveCart();
      this.updateCartDisplay();
      this.closeCartModal();
    } catch (error) {
      alert('Błąd podczas składania zamówienia');
    }
  }

  private calculatePrice(product: Product, size: string, additives: string[]): number {
    let price = product.price;
    
    // Dodaj cenę za rozmiar
    if (size === 'M') price += 0.50;
    if (size === 'L') price += 1.00;
    
    // Dodaj cenę za dodatki
    price += additives.length * 0.50;
    
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