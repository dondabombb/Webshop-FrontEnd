import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../_service/payment.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentId: string;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      paymentOption: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.paymentId) {
      this.loadPaymentMethod();
    }
  }

  private loadPaymentMethod(): void {
    this.paymentService.getPaymentMethodById(this.paymentId).subscribe({
      next: (payment) => {
        this.paymentForm.patchValue({
          paymentOption: payment.paymentOption
        });
        this.loading = false;
      },
      error: () => {
        alert('Failed to load payment method');
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.paymentService.updatePaymentMethod(this.paymentId, this.paymentForm.value.paymentOption).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: () => {
          alert('Failed to update payment method. Please try again.');
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }
}
