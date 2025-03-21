import {Injectable} from "@angular/core";
import {ItemModel} from "../_modals/item.model";
import {BehaviorSubject, Observable, Subject, catchError, map, of, tap} from "rxjs";
import {ApiService} from "./api.service";
import {CartItemModel, CartModel} from "../_modals/cart.model";
import {AuthService} from "./auth.service";

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService{
  updatedCart = new Subject<CartItemModel[]>();
  private cart: CartModel = new CartModel();
  count = new BehaviorSubject<number>(0);
  private cartSubject = new BehaviorSubject<CartModel>(this.cart);

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loadCart();
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadCart();
      } else {
        this.clearCart();
      }
    });
  }

  private loadCart(): void {
    if (this.authService.isLoggedIn()) {
      this.apiService.getCart().subscribe({
        next: (response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = response.payload.result;
            this.updatedCart.next(this.cart.items);
            this.updateCartCount();
            this.cartSubject.next(this.cart);
          }
        },
        error: (error) => {
          console.error('Error loading cart:', error);
        }
      });
    } else {
      // Load from local storage for non-authenticated users
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
        this.updatedCart.next(this.cart.items);
        this.updateCartCount();
        this.cartSubject.next(this.cart);
      }
    }
  }

  private saveLocalCart(): void {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  public getCart(): Observable<CartModel> {
    return this.cartSubject.asObservable();
  }

  public addToCart(item: ItemModel, quantity: number = 1): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      return this.apiService.addProductToCart(item.id, quantity).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = response.payload.result;
            this.updatedCart.next(this.cart.items);
            this.updateCartCount();
            this.cartSubject.next(this.cart);
            return this.cart;
          }
          throw new Error('Invalid response format');
        }),
        catchError(error => {
          console.error('Error adding item to cart:', error);
          throw error;
        })
      );
    } else {
      // Handle local cart for non-authenticated users
      const existingItemIndex = this.cart.items.findIndex(
        cartItem => cartItem.product.id === item.id
      );

      if (existingItemIndex !== -1) {
        this.cart.items[existingItemIndex].quantity += quantity;
      } else {
        this.cart.items.push(new CartItemModel(item, quantity));
      }

      this.updatedCart.next(this.cart.items);
      this.updateCartCount();
      this.saveLocalCart();
      this.cartSubject.next(this.cart);
      return of(this.cart);
    }
  }

  public updateQuantity(productId: string, quantity: number): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      return this.apiService.updateProductQuantity(productId, quantity).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = response.payload.result;
            this.updatedCart.next(this.cart.items);
            this.updateCartCount();
            this.cartSubject.next(this.cart);
            return this.cart;
          }
          throw new Error('Invalid response format');
        }),
        catchError(error => {
          console.error('Error updating item quantity:', error);
          throw error;
        })
      );
    } else {
      // Handle local cart for non-authenticated users
      const existingItemIndex = this.cart.items.findIndex(
        cartItem => cartItem.product.id === productId
      );

      if (existingItemIndex !== -1) {
        if (quantity <= 0) {
          this.cart.items.splice(existingItemIndex, 1);
        } else {
          this.cart.items[existingItemIndex].quantity = quantity;
        }

        this.updatedCart.next(this.cart.items);
        this.updateCartCount();
        this.saveLocalCart();
      }

      this.cartSubject.next(this.cart);
      return of(this.cart);
    }
  }

  public removeItem(productId: string): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      return this.apiService.removeProductFromCart(productId).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = response.payload.result;
            this.updatedCart.next(this.cart.items);
            this.updateCartCount();
            this.cartSubject.next(this.cart);
            return this.cart;
          }
          throw new Error('Invalid response format');
        })
      );
    } else {
      this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
      this.updateCartCount();
      this.cartSubject.next(this.cart);
      return of(this.cart);
    }
  }

  public clearCart(): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      return this.apiService.clearCart().pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = response.payload.result;
            this.updatedCart.next(this.cart.items);
            this.updateCartCount();
            this.cartSubject.next(this.cart);
            localStorage.removeItem('cart');
            return this.cart;
          }
          throw new Error('Invalid response format');
        })
      );
    } else {
      this.cart = new CartModel();
      this.updateCartCount();
      this.cartSubject.next(this.cart);
      return of(this.cart);
    }
  }

  public getCartTotal(): number {
    return this.cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  private updateCartCount(): void {
    const itemCount = this.cart.items.reduce(
      (count, item) => count + item.quantity,
      0
    );
    this.count.next(itemCount);
  }

  public syncLocalCartWithServer(): Observable<CartModel> {
    if (!this.authService.isLoggedIn() || this.cart.items.length === 0) {
      return of(this.cart);
    }

    const addItemObservables = this.cart.items.map(item =>
      this.apiService.addProductToCart(item.product.id, item.quantity)
    );

    return addItemObservables[addItemObservables.length - 1].pipe(
      map((response: ApiResponse<CartModel>) => {
        if (response.payload.result) {
          this.cart = response.payload.result;
          this.updatedCart.next(this.cart.items);
          this.updateCartCount();
          localStorage.removeItem('cart');
          this.cartSubject.next(this.cart);
          return this.cart;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  public addItemsFromLocalStorage(items: CartItemModel[]): Observable<CartModel> {
    if (items.length === 0) {
      return this.getCart();
    }

    const addItemObservables = items.map(item =>
      this.apiService.addProductToCart(item.product.id, item.quantity)
    );

    return addItemObservables[addItemObservables.length - 1].pipe(
      map((response: ApiResponse<CartModel>) => {
        if (response.payload.result) {
          this.cart = response.payload.result;
          this.updatedCart.next(this.cart.items);
          this.updateCartCount();
          this.cartSubject.next(this.cart);
          return this.cart;
        }
        throw new Error('Invalid response format');
      })
    );
  }
}
