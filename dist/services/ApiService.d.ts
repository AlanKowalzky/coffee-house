import { Product, User, LoginCredentials, RegisterData, OrderRequest, OrderResponse } from '../types/api';
export declare class ApiService {
    private readonly baseUrl;
    private fetchWithFallback;
    getProducts(): Promise<Product[]>;
    private getImagePath;
    private normalizeCategory;
    private getMockProducts;
    getFavoriteProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    login(credentials: LoginCredentials): Promise<User>;
    register(userData: RegisterData): Promise<User>;
    placeOrder(orderData: OrderRequest): Promise<OrderResponse>;
    private getFallbackProductImagesMap;
}
//# sourceMappingURL=ApiService.d.ts.map