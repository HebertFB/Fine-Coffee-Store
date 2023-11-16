import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/shared/models/Cart';
import { CartItem } from "src/app/shared/models/CartItem";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cart!: Cart;

  constructor(private cartService: CartService,
    private router: Router, private toastrService: ToastrService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    })
  }

  ngOnInit(): void {
  }

  removeFromCart(cartItem: CartItem, size: number) {
    this.cartService.removeFromCart(cartItem.product.id, size);
  }


  changeQuantity(cartItem: CartItem, quantityInString: string, size: number) {
    const glassSize = size;
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.product.id, glassSize, quantity);
  }

  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.changeQuantity(cartItem, (cartItem.quantity - 1).toString(), cartItem.glassSizeSelected);
    }
  }

  incrementQuantity(cartItem: CartItem): void {
    this.changeQuantity(cartItem, (cartItem.quantity + 1).toString(), cartItem.glassSizeSelected);
  }

  clearCart() {
    this.cartService.clearCart();
    this.router.navigateByUrl('/');
    this.toastrService.success('Carrinho limpo com sucesso');
  }

}
