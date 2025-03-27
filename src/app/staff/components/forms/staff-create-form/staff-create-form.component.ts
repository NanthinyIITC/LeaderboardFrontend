import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { Staff } from '../../../core/staff';
import { first, last } from 'rxjs';
import { StaffService } from '../../../service/staff.service';
import { StaffModel } from '../../../models/staff-model';
import { UserType } from '../../../core/user-type';
import { ResponseMessage } from '../../../../common/response-message';
import { BaseTemplate } from '../../../../common/base-template';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-staff-create-form',
  templateUrl: './staff-create-form.component.html',
  styleUrl: './staff-create-form.component.scss',
})
export class StaffCreateFormComponent implements OnInit, OnChanges {
  //input/output from staff details component
  @Input() mode: boolean = false;
  @Input() data: any;
  @Output() result = new EventEmitter<ResponseMessage>();
  id = 0;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  nickName = '';
  contactNumber = '';
  designation = '';
  userTypeId = 0;
  userType = '';
  //declare staff
  staff: Staff;
  //declare staff model
  staffModel: StaffModel;
  //declare array of staff
  userTypes: UserType[] = [];
  constructor(
    private staffService: StaffService,
    private messageService: MessageService
  ) {
    this.staffModel = new StaffModel(staffService);
    this.staff = this.getStaffDefault();
  }
  ngOnInit(): void {
    this.getUserTypes();
  }
  //handle success or failure
  showMessage(severity: string, summary: string, message: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: message,
      key: 'br',
      life: 30000,
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //handle if edit then set values to defined staff,if add set default values
    debugger
    if (this.mode) {
     if(this.data!==undefined){
      this.id = this.data.id;
      this.firstName = this.data.firstName;
      this.lastName = this.data.lastName;
      this.nickName = this.data.nickName;
      this.email = this.data.email;
      this.password = this.data.password;
      this.designation = this.data.designation;
      this.contactNumber = this.data.contactNumber;
      this.userType = this.data.userType;
      this.userTypeId = this.data.userTypeId;
     }
    } else {
      this.firstName = '';
      this.lastName = '';
      this.nickName = '';
      this.email = '';
      this.password = '';
      this.designation = '';
      this.contactNumber = '';
      this.userType = '';
      this.userTypeId = 0;
    }
  }
  //get default staff details
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
  //handle save operation
  saveUser() {
    
    //set values
    const data = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      nickName: this.nickName,
      contactNumber: this.contactNumber,
      designation: this.designation,
      userTypeId: Number(this.userTypeId),
      userType: this.userType,
      totalRecords:0
    };
    //if mode is edit, update staff details,else create new staff
    if (this.mode) {
      this.staffModel.UpdateStaff(data, this.id).then((data) => {
        let msg = <ResponseMessage>data;
        console.log(msg);
        this.result.emit(msg);
      });
    } else {
      this.staffModel.CreateNewStaff(data).then((data) => {
        let msg = <ResponseMessage>data;      
        this.result.emit(msg);
      });
    }
  }
  //get all user types
  getUserTypes() {
    this.staffModel.GetUserTypes().then((data) => {
      let types = <UserType[]>data;
      if (types) {
        this.userTypes = types;
        this.userTypeId = types[0].id;
      }
    });
  }
  //handle validation
  validateSubmit() {
    return (
      this.firstName === '' ||
      this.lastName === '' ||
      this.nickName === '' ||
      this.email === '' ||
      this.designation === '' ||
      this.contactNumber === '' ||
      this.userTypeId === 0
    );
  }

  passwordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
