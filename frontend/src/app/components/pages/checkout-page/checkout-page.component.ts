import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  order: Order = new Order();
  orderId!: Order;
  checkoutForm!: FormGroup;

  @Input()
  deliveryAtHome: boolean | null = null;

  @Input()
  deliveryType!: string;

  constructor(private cartService: CartService, private formBuilder: FormBuilder,
    private userService: UserService, private toastrService: ToastrService,
    private orderService: OrderService, private router: Router) {
    const cart = cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }

  ngOnInit(): void {
    let { name, phone, address, numberHouse, cep, city, stateUF, district, complement } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name, Validators.required],
      phone: [phone, Validators.required],
      address: [address, Validators.required],
      numberHouse: [numberHouse, Validators.required],
      cep: [cep, Validators.required],
      city: [city, Validators.required],
      stateUF: [stateUF, Validators.required],
      district: [district, Validators.required],
      complement: [complement]
    });
  }

  onSelectedTypeChange(selectedType: string) {
    if (selectedType.toLowerCase() === 'true') {
      this.deliveryAtHome = true;
      this.deliveryType = 'Delivery';
    }
    else if (selectedType.toLowerCase() === 'false') {
      this.deliveryAtHome = false;
      this.deliveryType = 'Retirada';
    } else {
      this.deliveryAtHome = null;
    }
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  toCapitalize(text: string): string {
    return text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }

  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning('Por favor preencha os campos!', 'Entradas inválidas');
      return;
    }
    if (this.deliveryAtHome === null) {
      this.toastrService.warning('Por favor escolha um método de entrega!', 'Escolha um método');
      return;
    }

    this.order.name = this.toCapitalize(this.fc.name.value);
    this.order.phone = this.fc.phone.value;
    this.order.deliveryAddress = this.deliveryType;

    if (this.deliveryAtHome === false) {
      this.order.address = 'Rua Café';
      this.order.numberHouse = '23';
      this.order.cep = '12345000';
      this.order.city = 'Minas Gerais';
      this.order.stateUF = 'MG';
      this.order.district = "Cafezais";
      this.order.deliveryTax = 0;
    }
    if (this.deliveryAtHome === true) {
      this.order.address = this.toCapitalize(this.fc.address.value);
      this.order.numberHouse = this.fc.numberHouse.value;
      this.order.cep = this.fc.cep.value;
      this.order.city = this.toCapitalize(this.fc.city.value);
      this.order.stateUF = this.fc.stateUF.value.toUpperCase();
      this.order.district = this.toCapitalize(this.fc.district.value);
      this.order.complement = this.toCapitalize(this.fc.complement.value);
      this.order.deliveryTax = 12;
    }

    this.order.typePayment = 'undefined';
    this.order.totalPriceToPay = (this.order.deliveryTax + this.order.totalPrice);

    this.orderService.create(this.order).subscribe({
      next: (order: Order) => {
        this.cartService.clearCart();
        this.orderId = order;
        this.router.navigateByUrl('/payment/' + this.orderId.id);
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Cart');
      }
    })
  }

  clearCart() {
    this.cartService.clearCart();
    this.router.navigateByUrl('/');
    this.toastrService.success(
      'Pedido cancelado com sucesso!'
    );
  }

}
