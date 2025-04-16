import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReUseModule} from "../re-use/re-use.module";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {EditItemComponent} from "./edit-item/edit-item.component";
import {CreateItemComponent} from "./create-item/create-item.component";
import {ReactiveFormsModule} from "@angular/forms";
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { CreatePaymentComponent } from './create-payment/create-payment.component';






@NgModule({
  declarations: [
    AdminPanelComponent,
    EditItemComponent,
    CreateItemComponent,
    EditPaymentComponent,
    CreatePaymentComponent
  ],
    imports: [
        CommonModule,
        ReUseModule,
        ReactiveFormsModule,
    ],
  exports: [
    AdminPanelComponent
  ]
})
export class AdminModule { }
