export class ItemModel{

  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _price: number;
  private readonly _imageUrl: string;

  constructor(id: string, name: string, description: string, price: number, imageUrl: string) {
  this._id = id;
  this._name = name;
  this._description = description;
  this._price = price;
  this._imageUrl = imageUrl
}

get id(): string {
  return this._id;
}

get name(): string {
  return this._name;
}

get description(): string {
  return this._description;
}

get price():number{
    return this._price;
}

get imageUrl():string{
    return this._imageUrl
}


}
