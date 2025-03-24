import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseTemplate } from '../../../common/base-template';
import { LeaveModel } from '../../models/leave-model';
import { LeaveType } from '../../core/leave-type';
import { LeaveDetails } from '../../core/leave-request';
import {
  CalenderDetails,
  LeaveBalance,
  LeaveSummary,
} from '../../core/leave-balance';
import { LeaveService } from '../../service/leave.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrl: './leave-details.component.scss',
})
export class LeaveDetailsComponent
  extends BaseTemplate
  implements OnInit, OnChanges
{
  //declare leave model
  leaveModel: LeaveModel;
  //declare array of leave types
  leaveTypes: LeaveType[] = [];
  //declare array of leave details
  leaveDetails: CalenderDetails[] = [];
  //declare leave balance
  leaveBalance: LeaveBalance[] = [];
  //declare lave summary
  leaveSummary: LeaveSummary[] = [];
  //calender options
  calenderOptions: CalenderDetails;
 //declare button selection
 buttonSelection:string='';
  //declare reset variable
  reset: boolean = false;
  //staffid
  staffId:number=0;
  calendarOptions: CalendarOptions = {
    themeSystem: 'standard',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      right: 'today prev,next',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
  };
  isEditMode: boolean = false;
  visible: boolean = false;
  constructor(
    private leaveService: LeaveService,
    private route: Router,
    message: NzNotificationService,
    private messageServ: MessageService
  ) {
    super(message);
    this.staffId=(this.getUser()).staffId
    this.leaveModel = new LeaveModel(leaveService);
    //get leave types
    this.getLeaveTypes();
    //get leave balance
    this.getLeaveBalance();
    //get all lave details
    this.getLeaveDetails();
    //get applied leave balanc
    this.getLeaveApplied();
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}

  showDialog(type) {
    //handle button click event
    this.buttonSelection=type;
    //enable dialog visible
    this.visible = true;
  }

  closeModal() {
    // if (this.userModel) {
    //   this.userModel.nativeElement.style.display = 'none';
    // }
    this.visible = false;
  }
  //handle leave form submission changes
  updateChanges(event) {
    if (event.success) {
      //call leave balance after leave applied
      this.getLeaveBalance();
        //call to get all leave details after leave applied
      this.getLeaveDetails();
        //call to get applied leave details 
      this.getLeaveApplied();
      //display success after applied leave
      this.showMessgae('success', 'Success', event.message);
    } else {
      //display error if occured
      this.showMessgae('error', 'Error', event.message);
    }
    //close dialog after leave created
    this.closeModal();
    //get leave details 
    this.getLeaveDetails()
  }
  //get all leave types
  getLeaveTypes() {
    this.leaveModel.GetAllleaveTypes().then((data) => {
      //set leave types
      this.leaveTypes = <LeaveType[]>data;      
    });
  }
  //reset form while close dialog
  onDialogClose() {
    this.reset = true;
    this.closeModal();
  }
  addRequest() {}
  //get all leave details
  getLeaveDetails() {
    this.leaveModel.GetAllleaveDetails().then((data) => {
      const res = <CalenderDetails[]>data;

      // Transform data to format required by FullCalendar
      const calendarEvents = res.map((leave) => {
        let text='';
        let eventStart = new Date(leave.start!);
        let eventEnd = new Date(leave.end!);
        let eventColor = leave.color || '#3788d8'; // Default event color
        let allDayFlag = true; // Ensure event is NOT all-day
        // If it's a half-day leave
        if (leave.isHalfday) {
          if (leave.isMorningHalfday) {  
            text='Halfday-morning'        
            eventColor = '#006400'; // Morning half-day color (Yellow)
          } else if (leave.isAfternoonHalfday) {      
            text='Halfday-afternoon'     
            eventColor = '#006400'; // Afternoon half-day color (Orange)
          }
        } else if (leave.isFullday) {        
          eventColor =leave.color; // Full-day color (Blue)
        }

        return {
          title: leave.title+' '+text,
          start: eventStart,
          end: eventEnd,
          color: eventColor,
          allDay: allDayFlag,
        };
      });

      // Set leave details into FullCalendar options
      this.calendarOptions = {
        ...this.calendarOptions,
        events: calendarEvents,
      };
    });
  }
  //get leave balance details
  getLeaveBalance() {  
    this.leaveModel.GetAllleavebalanceDetails(this.staffId).then((data) => {
      this.leaveBalance = <LeaveBalance[]>data;
    });
  }
  //get all applied leave details of staff
  getLeaveApplied() {  
    this.leaveModel.GetAllleaveAppliedDetails(this.staffId).then((data) => {
      this.leaveSummary = <LeaveSummary[]>data;
    });
  }
  //handle message events
  showMessgae(severity, summary, message) {
    this.messageServ.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }
     //get user
     getUser(){
      const userjson=localStorage.getItem('auth')
      const user = JSON.parse(userjson);   
      return user;
    }
}
