import { Injectable } from '@angular/core';
import { Product } from '../shared/models/Product';
import { Tag } from '../shared/models/Tag';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PRODUCT_BY_ID_URL, PRODUCT_CREATE_URL, PRODUCT_DELETE_URL, PRODUCT_UPDATE_URL, PRODUCTS_BY_SEARCH_URL, PRODUCTS_BY_TAG_URL, PRODUCTS_TAGS_URL, PRODUCTS_URL, } from '../shared/constants/urls';
import { IProductRegister } from '../shared/interfaces/IProductRegister';
import { ToastrService } from 'ngx-toastr';


const PRODUCT_KEY = 'Product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productSubject = new BehaviorSubject<Product>(this.getProductFromLocalStorage());
  public productObservable: Observable<Product>;

  public get currentProduct(): Product {
    return this.productSubject.value;
  }

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.productObservable = this.productSubject.asObservable()
  }

  create(productCreated: IProductRegister): Observable<Product> {
    return this.http.post<Product>(PRODUCT_CREATE_URL, productCreated).pipe(
      tap({
        next: (product) => {
          this.setProductToLocalStorage(product);
          this.productSubject.next(product);
          this.toastrService.success(`${product.name} criado com sucesso!`, 'Registrado');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Falha na criação!');
        }
      })
    )
  }

  update(productId: string, productUpdate: IProductRegister): Observable<Product> {
    return this.http.put<Product>(`${PRODUCT_UPDATE_URL}/${productId}`, productUpdate).pipe(tap({
      next: (product) => {
        this.setProductToLocalStorage(product);
        this.productSubject.next(product);
        this.toastrService.success(`${product.name} foi atualizado com sucesso!`, 'Atualizado');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Falha na atualização!');
      }
    })
    );
  }

  delete(productId: string): Observable<Product> {
    return this.http.delete<Product>(`${PRODUCT_DELETE_URL}/${productId}`).pipe(tap({
      next: (product) => {
        this.setProductToLocalStorage(product);
        this.productSubject.next(product);
        this.toastrService.success(`${product.name} foi excluído com sucesso.`, 'Excluído');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Falha na exclusão!');
      }
    })
    );
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCTS_URL).pipe(
      map((products: Product[]) => {
        return products.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      })
    )
  }

  getAllProductsBySearchTerm(searchTerm: string) {
    return this.http.get<Product[]>(PRODUCTS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(PRODUCTS_TAGS_URL);
  }

  getAllProductsByTag(tag: string): Observable<Product[]> {
    return tag === "Tudo" ? this.getAll() :
      this.http.get<Product[]>(PRODUCTS_BY_TAG_URL + tag);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(PRODUCT_BY_ID_URL + productId);
  }

  private setProductToLocalStorage(product: Product) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(product));
  }

  private getProductFromLocalStorage(): Product {
    const productJson = localStorage.getItem(PRODUCT_KEY);
    if (productJson) return JSON.parse(productJson) as Product;
    return new Product();
  }

}
