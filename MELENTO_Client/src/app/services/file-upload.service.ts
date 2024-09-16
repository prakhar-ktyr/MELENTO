import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  constructor(private httpClient : HttpClient) { }
  uploadImage(fileData: FormData): Observable<any> {
    return this.httpClient.post<{ url: string }>(this.baseUrl + "/upload", fileData , this.httpHeader).pipe(catchError(this.httpError));  // Adjust the URL to your backend
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
