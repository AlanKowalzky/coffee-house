import { Product } from '../types/api';
import { Cart } from './Cart';

export class ProductModal {
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  public showModal(product: Product): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Update modal content
    const modalImage = document.getElementById('modal-product-image') as HTMLImageElement;
    const modalName = document.getElementById('modal-product-name');
    const modalDescription = document.getElementById('modal-product-description');
    const sizeOptions = document.getElementById('size-options');
    const additivesOptions = document.getElementById('additives-options');
    const totalPrice = document.getElementById('total-price');
    
    if (modalImage) {
      modalImage.src = `assets/${product.image}`;
      modalImage.alt = product.name;
    }
    if (modalName) modalName.textContent = product.name;
    if (modalDescription) modalDescription.textContent = product.description;
    
    // Render size options
    if (sizeOptions) {
      sizeOptions.innerHTML = product.sizes.map((size, index) => `
        <button class="option-btn ${index === 0 ? 'active' : ''}" data-size="${size.id}" data-price="${size.price}">
          <span class="option-icon">${size.id}</span>
          <span class="option-text">${size.name}</span>
        </button>
      `).join('');
    }
    
    // Render additive options
    if (additivesOptions) {
      additivesOptions.innerHTML = product.additives.map((additive, index) => `
        <button class="option-btn" data-additive="${additive.id}" data-price="${additive.price}">
          <span class="option-icon">${index + 1}</span>
          <span class="option-text">${additive.name}</span>
        </button>
      `).join('');
    }
    
    // Set initial price
    if (totalPrice) totalPrice.textContent = `$${product.price.toFixed(2)}`;
    
    // Remove old event listeners
    this.removeModalEvents();
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add new event listeners
    this.bindModalEvents(product);
  }



  private closeModal(): void {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  private removeModalEvents(): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    // Clone and replace modal to remove all event listeners
    const newModal = modal.cloneNode(true);
    modal.parentNode?.replaceChild(newModal, modal);
  }

  private bindModalEvents(product: Product): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    // Close modal events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      });
    }

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

    // Escape key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
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