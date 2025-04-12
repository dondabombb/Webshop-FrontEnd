import { Injectable } from '@angular/core';
import {BehaviorSubject, from, Observable, tap} from 'rxjs';
import { ApiService } from './api.service';
import { UserModel } from '../_modals/user.model';
import {ApiConnectorService} from "./apiConnector.service";
import {ShoppingCartService} from "./shoppingCart.service";

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
    userId?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private apiService: ApiService, private apiConnector: ApiConnectorService) {
    // Check for stored user data on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const user = JSON.parse(userData) as UserModel;
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(user.role === 'ADMIN');
    }
  }

  register(user: {
    firstName: string | null | undefined;
    middleName: string;
    lastName: string | null | undefined;
    email: string | null | undefined;
    password: string | null | undefined
  }): Promise<ApiResponse<any>> {
    return this.apiService.register(user);
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return from(this.apiService.login(email, password)).pipe(
      tap(response => {
        if (response && response.success && response.payload) {
          if (response.payload.JWT) {
            this.apiConnector.storeToken(response.payload.JWT);
          }
          if (response.payload.userRole) {
            const user: UserModel = {
              id: response.payload.userId,
              email: email,
              role: response.payload.userRole,
            };
            this.currentUserSubject.next(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.isLoggedInSubject.next(true);
            this.isAdminSubject.next(user.role === 'ADMIN');
          }
        }
      })
    );
  }

  logout(): void {
    this.apiConnector.removeToken();
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  getCurrentUserId() {
    return this.currentUserSubject.value?.id;
  }
}
