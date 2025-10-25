import { Product, User, LoginCredentials, RegisterData, ApiResponse, OrderRequest, OrderResponse } from '../types/api.js';

export class ApiService {
  private readonly baseUrl = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api';

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
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Product[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to load products');
    }
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