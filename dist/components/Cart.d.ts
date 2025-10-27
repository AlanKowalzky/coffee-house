import { Product } from '../types/api';
import { ApiService } from '../services/ApiService';
export declare class Cart {
    private items;
    private apiService;
    constructor(apiService: ApiService);
    addItem(product: Product, sizeId: string, additiveIds: string[]): void;
    removeItem(itemId: string): void;
    updateQuantity(itemId: string, quantity: number): void;
    getTotal(): number;
    getItemCount(): number;
    renderCartModal(): string;
    initializeCart(): void;
    private addCartButton;
    private bindEvents;
    private showCartModal;
    private bindCartModalEvents;
    private refreshCartModal;
    private closeCartModal;
    private checkout;
    private showLoader;
    private hideLoader;
    private saveOrderHistory;
    private calculatePrice;
    private updateCartDisplay;
    private saveCart;
    private loadCart;
}
//# sourceMappingURL=Cart.d.ts.map