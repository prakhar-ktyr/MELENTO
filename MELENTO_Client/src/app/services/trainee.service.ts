import { Injectable } from '@angular/core';
import { Trainee } from '../models/trainee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AssessmentTrainees } from '../models/assessmentTrainess';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {

  arrTrainees : Trainee[] = [] ; 
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { 
    
  }

  getTrainees(){
    return this.arrTrainees ; 
  }

  getTraineeByID(id:number){
    return this.arrTrainees[id] ; 
  }
  getAssessmentTrainess(){
    return this.httpClient.get<AssessmentTrainees[]>(this.baseUrl + "/assessmentTrainees", this.httpHeader).pipe(catchError(this.httpError));
  }
  updateAssessmentTraineeById(id:number , astt:AssessmentTrainees){
    return this.httpClient.put<AssessmentTrainees>(this.baseUrl + "/assessmentTrainees/" + id , JSON.stringify(astt) , this.httpHeader).pipe(catchError(this.httpError));
  }
  // updateAssessmentTrainees(asst:AssessmentTrainees){
  //   return this.httpClient.post<AssessmentTrainees[]>(this.baseUrl + "/assessmentTrainees/", JSON.stringify(asst), this.httpHeader).pipe(catchError(this.httpError));
  // }
  addAssessmentTrainee(astt:AssessmentTrainees){
    return this.httpClient.post<AssessmentTrainees>(this.baseUrl + "/assessmentTrainees/" , JSON.stringify(astt) , this.httpHeader).pipe(catchError(this.httpError));
  }
  getAssessmentTraineesCount():number{
    let count:number = 0 ; 
    this.getAssessmentTrainess().subscribe(data => {
      count = data.length ; 
      return count ;
    })
    return count ; 
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
