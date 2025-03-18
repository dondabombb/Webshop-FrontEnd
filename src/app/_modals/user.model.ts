export class AddressModel {
  constructor(
    public street: string,
    public houseNumber: string,
    public postalCode: string,
    public city: string,
    public country: string
  ) {}
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