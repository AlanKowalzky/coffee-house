import { Product } from '../types/api';
import { Cart } from './Cart';

export class ProductModal {
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  public showModal(product: Product): void {
    console.log('showModal called with product:', product.name, product.image);
    const modal = document.getElementById('product-modal');
    if (!modal) {
      console.log('Modal not found!');
      return;
    }
    
    console.log('Modal found, showing...');
    // Show modal first
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Update modal content after showing
    setTimeout(() => {
      console.log('Updating modal content...');
      const modalImage = document.getElementById('modal-product-image') as HTMLImageElement;
      const modalName = document.getElementById('modal-product-name');
      const modalDescription = document.getElementById('modal-product-description');
      const sizeOptions = document.getElementById('size-options');
      const additivesOptions = document.getElementById('additives-options');
      const totalPrice = document.getElementById('total-price');
      
      console.log('Modal elements found:', {
        image: !!modalImage,
        name: !!modalName,
        description: !!modalDescription,
        sizeOptions: !!sizeOptions,
        additivesOptions: !!additivesOptions,
        totalPrice: !!totalPrice
      });
      
      if (modalImage) {
        const imagePath = `assets/${product.image}`;
        console.log('Setting image src to:', imagePath);
        modalImage.src = imagePath;
        modalImage.alt = product.name;
        
        modalImage.onload = () => console.log('Image loaded successfully:', imagePath);
        modalImage.onerror = () => console.log('Image failed to load:', imagePath);
      } else {
        console.log('Modal image element not found!');
      }
      
      if (modalName) {
        modalName.textContent = product.name;
        console.log('Set modal name to:', product.name);
      }
      if (modalDescription) {
        modalDescription.textContent = product.description;
        console.log('Set modal description');
      }
      
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
    }, 10);
    
    // Bind events
    this.bindModalEvents(product);
  }



  private closeModal(): void {
    console.log('Closing modal');
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }



  private bindModalEvents(product: Product): void {
    console.log('Binding modal events...');
    // Simple direct event binding
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log('Document click on:', target.className, target.tagName);
      
      // Close modal
      if (target.classList.contains('modal-close') || target.classList.contains('modal-overlay')) {
        console.log('Close button or overlay clicked!');
        this.closeModal();
        return;
      }
      
      // Size selection
      if (target.closest('[data-size]')) {
        const btn = target.closest('[data-size]') as HTMLElement;
        document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePrice(product, document.getElementById('product-modal')!);
        return;
      }
      
      // Additive selection
      if (target.closest('[data-additive]')) {
        const btn = target.closest('[data-additive]') as HTMLElement;
        btn.classList.toggle('active');
        this.updatePrice(product, document.getElementById('product-modal')!);
        return;
      }
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