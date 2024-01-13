import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartComponent} from "./cart/cart.component";
import {PaymentComponent} from "./payment/payment.component";
import {ReUseModule} from "../re-use/re-use.module";



@NgModule({
  declarations: [
    CartComponent,
    PaymentComponent
  ],
  imports: [
    CommonModule,
    ReUseModule
  ],
  exports: [
    CartComponent,
    PaymentComponent
  ]
})
export class CartModule { }
