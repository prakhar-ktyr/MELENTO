import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Observable, catchError, of, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class UserService {

  arrUsers: User[] = []

  baseUrl: string = "http://localhost:3000";

  httpHeader={
    headers:new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { // Add HttpClient as a parameter in the constructor
    this.arrUsers = [
      // new User(1, "John", "Doe", "johndoe@gmail.com", "9876543210", 
      //   [new Address(1, 101, "1st Main", "1st Block", "Bangalore", "Karnataka", "India", "560001")], "password", "01/01/1990", "Admin"),
      // new User(2, "Jane", "Doe", "janedoe@gmail.com", "9876543211",
      //   [new Address(2, 201, "2nd Main", "2nd Block", "Bangalore", "Karnataka", "India", "560002")], "password", "01/01/1991", "User")
    ]



  }

  getUsers(): Observable<User[]>{
    // return this.arrUsers;
    return this.httpClient.get<User[]>(this.baseUrl + '/users')
    .pipe(catchError(this.httpError));
  }

  getUserById(id: string): User {
    for (let i = 0; i < this.arrUsers.length; i++) {
      if (id == this.arrUsers[i].id) {
        return this.arrUsers[i];
      }
    }

    return new User("", "", "", "", "", [new Address(0, 0, "", "", "", "", "", "")], "", "", "");
  }

  addUser(u: User): Observable<User[]> {
    return this.httpClient.post<User[]>(this.baseUrl + '/users', JSON.stringify(u), this.httpHeader)
    .pipe(catchError(this.httpError));
  
  }

  updateUser(u: User): Observable<User[]> {
    return this.httpClient.put<User[]>(this.baseUrl + '/users/' + u.id, JSON.stringify(u), this.httpHeader)
    .pipe(catchError(this.httpError));
  }

  deleteUser(id: number): Observable<User[]> {
    return this.httpClient.delete<User[]>(this.baseUrl + '/users/' + id, this.httpHeader)
    .pipe(catchError(this.httpError));
  }
  userAuth(user:any){
    console.log(user) ; 
    return this.httpClient.post<any>(this.baseUrl + '/login/' , user , this.httpHeader).pipe(catchError(this.httpError)) ; 
  }

  registerUser(user:any){
    return this.httpClient.post<any>(this.baseUrl + '/register' , user , this.httpHeader).pipe(catchError(this.httpError))
  }

  getUsersNotLoggedIn(){
    return this.httpClient.get<User[]>(this.baseUrl + '/users/notLoggedIn/')
    .pipe(catchError(this.httpError));
  }
  httpError(error:HttpErrorResponse){
    let msg='';
    if(error.error instanceof ErrorEvent){
      msg=error.error.message;
    }
    else{
      msg=`Error Code:${error.status}\nMessafe:${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
