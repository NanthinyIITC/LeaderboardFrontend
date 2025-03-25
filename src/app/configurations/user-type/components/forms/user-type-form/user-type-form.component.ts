import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UserType } from '../../../../../staff/core/user-type';
import { UserTypeModel } from '../../../model/user-type-model';
import { UserTypeService } from '../../../service/user-type.service';
import { ResponseMessage } from '../../../../../common/response-message';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../../../authentication/service/authentication.service';

@Component({
  selector: 'app-user-type-form',
  templateUrl: './user-type-form.component.html',
  styleUrl: './user-type-form.component.scss'
})
export class UserTypeFormComponent implements OnInit, OnChanges {
    //input/output from staff details component
    @Input() mode: boolean = false;
    @Input() data: any;
    @Input() visibleDialog: boolean=false;
    @Output() result = new EventEmitter<ResponseMessage>();
    //declare form
    @ViewChild('typeForm') form:NgForm;
//declare usertype
userType:UserType={
  id:0,
  name:'',
  isEditable:true
}
 //declare staff model
  typeModel: UserTypeModel;
constructor( private userTypeService: UserTypeService,private auth:AuthenticationService){
  this.typeModel = new UserTypeModel(userTypeService);
  this.userType=this.getUserTypeDefault();
}
  ngOnChanges(changes: SimpleChanges): void {
    //handle if edit then set values to defined staff,if add set default values    
    if (this.mode) {
      this.userType.id=this.data.id,
      this.userType.name=this.data.name
    } else {
      this.closeDialog()
      this.userType.id=0,
      this.userType.name=''
     
    }

  }
  ngOnInit(): void {
   
  }
   //get user
   getUser(){    
    return this.auth.getUserData();
  }
  //form reset
  closeDialog() {  
    this.form.resetForm(); // Reset form state and values   
  }
   //get default staff details
   getUserTypeDefault() {
    const data = {
      id: 0,
      name: ''  ,
      isEditable:true 
    };
    return data;
  }
//handle save operation
  saveUser() {
    //if mode is edit, update user type details,else create new user type
    if (this.mode) {
      this.typeModel.userTypeActionsPromisef('update', this.userType).then((data) => {
        
        let msg = <ResponseMessage>data;
        console.log(msg);
        this.result.emit(msg);
      });
    } else {
      this.typeModel.userTypeActionsPromisef('add', this.userType).then((data) => {
        let msg = <ResponseMessage>data;
        this.result.emit(msg);
      });
    }
  }
  //handle validation
  validateSubmit() {
    return this.userType.name === '';
  }
}
