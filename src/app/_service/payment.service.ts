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
      tap(response => console.log('API Response:', response)), // Debug log
      map((response: ApiResponse<PaymentResponse[]>) => {
        if (response.payload.result) {
          const methods = response.payload.result;
          console.log('Mapped payment methods:', methods); // Debug log
          return methods;
        }
        return [];
      })
    );
  }
}
