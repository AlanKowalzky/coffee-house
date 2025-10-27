import { Product } from '../types/api';
import { Cart } from './Cart';
export declare class ProductModal {
    private cart;
    private tooltipElement;
    private escListener?;
    private isAdding;
    constructor(cart: Cart);
    showModal(product: Product): void;
    private closeModal;
    private bindModalEvents;
    private showPriceTooltip;
    private hidePriceTooltip;
    private updatePrice;
    private addToCart;
}
//# sourceMappingURL=ProductModal.d.ts.map