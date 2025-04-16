import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../_service/auth.service";
import { ShoppingCartService } from "../_service/shoppingCart.service";
import {from} from "rxjs";

@Component({
  selector: 'app-login-screen',
  standalone: false,
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.scss'
})
export class LoginScreenComponent {
  error: string|null = null;
  isLoading: boolean = false;
  showRegisterForm: boolean = false;
  emailRequirements: string = '^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: ShoppingCartService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailRequirements),
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    middleName: new FormControl(''),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailRequirements),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
  });

  toggleForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
    this.error = null;
  }

  onLogin(): void {
    this.error = null;
    this.isLoading = true;

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    if (!email || !password || !this.loginForm.valid) {
      this.error = "Please fill in all required fields correctly";
      this.isLoading = false;
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.isLoading = false;
          this.cartService.syncLocalCartWithServer().subscribe(() => {
            this.router.navigate(['/']);
          });
        } else {
          this.isLoading = false;
          this.error = response?.payload?.result || "Login failed. Please check your credentials.";
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || "Login failed. Please check your credentials.";
      }
    });
  }

  onRegister(): void {
    this.error = null;
    this.isLoading = true;

    if (!this.registerForm.valid) {
      this.error = "Please fill in all required fields correctly";
      this.isLoading = false;
      return;
    }

    const formValues = this.registerForm.value;

    const user = {
      firstName: formValues.firstName,
      middleName: formValues.middleName || '',
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password
    };

    from(this.authService.register(user)).subscribe({
      next: () => {
        // After successful registration, attempt to login
        if (formValues.email && formValues.password) {
          this.authService.login(formValues.email, formValues.password).subscribe({
            next: (response) => {
              if (response && response.success) {
                this.cartService.syncLocalCartWithServer().subscribe(() => {
                  this.router.navigate(['/']);
                });
              } else {
                this.error = response?.payload?.result || "Login failed after registration.";
              }
            },
            error: (error) => {
              this.error = error.error?.message || "Login failed after registration.";
            }
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || "Registration failed. Please try again.";
      }
    });
  }
}
