import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemsService } from '../../_service/items.service';
import { ItemModel } from '../../_modals/item.model';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imagePath: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const newItem = {
        name: this.itemForm.value.name,
        description: this.itemForm.value.description,
        imageUrl: this.itemForm.value.imagePath,
        price: Number(this.itemForm.value.price)
      };

      this.itemsService.addItem(newItem).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          if (error.error && error.error.message) {
            alert(`Failed to create item: ${error.error.message}`);
          } else {
            alert('Failed to create item. Please check all fields and try again.');
          }
        }
      });
    } else {
      Object.keys(this.itemForm.controls).forEach(key => {
        const control = this.itemForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin']);
  }
}
