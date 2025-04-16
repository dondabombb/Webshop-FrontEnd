import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
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

  createPaymentMethod(payment: string): Observable<PaymentResponse> {
    return from(this.apiService.createPaymentMethod(payment)).pipe(
      map(response => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Failed to create payment method');
      })
    );
  }

  getPaymentMethodById(id: string): Observable<PaymentResponse> {
    return from(this.apiService.getPaymentMethodById(id)).pipe(
      map(response => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Payment method not found');
      })
    );
  }

  updatePaymentMethod(id: string, payment: string): Observable<PaymentResponse> {
    return from(this.apiService.updatePaymentMethod(id, payment)).pipe(
      map(response => {
        if (response.payload.result) {
          return response.payload.result;
        }
        throw new Error('Failed to update payment method');
      })
    );
  }

  deletePaymentMethod(id: string): Observable<void> {
    return from(this.apiService.deletePaymentMethod(id)).pipe(
      map(response => {
        if (!response.success) {
          throw new Error('Failed to delete payment method');
        }
      })
    );
  }

}
