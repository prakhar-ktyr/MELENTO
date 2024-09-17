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
  uploadImage(uploadedFile: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', uploadedFile); // Append the image to FormData
    return this.httpClient.post(this.baseUrl + "/upload/", formData); 
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
