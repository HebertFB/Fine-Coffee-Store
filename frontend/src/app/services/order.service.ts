import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { ORDER_CREATE_URL, ORDER_DELETE_BY_ID_URL, ORDER_DELETE_BY_UNDEFINED_TYPE_PAYMENT_URL, ORDER_GET_BY_ID_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_PAY_CASH_URL, ORDER_PAYMENT_BY_ID_URL, ORDER_TRACK_URL, ORDER_UPDATE_URL, ORDER_USER_ALL_ORDERS_URL, } from '../shared/constants/urls';
import { IOrderUpdate } from '../shared/interfaces/IOrderUpdate';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';

const ORDER_KEY = 'Order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderSubject = new BehaviorSubject<Order>(this.getOrderFromLocalStorage());
  public orderObservable: Observable<Order>;

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public ordersObservable: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.orderObservable = this.orderSubject.asObservable();
  }

  public get currentOrder(): Order {
    return this.orderSubject.value;
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_USER_ALL_ORDERS_URL).pipe(
      map(orders => {
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(ORDER_USER_ALL_ORDERS_URL).pipe(
      map(orders => {
        return orders.filter(order => order.user === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(ORDER_DELETE_BY_ID_URL + orderId).pipe(
      tap(() => {
        const updatedOrders = this.ordersSubject.value.filter(order => order.id.toString() !== orderId);
        this.ordersSubject.next(updatedOrders);
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  deleteUndefinedPaymentOrders(): Observable<any> {
    return this.http.delete(ORDER_DELETE_BY_UNDEFINED_TYPE_PAYMENT_URL).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(ORDER_GET_BY_ID_URL + orderId);
  }

  create(order: Order) {
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }


  update(orderId: string, orderUpdate: IOrderUpdate): Observable<Order> {
    return this.http.put<Order>(`${ORDER_UPDATE_URL}/${orderId}`, orderUpdate).pipe(tap({
      next: (order) => {
        this.setOrderToLocalStorage(order);
        this.orderSubject.next(order);
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Falha na Atualização!');
      }
    })
    );
  }

  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  pay(order: Order): Observable<string> {
    return this.http.post<string>(ORDER_PAY_URL, order);
  }

  payWithCash(order: Order): Observable<string> {
    return this.http.post<string>(ORDER_PAY_CASH_URL, order);
  }

  paymentOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(ORDER_PAYMENT_BY_ID_URL + id);
  }

  trackOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(ORDER_TRACK_URL + id);
  }

  private setOrderToLocalStorage(order: Order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }

  private getOrderFromLocalStorage(): Order {
    const orderJson = localStorage.getItem(ORDER_KEY);
    if (orderJson) return JSON.parse(orderJson) as Order;
    return new Order();
  }

}
