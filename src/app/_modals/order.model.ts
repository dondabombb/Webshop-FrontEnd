import { AddressModel } from './user.model';
import { ItemModel } from './item.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export class OrderItemModel {
  item: { imagePath: string; };
  constructor(
    public product: ItemModel,
    public quantity: number,
    public price: number
  ) {}
}

export class OrderModel {
  constructor(
    public id?: string,
    public userId?: string,
    public items?: OrderItemModel[],
    public totalAmount?: number,
    public orderStatus?: OrderStatus,
    public shippingAddress?: AddressModel,
    public billingAddress?: AddressModel,
    public orderDate?: Date,
    public paymentMethod?: String
  ) {}
}
