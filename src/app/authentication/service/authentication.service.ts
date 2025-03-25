import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthRequest, User } from '../core/user';
import { catchError, of } from 'rxjs';
import { API$DOMAIN } from '../core/apiconfiguration';
import { AuthResponse } from '../core/auth-response';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
// API Urls
private loginUrl = API$DOMAIN + 'api/authentication/login';
private response:AuthResponse;
constructor(private http: HttpClient) {
}
 
 // login to check user exist
 LoginUser(req:AuthRequest) {
  debugger
  return this.http.post<AuthResponse>(this.loginUrl, req).pipe(
    catchError((error) => {
      debugger
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}

createMessage(type: string, title: string, message: string): void {
  debugger
 console.log(message)
}
//get user
getUserData(){
  debugger
  const userjson = JSON.parse(localStorage.getItem(`${environment.appName}-auth`));
  this.response = JSON.parse(userjson); 
  return this.response;
}
}
