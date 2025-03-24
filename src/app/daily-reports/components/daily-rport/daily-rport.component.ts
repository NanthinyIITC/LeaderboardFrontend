import { Component, OnInit } from '@angular/core';
import { BaseTemplate } from '../../../common/base-template';
import { DailyReportModel } from '../../models/daily-report-model';
import { DailyReportService } from '../../service/daily-report.service';
import { DailyReport, ReportDetails } from '../../core/daily-report';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { ResponseMessage } from '../../../common/response-message';
import { TaskType } from '../../core/task-type';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { debounceTime, Subject } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-daily-rport',
  templateUrl: './daily-rport.component.html',
  styleUrl: './daily-rport.component.scss',
})
export class DailyRportComponent implements OnInit {
  //declare daily report model
  dailyReportModel: DailyReportModel;
  //declare reports list
  dailyReports: ReportDetails[] = [];
  //set initial report count
  reportCount: number = 0;
  //declare tasktype
  taskTypes: TaskType[] = [];
  task: TaskType = { id: 0, name: '' };
  private autoSaveSubject = new Subject<void>();
  //declare to track index of table row
  currentIndex: number = 0;
  //declare date
  date: Date = new Date();
  //declare staff id
  staffId:number=0;
  constructor(
    private dailyReportService: DailyReportService,
    messageService: NzNotificationService,
    private messageServ: MessageService,
    private confirmationService: ConfirmationService
  ) {
    //initialize model
    this.dailyReportModel = new DailyReportModel(dailyReportService);
    //get task type list
    this.getTaskTypes();
  }
  ngOnInit(): void {
    //set staff id
    const userjson=localStorage.getItem('auth')
    const user = JSON.parse(userjson); 
    this.staffId=user.staffId
    //get all report details
    this.getAllReports(this.staffId);
    //update report after 2sec after the user input
    this.autoSaveSubject
      .pipe(debounceTime(2000))
      .subscribe(() => this.saveData());
  }

  //save daily reports
  addReports(reports: ReportDetails[]) {
   
    //set daily report
    const dailyReport: DailyReport = {
      staffId:   this.staffId,
      reports: reports,
    };
    if (  this.staffId > 0) {
      this.dailyReportModel.CreateReports(dailyReport).then((data) => {
        const list = <ResponseMessage>data;
        //show succes/error message
        if (list.success) {
          this.showMessgae('success', 'Success', 'Daily report updated...');
        } else {
          this.showMessgae('error', 'Error', 'Failed...');
        }
        //add default first row if there are no any reports exist after removed all records
        if (reports.length == 0) {
          //set report count to zero
          this.reportCount = 0;
          //add default row with zero index
          this.addRow(0);
        }
      });
    }
  }
  //show success/error message
  showMessgae(severity, summary, message) {
    this.messageServ.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }
  //get task types
  getTaskTypes() {
    this.dailyReportModel.GetTaskTypes().then((data) => {
      const list = <TaskType[]>data;
      if (list) {
        //set tasks list
        this.taskTypes = list;
        //get default task
        this.task = this.taskTypes[0];
      }
    });
  }
  //handle update start time event changes
  updateStartTime(t) {
    //start time change only for first row
    if (t === 0) {
      //check daily reports length
      if (this.dailyReports.length > 1) {
        for (let i = 0; i < this.dailyReports.length; i++) {
          if (i == 0) {
            //set end time as mins based on duration of first record
            const endMinutes =
              this.convertToMinutes(this.dailyReports[i].startTime) +
              this.dailyReports[i].duration;
            //set end time as string format
            this.dailyReports[0].endTime = this.convertToTimeString(endMinutes);
          } else {
            //update end time of first record as second record start time
            this.dailyReports[i].startTime = this.dailyReports[i - 1].endTime;
            //get end time in minutes
            const endMinutes =
              this.convertToMinutes(this.dailyReports[i].startTime) +
              this.dailyReports[i].duration;
          
            //set endtime as string
            this.dailyReports[i].endTime = this.convertToTimeString(endMinutes);
          }
        }
      }
      //save start time changes to db
      this.autoSave();
    }
  }
  //handle update end time event changes
  updateEndTime(t) {
    //update end time only updated row is valid
    if (!this.validateRow(t)) {
      //check whether daily reports length
      if (this.dailyReports.length > 1) {
        for (let i = t; i < this.dailyReports.length - 1; i++) {
          //set end time of updated row as start time of next row start time
          this.dailyReports[i + 1].startTime = this.dailyReports[i].endTime;
          //set endtime in minutes with duration and next row start time
          const endMinutes =
            this.convertToMinutes(this.dailyReports[i + 1].startTime) +
            this.dailyReports[i + 1].duration;

          //set endtime as string for next row
          this.dailyReports[i + 1].endTime =
            this.convertToTimeString(endMinutes);
        }
      }
      //save updated values to db
      this.autoSave();
    }
  }
  //disable start time of all rows except first row
  setStartTimeValid(i) {
    return i > 0;
  }
  //add new row to table
  addRow(i) {
    this.currentIndex = i;
    //set default report with values
    let newReport = {
      id: 0,
      taskId: this.task.id,
      startTime: '08:30',
      task: '',
      endTime: null,
      percentage: 0,
      duration: 0,
      comments: '',
      createdDate: new Date(),
      totalRecords: 0,
    };
    //set start time as previous rows endtime while add new row
    if (i !== 0) {
      newReport.startTime = this.dailyReports[i - 1].endTime;
    }
    //add report obj to list
    this.dailyReports.push(newReport);
  }
  //remove row from table
  removeRow(index: number) {
    //get start time of record going to be delete
    const deleteObjEndTime = this.dailyReports[index].startTime;
    //check the row is equal to before the end of last
    if (index < this.dailyReports.length - 1) {
      //set deleted record start time to nect record start time
      this.dailyReports[index + 1].startTime = deleteObjEndTime;
      //get duration and set to next record
      this.dailyReports[index + 1].duration = this.getTimeDifference(
        deleteObjEndTime,
        this.dailyReports[index + 1].endTime
      );
    }
    //remove that particular index row
    this.dailyReports.splice(index, 1);
    //save reports changes to db
    this.saveReports();
    //if deleted row is first then set default row
  }
  //convert to mins
  convertToMinutes(time: string): number {
    let [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
  }

  // Convert minutes to time string in "HH:mm AM/PM" format
  convertToTimeString(minutes: number): string {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    //if hour is grater than 24 then need to substract from 24 to get 12 hour time
    if (hours >= 24) {
      hours = hours - 24;
    }

    //set time as string HH:mm format
    const res = `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
    return res;
  }

  //handle auto save while model changes
  autoSave() {
    this.autoSaveSubject.next();
  }
  //validate add row button
  validateRow(i) {
    let status =
      this.dailyReports[i].endTime === null ||
      this.dailyReports[i].comments === '';
    return status;
  }
  //save data to db
  saveData() {
    if (!this.validateRow(this.currentIndex)) {
      //call save report method to store in db
      this.saveReports();
    } 
  }

  //calculate duration
  calculateDuration(task: any) {
    if (task.startTime && task.endTime) {
      //set duration
      task.duration = this.getTimeDifference(task.startTime, task.endTime);
    }
  }
  //get timeDifference
  getTimeDifference(start, end) {
    const startMinutes = this.convertToMinutes(start);
    const endMinutes = this.convertToMinutes(end);
    if (endMinutes > startMinutes) {
      return endMinutes - startMinutes;
    } else {
      return 0;
    }
  }
  //confirmation dialog before delete
  deleteConfirmation(event: Event, i: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this row?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        //if yes then delete record
        if (this.checkReportsTableState()) {
          this.showMessgae(
            'error',
            'Error',
            'Need to fill all fields to update changes....'
          );
        } else {
          this.removeRow(i);
        }
        
      },
      reject: () => {},
    });
  }
  onRowEditInit(event: any) {
    // Handle initialization of row edits if required
  }
  //save daily reports
  saveReports() {
  
    this.addReports(this.dailyReports);
  }
  //check reports has any unfilled data
  checkReportsTableState() {
    return this.dailyReports.some(
      (report) =>
        report.endTime === null ||
        report.comments === '' ||
        report.duration === 0
    );
  }
  //get all daily reports per staff
  getAllReports(staffId) {
    //format change for initial date
    const formattedDate = formatDate(this.date, 'yyyy-dd-MM', 'en-us');
    if (staffId > 0) {
      this.dailyReportModel
        .GetAllReportsonDate(formattedDate, staffId)
        .then((data) => {
          const list = <ReportDetails[]>data;
          if (list) {
            this.dailyReports = list;
          }
          //if staff not have any records by default add one record
          if (list.length == 0) {
            setTimeout(() => {
              this.addRow(0);
            }, 200);
          }
        });
    }
  }
}
