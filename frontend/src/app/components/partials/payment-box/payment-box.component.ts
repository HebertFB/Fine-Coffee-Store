import { Component, Input } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'payment-box',
  templateUrl: './payment-box.component.html',
  styleUrls: ['./payment-box.component.css']
})
export class PaymentBoxComponent {

  @Input()
  order!: Order;

  @Input()
  name!: string;

  @Input()
  typeOption!: string;

  @Input()
  typePay!: string;

}
