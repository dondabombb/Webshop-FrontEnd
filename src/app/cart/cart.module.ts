import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartComponent} from "./cart/cart.component";
import {PaymentComponent} from "./payment/payment.component";
import {ReUseModule} from "../re-use/re-use.module";
import {AddressComponent} from "./address/address.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    CartComponent,
    PaymentComponent,
    AddressComponent
  ],
    imports: [
        CommonModule,
        ReUseModule,
        FormsModule,
        ReactiveFormsModule
    ],
  exports: [
    CartComponent,
    PaymentComponent,
    AddressComponent
  ]
})
export class CartModule { }
