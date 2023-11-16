import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { IProductRegister } from 'src/app/shared/interfaces/IProductRegister';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product-page',
  templateUrl: './create-product-page.component.html',
  styleUrls: ['./create-product-page.component.css']
})
export class CreateProductPageComponent implements OnInit {

  productForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(private formBuilder: FormBuilder, private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      priceP: [null, [Validators.required]],
      priceM: [null, [Validators.required]],
      priceG: [null, [Validators.required]],
      description: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      tagsTwo: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      origins: ['', [Validators.required]],
      preparationTime: ['', [Validators.required]],
    });
  }

  get fc() {
    return this.productForm.controls;
  }

  submit() {
    this.isSubmitted = true;

    if (this.productForm.invalid) return;
    const fv = this.productForm.value;
    const product: IProductRegister = {
      name: this.toCapitalize(fv.name),
      description: this.capitalizeFirstLetter(fv.description),
      imageUrl: fv.imageUrl,
      tags: [this.capitalizeFirstLetter(fv.tags), this.capitalizeFirstLetter(fv.tagsTwo)],
      price: [fv.priceP, fv.priceM, fv.priceG],
      origins: [this.capitalizeFirstLetter(fv.origins)],
      preparationTime: fv.preparationTime,
    };

    this.productService.create(product).subscribe(
      (response) => {
        this.router.navigateByUrl('/manage-products');
      }
    );
  }

  capitalizeFirstLetter(text: string): string {
    const lowerCase = text.toLowerCase();
    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
  }

  toCapitalize(text: string): string {
    return text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
  }

}
