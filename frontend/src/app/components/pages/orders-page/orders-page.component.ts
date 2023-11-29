import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { IOrderUpdate } from 'src/app/shared/interfaces/IOrderUpdate';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  isOrderAwait(orderStatus: string): boolean {
    return orderStatus === 'AGUARDANDO RETIRADA';
  }

  isOrderFinalized(orderStatus: string): boolean {
    return orderStatus === 'FINALIZADO';
  }

  isOrderCanceled(orderStatus: string): boolean {
    return orderStatus === 'CANCELADO';
  }

  ordersCurrentUser: Order[] = [];

  @Input()
  isEmptyOption: boolean = false;

  @Input()
  userId!: string;

  @Input()
  userName!: string;

  @Input()
  isAdmin!: boolean;


  constructor(private orderService: OrderService, private toastrService: ToastrService,
    private userService: UserService, private router: Router) { }


  async ngOnInit(): Promise<void> {
    await this.deleteUndefinedOrders();

    this.userId = this.userService.currentUser.id;
    this.userName = this.userService.currentUser.name;
    this.isAdmin = this.userService.currentUser.isAdmin;

    await this.loadOrders();
  }

  async deleteUndefinedOrders(): Promise<void> {
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

  async loadOrders(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.orderService.getUserOrders(this.userId).subscribe(
        (userOrders) => {
          resolve();
          this.ordersCurrentUser = userOrders;

          this.isEmptyOption = this.ordersCurrentUser.length === 0;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  showConfirmCancelAlert(orderId: string, typePayment: string,
    paymentId: string) {
    const message = `${this.userName} tem certeza que deseja cancelar o \npedido N° ${orderId}?`;

    Swal.fire({
      title: 'Atenção!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelOrder(orderId, typePayment, paymentId);
      }
    });
  }

  async cancelOrder(orderId: string, typePayment: string,
    paymentId: string) {
    let order: IOrderUpdate = {
      statusOrder: '',
      paymentId: '',
      statusPayment: '',
    }

    if (typePayment === 'Dinheiro' && !paymentId) {
      order = {
        statusOrder: 'CANCELADO',
        paymentId: paymentId,
        statusPayment: 'CANCELADO',
      }
    }
    if (typePayment === 'Dinheiro' && paymentId) {
      order = {
        statusOrder: 'CANCELADO',
        paymentId: paymentId,
        statusPayment: 'REEMBOLSADO',
      }
    }
    if (typePayment === 'Cartão') {
      order = {
        statusOrder: 'CANCELADO',
        paymentId: paymentId,
        statusPayment: 'REEMBOLSADO',
      };
    }

    try {
      await this.orderService.update(orderId, order).toPromise();
      this.router.navigateByUrl('/track/' + orderId);
      this.toastrService.success(`Pedido N°${orderId} cancelado com sucesso!`, 'Pedido cancelado');

      localStorage.removeItem('statusPayment');
      localStorage.removeItem('paymentId');
    }
    catch (error) {
      this.toastrService.error('Falha ao cancelar pedido!', 'Erro');
    }
  }

}
