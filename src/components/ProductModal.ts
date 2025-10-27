import { Product } from '../types/api';
import { Cart } from './Cart';

export class ProductModal {
  private cart: Cart;
  private tooltipElement: HTMLElement | null = null;
  private escListener?: (e: KeyboardEvent) => void;
  private isAdding: boolean = false;

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
    // add Esc key listener to close modal
    this.escListener = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', this.escListener);
    
  // Update modal content after showing
  setTimeout((): void => {
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
        const imagePath = product.image;
        console.log('Setting image src to:', imagePath);
        console.log('Current modalImage src before:', modalImage.src);
        modalImage.src = imagePath;
        modalImage.alt = product.name;
        console.log('Current modalImage src after:', modalImage.src);
        
        modalImage.onload = (): void => {
          console.log('Image loaded successfully:', imagePath);
          console.log('Image dimensions:', modalImage.naturalWidth, 'x', modalImage.naturalHeight);
        };
  modalImage.onerror = (): void => {
          console.log('Image failed to load:', imagePath);
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
  sizeOptions.innerHTML = product.sizes.map((size, index): string => `
          <button class="option-btn ${index === 0 ? 'active' : ''}" data-size="${size.id}" data-price="${size.price}">
            <span class="option-icon">${size.id}</span>
            <span class="option-text">${size.name}</span>
          </button>
        `).join('');
      }
      
      // Render additive options
      if (additivesOptions) {
  additivesOptions.innerHTML = product.additives.map((additive, index): string => `
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
      // remove esc listener when modal closes
      if (this.escListener) {
        document.removeEventListener('keydown', this.escListener);
        this.escListener = undefined;
      }
      // remove any tooltip left behind
      if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
      }
    }
  }



  private bindModalEvents(product: Product): void {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    console.log('Binding modal events...');

    // Close events - use onclick to overwrite previous handlers and avoid duplicates
    const closeBtn = modal.querySelector('.modal-close') as HTMLElement | null;
    const overlay = modal.querySelector('.modal-overlay') as HTMLElement | null;
  if (closeBtn) closeBtn.onclick = (): void => this.closeModal();
  if (overlay) overlay.onclick = (): void => this.closeModal();

    // Add to cart button - assign onclick to avoid multiple listeners stacking
    const addToCartBtn = modal.querySelector('#add-to-cart') as HTMLElement | null;
    if (addToCartBtn) {
      addToCartBtn.onclick = (): void => {
        if (this.isAdding) return;
        this.isAdding = true;
        // disable button to avoid multiple clicks
        (addToCartBtn as HTMLButtonElement).disabled = true;
        try {
          this.addToCart(product, modal);
          this.closeModal();
        } finally {
          // reset guard shortly after to allow future adds
          setTimeout((): void => {
            this.isAdding = false;
            (addToCartBtn as HTMLButtonElement).disabled = false;
          }, 300);
        }
      };
    }

    // Size selection
    const sizeButtons = modal.querySelectorAll('[data-size]');
    console.log('Found size buttons:', sizeButtons.length);
  sizeButtons.forEach((btn): void => {
      // tooltip handlers for size
    btn.addEventListener('mouseenter', (ev: Event): void => { this.showPriceTooltip(ev, btn as HTMLElement); });
    btn.addEventListener('mouseleave', (): void => { this.hidePriceTooltip(); });

    btn.addEventListener('click', (): void => {
        console.log('Size button clicked:', btn.getAttribute('data-size'));
        modal.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updatePrice(product, modal);
      });
    });

    // Additive selection
    const additiveButtons = modal.querySelectorAll('[data-additive]');
    console.log('Found additive buttons:', additiveButtons.length);
  additiveButtons.forEach((btn): void => {
      // tooltip handlers for additives
    btn.addEventListener('mouseenter', (ev: Event): void => { this.showPriceTooltip(ev, btn as HTMLElement); });
    btn.addEventListener('mouseleave', (): void => { this.hidePriceTooltip(); });

    btn.addEventListener('click', (): void => {
        console.log('Additive button clicked:', btn.getAttribute('data-additive'));
        btn.classList.toggle('active');
        this.updatePrice(product, modal);
      });
    });
  }

  private showPriceTooltip(ev: Event, target: HTMLElement): void {
    const priceAttr = target.getAttribute('data-price');
    if (!priceAttr) return;
  const price = parseFloat(priceAttr);
  const text = isNaN(price) ? priceAttr : `$${price.toFixed(2)}`;

    // remove existing tooltip
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }

    const rect = target.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.className = 'price-tooltip';
    tooltip.textContent = text;
    // basic inline styles so it works without CSS changes
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0,0,0,0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '9999';

    document.body.appendChild(tooltip);
    // position tooltip above the target, centered
    const tRect = tooltip.getBoundingClientRect();
    const left = rect.left + window.scrollX + rect.width / 2 - tRect.width / 2;
    const top = rect.top + window.scrollY - tRect.height - 8;
    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;

    this.tooltipElement = tooltip;
  }

  private hidePriceTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
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