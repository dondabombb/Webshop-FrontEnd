import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {HomeScreenComponent} from "./home-screen/home-screen.component";
import {LoginScreenComponent} from "./login-screen/login-screen.component";
import {ItemDetailComponent} from "./item-detail/item-detail.component";
import {CartComponent} from "./cart/cart/cart.component";

export const routes: Routes = [
  {path: '', component: HomeScreenComponent},
  {path:'l', component: LoginScreenComponent},
  {path:'cart', component: CartComponent},
  {path:':id', component: ItemDetailComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
