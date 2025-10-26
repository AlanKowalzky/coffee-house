import { ApiService } from './services/ApiService';
import { apiLog } from './services/DebugLog';
import { Auth } from './components/Auth';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { Menu } from './components/Menu';
import { Carousel } from './components/Carousel';
import { BurgerMenu } from './components/BurgerMenu';
import { Product, ProductCategory } from './types/api';

// Import styles
import '../styles/style.css';
import './styles/index.css';

class App {
  private apiService: ApiService;
  private auth: Auth;
  private cart: Cart;
  private productModal: ProductModal;
  private menu: Menu;
  private carousel: Carousel;
  private burgerMenu: BurgerMenu;

  constructor() {
    this.apiService = new ApiService();
    this.cart = new Cart(this.apiService);
    this.auth = new Auth(this.apiService);
    this.productModal = new ProductModal(this.cart);
    this.menu = new Menu();
    this.carousel = new Carousel();
    this.burgerMenu = new BurgerMenu();
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Coffee House Business App initialized');
        this.initializeComponents();
        this.enhanceExistingMenu();
      });
    } else {
      console.log('Coffee House Business App initialized');
      this.initializeComponents();
      this.enhanceExistingMenu();
    }
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

    // Fetch favorites when user clicks the nav link or any anchor pointing to #favorites
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href="#favorites"]') as HTMLAnchorElement | null;
      if (anchor) {
        e.preventDefault();
        apiLog('Favorites click detected - fetching favorite products');
        this.apiService.getFavoriteProducts()
          .then(products => {
            apiLog('ApiService.getFavoriteProducts - success', products);
            // keep UI update minimal for now; consumers can inspect console logs
          })
          .catch(err => {
            apiLog('ApiService.getFavoriteProducts - error', err, (err as any)?.message || JSON.stringify(err));
          });
      }
    });
  }

  public getCart(): Cart {
    return this.cart;
  }
}

// Initialize the application (guard to avoid multiple instances)
if (!(window as any).__coffeeHouseAppInitialized) {
  const app = new App();
  // Expose cart globally for modal interactions
  (window as any).cart = app.getCart();
  (window as any).__coffeeHouseAppInitialized = true;
}