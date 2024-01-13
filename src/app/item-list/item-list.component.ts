import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemModel} from "../_modals/item.model";

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements OnInit{
  @Input() item!: ItemModel;
  @Output() dataToSend: EventEmitter<ItemModel> = new EventEmitter();

  ngOnInit() {
  }

  constructor() {}

  public async navigateToDetail() {
    this.dataToSend.emit(this.item)
  }
}

