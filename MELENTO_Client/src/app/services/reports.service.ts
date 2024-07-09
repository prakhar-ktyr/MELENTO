import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Report } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { }

  getReports() {
    return this.httpClient.get<Report[]>(this.baseUrl + "/reports", this.httpHeader).pipe(catchError(this.httpError));
  }

  getReportsCount() {
    let count = 0;
    this.getReports().subscribe(data => {
      count = data.length;
    });
    return count;
  }

  getReportById(id: number) {
    return this.httpClient.get<Report>(this.baseUrl + "/reports/" + id, this.httpHeader).pipe(catchError(this.httpError));
  }

  addReport(r: Report) {
    return this.httpClient.post<Report>(this.baseUrl + "/reports", JSON.stringify(r), this.httpHeader).pipe(catchError(this.httpError));
  }

  private httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(msg);
    return throwError(msg);
  }
}
