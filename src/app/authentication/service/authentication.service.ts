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
  return this.http.post<AuthResponse>(this.loginUrl, req).pipe(
    catchError((error) => {      
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}

createMessage(type: string, title: string, message: string): void {  
 console.log(message)
}
//get user
getUserData(){
  //get item from local storage and return
  let userjson = localStorage.getItem(`${environment.appName}-auth`);
  if (!userjson) return null; // Handle case where data is missing

  let user = JSON.parse(userjson);
  return user;
}
}
