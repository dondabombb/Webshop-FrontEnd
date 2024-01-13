import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {HomeScreenComponent} from "./home-screen/home-screen.component";
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {ItemListComponent} from "./item-list/item-list.component";
import {ItemDetailComponent} from "./item-detail/item-detail.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ReUseModule} from "./re-use/re-use.module";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./re-use/header/header.component";
import {CartComponent} from "./cart/cart/cart.component";
import {CartModule} from "./cart/cart.module";
import {ShortenPipe} from "./_pipe/shorten.pipe";


@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    LoginScreenComponent,
    ItemListComponent,
    ItemDetailComponent,
    ShortenPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReUseModule,
    CartModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
