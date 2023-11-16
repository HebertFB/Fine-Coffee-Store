import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ProductPageComponent } from './components/pages/product-page/product-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { authGuard } from './auth/guards/auth.guard';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { OrderTrackPageComponent } from './components/pages/order-track-page/order-track-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { OrdersPageComponent } from './components/pages/orders-page/orders-page.component';
import { ManageOrdersPageComponent } from './components/pages/manage-orders-page/manage-orders-page.component';
import { UpdateOrderPageComponent } from './components/pages/update-order-page/update-order-page.component';
import { authAdminGuard } from './auth/guards/authAdmin.guard';
import { authUserGuard } from './auth/guards/authUser.guard';
import { ManageProductsPageComponent } from './components/pages/manage-products-page/manage-products-page.component';
import { UpdateProductPageComponent } from './components/pages/update-product-page/update-product-page.component';
import { CreateProductPageComponent } from './components/pages/create-product-page/create-product-page.component';
import { authLoginGuard } from './auth/guards/authLogin.guard';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { NewAdminPageComponent } from './components/pages/new-admin-page/new-admin-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:searchTerm', component: HomeComponent },
  { path: 'tag/:tag', component: HomeComponent },
  { path: 'product/:id', component: ProductPageComponent },
  { path: 'cart-page', component: CartPageComponent, canActivate: [authUserGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [authLoginGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [authLoginGuard] },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authUserGuard] },
  { path: 'payment/:id', component: PaymentPageComponent, canActivate: [authUserGuard] },
  { path: 'track/:orderId', component: OrderTrackPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersPageComponent, canActivate: [authUserGuard] },
  { path: 'manage-orders', component: ManageOrdersPageComponent, canActivate: [authAdminGuard] },
  { path: 'update-order/:id', component: UpdateOrderPageComponent, canActivate: [authAdminGuard] },
  { path: 'create-product', component: CreateProductPageComponent, canActivate: [authAdminGuard] },
  { path: 'manage-products', component: ManageProductsPageComponent, canActivate: [authAdminGuard] },
  { path: 'update-product/:id', component: UpdateProductPageComponent, canActivate: [authAdminGuard] },
  { path: 'new-admin', component: NewAdminPageComponent, canActivate: [authAdminGuard] },
  { path: 'about', component: AboutPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
