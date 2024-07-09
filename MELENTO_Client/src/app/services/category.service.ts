import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl: string = "http://localhost:3000";

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.baseUrl + '/coursecategories')
      .pipe(catchError(this.httpError));
  }

  addCategory(category: Category): Observable<Category[]> {
    return this.httpClient.post<Category[]>(this.baseUrl + '/coursecategories', JSON.stringify(category), this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  updateCategory(category: Category): Observable<Category[]> {
    return this.httpClient.put<Category[]>(this.baseUrl + '/coursecategories/' + category.id, JSON.stringify(category), this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  deleteCategory(id: string): Observable<Category[]> {
    return this.httpClient.delete<Category[]>(this.baseUrl + '/coursecategories/' + id, this.httpHeader)
      .pipe(catchError(this.httpError));
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
