import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from "../../_service/shoppingCart.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  amount: number;

  constructor(private cartService: ShoppingCartService) {
  }

  ngOnInit(): void {
    this.cartService.count.subscribe(params => this.amount = params);
    }

}
