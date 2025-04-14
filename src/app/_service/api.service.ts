import { Injectable } from '@angular/core';
import { UserModel, AddressModel } from '../_modals/user.model';
import { ItemModel } from '../_modals/item.model';
import { CartModel } from '../_modals/cart.model';
import { OrderModel } from '../_modals/order.model';
import { ApiConnectorService } from './apiConnector.service';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
  };
}

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  active: boolean;
}

interface PaymentResponse {
  id: string;
  paymentOption: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private apiConnector: ApiConnectorService) {}

  // Authentication
  async register(user: {
    firstName: string | null | undefined;
    middleName: string;
    lastName: string | null | undefined;
    email: string | null | undefined;
    password: string | null | undefined;
  }): Promise<ApiResponse<any>> {
    const response = await this.apiConnector.noAuth().post('/auth/register', user);
    return response.data;
  }

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.apiConnector.noAuth().post('/auth/login', { email, password });
    return response.data;
  }

  // Products
  async getAllProducts(): Promise<ApiResponse<ProductResponse[]>> {
    const response = await this.apiConnector.noAuth().get('/product');
    return response.data;
  }

  async getProductById(id: string): Promise<ApiResponse<ProductResponse>> {
    const response = await this.apiConnector.noAuth().get(`/product/${id}`);
    return response.data;
  }

  async createProduct(product: ItemModel): Promise<ApiResponse<ProductResponse>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.post('/product', product);
    return response.data;
  }

  async updateProduct(id: string, product: Partial<ItemModel>): Promise<ApiResponse<ProductResponse>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put(`/product/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.delete(`/product/${id}`);
    return response.data;
  }

  // Cart
  async getCart(): Promise<ApiResponse<CartModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get('/cart');
    return response.data;
  }

  async addProductToCart(cartId: string, productId: string, quantity: number): Promise<ApiResponse<CartModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.post('/cart/products', { cartId, productId, quantity });
    return response.data;
  }

  async removeProductFromCart(cartId: string, productId: string, quantity: number): Promise<ApiResponse<CartModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.delete('/cart/products', { params: { cartId, productId, quantity } });
    return response.data;
  }

  async clearCart(): Promise<ApiResponse<CartModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.delete('/cart/clear');
    return response.data;
  }

  async updateCart(cart: CartModel): Promise<ApiResponse<CartModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put('/cart', cart.items);
    return response.data;
  }

  // Orders
  async createOrder(paymentMethod: string): Promise<ApiResponse<OrderModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.post('/order', { paymentMethod });
    return response.data;
  }

  async getOrderById(id: string): Promise<ApiResponse<OrderModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get(`/order/${id}`);
    return response.data;
  }

  async getUserOrders(): Promise<ApiResponse<OrderModel[]>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get('/user/orders');
    return response.data;
  }

  async getAllOrders(): Promise<ApiResponse<OrderModel[]>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get('/order');
    return response.data;
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<OrderModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put(`/order/${id}/status`, { status });
    return response.data;
  }

  // Users
  async getUserById(id: string): Promise<ApiResponse<UserModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get(`/user/${id}`);
    return response.data;
  }

  async getAllUsers(): Promise<ApiResponse<UserModel[]>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get('/user');
    return response.data;
  }

  async updateUser(id: string, user: Partial<UserModel>): Promise<ApiResponse<UserModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put(`/user/${id}`, user);
    return response.data;
  }

  async updateShippingAddress(id: string | undefined, address: AddressModel): Promise<ApiResponse<UserModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put(`/user/${id}/shipping-address`, address);
    return response.data;
  }

  async updateBillingAddress(id: string | undefined, address: AddressModel): Promise<ApiResponse<UserModel>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.put(`/user/${id}/billing-address`, address);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.delete(`/user/${id}`);
    return response.data;
  }

  async getPaymentMethods(): Promise<ApiResponse<PaymentResponse[]>> {
    const authInstance = await this.apiConnector.auth();
    const response = await authInstance.get('/payment-methods');
    return response.data;
  }
}
