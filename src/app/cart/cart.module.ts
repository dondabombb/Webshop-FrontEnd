import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartComponent} from "./cart/cart.component";
import {PaymentComponent} from "./payment/payment.component";
import {ReUseModule} from "../re-use/re-use.module";
import {AddressComponent} from "./address/address.component";



@NgModule({
  declarations: [
    CartComponent,
    PaymentComponent,
    AddressComponent
  ],
  imports: [
    CommonModule,
    ReUseModule
  ],
  exports: [
    CartComponent,
    PaymentComponent,
    AddressComponent
  ]
})
export class CartModule { }
