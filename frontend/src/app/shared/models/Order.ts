import { CartItem } from "./CartItem";


export class Order {
  id!: number;
  items!: CartItem[];
  statusOrder!: string;
  glassSize!: string;
  deliveryAddress!: string;
  deliveryTax!: number;
  totalPrice!: number;
  totalPriceToPay!: number;
  user!: string;
  name!: string;
  address!: string;
  complement!: string;
  phone!: string;
  numberHouse!: string;
  cep!: string;
  city!: string;
  stateUF!: string;
  district!: string;
  paymentId!: string;
  statusPayment!: string;
  typePayment!: string;
  createdAt!: string;
  updatedAt!: string;
}
