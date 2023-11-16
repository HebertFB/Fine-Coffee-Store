import { Order } from "./Order";

export class Payment {
  typePayment!: string;
  totalPricePayment: number;
  ordeId: number;

  constructor(public order: Order) {
    this.totalPricePayment = (this.order.totalPrice + this.order.deliveryTax);
    this.ordeId = this.order.id;
  }
}
