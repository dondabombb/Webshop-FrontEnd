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
  public items: ItemModel[];

  constructor(private router: Router, private itemService: ItemsService) { }

  ngOnInit() {
    this.loadAllItems();
  }

  private loadAllItems() {
    this.itemService.getAll().subscribe({
      next: (items: ItemModel[]) => {
        this.items = items;
      },
      error: (error) => {
        console.error('Error loading items:', error);
      }
    });
  }

  navigateToCreate() {
    this.router.navigate(['/admin/create']);
  }

  navigateToEdit(item: ItemModel) {
    this.router.navigate(['/admin/edit', item.id]);
  }

  removeItem(item: ItemModel) {
    if (confirm(`Are you sure you want to remove ${item.name}?`)) {
      this.itemService.removeItem(item.id).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.id !== item.id);
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    }
  }
}
