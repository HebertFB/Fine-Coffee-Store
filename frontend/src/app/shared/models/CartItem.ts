import { Product } from "./Product";

export class CartItem {
  quantity: number = 1;
  price: number;
  glassSize!: string;
  glassSizeSelected: number = -1;

  constructor(public product: Product, glassSizeSelected: number) {
    this.glassSize = product.glassSize[glassSizeSelected]
    this.price = this.product.price[glassSizeSelected];
    this.glassSizeSelected = glassSizeSelected;
  }
}
