import { Injectable } from '@angular/core';
import {Observable, map, from} from 'rxjs';
import { ApiService } from './api.service';
import { OrderModel, OrderStatus } from '../_modals/order.model';
import { AddressModel } from '../_modals/user.model';
import { ShoppingCartService } from './shoppingCart.service';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
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

  createOrder(paymentMethod: string): Observable<OrderModel> {
    return from(this.apiService.createOrder(paymentMethod)).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response.payload.result) {
          this.cartService.clearCart();
          this.cartService.forceCartReload();
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  getOrderById(id: string): Observable<OrderModel> {
    return from(this.apiService.getOrderById(id)).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  getUserOrders(): Observable<OrderModel[]> {
    return from(this.apiService.getUserOrders()).pipe(
      map((response: ApiResponse<OrderModel[]>) => {
        console.log('API Response:', response); // Debug log
        if (response && response.payload && Array.isArray(response.payload.result)) {
          return response.payload.result;
        }
        console.warn('Invalid response format:', response);
        return [];
      })
    );
  }

  getAllOrders(): Observable<OrderModel[]> {
    return from(this.apiService.getAllOrders()).pipe(
      map((response: ApiResponse<OrderModel[]>) => {
        console.log('API Response:', response); // Debug log
        if (response && response.payload && Array.isArray(response.payload.result)) {
          return response.payload.result;
        }
        console.warn('Invalid response format:', response);
        return [];
      })
    );
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<OrderModel> {
    return from(this.apiService.updateOrderStatus(id, status)).pipe(
      map((response: ApiResponse<OrderModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }
}
