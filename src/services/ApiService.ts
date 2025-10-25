import { Product, User, LoginCredentials, RegisterData, ApiResponse, OrderRequest, OrderResponse } from '../types/api.js';

export class ApiService {
  private readonly baseUrl = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

  async getFavoriteProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/favorites`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Product[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      throw new Error('Failed to load favorite products');
    }
  }

  async getProducts(): Promise<Product[]> {
    // Add more coffee products
    return [
      {
        id: '1',
        name: 'Irish coffee',
        description: 'Fragrant black coffee with Jameson Irish whiskey and whipped milk',
        price: 7.00,
        category: 'coffee' as any,
        image: 'coffee-1.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'milk', name: 'Milk', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '2',
        name: 'Kahlua coffee',
        description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
        price: 7.00,
        category: 'coffee' as any,
        image: 'coffee-2.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'milk', name: 'Milk', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '3',
        name: 'Green Tea',
        description: 'Fresh green tea with natural antioxidants',
        price: 3.50,
        category: 'tea' as any,
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
        id: '3',
        name: 'Honey cappuccino',
        description: 'Espresso with frothed milk and natural honey',
        price: 5.50,
        category: 'coffee' as any,
        image: 'coffee-3.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'milk', name: 'Milk', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '4',
        name: 'Espresso',
        description: 'Classic black coffee made from freshly ground beans',
        price: 4.50,
        category: 'coffee' as any,
        image: 'coffee-4.jpg',
        sizes: [
          { id: 'S', name: 'Small', price: 0 },
          { id: 'M', name: 'Medium', price: 0.50 },
          { id: 'L', name: 'Large', price: 1.00 }
        ],
        additives: [
          { id: 'sugar', name: 'Sugar', price: 0 },
          { id: 'milk', name: 'Milk', price: 0.50 },
          { id: 'syrup', name: 'Syrup', price: 0.50 }
        ]
      },
      {
        id: '5',
        name: 'Green Tea',
        description: 'Fresh green tea with natural antioxidants',
        price: 3.50,
        category: 'tea' as any,
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
        category: 'dessert' as any,
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

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Product> = await response.json();
      if (!data.data) {
        throw new Error('Product not found');
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to load product details');
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Incorrect login or password');
      }
      
      const data: ApiResponse<User> = await response.json();
      if (!data.data) {
        throw new Error('Login failed');
      }
      return data.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data: ApiResponse<User> = await response.json();
      if (!data.data) {
        throw new Error('Registration failed');
      }
      return data.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async placeOrder(orderData: OrderRequest): Promise<OrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      
      const data: ApiResponse<OrderResponse> = await response.json();
      if (!data.data) {
        throw new Error('Order placement failed');
      }
      return data.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw new Error('Something went wrong. Please, try again');
    }
  }
}