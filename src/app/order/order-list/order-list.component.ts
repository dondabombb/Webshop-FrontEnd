import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OrderModel} from "../../_modals/order.model";

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  @Input() order!: OrderModel;
  @Output() dataToSend: EventEmitter<OrderModel> = new EventEmitter();

  public navigateToDetail() {
    this.dataToSend.emit(this.order);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
