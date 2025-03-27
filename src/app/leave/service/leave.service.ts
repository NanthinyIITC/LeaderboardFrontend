import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../authentication/core/apiconfiguration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LeaveType } from '../core/leave-type';
import { catchError, of } from 'rxjs';
import { CalenderDetails, LeaveDetails, LeaveRequest } from '../core/leave-request';
import { ResponseMessage } from '../../common/response-message';
import { LeaveBalance, LeaveSummary } from '../core/leave-balance';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  // API Urls
  private leaveGetUrl = API$DOMAIN + 'api/leave/get-all';
  private staffLeaveGetUrl = API$DOMAIN + 'api/leave/staff-leaves';
  private leaveBalanceUrl = API$DOMAIN + 'api/leave/leavebalance';
  private leaveCreateUrl = API$DOMAIN + 'api/leave/leave-request';
  private leaveTypesUrl = API$DOMAIN + 'api/leave/leave-types';
  private leaveAppliedUrl = API$DOMAIN + 'api/leave/appliedleaves';
  constructor(private http: HttpClient,private router:Router) {}
  // get-all leave types details
  GetLeaveTypes() {
    return this.http.get<LeaveType[]>(this.leaveTypesUrl).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
  // create leave request
  createLeaveRequest(request: LeaveRequest) {
    return this.http.post<ResponseMessage>(this.leaveCreateUrl, request).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
  // get leave balance of staff 
  getLeaveBalance(staffId: number) {
    // Setting the params
    let my_params = new HttpParams().set('staffId', staffId);
    return this.http
      .get<LeaveBalance[]>(this.leaveBalanceUrl, { params: my_params })
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  // get leave details
  getLeaveDetails() {
    return this.http.get<CalenderDetails[]>(this.leaveGetUrl).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
   // get applied leave staff details
   getLeaveAppliedDetails(staffId:number) {
      // Setting the params
      let my_params = new HttpParams().set('staffId', staffId);
    return this.http.get<LeaveSummary[]>(this.leaveAppliedUrl,{ params: my_params }).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
    // get applied leave staff details
    getStaffLeaveDetails(staffId:number,year:number,currentPage:number,recordsPerPage:number) {
      // Setting the params
      let my_params = new HttpParams()
      .set('staffId', staffId)
      .set('year', year)
      .set('pageNumber', currentPage)
      .set('recordsperPage', recordsPerPage)
      ;
    return this.http.get<LeaveDetails[]>(this.staffLeaveGetUrl,{ params: my_params }).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
  createMessage(type: string, title: string, error: any): void {  
    if(error.status==401){
    //navigate to login page
    this.router.navigate(['/login']);
    }else{
     console.log(error.message)
    }
   }
}
