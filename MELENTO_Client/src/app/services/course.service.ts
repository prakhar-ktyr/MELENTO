import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { Observable, of, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  baseUrl: string = "http://localhost:3000";  

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.baseUrl + '/courses')
      .pipe(catchError(this.httpError));
  }

  getCourseById(id: string): Observable<Course> {
    return this.httpClient.get<Course>(this.baseUrl + '/courses/' + id)
      .pipe(catchError(this.httpError));
  }

  addCourse(course: Course): Observable<Course[]> {
    return this.httpClient.post<Course[]>(this.baseUrl + '/courses', JSON.stringify(course), this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  updateCourse(course: Course): Observable<Course[]> {
    return this.httpClient.put<Course[]>(this.baseUrl + '/courses/' + course.id, JSON.stringify(course), this.httpHeader)
      .pipe(catchError(this.httpError));
  }

  deleteCourse(id: string): Observable<Course[]> {
    return this.httpClient.delete<Course[]>(this.baseUrl + '/courses/' + id, this.httpHeader)
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
