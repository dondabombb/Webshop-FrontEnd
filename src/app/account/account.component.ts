import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../_service/auth.service";
import { UserService } from '../_service/user.service';
import {AddressModel, UserModel} from "../_modals/user.model";

interface UpdateUser{
  firstName: string;
  lastName: string;
  email: string;
}
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
  isLoading = true;
  error: string | null = null;
  success: string | null = null;
  user: UserModel | null = null;
  initialAccountValues: any; // Add this property declaration

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        houseNumber: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    });

    // Remove separate forms since they're now part of accountForm
    this.shippingAddressForm = this.accountForm.get('shippingAddress') as FormGroup;
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

          this.initialAccountValues = this.accountForm.value;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to load user data. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  updateAccount(): void {
    if (this.accountForm.valid && this.user?.id) {
      const userData: UpdateUser = {
        email: this.accountForm.value.email,
        firstName: this.accountForm.value.firstName,
        lastName: this.accountForm.value.lastName,
      };

      this.userService.updateUser(this.user.id, userData).subscribe({
        next: () => {
          this.success = 'Account information updated successfully.';
          setTimeout(() => this.success = null, 3000);
        },
        error: () => {
          this.error = 'Failed to update account information. Please try again.';
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
        error: () => {
          this.error = 'Failed to update shipping address. Please try again.';
        }
      });
    }
  }
}
