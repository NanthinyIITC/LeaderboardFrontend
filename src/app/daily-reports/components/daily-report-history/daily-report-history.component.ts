import { Component, OnInit } from '@angular/core';
import { BaseTemplate } from '../../../common/base-template';
import { ReportDetails } from '../../core/daily-report';
import { DailyReportModel } from '../../models/daily-report-model';
import { DailyReportService } from '../../service/daily-report.service';
import { MessageService } from 'primeng/api';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Staff } from '../../../staff/core/staff';
import { StaffService } from '../../../staff/service/staff.service';
import { StaffModel } from '../../../staff/models/staff-model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from '../../../authentication/service/authentication.service';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-daily-report-history',
  templateUrl: './daily-report-history.component.html',
  styleUrl: './daily-report-history.component.scss',
})
export class DailyReportHistoryComponent
  extends BaseTemplate
  implements OnInit
{
  //declare daily report model
  dailyReportModel: DailyReportModel;
  //declare daily report model
  staffModel: StaffModel;
  //declare reports list
  dailyReports: ReportDetails[] = [];
  //selected filtered date
  selectedDate: Date | null = null;
  //selected staff
  selectedStaff: number = 0;
  //declare staff list
  staffList: Staff[] = [];
  //ropdownlist
  staffDrpList: any;
  //staffid
  staffIdLoggedUser: number = 0;
  //declare to track page number
  currentPageNumber: number = 1;
  //track total records
  totalRecords: number = 0;
  //set records per page
  recordsPerPage: number = 10;
  //declare formatted date
  formattedDate: string = null;
  constructor(
    private dailyReportService: DailyReportService,
    private staffService: StaffService,
    messageService: NzNotificationService,
    messageS: MessageService,
    private auth:AuthenticationService
  ) {
    super(messageService);
    this.selectedDate = new Date();
    //format change for initial date
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-us');
    this.staffIdLoggedUser = this.getUser().staffId;
    this.dailyReportModel = new DailyReportModel(dailyReportService);
    this.staffModel = new StaffModel(staffService);
  }
  ngOnInit(): void {
    //if user is admin filter all daily report,else filter reports for that user only
    if (this.isAdmin()) {
      //get all staff list
      this.getAllStaffDetails();
      //get all staff report on particular date
      this.getAllStaffReportWithdate();
    } else {
      //get all reports
      this.getAllReports(this.staffIdLoggedUser);
    }
  }
  //check if user is admin
  isAdmin() {
    //set staff id
    const user = this.getUser();
    return user.userType == 'Admin';
  }
  //get user
  getUser(){    
    return this.auth.getUserData();
  }
  //filtering while calender changes
  filterUsingDate(event) {
    //format date to string
    this.formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-us');
    //get all reports on the date
    this.getAllStaffReportWithdate();
  }
  //filter while staff changes
  filterUsingStaff(event) {
    //get report details of eac staff
    this.getAllReports(Number(event));
  }
  // get staff details for admin usage
  getAllStaffDetails() {
    this.staffModel.GetAllStaffs().then((data) => {
      this.staffList = <Staff[]>data;
      this.staffDrpList = this.staffList.map((staff) => ({
        label: `${staff.firstName} ${staff.lastName}`, // Display Name
        value: staff.id, // The actual value stored
      }));
    });
  }
  //get all daily reports per staff
  getAllReports(staffId) {
    if (staffId > 0) {
      this.dailyReportModel
        .GetAllReportsWithFilter(
          this.formattedDate,
          staffId,
          this.currentPageNumber,
          this.recordsPerPage
        )
        .then((data) => {
          const list = <ReportDetails[]>data;
          if (list) {
            this.dailyReports = list;
          }
        });
    }
  }
  //handle pagination
  onPageChange(event: any) {
    //set current page number
    this.currentPageNumber = event.page + 1;
    //get staff details by pagination
    this.getAllStaffReportWithdate();
  }
  //get all daily reports
  getAllStaffReportWithdate() {
    this.dailyReportModel
      .GetAllReportsWithFilterdate(
        this.formattedDate,
        this.currentPageNumber,
        this.recordsPerPage
      )
      .then((data) => {
        const list = <ReportDetails[]>data;
        if (list) {
          this.dailyReports = list;
        }
      });
  }
}
