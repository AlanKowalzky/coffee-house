import { Product } from '../types/api';
import { Cart } from './Cart';

export class ProductModal {
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart;
  }

  public renderModal(product: Product): string {
    return `
      <div class="modal" id="productModal">
        <div class="modal-content">
          <span class="modal-close">&times;</span>
          <div class="modal-body">
            <img src="assets/menu/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${product.name}">
            <div class="modal-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              
              <div class="size-selection">
                <h4>Rozmiar</h4>
                <div class="size-options">
                  <label><input type="radio" name="size" value="S" checked> S <span class="size-price">$${product.price.toFixed(2)}</span></label>
                  <label><input type="radio" name="size" value="M"> M <span class="size-price">$${(product.price + 0.50).toFixed(2)}</span></label>
                  <label><input type="radio" name="size" value="L"> L <span class="size-price">$${(product.price + 1.00).toFixed(2)}</span></label>
                </div>
              </div>

              <div class="additives-selection">
                <h4>Dodatki</h4>
                <div class="additives-options">
                  <label><input type="checkbox" name="additive" value="Dodatkowy shot"> Dodatkowy shot <span class="additive-price">+$0.50</span></label>
                  <label><input type="checkbox" name="additive" value="Mleko kokosowe"> Mleko kokosowe <span class="additive-price">+$0.50</span></label>
                  <label><input type="checkbox" name="additive" value="Syrop waniliowy"> Syrop waniliowy <span class="additive-price">+$0.50</span></label>
                  <label><input type="checkbox" name="additive" value="Śmietanka"> Śmietanka <span class="additive-price">+$0.50</span></label>
                </div>
              </div>

              <div class="modal-footer">
                <div class="total-price">
                  Razem: $<span id="modalTotalPrice">${product.price.toFixed(2)}</span>
                </div>
                <button id="addToCartBtn" class="add-to-cart-btn">Dodaj do koszyka</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public showModal(product: Product): void {
    document.body.insertAdjacentHTML('beforeend', this.renderModal(product));
    this.bindModalEvents(product);
    this.updatePrice(product);
  }

  private bindModalEvents(product: Product): void {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Zamknij modal
    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      modal.remove();
    });

    // Kliknięcie poza modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Aktualizuj cenę przy zmianie opcji
    modal.querySelectorAll('input[name="size"], input[name="additive"]').forEach(input => {
      input.addEventListener('change', () => this.updatePrice(product));
    });

    // Dodaj do koszyka
    modal.querySelector('#addToCartBtn')?.addEventListener('click', () => {
      this.addToCart(product);
      modal.remove();
    });
  }

  private updatePrice(product: Product): void {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const selectedSize = (modal.querySelector('input[name="size"]:checked') as HTMLInputElement)?.value || 'S';
    const selectedAdditives = Array.from(modal.querySelectorAll('input[name="additive"]:checked'))
      .map(input => (input as HTMLInputElement).value);

    let totalPrice = product.price;

    // Dodaj cenę za rozmiar
    if (selectedSize === 'M') totalPrice += 0.50;
    if (selectedSize === 'L') totalPrice += 1.00;

    // Dodaj cenę za dodatki
    totalPrice += selectedAdditives.length * 0.50;

    const totalPriceElement = modal.querySelector('#modalTotalPrice');
    if (totalPriceElement) {
      totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  }

  private addToCart(product: Product): void {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const selectedSize = (modal.querySelector('input[name="size"]:checked') as HTMLInputElement)?.value || 'S';
    const selectedAdditives = Array.from(modal.querySelectorAll('input[name="additive"]:checked'))
      .map(input => (input as HTMLInputElement).value);

    this.cart.addItem(product, selectedSize, selectedAdditives);
    
    // Pokaż komunikat o dodaniu do koszyka
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Produkt dodany do koszyka!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
}