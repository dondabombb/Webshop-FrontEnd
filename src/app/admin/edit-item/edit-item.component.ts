import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../_service/items.service';
import { ItemModel } from '../../_modals/item.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.scss'
})
export class EditItemComponent implements OnInit {
  itemForm: FormGroup;
  itemId: string;
  loading = true;
  error = false;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imagePath: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') || '';
    if (this.itemId) {
      this.loadItem();
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadItem(): void {
    console.log('Loading item with ID:', this.itemId);
    this.itemsService.getOne(this.itemId).subscribe({
      next: (item: ItemModel | undefined) => {
        console.log('Loaded item:', item);
        if (item) {
          this.itemForm.patchValue({
            name: item.name,
            description: item.description,
            price: item.price,
            imagePath: item.imageUrl
          });
          this.loading = false;
        } else {
          console.error('Item not found');
          this.error = true;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading item:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const updatedItem = {
        name: this.itemForm.value.name,
        description: this.itemForm.value.description,
        price: Number(this.itemForm.value.price),
        imageUrl: this.itemForm.value.imagePath
      };
      
      console.log('Submitting updated item:', updatedItem);
      
      this.itemsService.updateItem(this.itemId, updatedItem).subscribe({
        next: (updated) => {
          console.log('Item updated successfully:', updated);
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
        }
      });
    } else {
      console.log('Form is invalid:', this.itemForm.errors);
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin']);
  }
}
