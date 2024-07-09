import { Injectable } from '@angular/core';
import { AssessmentScore } from '../models/assessmentScore';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentScoreService {
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getAssessmentScore(): Observable<AssessmentScore[]> { 
    return this.httpClient.get<AssessmentScore[]>(this.baseUrl + '/assessmentScore', this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  postAssessmentScore(a: AssessmentScore): Observable<AssessmentScore> {
    return this.httpClient.post<AssessmentScore>(this.baseUrl + '/assessmentScore', a, this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  getAssessmentScoreById(id: string): Observable<AssessmentScore> {
    return this.httpClient.get<AssessmentScore>(`${this.baseUrl}/assessmentScore/${id}`, this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  updateAssessmentScore(a: AssessmentScore): Observable<AssessmentScore> { 
    return this.httpClient.put<AssessmentScore>(`${this.baseUrl}/assessmentScore/${a.id}`, a, this.httpHeader)
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
