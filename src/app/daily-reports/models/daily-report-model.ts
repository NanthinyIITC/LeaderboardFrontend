import { Subscription } from 'rxjs';

import { ResponseMessage } from '../../common/response-message';

import { DailyReportService } from '../service/daily-report.service';
import { TaskType } from 'zone.js/lib/zone-impl';
import { ChartViewRequest, DailyReport, ReportChartSummary, ReportDetails } from '../core/daily-report';

export class DailyReportModel {
  //Store subscriptions
  allSubscriptions: Subscription[] = [];
  constructor(private reportService: DailyReportService) {}

  // Unsubscribe all
  UnsubscribeAll() {
    // Loop through the services
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();
    }
    // End of Loop through the services
  }

  // get alluser types promise
  GetTaskTypes() {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService.GetTaskTypes().subscribe((data) => {
          const res = <TaskType[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }

  // get alluser types promise
  GetAllReports(staffId: number) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService.GetDailyReports(staffId).subscribe((data) => {
          const res = <ReportDetails[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  // get all reports with filter promise
  GetAllReportsWithFilter(
    date: string,
    staffId: number,
    currentpage: number,
    recordsPerPage: number
  ) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService
          .GetDailyReportsWithFilter(date, staffId, currentpage, recordsPerPage)
          .subscribe((data) => {
            const res = <ReportDetails[]>data;
            // Resolve the promise
            resolve(res);
          })
      );
    });
    // return the promise
    return promise;
  }
  // get all reports on date without pagination promise
  GetAllReportsonDate(date: string, staffId: number) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService
          .GetDailyReportsOndate(date, staffId)
          .subscribe((data) => {
            const res = <ReportDetails[]>data;
            // Resolve the promise
            resolve(res);
          })
      );
    });
    // return the promise
    return promise;
  }
  // get all reports with filter promise
  GetAllReportsWithFilterdate(
    date: string,
    currentpage: number,
    recordsPerPage: number
  ) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService
          .GetDailyReportsWithFilterdate(date, currentpage, recordsPerPage)
          .subscribe((data) => {
            const res = <ReportDetails[]>data;
            // Resolve the promise
            resolve(res);
          })
      );
    });
    // return the promise
    return promise;
  }
  //create new report promise
  CreateReports(report: DailyReport) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService.AddDailyReports(report).subscribe((data) => {
          const res = <ResponseMessage>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  //remove report promise
  DeleteReports(id: number) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService.DeleteReport(id).subscribe((data) => {
          const res = <ResponseMessage>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  //get daily activity summary
  DailyActivitySummary(  chartview:ChartViewRequest) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.reportService.GetDailyReportsChartView(chartview).subscribe((data) => {
          const res = <ReportChartSummary>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
}
