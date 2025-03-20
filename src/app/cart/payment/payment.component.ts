import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../_service/user.service';
import { AddressModel, UserModel } from '../../_modals/user.model';
import {ShoppingCartService} from "../../_service/shoppingCart.service";
import {CartItemModel} from "../../_modals/cart.model";

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

  constructor(
    private cartService: ShoppingCartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
    this.loadUserData();
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

  processPayment() {
    if (!this.selectedPaymentMethod) {
      this.error = 'Please select a payment method.';
      return;
    }

    this.success = 'Payment processed successfully!';
    this.cartService.clearCart();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }
}
