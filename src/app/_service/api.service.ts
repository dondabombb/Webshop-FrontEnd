import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel, AddressModel } from '../_modals/user.model';
import { ItemModel } from '../_modals/item.model';
import { CartModel } from '../_modals/cart.model';
import { OrderModel } from '../_modals/order.model';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  response: {
    result: T;
    message: string | null;
  };
  token?: string;
  user?: any;
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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:8080/api"
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  // Helper methods
  private getHeaders(requiresAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (requiresAuth && this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Authentication
  register(user: {
    firstName: string | null | undefined;
    middleName: string;
    lastName: string | null | undefined;
    email: string | null | undefined;
    password: string | null | undefined;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/register`, user, { headers: this.getHeaders() });
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/login`, { email, password }, { headers: this.getHeaders() });
  }

  // Products
  getAllProducts(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(`${this.apiUrl}/product`, { headers: this.getHeaders() });
  }

  getProductById(id: string): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(`${this.apiUrl}/product/${id}`, { headers: this.getHeaders() });
  }

  createProduct(product: ItemModel): Observable<ApiResponse<ProductResponse>> {
    return this.http.post<ApiResponse<ProductResponse>>(`${this.apiUrl}/product`, product, { headers: this.getHeaders(true) });
  }

  updateProduct(id: string, product: Partial<ItemModel>): Observable<ApiResponse<ProductResponse>> {
    return this.http.put<ApiResponse<ProductResponse>>(`${this.apiUrl}/product/${id}`, product, { headers: this.getHeaders(true) });
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/product/${id}`, { headers: this.getHeaders(true) });
  }

  // Cart
  getCart(): Observable<ApiResponse<CartModel>> {
    return this.http.get<ApiResponse<CartModel>>(`${this.apiUrl}/cart`, { headers: this.getHeaders(true) });
  }

  addProductToCart(productId: string, quantity: number): Observable<ApiResponse<CartModel>> {
    return this.http.post<ApiResponse<CartModel>>(`${this.apiUrl}/cart/add`, { productId, quantity }, { headers: this.getHeaders(true) });
  }

  updateProductQuantity(productId: string, quantity: number): Observable<ApiResponse<CartModel>> {
    return this.http.put<ApiResponse<CartModel>>(`${this.apiUrl}/cart/update/${productId}`, { quantity }, { headers: this.getHeaders(true) });
  }

  removeProductFromCart(productId: string): Observable<ApiResponse<CartModel>> {
    return this.http.delete<ApiResponse<CartModel>>(`${this.apiUrl}/cart/remove/${productId}`, { headers: this.getHeaders(true) });
  }

  clearCart(): Observable<ApiResponse<CartModel>> {
    return this.http.delete<ApiResponse<CartModel>>(`${this.apiUrl}/cart/clear`, { headers: this.getHeaders(true) });
  }

  // Orders
  createOrder(shippingAddress: AddressModel, billingAddress: AddressModel): Observable<ApiResponse<OrderModel>> {
    return this.http.post<ApiResponse<OrderModel>>(`${this.apiUrl}/order`, { shippingAddress, billingAddress }, { headers: this.getHeaders(true) });
  }

  getOrderById(id: string): Observable<ApiResponse<OrderModel>> {
    return this.http.get<ApiResponse<OrderModel>>(`${this.apiUrl}/order/${id}`, { headers: this.getHeaders(true) });
  }

  getUserOrders(): Observable<ApiResponse<OrderModel[]>> {
    return this.http.get<ApiResponse<OrderModel[]>>(`${this.apiUrl}/order/user`, { headers: this.getHeaders(true) });
  }

  getAllOrders(): Observable<ApiResponse<OrderModel[]>> {
    return this.http.get<ApiResponse<OrderModel[]>>(`${this.apiUrl}/order`, { headers: this.getHeaders(true) });
  }

  updateOrderStatus(id: string, status: string): Observable<ApiResponse<OrderModel>> {
    return this.http.put<ApiResponse<OrderModel>>(`${this.apiUrl}/order/${id}/status`, { status }, { headers: this.getHeaders(true) });
  }

  // Users
  getUserById(id: string): Observable<ApiResponse<UserModel>> {
    return this.http.get<ApiResponse<UserModel>>(`${this.apiUrl}/user/${id}`, { headers: this.getHeaders(true) });
  }

  getAllUsers(): Observable<ApiResponse<UserModel[]>> {
    return this.http.get<ApiResponse<UserModel[]>>(`${this.apiUrl}/user`, { headers: this.getHeaders(true) });
  }

  updateUser(id: string, user: Partial<UserModel>): Observable<ApiResponse<UserModel>> {
    return this.http.put<ApiResponse<UserModel>>(`${this.apiUrl}/user/${id}`, user, { headers: this.getHeaders(true) });
  }

  updateShippingAddress(id: string, address: AddressModel): Observable<ApiResponse<UserModel>> {
    return this.http.put<ApiResponse<UserModel>>(`${this.apiUrl}/user/${id}/shipping-address`, address, { headers: this.getHeaders(true) });
  }

  updateBillingAddress(id: string, address: AddressModel): Observable<ApiResponse<UserModel>> {
    return this.http.put<ApiResponse<UserModel>>(`${this.apiUrl}/user/${id}/billing-address`, address, { headers: this.getHeaders(true) });
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/user/${id}`, { headers: this.getHeaders(true) });
  }
}
