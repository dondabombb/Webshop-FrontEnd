import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { UserModel } from '../_modals/user.model';
import { AddressModel } from '../_modals/user.model';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  response: {
    result: T;
    message: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserById(id: string): Observable<UserModel> {
    return this.apiService.getUserById(id).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateUser(id: string, userData: Partial<UserModel>): Observable<UserModel> {
    return this.apiService.updateUser(id, userData).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateShippingAddress(id: string | undefined, address: AddressModel): Observable<UserModel> {
    return this.apiService.updateShippingAddress(id, address).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateBillingAddress(id: string | undefined, address: AddressModel): Observable<UserModel> {
    return this.apiService.updateBillingAddress(id, address).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response?.response?.result) {
          return response.response.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }
}
