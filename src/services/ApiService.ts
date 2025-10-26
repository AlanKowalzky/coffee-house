import { Product, User, LoginCredentials, RegisterData, ApiResponse, OrderRequest, OrderResponse, ProductCategory } from '../types/api';
import { apiLog } from './DebugLog';

export class ApiService {
  private readonly baseUrl = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

  // Try fetching from API; on network/CORS errors or non-ok responses fall back to local static `products.json`.
  private async fetchWithFallback(url: string): Promise<unknown> {
    try {
      apiLog('ApiService.fetchWithFallback - attempting', url);
      const resp = await fetch(url, { mode: 'cors' });
      apiLog('ApiService.fetchWithFallback - response status', resp.status);
      if (resp.ok) return await resp.json();
      apiLog('ApiService.fetchWithFallback - non-ok response', resp.status);
    } catch (err) {
      apiLog('ApiService.fetchWithFallback - network/fetch error', err);
    }

    // As last resort return null (no fallback to products.json)
    return null;
  }

  async getProducts(): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/products`;
      apiLog('ApiService.getProducts - request url', url);
      const raw = await this.fetchWithFallback(url);
      apiLog('ApiService.getProducts - raw response', raw);

      const items: unknown[] = ((): unknown[] => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw as unknown[];
        const maybe = raw as Record<string, unknown>;
        if (Array.isArray(maybe.data)) return maybe.data as unknown[];
        return [];
      })();

      if (items.length === 0) {
        throw new Error('No products found from API');
      }

      const fallbackImageMap = await this.getFallbackProductImagesMap(); // Pobierz mapę obrazków fallbackowych
      const mockProducts = this.getMockProducts(); // Pobierz wszystkie mockowane produkty

      // Połącz produkty z API z mockowanymi, usuwając duplikaty i preferując API
      const productsMap = new Map<string, Product>();

      // Najpierw dodaj produkty z API
      items.map((item: unknown) => {
        const it = item as Record<string, unknown>;
        const cat = this.normalizeCategory(it.category);

        // Zawsze używaj obrazka z fallbackImageMap (products.json), jeśli dostępny.
        // Jeśli brak, użyj assets/Logo.png jako domyślnego placeholdera.
        let finalImagePath: string = 'assets/Logo.png'; // Domyślny placeholder
        if (fallbackImageMap.has(String(it.id))) {
          finalImagePath = fallbackImageMap.get(String(it.id)) || 'assets/Logo.png';
        }

        apiLog('ApiService.getProducts - final image path for product', it.id, finalImagePath);

        const product: Product = {
          id: String(it.id),
          name: String(it.name),
          description: String(it.description),
          price: parseFloat(String(it.price)),
          discountedPrice: it.discountPrice ? parseFloat(String(it.discountPrice)) : undefined,
          category: cat,
          image: finalImagePath,
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
        };
        productsMap.set(product.id, product);
      });

      // Następnie dodaj mockowane produkty, jeśli nie ma ich jeszcze na liście (API ma priorytet)
      mockProducts.forEach(mp => {
        if (!productsMap.has(mp.id)) {
          // Zastosuj logikę obrazków z fallbackImageMap również do mocków
          let mockImagePath: string = 'assets/Logo.png';
          if (fallbackImageMap.has(String(mp.id))) {
            mockImagePath = fallbackImageMap.get(String(mp.id)) || 'assets/Logo.png';
          }
          productsMap.set(mp.id, { ...mp, image: mockImagePath });
        }
      });

      return Array.from(productsMap.values());
    } catch (error) {
      console.error('Error fetching products:', error);
      // W przypadku błędu, zwróć wszystkie mockowane produkty jako ostateczny fallback
      return this.getMockProducts();
    }
  }

  private getImagePath(category: string, id: number): string {
    if (category === 'coffee') return `coffee-${Math.min(id, 8)}.jpg`;
    if (category === 'tea') return `tea-${Math.min(id - 8, 4)}.png`;
    return `dessert-${Math.min(id - 16, 8)}.png`;
  }

  private normalizeCategory(value: unknown): ProductCategory {
    const s = String(value ?? '').toLowerCase();
    if (s.includes('coffee')) return ProductCategory.COFFEE;
    if (s.includes('tea')) return ProductCategory.TEA;
    return ProductCategory.DESSERT;
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
      const raw = await this.fetchWithFallback(url);
      apiLog('ApiService.getFavoriteProducts - raw', raw);

      const items: unknown[] = ((): unknown[] => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw as unknown[];
        const maybe = raw as Record<string, unknown>;
        if (Array.isArray(maybe.data)) return maybe.data as unknown[];
        return [];
      })();

      if (items.length === 0) {
        throw new Error('No favorite products found from API');
      }

      const fallbackImageMap = await this.getFallbackProductImagesMap(); // Pobierz mapę obrazków fallbackowych
      const mockProducts = this.getMockProducts(); // Pobierz wszystkie mockowane produkty

      // Połącz produkty z API z mockowanymi, usuwając duplikaty i preferując API
      const productsMap = new Map<string, Product>();

      // Najpierw dodaj produkty z API
      items.map((item: unknown) => {
        const it = item as Record<string, unknown>;
        const cat = this.normalizeCategory(it.category);

        // Zawsze używaj obrazka z fallbackImageMap (products.json), jeśli dostępny.
        // Jeśli brak, użyj assets/Logo.png jako domyślnego placeholdera.
        let finalImagePath: string = 'assets/Logo.png'; // Domyślny placeholder
        if (fallbackImageMap.has(String(it.id))) {
          finalImagePath = fallbackImageMap.get(String(it.id)) || 'assets/Logo.png';
        }

        apiLog('ApiService.getFavoriteProducts - final image path for product', it.id, finalImagePath);

        const product: Product = {
          id: String(it.id),
          name: String(it.name),
          description: String(it.description),
          price: parseFloat(String(it.price)),
          discountedPrice: it.discountPrice ? parseFloat(String(it.discountPrice)) : undefined,
          category: cat,
          image: finalImagePath,
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
        };
        productsMap.set(product.id, product);
      });

      // Następnie dodaj mockowane produkty, jeśli nie ma ich jeszcze na liście (API ma priorytet)
      mockProducts.forEach(mp => {
        if (!productsMap.has(mp.id)) {
          // Zastosuj logikę obrazków z fallbackImageMap również do mocków
          let mockImagePath: string = 'assets/Logo.png';
          if (fallbackImageMap.has(String(mp.id))) {
            mockImagePath = fallbackImageMap.get(String(mp.id)) || 'assets/Logo.png';
          }
          productsMap.set(mp.id, { ...mp, image: mockImagePath });
        }
      });

      // Ogranicz do 3 produktów, jeśli po połączeniu jest ich więcej
      return Array.from(productsMap.values()).slice(0, 3);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      throw new Error('Failed to load favorite products');
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const url = `${this.baseUrl}/products/${id}`;
      apiLog('ApiService.getProductById - request url', url);
      const raw = await this.fetchWithFallback(url);
      apiLog('ApiService.getProductById - raw', raw);

      if (!raw) throw new Error('Product not found');

      // raw can be ApiResponse<Product> or plain product
      let product: Product | null = null;
      if (typeof raw === 'object' && (raw as Record<string, unknown>)['data']) {
        const wrap = raw as ApiResponse<Product>;
        product = wrap.data ?? null;
      } else {
        product = raw as unknown as Product;
      }

      if (!product) throw new Error('Product not found');
      product.category = this.normalizeCategory((product as Product).category as unknown);
      return product;
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

  private async getFallbackProductImagesMap(): Promise<Map<string, string>> {
    try {
      const fallbackUrl = '/products.json';
      apiLog('ApiService.getFallbackProductImagesMap - attempting', fallbackUrl);
      const r = await fetch(fallbackUrl);
      if (!r.ok) {
        apiLog('ApiService.getFallbackProductImagesMap - fallback non-ok', r.status);
        return new Map();
      }
      const raw = await r.json();
      const items: unknown[] = ((): unknown[] => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw as unknown[];
        const maybe = raw as Record<string, unknown>;
        if (Array.isArray(maybe.data)) return maybe.data as unknown[];
        return [];
      })();

      const imageMap = new Map<string, string>();
      items.forEach((item: unknown) => {
        const it = item as Record<string, unknown>;
        const id = String(it.id);
        const image = this.getImagePath(String(it.category), Number(it.id)); // Używamy istniejącej logiki do generowania ścieżki
        if (id && image) {
          imageMap.set(id, image);
        }
      });
      return imageMap;
    } catch (e) {
      apiLog('ApiService.getFallbackProductImagesMap - fallback fetch failed', e);
      return new Map();
    }
  }
}