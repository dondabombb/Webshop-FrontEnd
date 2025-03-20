import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../_service/user.service';
import { AddressModel, UserModel } from '../../_modals/user.model';

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

    if (this.shippingBillingSame) {
      this.billingAddress = { ...this.shippingAddress };
    }

    if (this.isAddressValid(this.shippingAddress) &&
        (this.shippingBillingSame || this.isAddressValid(this.billingAddress))) {
      this.userService.updateShippingAddress(this.user.id, this.shippingAddress).subscribe({
        next: () => {
          if (!this.shippingBillingSame) {
            this.userService.updateBillingAddress(this.user?.id, this.billingAddress).subscribe({
              next: () => this.navigateToPayment(),
              error: this.handleError
            });
          } else {
            this.navigateToPayment();
          }
        },
        error: this.handleError
      });
    } else {
      this.error = 'Please fill in all required fields.';
    }
  }

  private isAddressValid(address: AddressModel): boolean {
    return !!(address.street && address.houseNumber && address.postalCode && address.city && address.country);
  }

  private navigateToPayment(): void {
    this.success = 'Address updated successfully. Redirecting to payment...';
    setTimeout(() => {
      this.router.navigate(['/cart/payment']);
    }, 2000);
  }

  private handleError = (error: any) => {
    this.error = 'Failed to update address. Please try again.';
    console.error('Error updating address:', error);
  }
}
