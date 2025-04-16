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
    console.log('AdminPanelComponent initialized');
    this.loadAllItems();
  }
  
  dismissError() {
    this.productNotFound = false;
  }
  
  private loadAllItems() {
    console.log('Loading all items...');
    this.loading = true;
    this.error = false;
    this.productNotFound = false;
    
    // Simplify to match HomeScreenComponent approach
    this.itemService.getAll().subscribe({
      next: (items: ItemModel[]) => {
        console.log('Successfully loaded items:', items);
        this.items = items;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
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
      console.log('Navigating to edit for item:', item);
      
      if (!item) {
        throw new Error('Item is undefined or null');
      }
      
      const itemId = item.id;
      if (!itemId) {
        throw new Error('Item ID is undefined or null');
      }
      
      console.log('Navigating to edit with ID:', itemId);
      this.router.navigate(['/admin/edit', itemId]);
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Cannot edit this item. Please try again or select another item.');
    }
  }

  removeItem(item: ItemModel) {
    console.log('Attempting to remove item:', item);
    if (confirm(`Are you sure you want to remove ${item.name}?`)) {
      this.itemService.removeItem(item.id).subscribe({
        next: () => {
          console.log('Item removed successfully');
          this.items = this.items.filter(i => i.id !== item.id);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          alert('Failed to remove item. Please try again.');
        }
      });
    }
  }

  refreshItems() {
    console.log('Refreshing items...');
    this.loadAllItems();
  }
  
  hasItems(): boolean {
    return Array.isArray(this.items) && this.items.length > 0;
  }
  
  // Add this method to your component class
  handleImageError(event: any) {
    console.error('Error loading image:', event);
    // Set a fallback image
    event.target.src = 'assets/placeholder-image.jpg'; // Make sure this file exists in your assets folder
    // Or you can use a data URL for a simple placeholder
    // event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  }
}
