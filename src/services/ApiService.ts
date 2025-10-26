import { Product, User, LoginCredentials, RegisterData, ApiResponse, OrderRequest, OrderResponse, ProductCategory } from '../types/api.js';
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
      const products = (data.data || []).map((item: unknown) => {
        const it = item as Record<string, unknown>;
        return {
          id: String(it.id),
          name: String(it.name),
          description: String(it.description),
          price: parseFloat(String(it.price)),
          discountedPrice: it.discountPrice ? parseFloat(String(it.discountPrice)) : undefined,
          category: String(it.category),
          image: this.getImagePath(String(it.category), Number(it.id)),
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
        } as Product;
      }) || [];
      
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
  category: ProductCategory.COFFEE,
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
  category: ProductCategory.COFFEE,
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
  category: ProductCategory.COFFEE,
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
  category: ProductCategory.COFFEE,
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
      const coffeeProducts = ((data.data || []) as unknown[]).filter((item) => {
        const it = item as Record<string, unknown>;
        return String(it.category) === 'coffee';
      }).slice(0, 3) || [];

      return coffeeProducts.map((item) => {
        const it = item as Record<string, unknown>;
        return {
          id: String(it.id),
          name: String(it.name),
          description: String(it.description),
          price: parseFloat(String(it.price)),
          discountedPrice: it.discountPrice ? parseFloat(String(it.discountPrice)) : undefined,
          category: String(it.category),
          image: this.getImagePath(String(it.category), Number(it.id)),
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
        } as Product;
      });
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
  let parsed: unknown = null;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  apiLog('ApiService.login - response body', parsed);
      if (!response.ok) {
        let errMsg = 'Incorrect login or password';
  try { const p = parsed as Record<string, unknown> | null; if (p && (p.message || p.error)) errMsg = String(p.message ?? p.error); } catch { /* ignore parse helpers */ }
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
  let parsed: unknown = null;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  apiLog('ApiService.register - response body', parsed);
      if (!response.ok) {
        const errObj = parsed as Record<string, unknown> | string | null;
        const msg = (errObj && typeof errObj === 'object' && (errObj['error'] || errObj['message'])) ? String(errObj['error'] ?? errObj['message']) : (typeof errObj === 'string' ? errObj : 'Registration failed');
        throw new Error(msg);
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
  const apiPayload = {
    items: (orderData.items || []).map((it) => {
      const item = it as unknown as Record<string, unknown>;
      // determine productId safely
      const productField = item['product'] as Record<string, unknown> | undefined;
      const productId = ((): number => {
        if (productField && productField['id'] !== undefined) return Number(productField['id']);
        if (item['productId'] !== undefined) return Number(item['productId']);
        if (item['id'] !== undefined) return Number(item['id']);
        return 0;
      })();

      const sizeVal = ((item['size'] as Record<string, unknown>)?.['id'] ?? item['size'] ?? '') as string;
      const additivesArr = (item['additives'] as unknown[]) || [];

      return {
        productId: productId,
        size: String(sizeVal).toLowerCase(),
        additives: additivesArr.map((a) => {
          const add = a as Record<string, unknown> | string;
          return String((add as Record<string, unknown>)?.['name'] ?? add ?? '');
        }),
        quantity: Number(item['quantity'] ?? 1)
      };
    }),
    totalPrice: Number((orderData as unknown as Record<string, unknown>)?.totalAmount ?? (orderData as unknown as Record<string, unknown>)?.totalPrice ?? 0)
  } as Record<string, unknown>;
  apiLog('ApiService.placeOrder - transformed request body', apiPayload);
      const doPost = async (payload: Record<string, unknown>): Promise<Response> => await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let response = await doPost(apiPayload);
      // simple retry for 5xx
      if (response.status >= 500 && response.status < 600) {
        apiLog('ApiService.placeOrder - server-side error, retrying once', response.status);
        await new Promise(r => setTimeout(r, 400));
        response = await doPost(apiPayload);
      }
  apiLog('ApiService.placeOrder - response status', response.status);
      const text = await response.text();
  let parsed: unknown = null;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
      apiLog('ApiService.placeOrder - response body', parsed);

      // detect simulated/test error flag in body
      try {
        const p = parsed as Record<string, unknown> | null;
        if (p && p['isTestError']) {
          throw new Error(String(p['error'] ?? p['message'] ?? 'Simulated API error'));
        }
      } catch {
        // will be handled below as non-ok
      }

      if (!response.ok) {
  const p = parsed as Record<string, unknown> | string | null;
  const errMsg = (p && typeof p === 'object' && (p['message'] || p['error'])) ? String(p['message'] ?? p['error']) : (typeof p === 'string' ? p : JSON.stringify(p) || `Failed to place order (status ${response.status})`);

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
            let p2: unknown = null;
            try { p2 = JSON.parse(t2); } catch { p2 = t2; }
            apiLog('ApiService.placeOrder - fallback response body', p2);
            if (!r2.ok) {
              const p2obj = p2 as Record<string, unknown> | string | null;
              const errMsg2 = (p2obj && typeof p2obj === 'object' && (p2obj['message'] || p2obj['error'])) ? String(p2obj['message'] ?? p2obj['error']) : (typeof p2obj === 'string' ? p2obj : JSON.stringify(p2obj) || `Fallback failed (status ${r2.status})`);
              throw new Error(`${errMsg} | ${errMsg2}`);
            }
            const data2wrap: ApiResponse<OrderResponse> = (p2 && typeof p2 === 'object') ? (p2 as ApiResponse<OrderResponse>) : { success: false, data: undefined };
            if (!data2wrap.data) throw new Error('Order placement failed on fallback');
            apiLog('ApiService.placeOrder - success (fallback)', data2wrap.data);
            return data2wrap.data;
          } catch (fallbackErr) {
            apiLog('ApiService.placeOrder - fallback error', fallbackErr, ((fallbackErr as unknown) as { message?: string })?.message || JSON.stringify(fallbackErr));
            const ferr = fallbackErr as { message?: string } | null;
            throw new Error(`${errMsg} | Fallback error: ${ferr?.message || JSON.stringify(ferr)}`);
          }
        }

        throw new Error(errMsg);
      }

      const data: ApiResponse<OrderResponse> = (parsed && typeof parsed === 'object') ? (parsed as ApiResponse<OrderResponse>) : { success: false, data: undefined };
      if (!data.data) {
        throw new Error('Order placement failed');
      }
  apiLog('ApiService.placeOrder - success', data.data);
      return data.data;
    } catch (error) {
      apiLog('Error placing order:', error, ((error as unknown) as { message?: string })?.message || JSON.stringify(error));
      throw error;
    }
  }
}