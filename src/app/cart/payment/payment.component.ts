import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../_service/user.service';
import { AddressModel, UserModel } from '../../_modals/user.model';
import {ShoppingCartService} from "../../_service/shoppingCart.service";
import {CartItemModel} from "../../_modals/cart.model";
import { OrderService } from '../../_service/order.service';
import { PaymentService } from '../../_service/payment.service';

export interface PaymentMethod {
  id: string;
  paymentOption: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  selectedPaymentMethod: string = '';
  items: CartItemModel[] = [];
  subtotal: number = 0;
  shippingAddress: AddressModel = new AddressModel();
  success: string | null = null;
  error: string | null = null;
  user: UserModel | null = null;
  paymentMethods: PaymentMethod[] = [];  // Change type to PaymentMethod[]

  constructor(
    private cartService: ShoppingCartService,
    private userService: UserService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
    this.loadUserData();
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.paymentService.getPaymentMethods().subscribe({
      next: (methods: PaymentMethod[]) => {  // Add type annotation
        this.paymentMethods = methods;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.error = 'Failed to load payment methods. Please try again.';
      }
    });
  }

  loadCartItems() {
    this.cartService.getCart().subscribe((cart: { items: CartItemModel[] }) => {
      this.items = cart.items;
      this.subtotal = this.cartService.getCartTotal();
    });
  }

  loadUserData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser) as UserModel;
      if (this.user && this.user.id) {
        this.userService.getUserById(this.user.id).subscribe({
          next: (user: UserModel) => {
            this.shippingAddress = user.shippingAddress || new AddressModel();
          },
          error: (error) => {
            console.error('Error loading user data:', error);
            this.error = 'Failed to load user data. Please try again.';
          }
        });
      }
    }
  }

  // Update the processPayment method to use the payment ID
  processPayment() {
    if (!this.selectedPaymentMethod) {
      this.error = 'Please select a payment method.';
      return;
    }

    // Create order with payment method
    this.orderService.createOrder(this.selectedPaymentMethod).subscribe({
      next: (order) => {
        this.success = 'Order placed successfully!';
        this.cartService.clearCart();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.error = 'Failed to place order. Please try again.';
      }
    });
  }
}
