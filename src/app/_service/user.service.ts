import { Injectable } from '@angular/core';
import {Observable, map, from} from 'rxjs';
import { ApiService } from './api.service';
import { UserModel } from '../_modals/user.model';
import { AddressModel } from '../_modals/user.model';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
  };
}

interface UpdateUser{
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserById(id: string): Observable<UserModel> {
    return from(this.apiService.getUserById(id)).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateUser(id: string, userData: UpdateUser): Observable<UserModel> {
    return from(this.apiService.updateUser(id, userData)).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateShippingAddress(id: string | undefined, address: AddressModel): Observable<UserModel> {
    return from(this.apiService.updateShippingAddress(id, address)).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }

  updateBillingAddress(id: string | undefined, address: AddressModel): Observable<UserModel> {
    return from(this.apiService.updateBillingAddress(id, address)).pipe(
      map((response: ApiResponse<UserModel>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Invalid response format');
      })
    );
  }
}
