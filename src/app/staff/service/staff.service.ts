import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../authentication/core/apiconfiguration';
import { User } from '../../authentication/core/user';
import { AuthResponse } from '../../authentication/core/auth-response';
import { catchError, of } from 'rxjs';
import { Staff } from '../core/staff';
import { ResponseMessage } from '../../common/response-message';
import { UserType } from '../core/user-type';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
// API Urls
private staffGetUrl = API$DOMAIN + 'api/staff/get-all';
private staffGetWithoutFilterUrl = API$DOMAIN + 'api/staff/get-all-staff';
private staffGetByIdUrl = API$DOMAIN + 'api/staff/get-by-id';
private staffCreateUrl = API$DOMAIN + 'api/staff/new-staff';
private staffUpdatetUrl = API$DOMAIN + 'api/staff/update-staff';
private staffDeleteUrl = API$DOMAIN + 'api/staff/remove-staff';
private userTypeGetUrl = API$DOMAIN + 'api/staff/usertypes';
constructor(private http: HttpClient) {

}
  // get-all user types details
  GetUserTypes() {
 
    return this.http.get<UserType[]>(this.userTypeGetUrl).pipe(
      catchError((error) => {
        this.createMessage('error','Request Failed', error.message)
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
    
  }
 // get-all staff details without pagination
 GetallStaffDetails() { 
  return this.http.get<Staff[]>(this.staffGetWithoutFilterUrl).pipe(
    catchError((error) => {
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}
  // get-all staff details
  GetallStaffDetailsWithPagination(currentPage:number,recordsPerPage:number) { 
    // Setting the params
    let my_params = new HttpParams()  
    .set('recordsperPage', recordsPerPage.toString())
    .set('pageNumber', currentPage.toString())
    ;
  return this.http.get<Staff[]>(this.staffGetUrl,{params:my_params}).pipe(
    catchError((error) => {
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}
 // get staff details by id
 GetallStaffDetailsById(id:number) {
  // Setting the params
  let my_params = new HttpParams()
    .set("staffId", id)   
   ;
  return this.http.get<Staff>(this.staffGetByIdUrl, { params: my_params }).pipe(
    catchError((error) => {
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}
 // create staff
 CreateStaff(staff:Staff) {
  return this.http.post<number>(this.staffCreateUrl, staff).pipe(
    catchError((error) => {
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}
 // update staff details
 UpdateStaffDetails(id:number,staff:Staff) {
  // Setting the params
  let my_params = new HttpParams()
    .set("staffId", id)   
   ;
  return this.http.put<ResponseMessage>(this.staffUpdatetUrl,staff, { params: my_params }).pipe(
    catchError((error) => {
      this.createMessage('error','Request Failed', error.message)
      // Return an Observable (for example, an Observable of a default value or rethrow the error)
      return of(false); // or return throwError(error);
    })
  );
  
}
 // remove staff details
 RemoveStaffDetails(id:number) {
  // Setting the params
  let my_params = new HttpParams()
    .set("staffId", id)   
   ;
  return this.http.delete<ResponseMessage>(this.staffDeleteUrl, { params: my_params }).pipe(
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
