import {EventEmitter, Injectable} from "@angular/core";
import {ItemModel} from "../_modals/item.model";
import {Observable, of} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ItemsService{

  private itemlist : ItemModel[] = [
    new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),
    new ItemModel(
      '2',
      'voetbal',
      'een bal denk ik, of niet. daarvoor moet je eerst naar de winkel',
      9.99,
      'https://www.voetbalshop.nl/media/catalog/product/cache/1a662e74f62b3db31cb2d94e98c7cd90/2/4/244317_adidas-ek-2024-fussballliebe-league-voetbal-maat-5-wit-zwart-multicolor_1.jpg'
    ),
    new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),new ItemModel(
      '1',
      'tennisbal',
      'een bal denk ik',
      9.99,
      'https://www.kwd.nl/media/catalog/product/cache/2/image/515x515/9df78eab33525d08d6e5fb8d27136e95/t/e/tennisbal.jpg'
    ),
  ]

  constructor() {
  }


  public getAll(): Observable<ItemModel[]>{
    return of(this.itemlist);


  }

  public getOne(id: String):ItemModel | undefined{
    for (const element of this.itemlist) {
      if(element.id == id){
        return element;
      }
    }
    return undefined;
  }

  public addItem(item: ItemModel){

  }

  public updateItem(id: string){

  }

  public removeItem(id: string){

  }
}
