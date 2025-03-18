 import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { OrderModel, OrderStatus } from '../_modals/order.model';
import { AddressModel } from '../_modals/user.model';
import { ShoppingCartService } from './shoppingCart.service';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  response: {
    result: T;
    message: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private apiService: ApiService,
    private cartService: ShoppingCartService
  ) {}

  createOrder(shippingAddress: AddressModel, billingAddress: AddressModel): Observable<OrderModel> {
    return this.apiService.createOrder(shippingAddress, billingAddress).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response?.response?.result) {
          // Clear the cart after successful order
          this.cartService.clearCart();
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  getOrderById(id: string): Observable<OrderModel> {
    return this.apiService.getOrderById(id).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  getUserOrders(): Observable<OrderModel[]> {
    return this.apiService.getUserOrders().pipe(
      map((response: ApiResponse<OrderModel[]>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        return [];
      })
    );
  }

  getAllOrders(): Observable<OrderModel[]> {
    return this.apiService.getAllOrders().pipe(
      map((response: ApiResponse<OrderModel[]>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        return [];
      })
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<OrderModel> {
    return this.apiService.updateOrderStatus(id, status).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }
}
