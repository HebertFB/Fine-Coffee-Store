import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-orders-page',
  templateUrl: './manage-orders-page.component.html',
  styleUrls: ['./manage-orders-page.component.css']
})
export class ManageOrdersPageComponent implements OnInit {

  isOrderAwait(orderStatus: string): boolean {
    return orderStatus === 'AGUARDANDO RETIRADA';
  }

  isOrderFinalized(orderStatus: string): boolean {
    return orderStatus === 'FINALIZADO';
  }

  isOrderCanceled(orderStatus: string): boolean {
    return orderStatus === 'CANCELADO';
  }

  orders: Order[] = [];
  ordersLoaded: boolean = false;

  updateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private orderService: OrderService) { }

  async ngOnInit(): Promise<void> {
    await this.deleteAllUndefinedOrders();
    await this.loadAllOrders();
    this.ordersLoaded = true;

    let { id, statusOrder, statusPayment, paymentId } = this.orderService.currentOrder;
    this.updateForm = this.formBuilder.group({
      id: [id],
      statusOrder: [statusOrder, Validators.required],
      paymentId: [paymentId, Validators.required],
      statusPayment: [statusPayment, Validators.required],
    });
  }

  async deleteAllUndefinedOrders(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.orderService.deleteUndefinedPaymentOrders().subscribe(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async loadAllOrders(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.orderService.getAllOrders().subscribe(
        (allOrders) => {
          resolve();
          this.orders = allOrders;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}
