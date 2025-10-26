import { Product, User, LoginCredentials, RegisterData, ApiResponse, OrderRequest, OrderResponse } from '../types/api.js';
import { apiLog } from './DebugLog';

export class ApiService {
  private readonly baseUrl = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';



  async getProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/products`;
  apiLog('ApiService.getProducts - request url', url);
      const response = await fetch(url);
  apiLog('ApiService.getProducts - response status', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  apiLog('ApiService.getProducts - response body', data);
      
      // Transform API data to match our Product interface
      const products = data.data?.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        discountedPrice: item.discountPrice ? parseFloat(item.discountPrice) : undefined,
        category: item.category,
        image: this.getImagePath(item.category, item.id),
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
      })) || [];
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data as fallback
      return this.getMockProducts();
    }
  }

  private getImagePath(category: string, id: number): string {
    if (category === 'coffee') return `coffee-${Math.min(id, 8)}.jpg`;
    if (category === 'tea') return `tea-${Math.min(id - 8, 4)}.png`;
    return `dessert-${Math.min(id - 16, 8)}.png`;
  }

  private getMockProducts(): Product[] {
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

  async getFavoriteProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/products`;
  apiLog('ApiService.getFavoriteProducts - request url', url);
      const response = await fetch(url);
  apiLog('ApiService.getFavoriteProducts - response status', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  apiLog('ApiService.getFavoriteProducts - response body', data);
      
      // Get first 3 coffee products as favorites
      const coffeeProducts = data.data?.filter((item: any) => item.category === 'coffee').slice(0, 3) || [];
      
      return coffeeProducts.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        discountedPrice: item.discountPrice ? parseFloat(item.discountPrice) : undefined,
        category: item.category,
        image: this.getImagePath(item.category, item.id),
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
      }));
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      throw new Error('Failed to load favorite products');
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const url = `${this.baseUrl}/products/${id}`;
  apiLog('ApiService.getProductById - request url', url);
      const response = await fetch(url);
  apiLog('ApiService.getProductById - response status', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Product> = await response.json();
  apiLog('ApiService.getProductById - response body', data);
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
      const url = `${this.baseUrl}/auth/login`;
  apiLog('ApiService.login - request url', url);
  apiLog('ApiService.login - request body', credentials);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  apiLog('ApiService.login - response status', response.status);
      const text = await response.text();
      let parsed: any = null;
      try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
  apiLog('ApiService.login - response body', parsed);
      if (!response.ok) {
        let errMsg = 'Incorrect login or password';
        try { if (parsed && (parsed.message || parsed.error)) errMsg = parsed.message || parsed.error; } catch(e) {}
        throw new Error(errMsg);
      }
      const data: ApiResponse<User> = typeof parsed === 'object' ? parsed : await response.json();
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
      const url = `${this.baseUrl}/auth/register`;
  apiLog('ApiService.register - request url', url);
  apiLog('ApiService.register - request body', userData);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  apiLog('ApiService.register - response status', response.status);
      const text = await response.text();
      let parsed: any = null;
      try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
  apiLog('ApiService.register - response body', parsed);
      if (!response.ok) {
        const errorData = parsed;
        throw new Error((errorData && (errorData.error || errorData.message)) ? (errorData.error || errorData.message) : 'Registration failed');
      }
      const data: ApiResponse<User> = typeof parsed === 'object' ? parsed : await response.json();
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
      // Use OpenAPI-documented endpoint for confirming orders
      const url = `${this.baseUrl}/orders/confirm`;
  apiLog('ApiService.placeOrder - request url', url);
  // Transform internal OrderRequest (CartItem[]) into API schema
  const apiPayload: any = {
    items: (orderData.items || []).map((it: any) => ({
      productId: Number(it.product?.id ?? it.productId ?? it.id),
      size: String((it.size?.id || it.size || '')).toLowerCase(),
      additives: (it.additives || []).map((a: any) => (a?.name ?? a ?? '') as string),
      quantity: Number(it.quantity || 1)
    })),
    totalPrice: Number((orderData as any).totalAmount ?? (orderData as any).totalPrice ?? 0)
  };
  apiLog('ApiService.placeOrder - transformed request body', apiPayload);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });
  apiLog('ApiService.placeOrder - response status', response.status);
      const text = await response.text();
      let parsed: any = null;
      try { parsed = JSON.parse(text); } catch (e) { parsed = text; }
      apiLog('ApiService.placeOrder - response body', parsed);

      if (!response.ok) {
        const errMsg = (parsed && (parsed.message || parsed.error)) ? (parsed.message || parsed.error) : (typeof parsed === 'string' ? parsed : JSON.stringify(parsed) || `Failed to place order (status ${response.status})`);

        // If server responds with 404 or a message mentioning '/orders', try documented alternate path
        const bodyStr = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        if (response.status === 404 || (bodyStr && bodyStr.includes('/orders'))) {
          const fallbackUrl = `${this.baseUrl}/orders/confirm`;
          apiLog('ApiService.placeOrder - attempting fallback url', fallbackUrl);
          try {
            const r2 = await fetch(fallbackUrl, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
            });
            apiLog('ApiService.placeOrder - fallback response status', r2.status);
            const t2 = await r2.text();
            let p2: any = null;
            try { p2 = JSON.parse(t2); } catch (e) { p2 = t2; }
            apiLog('ApiService.placeOrder - fallback response body', p2);
            if (!r2.ok) {
              const errMsg2 = (p2 && (p2.message || p2.error)) ? (p2.message || p2.error) : (typeof p2 === 'string' ? p2 : JSON.stringify(p2) || `Fallback failed (status ${r2.status})`);
              throw new Error(`${errMsg} | ${errMsg2}`);
            }
            const data2: ApiResponse<OrderResponse> = typeof p2 === 'object' ? p2 : { data: null };
            if (!data2.data) throw new Error('Order placement failed on fallback');
            apiLog('ApiService.placeOrder - success (fallback)', data2.data);
            return data2.data;
          } catch (fallbackErr) {
            apiLog('ApiService.placeOrder - fallback error', fallbackErr, (fallbackErr as any)?.message || JSON.stringify(fallbackErr));
            const ferr: any = fallbackErr as any;
            throw new Error(`${errMsg} | Fallback error: ${ferr?.message || JSON.stringify(ferr)}`);
          }
        }

        throw new Error(errMsg);
      }

      const data: ApiResponse<OrderResponse> = typeof parsed === 'object' ? parsed : { data: null };
      if (!data.data) {
        throw new Error('Order placement failed');
      }
  apiLog('ApiService.placeOrder - success', data.data);
      return data.data;
    } catch (error) {
      apiLog('Error placing order:', error, (error as any)?.message || JSON.stringify(error));
      throw error;
    }
  }
}