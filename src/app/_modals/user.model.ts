export class AddressModel {
  street: string = '';
  city: string = '';
  postalCode: string = '';
  country: string = '';
  houseNumber: string = '';
}

export class UserModel {
  constructor(
    public id?: string,
    public firstName?: string,
    public middleName?: string,
    public lastName?: string,
    public email?: string,
    public password?: string,
    public phoneNumber?: string,
    public shippingAddress?: AddressModel,
    public billingAddress?: AddressModel,
    public role?: string
  ) {}
}
