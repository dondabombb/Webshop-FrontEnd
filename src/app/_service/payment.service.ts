import { Injectable } from '@angular/core';
import { Observable, from, map, tap } from 'rxjs';
import { ApiService } from './api.service';

interface ApiResponse<T> {
  success: boolean;
  status: string;
  payload: {
    result?: T;
    userRole?: string;
    JWT?: string;
  };
}

interface PaymentResponse {
  id: string;
  paymentOption: string;  // Changed from 'payment' to 'paymentOption' to match backend
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  getPaymentMethods(): Observable<PaymentResponse[]> {
    return from(this.apiService.getPaymentMethods()).pipe(
      map((response: ApiResponse<PaymentResponse[]>) => {
        if (response.payload.result) {
          return response.payload.result;
        }
        return [];
      })
    );
  }
}
