import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {HomeScreenComponent} from "./home-screen/home-screen.component";
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {ItemListComponent} from "./item-list/item-list.component";
import {ItemDetailComponent} from "./item-detail/item-detail.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {ReUseModule} from "./re-use/re-use.module";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {CartModule} from "./cart/cart.module";
import {ShortenPipe} from "./_pipe/shorten.pipe";
import {AdminModule} from "./admin/admin.module";
import {HttpClientModule} from "@angular/common/http";
import {OrderComponent} from './order/order.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import {AccountComponent} from './account/account.component';
import {OrderListComponent} from "./order/order-list/order-list.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    LoginScreenComponent,
    ItemListComponent,
    ItemDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    OrderListComponent,
    ShortenPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReUseModule,
    CartModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AdminModule,
    HttpClientModule,
    AccountComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
