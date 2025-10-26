export enum ProductCategory {
  COFFEE = 'coffee',
  TEA = 'tea',
  DESSERT = 'dessert'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: ProductCategory;
  image: string;
  sizes: ProductSize[];
  additives: ProductAdditive[];
}

export interface ProductSize {
  id: string;
  name: string;
  price: number;
}

export interface ProductAdditive {
  id: string;
  name: string;
  price: number;
}

export interface User {
  id: string;
  login: string;
  city: string;
  street: string;
  house: number;
  paymentMethod: PaymentMethod;
}

export interface CartItem {
  id: string;
  product: Product;
  size: ProductSize;
  additives: ProductAdditive[];
  quantity: number;
  totalPrice: number;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  house: number;
  paymentMethod: PaymentMethod;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OrderRequest {
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: {
    city: string;
    street: string;
    house: number;
  };
}

export interface OrderResponse {
  orderId: string;
  status: string;
  estimatedDelivery: string;
}