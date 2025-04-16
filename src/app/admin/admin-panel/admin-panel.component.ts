import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ItemModel } from "../../_modals/item.model";
import { ItemsService } from "../../_service/items.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  public items: ItemModel[] = [];
  loading = true;
  error = false;
  productNotFound = false;

  constructor(private router: Router, private itemService: ItemsService) { }

  ngOnInit() {
    this.loadAllItems();
  }
  
  dismissError() {
    this.productNotFound = false;
  }
  
  private loadAllItems() {
    this.loading = true;
    this.error = false;
    this.productNotFound = false;
    
    this.itemService.getAll().subscribe({
      next: (items: ItemModel[]) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToCreate() {
    this.router.navigate(['/admin/create']);
  }

  navigateToEdit(item: ItemModel) {
    try {
      if (!item) {
        throw new Error('Item is undefined or null');
      }
      
      const itemId = item.id;
      if (!itemId) {
        throw new Error('Item ID is undefined or null');
      }
      
      this.router.navigate(['/admin/edit', itemId]);
    } catch (error) {
      alert('Cannot edit this item. Please try again or select another item.');
    }
  }

  removeItem(item: ItemModel) {
    if (confirm(`Are you sure you want to remove ${item.name}?`)) {
      this.itemService.removeItem(item.id).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== item.id);
        },
        error: () => {
          alert('Failed to remove item. Please try again.');
        }
      });
    }
  }

  refreshItems() {
    this.loadAllItems();
  }
  
  hasItems(): boolean {
    return Array.isArray(this.items) && this.items.length > 0;
  }
  
  handleImageError(event: any) {
    event.target.src = 'assets/placeholder-image.jpg';
  }
}
