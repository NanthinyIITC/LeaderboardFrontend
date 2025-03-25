import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LeaveRequest } from '../../../core/leave-request';
import { ResponseMessage } from '../../../../common/response-message';
import { LeaveService } from '../../../service/leave.service';
import { LeaveType } from '../../../core/leave-type';
import { LeaveModel } from '../../../models/leave-model';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../../authentication/service/authentication.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss',
})
export class LeaveFormComponent implements OnInit, OnChanges {
  //declare leave request
  leaveRequest: LeaveRequest;
  //declare leave model
  leaveModel: LeaveModel;
  //declare leave types
  @Input() leaveTypes: LeaveType[] = [];
  @Input() resetform: boolean = false;
  //declare halfday type
  halfdayType: string = '';
  //declare array of leave type
  //checkbox
  //set min date
  minDate: string = '';
  isHalfday: boolean = false;
  //ishalfday visible
  halfdayVisible: boolean = true;
  //declare form
  @ViewChild('leaveForm') form: NgForm;
  @Output() result = new EventEmitter<ResponseMessage>();
  constructor(
    private leaveService: LeaveService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private auth:AuthenticationService
  ) {
    //initialized leave model
    this.leaveModel = new LeaveModel(leaveService);
    this.setMinDate();
    //initialize leave request
    this.leaveRequest = {
      staffId: 0,
      startDate: null,
      endDate: null,
      leaveTypeId: null,
      numberOfDays: 0,
      description: '',
      isHalfday: false,
      isMorningHalfday: false,
      isAfternoonHalfday: false,
      adminComment: '',
      leaveStatusId: 0,
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.closeDialog();
    this.halfdayVisible = true;
    this.leaveRequest = {
      staffId: 0,
      startDate: null,
      endDate: null,
      leaveTypeId: null,
      numberOfDays: 0,
      description: '',
      isHalfday: false,
      isMorningHalfday: false,
      isAfternoonHalfday: false,
      adminComment: '',
      leaveStatusId: 0,
    };
  }
  ngOnInit(): void {}
  //form reset
  closeDialog() {
    this.form.resetForm(); // Reset form state and values
  }
  //set min date
  setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits

    this.minDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    console.log(this.minDate);
  }
  //handle checkbox event change
  checkBoxChange() {
    //update radio while not halfday selected
    if (!this.leaveRequest.isHalfday) {
      this.leaveRequest.isMorningHalfday = false;
      this.leaveRequest.isAfternoonHalfday = false;
    }
  }
    //get user
  getUser(){    
    return this.auth.getUserData();
  }
  //radiochange
  radioButtonChange() {
    if (this.halfdayType === 'morning') {
      this.leaveRequest.isMorningHalfday = true;
    }
    if (this.halfdayType === 'afternoon') {
      this.leaveRequest.isAfternoonHalfday = true;
    }
  }
  //send leave request
  sendRequest() {
    console.log(this.leaveRequest);
    //set staffid logged in user
    this.leaveRequest.staffId = (this.getUser()).staffId;
    if (this.leaveRequest.staffId > 0) {
      //setleave difference
      this.leaveRequest.numberOfDays = this.calculateDateDifference();
      this.leaveModel.CreateNewleaveRequest(this.leaveRequest).then((data) => {
        //set result
        const res = <ResponseMessage>data;
        //emit result to parent
        this.result.emit(res);
        this.closeDialog();
      });
    }
  }
  //check if start date previous than current date should popup message
  validateStartDate(event) {
    //convert to date
    const min = new Date(this.minDate);
    const start = new Date(this.leaveRequest.startDate);
    //set endtime
    const end = new Date(this.leaveRequest.endDate);
    if (start < min) {
      this.confirm(event);
    }
    if (end == null) {
      this.halfdayVisible = true;
    }
  }
  //handle event end date selection
  validateEndDate(event) {
    //convert to date
    const start = new Date(this.leaveRequest.startDate).getTime();
    const end = new Date(this.leaveRequest.endDate).getTime();
    //if start and end date is same then consider as 1 day leave it can be halfday or fullday
    if (end == start) {
      this.halfdayVisible = true;
    } else {
      this.halfdayVisible = false;
    }
  }
  //calculate difference between days selected-start and end
  calculateDateDifference(): number {
    if (this.leaveRequest.startDate && this.leaveRequest.endDate) {
      const start = new Date(this.leaveRequest.startDate);
      const end = new Date(this.leaveRequest.endDate);

      // Get the difference in milliseconds
      const diffInMilliseconds = end.getTime() - start.getTime();

      // Convert milliseconds to days (1000 ms * 60 sec * 60 min * 24 hours)
      return diffInMilliseconds / (1000 * 3600 * 24);
    }
    return 0;
  }
  //confirmation before
  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Selected date is previous than current date. Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {},
      reject: () => {
        this.leaveRequest.startDate = null;
      },
    });
  }
  //handle validation
  validateSubmit() {
    if (this.leaveRequest.isHalfday) {
      return (
        this.leaveRequest.startDate === null ||
        this.leaveRequest.leaveTypeId === 0 ||
        this.leaveRequest.description === '' ||
        this.halfdayType == ''
      );
    } else {
      return (
        this.leaveRequest.startDate === null ||
        this.leaveRequest.leaveTypeId === 0 ||
        this.leaveRequest.description === ''
      );
    }
  }
}
