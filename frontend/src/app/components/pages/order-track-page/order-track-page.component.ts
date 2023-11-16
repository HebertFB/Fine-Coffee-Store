import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent {

  isOrderFinalized(orderStatus: string): boolean {
    return orderStatus === 'FINALIZADO';
  }

  isOrderCanceled(orderStatus: string): boolean {
    return orderStatus === 'CANCELADO';
  }

  order!: Order;

  user!: User;

  orderLoaded: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService,
    private userService: UserService) {
    this.user = this.userService.currentUser;

    this.loadOrder();
  }

  loadOrder() {
    const params = this.activatedRoute.snapshot.params;
    if (!params.orderId) return;

    this.orderService.trackOrderById(params.orderId).subscribe(
      order => {
        this.order = order;

        this.orderLoaded = true;
      })
  }

}
