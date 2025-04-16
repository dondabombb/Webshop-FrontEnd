import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ItemModel} from "../_modals/item.model";
import {ItemsService} from "../_service/items.service";
import {ShoppingCartService} from "../_service/shoppingCart.service";
import {HeaderComponent} from "../re-use/header/header.component";

@Component({
  selector: 'app-item-detail',
  standalone: false,
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit{
  receivedData: ItemModel | null = null;
  itemId: string;
  isLoading = true;
  error: string | null = null;

  constructor(private route: Router,
              private activatedRoute: ActivatedRoute,
              private itemservice: ItemsService,
              private cartService: ShoppingCartService,) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.itemId = params['id'];
      this.isLoading = true;
      this.error = null;

      this.itemservice.getOne(this.itemId).subscribe({
        next: (item) => {
          if (item) {
            this.receivedData = item;
          } else {
            this.error = 'Product not found';
          }
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load product details';
          this.isLoading = false;
        }
      });
    });
  }

  quantity: number = 1;

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onSubmit(): void {
    if (this.receivedData) {
      this.cartService.addToCart(this.receivedData, this.quantity).subscribe();
    }
  }
}
