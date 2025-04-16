import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../_service/user.service';
import { AddressModel, UserModel } from '../../_modals/user.model';
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  shippingAddress: AddressModel = new AddressModel();
  billingAddress: AddressModel = new AddressModel();
  shippingBillingSame: boolean = true;
  success: string | null = null;
  error: string | null = null;
  user: UserModel | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser) as UserModel;
    }
  }

  addAddress(): void {
    if (!this.user) {
      this.error = 'User information not found. Please log in again.';
      return;
    }

    if (!this.isAddressValid(this.shippingAddress)) {
      this.error = 'Please fill in all shipping address fields.';
      return;
    }

    // Copy shipping address to billing if they're the same
    if (this.shippingBillingSame) {
      this.billingAddress = { ...this.shippingAddress };
    } else if (!this.isAddressValid(this.billingAddress)) {
      this.error = 'Please fill in all billing address fields.';
      return;
    }

    // Update shipping address first, then billing address
    this.userService.updateShippingAddress(this.user.id, this.shippingAddress).pipe(
      switchMap(() => this.userService.updateBillingAddress(this.user!.id, this.billingAddress))
    ).subscribe({
      next: () => this.navigateToPayment(),
      error: this.handleError
    });
  }

  private isAddressValid(address: AddressModel): boolean {
    return !!(address.street && address.houseNumber && address.postalCode && address.city && address.country);
  }

  private navigateToPayment(): void {
    this.success = 'Address updated successfully. Redirecting to payment...';
    setTimeout(() => {
      this.router.navigate(['/cart/payment']);
    });
  }

  private handleError = (error: any) => {
    this.error = 'Failed to update address. Please try again.';
  }
}
