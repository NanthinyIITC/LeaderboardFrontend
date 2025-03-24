import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment.development';
interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  link:string;
}
@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  //declare isadmin 
  isAdmin:boolean=false;
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-users',
      label: 'Staff',
      isOpen: false,   
      link:"staff-detail", 
      children: [
        { icon: 'pi pi-id-card', label: 'Staff Details',link:'staff-detail' }       
      ]
    },
    {
      icon: 'far fa-chart-bar',
      label: 'Reports',
      isOpen: false,   
      link:"reports", 
      children: [
        { icon: 'fa fa-file', label: 'Daily Reports',link:'daily-report' }       ,
        { icon: 'fa fa-history', label: 'Daily Report History',link:'daily-report-history' }       ,
        { icon: 'fas fa-chart-pie', label: 'Daily Activity Summary',link:'daily-activity-summary' }       
      ]
    },
    {
      icon: 'pi pi-calendar-times',
      label: 'Leaves',
      isOpen: false,   
      link:"leaves", 
      children: [
        { icon: 'pi pi-info-circle', label: 'Leave Details',link:'leave-details' }       
      ]
    },
    {
      icon: 'pi pi-cog',
      label: 'Configurations',
      isOpen: false,   
      link:"config", 
      children: [
        { icon: 'pi pi-user', label: 'User Type',link:'user-type' }       
      ]
    },
  ];
constructor(){
 this.isAdmin=this.getUser().userType==='Admin' ? true:false;
}
toggleSidebar() {
  this.sidebarToggle.emit();
}

toggleMenuItem(item: MenuItem) {
  // Only toggle if sidebar is not collapsed and item has children
  if (!this.isSidebarCollapsed && item.children) {
    item.isOpen = !item.isOpen;
  }
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
