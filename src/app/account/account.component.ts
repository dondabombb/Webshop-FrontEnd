import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../_service/auth.service";
import { UserService } from '../_service/user.service';
import {AddressModel, UserModel} from "../_modals/user.model";

@Component({
  selector: 'app-account',
  standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})

export class AccountComponent implements OnInit {
  accountForm: FormGroup;
  shippingAddressForm: FormGroup;
  billingAddressForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  success: string | null = null;
  user: UserModel | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });

    this.shippingAddressForm = this.fb.group({
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.billingAddressForm = this.fb.group({
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.userService.getUserById(currentUser.id).subscribe({
        next: (user: UserModel) => {
          this.user = user;
          this.accountForm.patchValue({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber
          });

          if (user.shippingAddress) {
            this.shippingAddressForm.patchValue(user.shippingAddress);
          }

          if (user.billingAddress) {
            this.billingAddressForm.patchValue(user.billingAddress);
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          this.error = 'Failed to load user data. Please try again.';
          this.isLoading = false;
          console.error('Error loading user data:', error);
        }
      });
    }
  }

  updateAccount(): void {
    if (this.accountForm.valid && this.user?.id) {
      this.userService.updateUser(this.user.id, this.accountForm.value).subscribe({
        next: () => {
          this.success = 'Account information updated successfully.';
          setTimeout(() => this.success = null, 3000);
        },
        error: (error: any) => {
          this.error = 'Failed to update accounts information. Please try again.';
          console.error('Error updating accounts:', error);
        }
      });
    }
  }

  updateShippingAddress(): void {
    if (this.shippingAddressForm.valid && this.user?.id) {
      const address: AddressModel = this.shippingAddressForm.value;
      this.userService.updateShippingAddress(this.user.id, address).subscribe({
        next: () => {
          this.success = 'Shipping address updated successfully.';
          setTimeout(() => this.success = null, 3000);
        },
        error: (error: any) => {
          this.error = 'Failed to update shipping address. Please try again.';
          console.error('Error updating shipping address:', error);
        }
      });
    }
  }

  updateBillingAddress(): void {
    if (this.billingAddressForm.valid && this.user?.id) {
      const address: AddressModel = this.billingAddressForm.value;
      this.userService.updateBillingAddress(this.user.id, address).subscribe({
        next: () => {
          this.success = 'Billing address updated successfully.';
          setTimeout(() => this.success = null, 3000);
        },
        error: (error: any) => {
          this.error = 'Failed to update billing address. Please try again.';
          console.error('Error updating billing address:', error);
        }
      });
    }
  }
}
