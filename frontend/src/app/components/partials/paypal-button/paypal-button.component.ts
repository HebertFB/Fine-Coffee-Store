import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { NgZone } from '@angular/core';


declare var paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit {

  @Input()
  order!: Order;

  @Input()
  typePayment!: string;

  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;

  constructor(private orderService: OrderService, private cartService: CartService,
    private router: Router, private toastrService: ToastrService, private ngZone: NgZone) { }

  ngOnInit(): void {
    const self = this;
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'BRL',
                  value: self.order.totalPriceToPay,
                },
              },
            ],
          });
        },

        onApprove: async (data: any, actions: any) => {
          const payment = await actions.order.capture();
          this.order.paymentId = payment.id;
          this.order.typePayment = this.typePayment;
          self.orderService.pay(this.order).subscribe(
            {
              next: (orderId) => {
                this.cartService.clearCart();

                this.ngZone.run(() => {
                  this.router.navigateByUrl('/track/' + orderId);
                });
                this.toastrService.success('Pagamento PayPal feito com sucesso.', 'Sucesso');
              },
              error: (error) => {
                this.toastrService.error('Falha ao escolher pagamento no cartão PayPal!', 'Erro');
              }
            }
          );
        },

        onError: (err: any) => {
          this.toastrService.error('Falha no Pagamento!', 'Erro');
          console.log(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

}
