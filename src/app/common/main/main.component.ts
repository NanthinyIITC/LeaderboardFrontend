import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

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

constructor(){
  this.username=(this.getUser()).userName
}
logout(){
  localStorage.removeItem('auth');
}
//handle toggle events
onSidebarToggle() {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}
  //get user
  getUser(){
    const userjson=localStorage.getItem('auth')
    const user = JSON.parse(userjson);   
    return user;
  }
}
