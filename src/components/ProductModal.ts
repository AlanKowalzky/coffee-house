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
    modal.classList.add('show');
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
        console.log('Current modalImage src before:', modalImage.src);
        modalImage.src = imagePath;
        modalImage.alt = product.name;
        console.log('Current modalImage src after:', modalImage.src);
        
        modalImage.onload = () => {
          console.log('Image loaded successfully:', imagePath);
          console.log('Image dimensions:', modalImage.naturalWidth, 'x', modalImage.naturalHeight);
        };
        modalImage.onerror = (e) => {
          console.log('Image failed to load:', imagePath, e);
          console.log('Trying fallback image...');
          modalImage.src = 'assets/coffee-1.jpg';
        };
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
      
      // Bind events after content is rendered
      this.bindModalEvents(product);
    }, 10);
  }



  private closeModal(): void {
    console.log('Closing modal');
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }



  private bindModalEvents(product: Product): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    console.log('Binding modal events...');

    // Close events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn?.addEventListener('click', () => this.closeModal());
    overlay?.addEventListener('click', () => this.closeModal());

    // Add to cart button
    const addToCartBtn = modal.querySelector('#add-to-cart');
    addToCartBtn?.addEventListener('click', () => {
      this.addToCart(product, modal);
      this.closeModal();
    });

    // Size selection
    const sizeButtons = modal.querySelectorAll('[data-size]');
    console.log('Found size buttons:', sizeButtons.length);
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        console.log('Size button clicked:', btn.getAttribute('data-size'));
        modal.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePrice(product, modal);
      });
    });

    // Additive selection
    const additiveButtons = modal.querySelectorAll('[data-additive]');
    console.log('Found additive buttons:', additiveButtons.length);
    additiveButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        console.log('Additive button clicked:', btn.getAttribute('data-additive'));
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

  private addToCart(product: Product, modal: Element): void {
    const activeSize = modal.querySelector('[data-size].active');
    const activeAdditives = modal.querySelectorAll('[data-additive].active');
    
    const size = activeSize?.getAttribute('data-size') || 'S';
    const additives = Array.from(activeAdditives).map(additive => 
      additive.getAttribute('data-additive') || ''
    );
    
    this.cart.addItem(product, size, additives);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }


}