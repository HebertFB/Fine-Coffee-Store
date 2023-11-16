import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { IProductRegister } from 'src/app/shared/interfaces/IProductRegister';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-product-page',
  templateUrl: './update-product-page.component.html',
  styleUrls: ['./update-product-page.component.css']
})
export class UpdateProductPageComponent implements OnInit {

  product!: Product;
  updateForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '/manage-products';

  @Input()
  productId!: string;

  @Input()
  name!: string;
  @Input()
  description!: string;

  @Input()
  priceP!: number;
  @Input()
  priceM!: number;
  @Input()
  priceG!: number;

  @Input()
  tags!: string;
  @Input()
  tagsTwo!: string | undefined;

  @Input()
  imageUrl!: string;
  @Input()
  origins!: string;
  @Input()
  preparationTime!: string;

  isEmpty: boolean = false;

  productLoaded: boolean = false;

  constructor(private formBuilder: FormBuilder, private productService: ProductService,
    private activatedRoute: ActivatedRoute, private router: Router, private toastrService: ToastrService) {

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      priceP: [null, Validators.required],
      priceM: [null, Validators.required],
      priceG: [null, Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
      tagsTwo: [''],
      imageUrl: ['', Validators.required],
      origins: ['', Validators.required],
      preparationTime: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(params => {
      this.productId = params['id'];
    });

    await this.loadOrderDetails(this.productId).then(() => {
      this.updateForm.patchValue({
        name: this.product.name,
        priceP: this.product.price[0],
        priceM: this.product.price[1],
        priceG: this.product.price[2],
        description: this.product.description,
        tags: this.product.tags ? this.product.tags[0] : '',
        tagsTwo: this.product.tags && this.product.tags.length > 1 ? this.product.tags[1] : '',
        imageUrl: this.product.imageUrl,
        origins: this.product.origins[0],
        preparationTime: this.product.preparationTime,
      });
    }).catch(error => {
      console.error(error);
    });

    this.productLoaded = true;
  }

  get fc() {
    return this.updateForm.controls;
  }

  async loadOrderDetails(productId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.productService.getProductById(productId).subscribe(
        (product: Product) => {
          if (product) {
            resolve();

            this.product = product;
            this.name = product.name;
            this.priceP = product.price[0];
            this.priceM = product.price[1];
            this.priceG = product.price[2];
            this.description = product.description
            this.tags = product.tags ? product.tags[0] : '';
            this.tagsTwo = product.tags && product.tags.length > 1 ? product.tags[1] : '';
            this.imageUrl = product.imageUrl;
            this.origins = product.origins[0];
            this.preparationTime = product.preparationTime;

            localStorage.removeItem('name');
            localStorage.removeItem('description');
            localStorage.removeItem('imageUrl');
            localStorage.removeItem('tags');
            localStorage.removeItem('price');
            localStorage.removeItem('origins');
            localStorage.removeItem('preparationTime');
          } else {
            reject(`Produto não encontrado para o ID ${productId}!`);
            this.isEmpty = true;

            this.toastrService.error(`Produto não encontrado para o ID ${productId}.`, 'Erro');
          }
        },
        (error) => {
          reject(error);
          this.toastrService.error(`Erro ao carregar detalhes do produto ${error}. Por favor, tente novamente mais tarde.`, 'Erro');
        }
      );
    });
  }

  showUpdateProductAlert(productId: string) {
    const message = `Tem certeza que deseja atualizar o produto ${this.name}?`;

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
        await this.updateProduct(productId);
      }
    });
  }

  async updateProduct(productId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const fv = this.updateForm.value;

      let product: IProductRegister = {
        name: this.toCapitalize(fv.name),
        description: this.capitalizeFirstLetter(fv.description),
        imageUrl: fv.imageUrl,
        tags: [this.capitalizeFirstLetter(fv.tags), this.capitalizeFirstLetter(fv.tagsTwo)],
        price: [fv.priceP, fv.priceM, fv.priceG],
        origins: [this.capitalizeFirstLetter(fv.origins)],
        preparationTime: fv.preparationTime,
      };

      try {
        await this.productService.update(productId, product).toPromise();
        localStorage.removeItem('name');
        localStorage.removeItem('description');
        localStorage.removeItem('imageUrl');
        localStorage.removeItem('tags');
        localStorage.removeItem('price');
        localStorage.removeItem('origins');
        localStorage.removeItem('preparationTime');

        this.router.navigateByUrl('/manage-products');
      }
      catch (error) {
      }
    });
  }

  capitalizeFirstLetter(text: string): string {
    const lowerCase = text.toLowerCase();
    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
  }

  toCapitalize(text: string): string {
    return text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }

}
