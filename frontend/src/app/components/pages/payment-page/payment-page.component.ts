import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {

  order: Order = {} as Order;

  @Input()
  typePayment: string | null = null;

  @Input()
  typePay!: string;

  @Input()
  totalPriceToPay!: number;

  orderLoaded: boolean = false;

  onSelectedTypeChange(selectedType: string) {
    this.typePayment = selectedType;
    this.typePay = selectedType;
  }

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) { }

  async ngOnInit(): Promise<void> {
    await this.loadPayment();
    this.orderLoaded = true;
  }

  async loadPayment(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      const params = this.activatedRoute.snapshot.params;
      const orderId = params['id'];
      if (!orderId) return;

      this.orderService.paymentOrderById(orderId).subscribe(
        (order) => {
          resolve();
          this.order = order;
          this.order.typePayment = this.typePay;
        },
        (error) => {
          reject(error);
        });
    });
  }

}
