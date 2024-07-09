import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { Assessment } from '../models/assessment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private checkoutSource = new Subject<number>();
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  arrCart: Cart[] = [];

  constructor(private httpClient: HttpClient) {}

  getCarts() {
    return this.httpClient.get<Cart[]>(this.baseUrl + "/cart", this.httpHeader).pipe(catchError(this.httpError));
  }

  getCartByID(id: string) {
    return this.httpClient.get<Cart>(this.baseUrl + '/cart/' + id, this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  addAssessmentToCart(cartId: number, updatedCart: Cart) {
    return this.httpClient.put<Cart>(this.baseUrl + "/cart/" + cartId, updatedCart, this.httpHeader).pipe(catchError(this.httpError));
  }

  updateCartById(cartId: number, newCart: Cart) {
    return this.httpClient.put<Cart>(this.baseUrl + "/cart/" + cartId, newCart, this.httpHeader).pipe(catchError(this.httpError));
  }

  deleteCart(cartId: number) {
    return this.httpClient.delete<Cart>(this.baseUrl + "/cart/" + cartId, this.httpHeader).pipe(catchError(this.httpError));
  }

  addNewCart(newCart: any) {
    return this.httpClient.post<Cart>(this.baseUrl + "/cart", JSON.stringify(newCart), this.httpHeader).pipe(catchError(this.httpError));
  }

  checkout(count: number) {
    this.checkoutSource.next(count);
  }

  getCheckout() {
    return this.checkoutSource.asObservable();
  }

  clearCart(cartId: number) {
    return this.httpClient.delete(this.baseUrl + '/cart/' + cartId, this.httpHeader).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
