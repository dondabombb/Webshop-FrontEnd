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
export class HomeScreenComponent implements OnInit{

  public items: ItemModel[];

  constructor(private router: Router, private itemservice: ItemsService) { }
  public ngOnInit() {
    this.loadAllItems();
  }

  private loadAllItems(){
    this.itemservice.getAll().subscribe((items: ItemModel[]) =>{
      this.items = items;
    })
  }



  navigateToDetail(item: ItemModel) {
    this.router.navigate([item.id]);

  }

}
