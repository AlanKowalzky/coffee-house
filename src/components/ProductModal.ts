import { Product } from '../types/api';
import { Cart } from './Cart';

export class ProductModal {
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  public showModal(product: Product): void {
    const existingModal = document.getElementById('product-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Update modal content
    const modalImage = document.getElementById('modal-product-image') as HTMLImageElement;
    const modalName = document.getElementById('modal-product-name');
    const modalDescription = document.getElementById('modal-product-description');
    const sizeOptions = document.getElementById('size-options');
    const additivesOptions = document.getElementById('additives-options');
    const totalPrice = document.getElementById('total-price');
    
    if (modalImage) modalImage.src = `assets/${product.image}`;
    if (modalName) modalName.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    
    // Render size options
    if (sizeOptions) {
      sizeOptions.innerHTML = product.sizes.map((size, index) => `
        <button class="option-btn ${index === 0 ? 'active' : ''}" data-size="${size.id}" data-price="${size.price}">
          <span class="option-icon">S</span>
          <span class="option-text">${size.name}</span>
        </button>
      `).join('');
    }
    
    // Render additive options
    if (additivesOptions) {
      additivesOptions.innerHTML = product.additives.map(additive => `
        <button class="option-btn" data-additive="${additive.id}" data-price="${additive.price}">
          <span class="option-icon">1</span>
          <span class="option-text">${additive.name}</span>
        </button>
      `).join('');
    }
    
    // Set initial price
    if (totalPrice) totalPrice.textContent = `$${product.price.toFixed(2)}`;
    
    // Show modal
    modal.style.display = 'flex';
    
    this.bindModalEvents(product);
  }



  private bindModalEvents(product: Product): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.style.display = 'none';
    };
    
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    // Size selection
    modal.querySelectorAll('[data-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePrice(product, modal);
      });
    });

    // Additive selection
    modal.querySelectorAll('[data-additive]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        this.updatePrice(product, modal);
      });
    });
  }

  private updatePrice(product: Product, modal: Element): void {
    let totalPrice = product.price;

    // Add size price
    const activeSize = modal.querySelector('[data-size].active');
    if (activeSize) {
      const sizePrice = parseFloat(activeSize.getAttribute('data-price') || '0');
      totalPrice += sizePrice;
    }

    // Add additive prices
    const activeAdditives = modal.querySelectorAll('[data-additive].active');
    activeAdditives.forEach(additive => {
      const additivePrice = parseFloat(additive.getAttribute('data-price') || '0');
      totalPrice += additivePrice;
    });

    const totalPriceElement = modal.querySelector('#total-price');
    if (totalPriceElement) {
      totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
  }


}