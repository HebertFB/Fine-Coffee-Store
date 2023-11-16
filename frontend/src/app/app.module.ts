import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { NgxMaskModule } from "ngx-mask";
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { SearchComponent } from './components/partials/search/search.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { TitleComponent } from './components/partials/title/title.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputContainerComponent } from './components/partials/input-container/input-container.component';
import { InputValidationComponent } from './components/partials/input-validation/input-validation.component';
import { TextInputComponent } from './components/partials/text-input/text-input.component';
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { OrderItemsListComponent } from './components/partials/order-items-list/order-items-list.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { PaypalButtonComponent } from './components/partials/paypal-button/paypal-button.component';
import { OrderTrackPageComponent } from './components/pages/order-track-page/order-track-page.component';
import { ChoiceBoxComponent } from './components/partials/choice-box/choice-box.component';
import { CashButtonComponent } from './components/partials/cash-button/cash-button.component';
import { PaymentBoxComponent } from './components/partials/payment-box/payment-box.component';
import { ButtonsOptionsComponent } from './components/partials/buttons-options/buttons-options.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { OrdersPageComponent } from './components/pages/orders-page/orders-page.component';
import { ManageOrdersPageComponent } from './components/pages/manage-orders-page/manage-orders-page.component';
import { UpdateOrderPageComponent } from './components/pages/update-order-page/update-order-page.component';
import { ManageProductsPageComponent } from './components/pages/manage-products-page/manage-products-page.component';
import { UpdateProductPageComponent } from './components/pages/update-product-page/update-product-page.component';
import { CreateProductPageComponent } from './components/pages/create-product-page/create-product-page.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { NewAdminPageComponent } from './components/pages/new-admin-page/new-admin-page.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    TagsComponent,
    ProductPageComponent,
    CartPageComponent,
    TitleComponent,
    NotFoundComponent,
    LoginPageComponent,
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    RegisterPageComponent,
    LoadingComponent,
    CheckoutPageComponent,
    OrderItemsListComponent,
    PaymentPageComponent,
    PaypalButtonComponent,
    OrderTrackPageComponent,
    ChoiceBoxComponent,
    CashButtonComponent,
    PaymentBoxComponent,
    ButtonsOptionsComponent,
    ProfilePageComponent,
    OrdersPageComponent,
    ManageOrdersPageComponent,
    UpdateOrderPageComponent,
    ManageProductsPageComponent,
    UpdateProductPageComponent,
    CreateProductPageComponent,
    PageNotFoundComponent,
    FooterComponent,
    AboutPageComponent,
    NewAdminPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
