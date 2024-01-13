import {Injectable} from "@angular/core";
import {ItemModel} from "../_modals/item.model";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService{
  updatedCart = new Subject<ItemModel[]>();
  private shoppingCart : ItemModel[] = [];
  count = new BehaviorSubject<number>(0);

  public getCart(){
    return this.shoppingCart.slice();
  }

  public addToCart(item: ItemModel){
    this.shoppingCart.push(item);
    this.updatedCart.next(this.shoppingCart.slice());
    this.getAmount();
  }

  removeItem(item: ItemModel){
  }

  public getAmount(){
    this.count.next(this.shoppingCart.length);
  }

}
