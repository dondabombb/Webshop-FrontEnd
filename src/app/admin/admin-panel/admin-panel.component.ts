import { Component } from '@angular/core';
import {ItemModel} from "../../_modals/item.model";
import {Router} from "@angular/router";
import {ItemsService} from "../../_service/items.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
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


  }
}
