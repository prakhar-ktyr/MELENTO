import { Injectable } from '@angular/core';
import { Assessment } from '../models/assessment';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  arrAssessments: Assessment[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient , private localStorageService : LocalStorageService) {
  
  }

  getAssessments(): Observable<Assessment[]> {
    return this.httpClient.get<Assessment[]>(this.baseUrl + "/assessments", this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  getAssessmentById(id: number): Observable<Assessment> {
    return this.httpClient.get<Assessment>(`${this.baseUrl}/assessments/${id}`, this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  addAssessment(assessment: Assessment): Observable<Assessment> {
    return this.httpClient.post<Assessment>(this.baseUrl + "/assessments", assessment, this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  updateAssessmentById(id: number, assessment: Assessment): Observable<Assessment> {
    return this.httpClient.put<Assessment>(`${this.baseUrl}/assessments/${id}`, assessment, this.httpHeader)
      .pipe(catchError(this.httpError));
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
