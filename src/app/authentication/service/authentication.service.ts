import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../core/user';
import { catchError, of } from 'rxjs';
import { API$DOMAIN } from '../core/apiconfiguration';
import { AuthResponse } from '../core/auth-response';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
// API Urls
private loginUrl = API$DOMAIN + 'api/authentication/login';

constructor(private http: HttpClient) {

}
 
 // login to check user exist
 LoginUser(user:User) {
  return this.http.post<AuthResponse>(this.loginUrl, user).pipe(
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

}
