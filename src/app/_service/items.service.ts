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
    return new ItemModel(
      item.id,
      item.name,
      item.description,
      item.price,
      item.imageUrl
    );
  }

  public getAll(): Observable<ItemModel[]> {
    if (this.itemCache.length > 0) {
      return of([...this.itemCache]);
    }

    return from(this.apiService.getAllProducts()).pipe(
      map((response: ApiResponse<ProductResponse[]>) => {
        if (response.payload.result) {
          return response.payload.result.map(item => this.mapToItemModel(item));
        }
        return [];
      }),
      tap(items => {
        this.itemCache = items;
        this.itemsChanged.emit([...this.itemCache]);
      }),
      catchError(() => {
        return of([]);
      })
    );
  }

  public getOne(id: string): Observable<ItemModel | undefined> {
    const cachedItem = this.itemCache.find(item => item.id === id);
    if (cachedItem) {
      return of(cachedItem);
    }

    return from(this.apiService.getProductById(id)).pipe(
      map((response: ApiResponse<ProductResponse>) => {
        if (response.payload.result) {
          return this.mapToItemModel(response.payload.result);
        }
        return undefined;
      }),
      catchError(() => of(undefined))
    );
  }

  public addItem(item: any): Observable<ItemModel> {
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
        throw error;
      })
    );
  }

  public updateItem(id: string, updatedItem: Partial<ItemModel>): Observable<ItemModel> {
    const productData = {
      name: updatedItem.name,
      description: updatedItem.description,
      price: Number(updatedItem.price),
      imageUrl: updatedItem.imageUrl || (updatedItem as any).imagePath
    };

    return from(this.apiService.updateProduct(id, productData)).pipe(
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
      catchError(() => of(false))
    );
  }

  public clearCache(): void {
    this.itemCache = [];
  }
}
