import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemModel} from "../../_modals/item.model";
import {Subscription} from "rxjs";
import {ShoppingCartService} from "../../_service/shoppingCart.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy{
  items: ItemModel[] = [new ItemModel(
    '1',
    'tennisbal',
    'een bal denk ik',
    9.99,
    'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
  )];
  changedItems: Subscription;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getCart();
    this.changedItems = this.cartService.updatedCart.subscribe(
      (newItems: ItemModel[]) => {
        this.items = newItems;
      }
    )
  }

  ngOnDestroy(): void {
    this.changedItems.unsubscribe();
  }

  goBack(): void {
    this.router.navigateByUrl('')
  }

}
