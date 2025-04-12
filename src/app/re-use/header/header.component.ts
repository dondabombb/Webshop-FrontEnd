import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from "../../_service/shoppingCart.service";
import { AuthService } from "../../_service/auth.service";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  amount: number = 0;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: ShoppingCartService,
    protected authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getCartCount().subscribe(count => {
        this.amount = count;
      })
    );

    this.subscriptions.push(
      this.authService.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      })
    );

    this.subscriptions.push(
      this.authService.isAdmin$.subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
