import { Component, ElementRef, ViewChild } from '@angular/core';
import { StaffModel } from '../../models/staff-model';
import { StaffService } from '../../service/staff.service';
import { Router } from '@angular/router';
import { Staff } from '../../core/staff';
import { ResponseMessage } from '../../../common/response-message';
import { BaseTemplate } from '../../../common/base-template';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrl: './staff-details.component.scss',
})
export class StaffDetailsComponent {
  //declare staff model
  staffModel: StaffModel;
  //declare array of staff
  staffList: Staff[] = [];
  //declare staff
  staff: Staff | undefined;
  //declare mode for create and edit
  isEditMode = true;
  visible: boolean = false;
    //declare to track page number
    currentPageNumber:number=1;
    //track total records
    totalRecords:number=0;
    //set records per page
    recordsPerPage:number=10;
  constructor(
    private staffService: StaffService,
    private route: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.staffModel = new StaffModel(staffService);
  }

  ngOnInit() {
    //get all staff details
    this.getAllStaffDetails();
  }
  //open dialog when click add staff
  addStaff() {
    this.isEditMode = false;
    this.showDialog();
    this.staff = this.getStaffDefault();
  }
  //method to handle close
  closeModal() {
    // if (this.userModel) {
    //   this.userModel.nativeElement.style.display = 'none';
    // }
    this.visible = false;
  }
  // get staff details
  getAllStaffDetails() {
    this.staffModel.GetAllStaffsWithPagination(this.currentPageNumber,this.recordsPerPage).then((data) => {      
        this.staffList=<Staff[]>data;
    });
  }
  //tract output event changes
  updateChanges(event) {    
    if (event.success) {
      this.getAllStaffDetails();
      this.showMessgae('success', 'Success', event.message);
      this.closeModal();
    } else if (event.success==false) {
      this.showMessgae('error', 'Error', event.message);
    }else{
       this.showMessgae('error', 'Error', event.message);
       this.closeModal();
    }
   
  }
  //handle pagination
  onPageChange(event: any) {    
    this.currentPageNumber=event.page+1
    this.getAllStaffDetails()     
}
  //open model for edit
  EditStaff(staff: Staff) {
    this.staff = staff;
    this.isEditMode = true;
    this.showDialog();
  }
  //delete staff method
  DeleteStaff(id: number) {
    this.staffModel.DeleteStaff(id).then((data) => {
      const res = <ResponseMessage>data;
      if (res.success) {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: res.message });
      }
      this.getAllStaffDetails();
    });
  }
  //method to get default staff
  getStaffDefault() {
    const data = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      nickName: '',
      contactNumber: '',
      designation: '',
      userTypeId: 0,
      userType: '',
      totalRecords:0
    };
    return data;
  }
  //method to show dialog
  showDialog() {
    this.visible = true;
  }
  showMessgae(severity, summary, message) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }
  confirm1(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}
//confirmation dialog before delete
deleteConfirmation(event: Event,staffId:number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
          //if yes then delete record
          this.DeleteStaff(staffId)
          
        },
        reject: () => {
           
        }
    });
}
}
