import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthenticationService } from '../../authentication/service/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  //declare user name
  username:string='';
  //handle sidebar collapse events
  isSidebarCollapsed = false;

constructor(private auth:AuthenticationService){
  this.username=(this.getUser()).userName
}
logout(){
  localStorage.removeItem(`${environment.appName}-auth`);
}
//handle toggle events
onSidebarToggle() {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}
  //get user
  getUser(){    
    return this.auth.getUserData();
  }
}
