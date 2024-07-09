import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token = "" ;
    constructor(private localStorageService : LocalStorageService){
        this.localStorageService.getItem('token') ; 
    }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    let authtoken = this.localStorageService.getItem('token') ;
    if(!authtoken) authtoken = "" ;
    this.token = authtoken ; 
    let authreq = req ; 
    if(authtoken){
      authreq = authreq.clone({
        setHeaders: {
          authorization: `Bearer ${this.token}`,
        },
      });
      return next.handle(authreq) ; 
    }

    // Log the modified request
    console.log("Intercepted HTTP call", req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors
        console.error("Error occurred:", error);
        return throwError(error);
      })
    );
  }
}

export const httpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
