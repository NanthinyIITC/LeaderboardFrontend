import { Component } from '@angular/core';
import { StaffService } from '../../../staff/service/staff.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LeaveModel } from '../../models/leave-model';
import { LeaveService } from '../../service/leave.service';
import { LeaveDetails } from '../../core/leave-request';
import { environment } from '../../../../environments/environment.development';
import { AuthenticationService } from '../../../authentication/service/authentication.service';

@Component({
  selector: 'app-view-leaves',
  templateUrl: './view-leaves.component.html',
  styleUrl: './view-leaves.component.scss',
})
export class ViewLeavesComponent {
  //declare leaves
  leaves: LeaveDetails[] = [];
  //declare staff model
  leaveModel: LeaveModel;
  //declare to track page number
  currentPageNumber: number = 1;
  //track total records
  totalRecords: number = 0;
  //set records per page
  recordsPerPage: number = 10;
  //declare staffid
  staffId: number = 0;
  //declare year
  selectedYear: Date | null = new Date();
  year: number = this.selectedYear.getFullYear();
  constructor(
    private leaveService: LeaveService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private auth:AuthenticationService
  ) {
    this.leaveModel = new LeaveModel(leaveService);
    //set logged in user id
    this.staffId = (this.getUser()).staffId;
    //get all staff details

    this.getAllStaffLeaveDetails();
  }
   //get user
   getUser(){    
    return this.auth.getUserData();
  }
  onYearSelect(event: Date) {
    //set selected year
    this.year = event.getFullYear();
    //get all staff details
    this.getAllStaffLeaveDetails();
  }
  ngOnInit() {}
  //get all staff leave details
  getAllStaffLeaveDetails() {
    //handle get all leaves event
    this.leaveModel
      .GetleaveDetailsPerStaffPromise(
        this.staffId,
        this.year,
        this.currentPageNumber,
        this.recordsPerPage
      )
      .then((data) => {
        this.leaves = <LeaveDetails[]>data;
      });
  }
}
