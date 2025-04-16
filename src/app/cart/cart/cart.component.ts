import { Component, OnInit, OnDestroy } from '@angular/core';

import {ShoppingCartService} from "../../_service/shoppingCart.service";
import {CartItemModel} from "../../_modals/cart.model";
import {Router} from "@angular/router";
import { AddressModel } from "../../_modals/user.model";
import { Subscription } from 'rxjs';
import { AuthService } from '../../_service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItemModel[] = [];
  total: number = 0;
  isLoading = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: ShoppingCartService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getIsLoading().subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    this.loadCart();
  }

  private loadCart(): void {
    this.subscriptions.push(
      this.cartService.loadCart().subscribe({
        next: (cart) => {
          console.log('Cart updated:', cart);
          if (this.authService.isLoggedIn()) {
            // For authenticated users, filter out invalid items
            this.items = (cart.items || []).filter(item => item.product && item.product.id);
          } else {
            // For unauthenticated users, take all items from local storage
            this.items = cart.items || [];
          }
          this.total = this.cartService.getCartTotal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cart:', error);
          this.items = [];
          this.total = 0;
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) return;

    this.subscriptions.push(
      this.cartService.updateQuantity(productId, quantity).subscribe({
        next: (cart) => {
          this.items = cart.items || [];
          this.total = this.cartService.getCartTotal();
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
        }
      })
    );
  }

  removeItem(productId: string): void {
    this.subscriptions.push(
      this.cartService.removeItem(productId).subscribe({
        next: (cart) => {
          this.items = cart.items || [];
          this.total = this.cartService.getCartTotal();
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      })
    );
  }

  goToAddress(): void {
    this.router.navigate(['/cart/address']);
  }

  goHome() {
    this.router.navigate(['/'])
  }
}
