import { ApiService } from './services/ApiService';
import { Auth } from './components/Auth';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { Product, ProductCategory } from './types/api';

// Import styles
import '../styles/style.css';
import './styles/index.css';

class App {
  private apiService: ApiService;
  private auth: Auth;
  private cart: Cart;
  private productModal: ProductModal;

  constructor() {
    this.apiService = new ApiService();
    this.cart = new Cart(this.apiService);
    this.auth = new Auth(this.apiService);
    this.productModal = new ProductModal(this.cart);
    this.init();
  }

  private init(): void {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Coffee House Business App initialized');
      
      this.initializeComponents();
      this.enhanceExistingMenu();
    });
  }

  private initializeComponents(): void {
    this.auth.initializeAuth();
    this.auth.checkAuthStatus();
    this.cart.initializeCart();
  }

  private enhanceExistingMenu(): void {
    // Dodaj funkcjonalność do istniejących produktów w menu
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const productCard = target.closest('.menu-item');
      
      if (productCard && target.classList.contains('menu-item')) {
        const productName = productCard.querySelector('h4')?.textContent || '';
        const productPrice = parseFloat(productCard.querySelector('.price')?.textContent?.replace('$', '') || '0');
        
        const product: Product = {
          id: Date.now().toString(),
          name: productName,
          description: 'Opis produktu',
          price: productPrice,
          category: ProductCategory.COFFEE,
          image: 'default.jpg',
          sizes: [
            { id: 'S', name: 'Small', price: 0 },
            { id: 'M', name: 'Medium', price: 0.50 },
            { id: 'L', name: 'Large', price: 1.00 }
          ],
          additives: [
            { id: 'sugar', name: 'Sugar', price: 0 },
            { id: 'milk', name: 'Milk', price: 0.50 }
          ]
        };
        
        this.productModal.showModal(product);
      }
    });
  }

  public getCart(): Cart {
    return this.cart;
  }
}

// Initialize the application
const app = new App();

// Expose cart globally for modal interactions
(window as any).cart = app.getCart();