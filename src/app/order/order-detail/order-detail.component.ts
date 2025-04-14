import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../_service/order.service';
import { OrderModel, OrderStatus } from '../../_modals/order.model';
import { AuthService } from '../../_service/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  receivedData: OrderModel | null = null;
  isLoading = true;
  error: string | null = null;
  isAdmin = false;
  orderStatuses = Object.values(OrderStatus);
  selectedStatus: OrderStatus | undefined = undefined;
  isUpdatingStatus = false;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,  // Add this
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    
    const state = history.state;
    if (state && state.order) {
      this.receivedData = state.order;
      if (this.receivedData?.items) {
        this.receivedData.items.forEach(item => {
          if (item.product) {
            console.log('Product:', item.product);
            // Use imageUrl if available, otherwise fallback to placeholder
            item.product = Object.assign({}, item.product, {
              ...item.product,
              imagePath: item.product.imageUrl || 'assets/placeholder.png'
            });
          }
        });
      }
      this.selectedStatus = state.order.orderStatus;
      this.isLoading = false;
    } else {
      this.error = 'Order data not found';
      this.isLoading = false;
    }
  }

  // Update other methods to use receivedData instead of order
  updateOrderStatus(): void {
    if (!this.receivedData || !this.receivedData.id || !this.selectedStatus || this.selectedStatus === this.receivedData.orderStatus) {
      return;
    }

    this.isUpdatingStatus = true;

    this.orderService.updateOrderStatus(this.receivedData.id, this.selectedStatus).subscribe({
      next: (updatedOrder) => {
        this.receivedData = updatedOrder;
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
    this.route.navigate(['/orders']);
  }
}
