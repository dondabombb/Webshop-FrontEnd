import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../_service/payment.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})
export class CreatePaymentComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      paymentOption: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.paymentService.createPaymentMethod(this.paymentForm.value.paymentOption).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          alert('Failed to create payment method. Please try again.');
          console.error('Error creating payment method:', error);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin']);
  }
}
