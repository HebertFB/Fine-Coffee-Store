import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from "../shared/models/CartItem";
import { Product } from '../shared/models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() { }

  addToCart(product: Product, glassSizeSelected: number): void {
    let itemIndex = this.cart.items.findIndex(item => item.product.id === product.id && item.glassSizeSelected === glassSizeSelected);

    if (itemIndex !== -1) {
      this.cart.items[itemIndex].quantity++;
      this.cart.items[itemIndex].price = this.cart.items[itemIndex].quantity * this.cart.items[itemIndex].product.price[glassSizeSelected];
    } else {
      this.cart.items.push(new CartItem(product, glassSizeSelected));
    }

    this.setCartToLocalStorage();
  }


  removeFromCart(productId: string, glassSizeSelected: number): void {
    this.cart.items = this.cart.items.filter(item => !(item.product.id === productId && item.glassSizeSelected === glassSizeSelected));
    this.setCartToLocalStorage();
  }

  changeQuantity(productId: string, glassSizeSelected: number, quantity: number): void {
    const cartItem = this.cart.items.find(item => item.product.id === productId && item.glassSizeSelected === glassSizeSelected);
    if (!cartItem) return;

    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.product.price[glassSizeSelected];
      this.setCartToLocalStorage();
    }
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items
      .reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items
      .reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }

}
