import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Attendance } from '../models/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { }

  addAttendance(a: Attendance) {
    return this.httpClient.post<Attendance>(this.baseUrl + "/attendance", a, this.httpHeader).pipe(catchError(this.httpError));
  }

  getAttendance(){
    return this.httpClient.get<Attendance[]>(this.baseUrl + "/attendance" , this.httpHeader).pipe(catchError(this.httpError))
  }

  getAttendanceRecords() {
    return this.httpClient.get<Attendance[]>(this.baseUrl + "/attendance", this.httpHeader).pipe(catchError(this.httpError));
  }

  getAttendanceById(id: number) {
    return this.httpClient.get<Attendance>(this.baseUrl + "/attendance/" + id, this.httpHeader).pipe(catchError(this.httpError));
  }

  updateAttendance(id: number, att: Attendance) {
    return this.httpClient.put<Attendance>(this.baseUrl + "/attendance/" + id, att, this.httpHeader).pipe(catchError(this.httpError));
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
