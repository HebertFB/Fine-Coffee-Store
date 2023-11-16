import { CartItem } from "./CartItem";

export class Cart {
  items: CartItem[] = [];
  deliveryTax: number = 0;
  totalPrice: number = 0;
  totalCount: number = 0;
}
