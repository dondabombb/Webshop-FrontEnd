import { ItemModel } from './item.model';

export class CartItemModel {
  constructor(
    public product: ItemModel,
    public quantity: number
  ) {}
}

export class CartModel {
  constructor(
    public id?: string,
    public userId?: string,
    public items: CartItemModel[] = []
  ) {}
}
