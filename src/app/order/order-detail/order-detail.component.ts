import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../_service/order.service';
import { OrderModel, OrderStatus } from '../../_modals/order.model';
import { AuthService } from '../../_service/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  set selectedStatus(value: OrderStatus | undefined) {
    this._selectedStatus = value;
  }
  order: OrderModel | null = null;
  isLoading = true;
  error: string | null = null;
  isAdmin = false;
  orderStatuses = Object.values(OrderStatus);
  private _selectedStatus: OrderStatus | undefined = undefined;
  isUpdatingStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const orderId = this.route.snapshot.paramMap.get('id');

    if (orderId) {
      this.loadOrder(orderId);
    } else {
      this.error = 'Order ID not found';
      this.isLoading = false;
    }
  }

  loadOrder(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        if (!this.isAdmin && order.userId !== this.authService.getCurrentUserId()) {
          this.error = 'You do not have permission to view this order';
          this.isLoading = false;
          return;
        }

        this.order = order;
        this._selectedStatus = order.status;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load order details. Please try again.';
        this.isLoading = false;
        console.error('Error loading order:', error);
      }
    });
  }

  updateOrderStatus(): void {
    if (!this.order || !this.order.id || !this._selectedStatus || this._selectedStatus === this.order.status) {
      return;
    }

    this.isUpdatingStatus = true;

    this.orderService.updateOrderStatus(this.order.id, this._selectedStatus).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.isUpdatingStatus = false;
      },
      error: (error) => {
        this.error = 'Failed to update order status. Please try again.';
        this.isUpdatingStatus = false;
        console.error('Error updating order status:', error);
      }
    });
  }

  getStatusClass(status: OrderStatus | undefined): string {
    if (!status) return 'bg-gray-100 text-gray-800';

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

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
