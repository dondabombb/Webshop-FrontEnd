export class ItemModel{

  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _price: number;
  private readonly _imagePath: string

  constructor(id: string, name: string, description: string, price: number, imagePath: string) {
  this._id = id;
  this._name = name;
  this._description = description;
  this._price = price;
  this._imagePath = imagePath
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

get imagePath():string{
    return this._imagePath
}


}
