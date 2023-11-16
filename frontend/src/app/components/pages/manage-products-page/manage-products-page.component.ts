import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/shared/models/Product';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-products-page',
  templateUrl: './manage-products-page.component.html',
  styleUrls: ['./manage-products-page.component.css']
})
export class ManageProductsPageComponent implements OnInit {

  products: Product[] = [];

  isEmpty: boolean = false;

  productsLoaded: boolean = false;

  constructor(private productService: ProductService, private toastrService: ToastrService) { }

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
    this.productsLoaded = true;
  }

  async loadProducts(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let productsObservable: Observable<Product[]>;

      productsObservable = this.productService.getAll();
      productsObservable.subscribe(
        (product) => {
          resolve();
          this.products = product;

          this.isEmpty = this.products.length === 0;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async showDeleteProductAlert(productId: string, productName: string) {
    const message = `Tem certeza que deseja excluir o produto ${productName}?`;

    Swal.fire({
      title: 'Atenção!!',
      html: message.replace(/\n/g, '<br>'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.deleteProduct(productId);
          await this.loadProducts();
        } catch (error) {
          this.toastrService.error('Falha na exclusão do produto!', 'Erro');
        }
      }
      if (result.isDismissed) {
        await this.loadProducts();
      }
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.productService.delete(productId).subscribe(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    })
  }

}
