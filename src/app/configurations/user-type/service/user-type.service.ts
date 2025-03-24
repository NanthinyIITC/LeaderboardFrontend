import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../../authentication/core/apiconfiguration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserType } from '../../../staff/core/user-type';
import { catchError, of } from 'rxjs';
import { ResponseMessage } from '../../../common/response-message';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

// API Urls
private userTypeActionsUrl = API$DOMAIN + 'api/staff/usertype-actions';

constructor(private http: HttpClient) {

}

  // user type actions
  UserTypeActions(action:string, type:UserType) { 
    // Setting the params
    let my_params = new HttpParams()  
    .set('action', action.toString())
    .set('id', type.id.toString())
    .set('name', type.name.toString())
    ;
  return this.http.get<ResponseMessage>(this.userTypeActionsUrl,{params:my_params}).pipe(
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
