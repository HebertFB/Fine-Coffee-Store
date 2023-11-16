import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { CartItem } from 'src/app/shared/models/CartItem';
import { Product } from 'src/app/shared/models/Product';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  product!: Product;
  cartItem!: CartItem;
  user!: User;

  @Input()
  glassSizeSelected: number = 1;
  clickedButtonIndex: number = -1;

  productLoaded: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private cartService: CartService,
    private productService: ProductService, private userService: UserService, private router: Router) {
    this.user = this.userService.currentUser;

    this.product = {} as Product;
  }

  async ngOnInit(): Promise<void> {
    await this.loadProduct();
    this.clickedButtonIndex = this.glassSizeSelected;
  }

  async loadProduct(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.activatedRoute.params.subscribe(
        (params) => {
          resolve();
          if (params.id)
            this.productService.getProductById(params.id).subscribe((serverProduct) => {
              this.product = serverProduct;
            });

          this.productLoaded = true;
        },
        (error) => {
          reject(error);
        });
    });
  }

  selectGlassSize(size: number) {
    this.glassSizeSelected = size;
    this.clickedButtonIndex = size;
  }

  addToCart() {
    if (this.user.token) {
      this.router.navigateByUrl('/cart-page');
      this.cartService.addToCart(this.product, this.glassSizeSelected);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/product/' + this.product.id } })
    }
  }

}
