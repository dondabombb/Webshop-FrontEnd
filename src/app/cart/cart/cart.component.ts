import { Component, OnInit } from '@angular/core';

import {ShoppingCartService} from "../../_service/shoppingCart.service";
import {CartItemModel} from "../../_modals/cart.model";
import {Router} from "@angular/router";
import { AddressModel } from "../../_modals/user.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItemModel[] = [];
  total: number = 0;
  shippingAddress: AddressModel = new AddressModel();
  billingAddress: AddressModel = new AddressModel();

  constructor(private cartService: ShoppingCartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cart: { items: CartItemModel[] }) => {
      this.items = cart.items;
      this.total = this.cartService.getCartTotal();
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity).subscribe();
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe();
  }

  goToAddress(): void {
    this.router.navigate(['/cart/address']);
  }
}
