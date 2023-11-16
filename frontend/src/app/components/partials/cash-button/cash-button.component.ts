import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'cash-button',
  templateUrl: './cash-button.component.html',
  styleUrls: ['./cash-button.component.css']
})
export class CashButtonComponent {

  @Input()
  order!: Order;

  @Input()
  name!: string;

  @Input()
  typePayment!: string;

  constructor(private orderService: OrderService, private cartService: CartService,
    private router: Router, private toastrService: ToastrService) { }

  payWithCash() {
    this.order.typePayment = this.typePayment;

    this.orderService.payWithCash(this.order).subscribe(
      {
        next: (orderId) => {
          this.cartService.clearCart();
          this.router.navigateByUrl('/track/' + orderId);
          this.toastrService.success('Pagamento em dinheiro escolhido com sucesso.', 'Sucesso');
        },
        error: (error) => {
          this.toastrService.error('Falha ao escolher pagamento em dinheiro!', 'Erro');
        }
      }
    );
  }

}

