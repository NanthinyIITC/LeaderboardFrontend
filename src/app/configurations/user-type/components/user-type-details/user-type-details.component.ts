import { Component } from '@angular/core';
import { UserType } from '../../../../staff/core/user-type';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserTypeModel } from '../../model/user-type-model';
import { StaffModel } from '../../../../staff/models/staff-model';
import { StaffService } from '../../../../staff/service/staff.service';
import { UserTypeService } from '../../service/user-type.service';
import { ResponseMessage } from '../../../../common/response-message';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-type-details',
  templateUrl: './user-type-details.component.html',
  styleUrl: './user-type-details.component.scss',
})
export class UserTypeDetailsComponent {
  //declare user type
  //declare staff
  user: UserType | undefined;
  //declare mode for create and edit
  isEditMode = true;
  visible: boolean = false;
  //declare staff model
  typeModel: UserTypeModel;
  //declare staff model
  staffModel: StaffModel;
  //declare array of staff
  userTypes: UserType[] = [];
  constructor(
    private messageService: MessageService,
    private staffService: StaffService,
    private userTypeService: UserTypeService,
    private confirmationService: ConfirmationService
  ) {
    this.staffModel = new StaffModel(staffService);
    this.typeModel = new UserTypeModel(userTypeService);
    this.getUserTypes();
  }
  //open dialog when click add user type
  addUserType() {
    this.isEditMode = false;
    this.showDialog();
    this.user = this.getUserTypeDefault();
  }
  //open model for edit
  editUserType(type: UserType) {
    this.user = type;
    this.isEditMode = true;
    this.showDialog();
  }
  //confirmation dialog before delete
  deleteUserTypeConfirmation(event: Event, type: UserType) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        //if yes then delete record
        this.deleteUserType(type);
      },
      reject: () => {},
    });
  }
  //delete staff method
  deleteUserType(type: UserType) {
    this.typeModel.userTypeActionsPromisef('remove', type).then((data) => {
      const res = <ResponseMessage>data;
      if (res.success) {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: res.message,
        });
      }
      this.getUserTypes();
    });
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
  //method to get default user type
  getUserTypeDefault() {
    const data = {
      id: 0,
      name: '',
      isEditable: true,
    };
    return data;
  }
  //get all user types
  getUserTypes() {
    this.staffModel.GetUserTypes().then((data) => {
      let types = <UserType[]>data;
      if (types) {
        this.userTypes = types;
      }
    });
  }
  //method to handle close
  closeModal() {
    this.visible = false;
    //set default value while close the model(reset)
    this.user=this.getUserTypeDefault()
  }
   //track output event changes
   updateChanges(event) {
    
    if (event.success) {
      this.getUserTypes();
      this.showMessgae('success', 'Success', event.message);
      this.closeModal();
    } else if (event.success==false) {
      this.showMessgae('error', 'Error', event.message);
    }else{
       this.showMessgae('error', 'Error', event.message);
       this.closeModal();
    }

  }
  //get user
  getUser(){
    const userjson=localStorage.getItem('auth')
    const user = JSON.parse(userjson);   
    return user;
  }
}
