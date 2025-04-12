import {EventEmitter, Injectable} from "@angular/core";
import {ItemModel} from "../_modals/item.model";
import {Observable, catchError, map, of, tap, from} from "rxjs";
import {ApiService} from "./api.service";

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
  };
}

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  itemsChanged = new EventEmitter<ItemModel[]>();
  private itemCache: ItemModel[] = [];

  constructor(private apiService: ApiService) {}

  private mapToItemModel(item: ProductResponse): ItemModel {
    console.log('Mapping product response to ItemModel:', item);
    return new ItemModel(
      item.id,
      item.name,
      item.description,
      item.price,
      item.imageUrl
    );
  }

  public getAll(): Observable<ItemModel[]> {
    console.log('Getting all items...');
    // Return cached items if available
    if (this.itemCache.length > 0) {
      console.log('Returning cached items:', this.itemCache);
      return of([...this.itemCache]);
    }

    // Otherwise fetch from API
    return from(this.apiService.getAllProducts()).pipe(
      tap(response => {
        console.log('Raw API response:', response);
      }),
      map((response: ApiResponse<ProductResponse[]>) => {
        console.log('Processing API response:', response);
        if (response.payload.result) {
          console.log('Found items in response:', response.payload.result);
          return response.payload.result.map(item => this.mapToItemModel(item));
        }
        console.log('No items found in response');
        return [];
      }),
      tap(items => {
        console.log('Mapped items:', items);
        this.itemCache = items;
        this.itemsChanged.emit([...this.itemCache]);
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
  }

  public getOne(id: string): Observable<ItemModel | undefined> {
    // Check cache first
    const cachedItem = this.itemCache.find(item => item.id === id);
    if (cachedItem) {
      return of(cachedItem);
    }

    // Otherwise fetch from API
    return from(this.apiService.getProductById(id)).pipe(
      map((response: ApiResponse<ProductResponse>) => {
        if (response.payload.result) {
          return this.mapToItemModel(response.payload.result);
        }
        return undefined;
      }),
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  public addItem(item: ItemModel): Observable<ItemModel> {
    return from(this.apiService.createProduct(item)).pipe(
      map((response: ApiResponse<ProductResponse>) => {
        if (response.payload.result) {
          return this.mapToItemModel(response.payload.result);
        }
        throw new Error('Invalid response format');
      }),
      tap(newItem => {
        this.itemCache = [...this.itemCache, newItem];
        this.itemsChanged.emit([...this.itemCache]);
      }),
      catchError(error => {
        console.error('Error adding product:', error);
        throw error;
      })
    );
  }

  public updateItem(id: string, updatedItem: Partial<ItemModel>): Observable<ItemModel> {
    return from(this.apiService.updateProduct(id, updatedItem)).pipe(
      map((response: ApiResponse<ProductResponse>) => {
        if (response.payload.result) {
          return this.mapToItemModel(response.payload.result);
        }
        throw new Error('Invalid response format');
      }),
      tap(updated => {
        const index = this.itemCache.findIndex(item => item.id === id);
        if (index !== -1) {
          this.itemCache = [
            ...this.itemCache.slice(0, index),
            updated,
            ...this.itemCache.slice(index + 1)
          ];
          this.itemsChanged.emit([...this.itemCache]);
        }
      }),
      catchError(error => {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
      })
    );
  }

  public removeItem(id: string): Observable<boolean> {
    return from(this.apiService.deleteProduct(id)).pipe(
      map(() => {
        this.itemCache = this.itemCache.filter(item => item.id !== id);
        this.itemsChanged.emit([...this.itemCache]);
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting product with id ${id}:`, error);
        return of(false);
      })
    );
  }

  public clearCache(): void {
    this.itemCache = [];
  }
}
