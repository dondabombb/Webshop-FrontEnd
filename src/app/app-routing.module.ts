import {RouterModule, Routes} from '@angular/router';
import {AfterRenderPhase, NgModule} from "@angular/core";
import {HomeScreenComponent} from "./home-screen/home-screen.component";
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {ItemDetailComponent} from "./item-detail/item-detail.component";
import {CartComponent} from "./cart/cart/cart.component";
import {AuthGuard} from './_guards/auth.guard';
import {AdminGuard} from './_guards/admin.guard';
import {OrderComponent} from './order/order.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { CreateItemComponent } from './admin/create-item/create-item.component';
import { EditItemComponent } from './admin/edit-item/edit-item.component';
import {AddressComponent} from "./cart/address/address.component";
import {PaymentComponent} from "./cart/payment/payment.component";
import {AccountComponent} from "./account/account.component";
import { EditPaymentComponent } from './admin/edit-payment/edit-payment.component';
import { CreatePaymentComponent } from './admin/create-payment/create-payment.component';

export const routes: Routes = [
  // Admin routes should come before the dynamic :id route
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/create', component: CreateItemComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/edit/:id', component: EditItemComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/payments/create', component: CreatePaymentComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/payments/edit/:id', component: EditPaymentComponent, canActivate: [AuthGuard, AdminGuard]},
  
  // Other routes
  {path: '', component: HomeScreenComponent},
  {path:'l', component: LoginScreenComponent},
  {path:'cart', component: CartComponent},
  {path: 'orders', component: OrderComponent, canActivate: [AuthGuard]},
  {path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard]},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  {path: 'cart/address', component: AddressComponent},
  {path: 'cart/payment', component: PaymentComponent},
  
  // This wildcard route should come last
  {path:':id', component: ItemDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
