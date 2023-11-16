import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { IOrderUpdate } from 'src/app/shared/interfaces/IOrderUpdate';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-order-page',
  templateUrl: './update-order-page.component.html',
  styleUrls: ['./update-order-page.component.css']
})
export class UpdateOrderPageComponent implements OnInit {

  order: Order = {} as Order;
  updateForm!: FormGroup;

  orderStatusOptionsDelivery: string[] = ['PREPARANDO', 'PRONTO', 'EM TRANSITO', 'FINALIZADO'];
  orderStatusOptionsWithdrawal: string[] = ['PREPARANDO', 'PRONTO', 'AGUARDANDO RETIRADA', 'FINALIZADO'];
  selectedStatus: string = '';

  @Input()
  hashPaymentId!: string;

  @Input()
  isEmpty: boolean = false;

  ordersLoaded: boolean = false;

  constructor(private formBuilder: FormBuilder, private orderService: OrderService,
    private activatedRoute: ActivatedRoute, private router: Router,
    private toastrService: ToastrService) { }


  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params) => {
      const orderId = params['id'];
      await this.loadOrderDetails(orderId);
      this.ordersLoaded = true;
    });

    let { id, statusOrder, statusPayment, paymentId } = this.orderService.currentOrder;
    this.updateForm = this.formBuilder.group({
      id: [id],
      statusOrder: [statusOrder, Validators.required],
      paymentId: [paymentId, Validators.required],
      statusPayment: [statusPayment, Validators.required],
    });
  }

  async loadOrderDetails(orderId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.orderService.getOrderById(orderId).subscribe(
        (order: Order) => {
          resolve();

          if (order) {
            this.order = order;
            this.selectedStatus = order.statusOrder;
          } else {
            this.isEmpty = true;

            this.toastrService.error(`Ordem não encontrada para o ID ${orderId}. Por favor, verifique o ID da ordem.`, 'Erro');
          }
        },
        (error) => {
          reject(error);
          this.toastrService.error(`Erro ao carregar detalhes da ordem ${error}. Por favor, tente novamente mais tarde.`, 'Erro');
        }
      );
    });
  }

  get fc() {
    return this.updateForm.controls;
  }

  generateHashPaymentId(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';

    for (let i = 0; i < 17; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      hash += caracteres.charAt(randomIndex);
    }
    return this.hashPaymentId = hash.toLocaleUpperCase();
  }

  async showUpdateOrderAlert(orderId: string) {
    const message = `Deseja realmente atualizar o status do\npedido N° ${orderId}?`;

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (this.selectedStatus === 'FINALIZADO' && this.order.typePayment === 'Dinheiro' && this.order.statusPayment !== 'PAGO') {
          await this.confirmPay(orderId);
          this.toastrService.success(`Status do pedido N° ${orderId} foi atualizado com sucesso.`, 'Atualizado');
          this.router.navigateByUrl('/track/' + orderId);
        }
        else {
          await this.updateOrder(orderId);
          this.router.navigateByUrl('/track/' + orderId);
        }
      }
    });
  }

  async showConfirmPayAlert(orderId: string) {
    const message = `Deseja realmente confirmar pagamento do\npedido N° ${orderId}?`;

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.confirmPay(orderId);
        this.router.navigateByUrl('/track/' + orderId);
      }
    });
  }

  async confirmPay(orderId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const hash = this.generateHashPaymentId();

      let order: IOrderUpdate = {
        statusOrder: this.selectedStatus,
        paymentId: hash,
        statusPayment: "PAGO",
      };

      this.orderService.update(orderId, order).subscribe(
        () => {
          resolve();
          this.toastrService.success(` `, 'Pagamento Confirmado');

          localStorage.removeItem('statusPayment');
          localStorage.removeItem('paymentId');
        },
        (error) => {
          reject(error);
          this.toastrService.error('Falha ao atualizar pagamento!', 'Erro');
        }
      );
    });
  }

  async updateOrder(orderId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let order: IOrderUpdate = {
        statusOrder: this.selectedStatus,
        paymentId: this.order.paymentId,
        statusPayment: this.order.statusPayment,
      };

      this.orderService.update(orderId, order).subscribe(
        () => {
          resolve();
          this.toastrService.success(`Status do pedido N° ${orderId} foi atualizado com sucesso.`, 'Atualizado');

          localStorage.removeItem('statusPayment');
          localStorage.removeItem('paymentId');
        },
        (error) => {
          reject(error);
          this.toastrService.error('Falha ao atualizar pedido!', 'Erro');
        }
      );
    });
  }

}
