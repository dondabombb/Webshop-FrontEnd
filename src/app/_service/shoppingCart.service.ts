import {Injectable} from "@angular/core";
import {ItemModel} from "../_modals/item.model";
import {BehaviorSubject, Observable, Subject, catchError, map, of, tap, from, switchMap} from "rxjs";
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
  private cart: CartModel = new CartModel();
  private cartSubject = new BehaviorSubject<CartModel>(this.cart);
  private isLoading = new BehaviorSubject<boolean>(true);
  private count = new BehaviorSubject<number>(0);

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    // Modified subscription to handle both login and logout cases
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadCart();
      } else {
        // Clear cart when logged out or on page reload when not authenticated
        this.cart = new CartModel();
        this.updateCartState();
        localStorage.removeItem('cart');
        this.cartSubject.next(this.cart);
        this.count.next(0);
      }
    });
  }
  
  // Change from private to public
  public loadCart(): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      this.isLoading.next(true);
      return from(this.apiService.getCart()).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.success && response.payload.result) {
            this.cart = this.mapToCartModel(response.payload.result);
            this.mergeWithLocalStorage();
            this.updateCartState();
          } else {
            console.error('Failed to load cart:', response);
            this.loadFromLocalStorage();
          }
          this.isLoading.next(false);
          return this.cart;
        }),
        catchError(error => {
          console.error('Error loading cart:', error);
          this.loadFromLocalStorage();
          this.isLoading.next(false);
          return of(this.cart);
        })
      );
    } else {
      this.loadFromLocalStorage();
      return of(this.cart);
    }
  }

  private mapToCartModel(response: any): CartModel {
    const cart = new CartModel();
    cart.id = response.id;
    cart.items = response.products.map((product: any) =>
      new CartItemModel(
        new ItemModel(
          product.product.id,
          product.product.name,
          product.product.description,
          product.product.price,
          product.product.imageUrl
        ),
        product.quantity
      )
    );
    return cart;
  }

  private updateCartState(): void {
    this.cartSubject.next(this.cart);
    this.updateCartCount();
    this.saveLocalCart();
  }

  private updateCartCount(): void {
    const count = this.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    this.count.next(count);
  }

  private loadFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
        this.updateCartState();
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        this.cart = new CartModel();
        this.updateCartState();
      }
    } else {
      this.cart = new CartModel();
      this.updateCartState();
    }
  }

  private mergeWithLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const localCart: CartModel = JSON.parse(savedCart);
        if (localCart.items?.length > 0) {
          localCart.items.forEach(localItem => {
            const existingItem = this.cart.items.find(item => item.product.id === localItem.product.id);
            if (existingItem) {
              existingItem.quantity += localItem.quantity;
            } else {
              this.cart.items.push(localItem);
            }
          });
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error merging cart with localStorage:', error);
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
      if (!this.cart.id) {
        return from(this.apiService.getCart()).pipe(
          switchMap((response: ApiResponse<CartModel>) => {
            if (response.success && response.payload.result) {
              this.cart = this.mapToCartModel(response.payload.result);
              return from(this.apiService.addProductToCart(this.cart.id!, item.id, quantity));
            }
            throw new Error('Failed to get cart');
          }),
          map((response: ApiResponse<CartModel>) => {
            if (response.success && response.payload.result) {
              this.cart = this.mapToCartModel(response.payload.result);
              this.updateCartState();
              return this.cart;
            }
            throw new Error('Invalid response format');
          }),
          catchError(error => {
            console.error('Error adding item to cart:', error);
            return of(this.cart);
          })
        );
      }
      return from(this.apiService.addProductToCart(this.cart.id, item.id, quantity)).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.success && response.payload.result) {
            this.cart = this.mapToCartModel(response.payload.result);
            this.updateCartState();
            return this.cart;
          }
          throw new Error('Invalid response format');
        }),
        catchError(error => {
          console.error('Error adding item to cart:', error);
          return of(this.cart);
        })
      );
    }

    if (!this.cart.items) {
      this.cart.items = [];
    }
    const existingItemIndex = this.cart.items.findIndex(
      cartItem => cartItem.product.id === item.id
    );

    if (existingItemIndex !== -1) {
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      this.cart.items.push(new CartItemModel(item, quantity));
    }

    this.updateCartState();
    return of(this.cart);
  }

  public updateQuantity(productId: string, quantity: number): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      if (!this.cart.id) {
        throw new Error('Cart ID is required');
      }

      const currentItem = this.cart.items.find(item => item.product.id === productId);
      if (!currentItem) {
        return from(this.apiService.addProductToCart(this.cart.id, productId, quantity)).pipe(
          map((response: ApiResponse<CartModel>) => {
            if (response.payload.result) {
              this.cart = this.mapToCartModel(response.payload.result);
              this.updateCartState();
              return this.cart;
            }
            throw new Error('Invalid response format');
          })
        );
      }

      const currentQuantity = currentItem.quantity;
      if (quantity > currentQuantity) {
        return from(this.apiService.incrementProductIntoCart(this.cart.id, productId, quantity - currentQuantity)).pipe(
          map((response: ApiResponse<CartModel>) => {
            if (response.payload.result) {
              this.cart = this.mapToCartModel(response.payload.result);
              this.updateCartState();
              return this.cart;
            }
            throw new Error('Invalid response format');
          })
        );
      } else if (quantity < currentQuantity) {
        return from(this.apiService.decrementProductFromCart(this.cart.id, productId, currentQuantity - quantity)).pipe(
          map((response: ApiResponse<CartModel>) => {
            if (response.payload.result) {
              this.cart = this.mapToCartModel(response.payload.result);
              this.updateCartState();
              return this.cart;
            }
            throw new Error('Invalid response format');
          })
        );
      }

      return of(this.cart);
    } else {
      // Handle local cart for non-authenticated users (unchanged)
      const existingItemIndex = this.cart.items.findIndex(
        cartItem => cartItem.product.id === productId
      );

      if (existingItemIndex !== -1) {
        if (quantity <= 0) {
          this.cart.items.splice(existingItemIndex, 1);
        } else {
          this.cart.items[existingItemIndex].quantity = quantity;
        }

        this.updateCartState();
      }

      this.cartSubject.next(this.cart);
      return of(this.cart);
    }
  }

  public removeItem(productId: string): Observable<CartModel> {
    if (this.authService.isLoggedIn()) {
      if (!this.cart.id) {
        throw new Error('Cart ID is required');
      }
      return from(this.apiService.removeProductFromCart(this.cart.id, productId)).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = this.mapToCartModel(response.payload.result);
            this.updateCartState();
            return this.cart;
          }
          throw new Error('Invalid response format');
        }),
        catchError(error => {
          console.error('Error removing item:', error);
          // Remove item locally if API call fails
          this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
          this.updateCartState();
          return of(this.cart);
        })
      );
    } else {
      // For logged-out users, only remove the specific item
      const itemIndex = this.cart.items.findIndex(item => item.product.id === productId);
      if (itemIndex !== -1) {
        this.cart.items.splice(itemIndex, 1);
        this.updateCartState();
      }
      return of(this.cart);
    }
  }

  public clearCart(): Observable<CartModel> {
    this.cart = new CartModel();
    this.updateCartState();
    localStorage.removeItem('cart');
    
    if (this.authService.isLoggedIn()) {
      return from(this.apiService.getCart()).pipe(
        map((response: ApiResponse<CartModel>) => {
          if (response.payload.result) {
            this.cart = this.mapToCartModel(response.payload.result);
            this.updateCartState();
            return this.cart;
          }
          throw new Error('Invalid response format');
        })
      );
    }
    
    return of(this.cart);
  }

  public getCartTotal(): number {
    if (!this.cart || !this.cart.items || !Array.isArray(this.cart.items)) {
      return 0;
    }
    return this.cart.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  public getCartCount(): Observable<number> {
    return this.count.asObservable();
  }

  public syncLocalCartWithServer(): Observable<CartModel> {
    if (!this.authService.isLoggedIn() || this.cart.items.length === 0) {
      return of(this.cart);
    }
    if (!this.cart.id) {
      throw new Error('Cart ID is required');
    }
    const addItemObservables = this.cart.items.map(item =>
      this.apiService.addProductToCart(this.cart.id!, item.product.id, item.quantity)
    );

    return from(addItemObservables[addItemObservables.length - 1]).pipe(
      map((response: ApiResponse<CartModel>) => {
        if (response.payload.result) {
          this.cart = response.payload.result;
          this.updateCartState();
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
    if (!this.cart.id) {
      throw new Error('Cart ID is required');
    }
    const addItemObservables = items.map(item =>
      this.apiService.addProductToCart(this.cart.id!, item.product.id, item.quantity)
    );

    return from(addItemObservables[addItemObservables.length - 1]).pipe(
      map((response: ApiResponse<CartModel>) => {
        if (response.payload.result) {
          this.cart = response.payload.result;
          this.updateCartState();
          this.cartSubject.next(this.cart);
          return this.cart;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  public getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  public forceCartReload(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoading.next(true);
      from(this.apiService.getCart()).subscribe({
        next: (response: ApiResponse<CartModel>) => {
          if (response.success && response.payload.result) {
            this.cart = this.mapToCartModel(response.payload.result);
            this.updateCartState();
          }
          this.isLoading.next(false);
        },
        error: (error) => {
          console.error('Error reloading cart:', error);
          this.isLoading.next(false);
        }
      });
    }
  }
}
