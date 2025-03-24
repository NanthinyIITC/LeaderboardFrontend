import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  //declare isadmin 
  isAdmin:boolean=false;
constructor(){
 this.isAdmin=this.getUser().userType==='Admin' ? true:false;
}

  //get user
  getUser(){
    
    const userjson=localStorage.getItem('auth')
    const user = JSON.parse(userjson);   
    return user;
  }
  toggleCollapse(event: Event) {
    debugger
    event.preventDefault();
    const element = document.getElementById('leave');
    if (element) {
      element.classList.toggle('show');
    }
  }
}
