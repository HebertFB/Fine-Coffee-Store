import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/shared/models/Product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  productsLoaded: boolean = false;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    await this.loadAllProducts();
    this.productsLoaded = true;
  }

  async loadAllProducts(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      let productsObservable: Observable<Product[]>;
      this.activatedRoute.params.subscribe(
        (params) => {
          if (params.searchTerm)
            productsObservable = this.productService.getAllProductsBySearchTerm(params.searchTerm)
          else if (params.tag)
            productsObservable = this.productService.getAllProductsByTag(params.tag);
          else
            productsObservable = this.productService.getAll();

          productsObservable.subscribe(
            (serverProducts) => {

              resolve();
              this.products = serverProducts;
            },
            (error) => {
              reject(error);
            }
          )
        }
      );
    });
  }

}
