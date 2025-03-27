import { Injectable } from '@angular/core';
import { API$DOMAIN } from '../../authentication/core/apiconfiguration';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskType } from 'zone.js/lib/zone-impl';
import { catchError, of } from 'rxjs';
import { ChartViewRequest, DailyReport, ReportChartSummary, ReportDetails } from '../core/daily-report';
import { ResponseMessage } from '../../common/response-message';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DailyReportService {
  // API Urls
  private dailyReportChartDataGetUrl = API$DOMAIN + 'api/daily-reports/chart-view';
  private dailyReportGetUrl = API$DOMAIN + 'api/daily-reports/reports';
  private dailyReportGetOndateUrl =
    API$DOMAIN + 'api/daily-reports/reports-by-date';
  private dailyReportAddUrl = API$DOMAIN + 'api/daily-reports/add-reports';
  private taskTypeGetUrl = API$DOMAIN + 'api/daily-reports/tasks';
  private reportGetUrlFilter = API$DOMAIN + 'api/daily-reports/filter';
  private reportGetUrlFilteDate =
    API$DOMAIN + 'api/daily-reports/filter-by-date';
  private dailyReportRemoveUrl = API$DOMAIN + 'api/daily-reports/remove-report';
  constructor(private http: HttpClient,private router:Router) {}
  // get-all task types details
  GetTaskTypes() {
    return this.http.get<TaskType[]>(this.taskTypeGetUrl).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
  // get-all daily report details
  GetDailyReports(staffId: number) {
    // Setting the params
    let my_params = new HttpParams().set('staffId', staffId);
    return this.http
      .get<ReportDetails[]>(this.dailyReportGetUrl, { params: my_params })
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  // get-all daily report details
  GetDailyReportsWithFilter(
    date: string,
    staffId: number,
    currentpage: number,
    recordsPerPage: number
  ) {
    // Setting the params
    let my_params = new HttpParams()
      .set('date', date.toString())
      .set('staffId', staffId.toString())
      .set('recordsperPage', recordsPerPage.toString())
      .set('pageNumber', currentpage.toString());
    return this.http
      .get<ReportDetails[]>(this.dailyReportGetUrl, { params: my_params })
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  // get-all daily report details
  GetDailyReportsOndate(date: string, staffId: number) {
    // Setting the params
    let my_params = new HttpParams()
      .set('date', date.toString())
      .set('staffId', staffId.toString());
    return this.http
      .get<ReportDetails[]>(this.dailyReportGetOndateUrl, { params: my_params })
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  GetDailyReportsWithFilterdate(
    date: string,
    currentpage: number,
    recordsPerPage: number
  ) {
    // Setting the params
    let my_params = new HttpParams()
      .set('date', date.toString())
      .set('recordsperPage', recordsPerPage.toString())
      .set('pageNumber', currentpage.toString());
    return this.http
      .get<ReportDetails[]>(this.reportGetUrlFilteDate, { params: my_params })
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  //Get daily report chart view
  GetDailyReportsChartView(
   chartview:ChartViewRequest
  ) {
    // Setting the params
    // let my_params = new HttpParams()
    //   .set('start', start.toString())
    //   .set('end', end.toString())
    //   .set('staffId', staffId)
    //   .set('taskId', taskId);
    return this.http
      .post<ReportChartSummary>(this.dailyReportChartDataGetUrl,chartview)
      .pipe(
        catchError((error) => {
          this.createMessage('error', 'Request Failed', error);
          // Return an Observable (for example, an Observable of a default value or rethrow the error)
          return of(false); // or return throwError(error);
        })
      );
  }
  //add daily report
  AddDailyReports(report: DailyReport) {
    return this.http.post<ResponseMessage>(this.dailyReportAddUrl, report).pipe(
      catchError((error) => {
        this.createMessage('error', 'Request Failed', error);
        // Return an Observable (for example, an Observable of a default value or rethrow the error)
        return of(false); // or return throwError(error);
      })
    );
  }
  //Delete report
  DeleteReport(id: number) {
    // Setting the params
    let my_params = new HttpParams().set('id', id.toString());
    return this.http
      .delete<ResponseMessage>(this.dailyReportRemoveUrl, { params: my_params })
      .pipe(
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
