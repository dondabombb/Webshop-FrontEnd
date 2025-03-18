import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ItemModel} from "../_modals/item.model";
import {ItemsService} from "../_service/items.service";

@Component({
  selector: 'app-home-screen',
  standalone: false,
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss'
})
export class HomeScreenComponent implements OnInit {
  public items: ItemModel[] = [];
  public isLoading = true;
  public error: string | null = null;

  constructor(
    private router: Router, 
    private itemservice: ItemsService
  ) {
    console.log('HomeScreenComponent initialized');
  }

  public ngOnInit(): void {
    console.log('HomeScreenComponent ngOnInit called');
    this.loadAllItems();
  }

  private loadAllItems(): void {
    console.log('Loading all items...');
    this.isLoading = true;
    this.error = null;
    
    this.itemservice.getAll().subscribe({
      next: (items: ItemModel[]) => {
        console.log('Successfully loaded items:', items);
        this.items = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.error = `Failed to load products: ${error.statusText || error.message}`;
        this.isLoading = false;
      }
    });
  }

  navigateToDetail(item: ItemModel): void {
    this.router.navigate([item.id]);
  }
}
