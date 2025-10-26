import { ApiService } from './services/ApiService';
import { Auth } from './components/Auth';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { Menu } from './components/Menu';
import { BurgerMenu } from './components/BurgerMenu';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { Product, ProductCategory } from './types/api';

// Import styles
import '../styles/style.css';
import './styles/index.css';

class MenuApp {
  private apiService: ApiService;
  private auth: Auth;
  private cart: Cart;
  private productModal: ProductModal;
  private menu: Menu;
  private burgerMenu: BurgerMenu;
  private products: Product[] = [];
  private currentCategory: ProductCategory = ProductCategory.COFFEE;
  private displayedCount: number = 4;

  constructor() {
    this.apiService = new ApiService();
    this.cart = new Cart(this.apiService);
    this.auth = new Auth(this.apiService);
    this.productModal = new ProductModal(this.cart);
    this.menu = new Menu();
    this.burgerMenu = new BurgerMenu();
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('Coffee House Menu App initialized');
        this.initializeComponents();
        this.loadProducts();
        this.bindEvents();
      });
    } else {
      console.log('Coffee House Menu App initialized');
      this.initializeComponents();
      this.loadProducts();
      this.bindEvents();
    }
  }

  private initializeComponents(): void {
    this.auth.initializeAuth();
    this.auth.checkAuthStatus();
    this.cart.initializeCart();
  }

  private async loadProducts(): Promise<void> {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    const loader = new Loader();
    loader.show(menuGrid);

    try {
      this.products = await this.apiService.getProducts();
      console.log('API products loaded:', this.products.length);
      loader.hide();
      this.displayProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      loader.hide();
      ErrorMessage.getInstance().show('Something went wrong. Please, refresh the page');
      // Load mock products if API fails
      this.loadMockProducts();
      console.log('Mock products loaded:', this.products.length);
      this.displayProducts();
    }
  }

  private loadMockProducts(): void {
    this.products = [
      {
        id: '1',
        name: 'Irish coffee',
        description: 'Fragrant black coffee with Jameson Irish whiskey and whipped milk',
        price: 7.00,
        category: ProductCategory.COFFEE,
        image: 'coffee-1.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'cinnamon', name: 'Cinnamon', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '2',
        name: 'Kahlua coffee',
        description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
        price: 7.00,
        category: ProductCategory.COFFEE,
        image: 'coffee-2.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'cinnamon', name: 'Cinnamon', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '3',
        name: 'Honey cappuccino',
        description: 'Espresso with frothed milk and natural honey',
        price: 5.50,
        category: ProductCategory.COFFEE,
        image: 'coffee-3.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'cinnamon', name: 'Cinnamon', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '4',
        name: 'Espresso',
        description: 'Classic black coffee made from freshly ground beans',
        price: 4.50,
        category: ProductCategory.COFFEE,
        image: 'coffee-4.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'cinnamon', name: 'Cinnamon', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '5',
        name: 'Green Tea',
        description: 'Fresh green tea with natural antioxidants',
        price: 3.50,
        category: ProductCategory.TEA,
        image: 'tea-1.png',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'honey', name: 'Honey', price: 0.50 },
          { id: 'lemon', name: 'Lemon', price: 0.30 }
        ]
      },
      {
        id: '6',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with cream frosting',
        price: 4.50,
        category: ProductCategory.DESSERT,
        image: 'dessert-1.png',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'L', name: 'Large', price: 1.50 }
        ],
        additives: [
          { id: 'berries', name: 'Berries', price: 0.50 }
        ]
      }
    ];
  }

  private displayProducts(): void {
    console.log('Displaying products:', this.products.length, 'Category:', this.currentCategory);
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) {
      console.log('Menu grid not found!');
      return;
    }

    console.log('All products with categories:', this.products.map(p => ({name: p.name, category: p.category})));
    const filteredProducts = this.products.filter(product => product.category === this.currentCategory);
    console.log('Filtered products:', filteredProducts.length, 'for category:', this.currentCategory);
    console.log('Filtered product names:', filteredProducts.map(p => p.name));
    const productsToShow = filteredProducts.slice(0, this.displayedCount);
    console.log('Products to show:', productsToShow.length, 'Display count:', this.displayedCount);

    menuGrid.innerHTML = productsToShow.map(product => `
      <div class="menu-item" data-product-id="${product.id}">
        <img src="assets/${product.image}" alt="${product.name}" class="menu-item-image">
        <div class="menu-item-info">
          <h3 class="menu-item-name">${product.name}</h3>
          <p class="menu-item-description">${product.description}</p>
          <span class="menu-item-price">$${product.price.toFixed(2)}</span>
        </div>
      </div>
    `).join('');

    console.log('Menu grid HTML updated');

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = filteredProducts.length > this.displayedCount ? 'block' : 'none';
    }
  }

  private bindEvents(): void {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const category = target.getAttribute('data-category') as ProductCategory;
        this.switchCategory(category);
      });
    });

    // Menu items - use document delegation since menu-grid content changes
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Skip modal clicks
      if (target.closest('.modal')) {
        console.log('Modal click ignored');
        return;
      }
      
      console.log('Document click on:', target.className, target.tagName);
      const menuItem = target.closest('.menu-item') as HTMLElement;
      
      if (menuItem) {
        console.log('Menu item clicked!');
        const productId = menuItem.getAttribute('data-product-id');
        console.log('Product ID:', productId);
        const product = this.products.find(p => p.id === productId);
        console.log('Found product:', product?.name);
        if (product) {
          console.log('Calling showModal...');
          this.productModal.showModal(product);
        }
      }
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.displayedCount += 4;
        this.displayProducts();
      });
    }
  }

  private switchCategory(category: ProductCategory): void {
    this.currentCategory = category;
    this.displayedCount = 4;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

    this.displayProducts();
  }

  public getCart(): Cart {
    return this.cart;
  }
}

// Initialize the menu application
const menuApp = new MenuApp();

// Expose cart globally for modal interactions
(window as any).cart = menuApp.getCart();