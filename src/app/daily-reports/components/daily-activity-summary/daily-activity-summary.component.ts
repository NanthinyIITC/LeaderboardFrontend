import { Component } from '@angular/core';
import { DailyReportModel } from '../../models/daily-report-model';
import { StaffModel } from '../../../staff/models/staff-model';
import { DailyReportService } from '../../service/daily-report.service';
import { StaffService } from '../../../staff/service/staff.service';
import { MessageService } from 'primeng/api';
import { Staff } from '../../../staff/core/staff';

import { ChartViewRequest, ReportChartSummary } from '../../core/daily-report';
import { formatDate } from '@angular/common';
import { TaskType } from '../../core/task-type';

@Component({
  selector: 'app-daily-activity-summary',
  templateUrl: './daily-activity-summary.component.html',
  styleUrl: './daily-activity-summary.component.scss',
})
export class DailyActivitySummaryComponent {
  //declare daily report model
  dailyReportModel: DailyReportModel;
  //declare daily report model
  staffModel: StaffModel;
  //declare staff list
  staffList: Staff[] = [];
  //selected filtered date
  selectedDate: Date | null = null;
  //dropdownlist
  staffDrpList: any;
  //dropdownlist
  taskDrpList: any=[];
  //declare task id
  taskId: number = 0;
  //declare staffId
  staffId: number = 0;
  //declare start date formatted string
  selectedStart: string = '';
  //declare start date formatted string
  selectedEnd: string = '';
  //declare task type
  taskTypes: TaskType[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  //declare chart options
  chartData: any;
  chartOptions: any;
  //declare chart labels
  chartLabels:string[]=[];
  //declare chartdata
dataToChart:number[]=[];
//declare total working days
totalWorkingDays:number=0;
//declare total actual working days
totalActualWorkingdays:number=0;
//declare total actual working days
totalLeavedays:number=0;
  constructor(
    private dailyReportService: DailyReportService,
    private staffService: StaffService,
    messageS: MessageService
  ) {
    //set initial date value
    const now = new Date();
  
    //initialize models
    this.dailyReportModel = new DailyReportModel(dailyReportService);
    this.staffModel = new StaffModel(staffService);
    //get all task types
    this.getTaskTypes();
    //get staff liist
    this.getAllStaffDetails();
    this.defineChart();
    this.getStaffActivitySummary()
  }
  //define chart
  defineChart() {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.dataToChart, // Adjust values as needed
          backgroundColor: ['#4CAF50', '#FFC107', '#03A9F4'], // Green, Yellow, Blue
          hoverBackgroundColor: ['#45A049', '#FFB300', '#0288D1'],
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#555',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
  get getStaffName(){
    if(this.staffId>0){
      return (this.staffList.find(staff=>staff.id==this.staffId)).firstName
    }else{
      return '';
    }
   
  }
  //filter while staff changes
  filterUsingStaff(event) {
    this.staffId=Number(event)
    //get report details of eac staff
    this.getStaffActivitySummary();
  }
  //filter while task changes
  filterUsingTasktype(event) {
    //get report details of eac staff
    this.getStaffActivitySummary();
  }
  //filtering while calender changes
  filterUsingStartDate(event) {
    //format date to string
    this.selectedStart = formatDate(
      this.selectedStartDate,
      'yyyy-MM-dd',
      'en-us'
    );
    //get all reports on the date
    this.getStaffActivitySummary();
  }
  //filtering while calender changes
  filterUsingEndDate(event) {  
   
    //format date to string
    this.selectedEnd = formatDate(this.selectedEndDate, 'yyyy-MM-dd', 'en-us');
    //get all reports on the date
    this.getStaffActivitySummary();
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
  //get task types
  getTaskTypes() {
    this.dailyReportModel.GetTaskTypes().then((data) => {
      const list = <TaskType[]>data;
      if (list) {
        //set tasks list
        this.taskTypes = list;
     
       const types = this.taskTypes.map((task) => ({
          label: task.name, // Display Name
          value: task.id, // The actual value stored
        }));
        this.taskDrpList=[{
          label: 'All', // Display Name
          value:0, 
        },...types]
      }
    });
  }
  // get staff details for admin usage
  getStaffActivitySummary() {
    this.chartLabels=[];
    this.dataToChart=[];
    this.totalActualWorkingdays=0;
    this.totalLeavedays=0;
    this.totalWorkingDays=0;
    let chartData:ChartViewRequest={
      staffId: this.staffId,
      taskId: this.taskId,
      start: this.selectedStart,
      end: this.selectedEnd
    }
      if(this.staffId>0 && this.selectedStartDate!==null && this.selectedEndDate!==null){
        this.dailyReportModel
        .DailyActivitySummary(
          chartData
        )
        .then((data) => {
          const res = <ReportChartSummary>data;
          this.totalWorkingDays=res.totalWorkingDays;
          this.totalActualWorkingdays=res.totalActualWorkingDays;
          this.totalLeavedays=res.totalLeaveDays;
          this.totalActualWorkingdays=res.totalActualWorkingDays;
          res.dailyReportChartData.forEach(element => {
             this.chartLabels.push(element.label+' (%)')
             this.dataToChart.push(element.data)          
           
          });
          this.defineChart();
        });
      }
  }
}
