import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from "../../_service/shoppingCart.service";
import { AuthService } from "../../_service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  amount: number = 0;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private cartService: ShoppingCartService,
    protected authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.count.subscribe(params => this.amount = params);

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
