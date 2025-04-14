import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { OrderService } from '../_service/order.service';
import { OrderModel, OrderStatus } from '../_modals/order.model';
import { Router } from '@angular/router';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  standalone: false,
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orders: OrderModel[] = [];
  isLoading = true;
  error: string | null = null;
  isAdmin = false;
  @Output() dataToSend: EventEmitter<OrderModel> = new EventEmitter();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    const orderObservable = this.isAdmin ?
      this.orderService.getAllOrders() :
      this.orderService.getUserOrders();

    orderObservable.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  viewOrderDetails(order: OrderModel): void {
    this.router.navigate(['/orders', order.id], {
      state: { order }
    });
  }

  getStatusClass(status: OrderStatus | undefined): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
