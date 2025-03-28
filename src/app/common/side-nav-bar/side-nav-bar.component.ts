import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthenticationService } from '../../authentication/service/authentication.service';
interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  link: string;
}
@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss',
})
export class SideNavBarComponent {
  //declare isadmin
  isAdmin: boolean = false;
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-users',
      label: 'Staff',
      isOpen: false,
      link: 'staff-detail',
      children: [
        { icon: 'pi pi-id-card', label: 'Staff Details', link: 'staff-detail' },
      ],
    },
    {
      icon: 'far fa-chart-bar',
      label: 'Reports',
      isOpen: false,
      link: 'daily-report',
      children: [
        { icon: 'fa fa-file', label: 'Daily Reports', link: 'daily-report' },
        {
          icon: 'fa fa-history',
          label: 'Daily Report History',
          link: 'daily-report-history',
        },
        {
          icon: 'fas fa-chart-pie',
          label: 'Daily Activity Summary',
          link: 'daily-activity-summary',
        },
      ],
    },
    {
      icon: 'pi pi-calendar-times',
      label: 'Leaves',
      isOpen: false,
      link: 'leave-details',
      children: [
        {
          icon: 'pi pi-info-circle',
          label: 'Leave Details',
          link: 'leave-details',
        },
      ],
    },
    {
      icon: 'pi pi-cog',
      label: 'Configurations',
      isOpen: false,
      link: 'user-type',
      children: [{ icon: 'pi pi-user', label: 'User Type', link: 'user-type' }],
    },
  ];
  constructor(private auth: AuthenticationService) {
    if (this.getUser() == null) {
      this.isAdmin = false;
    } else {
      this.isAdmin = this.getUser().userType === 'Admin' ? true : false;
    }
  }
  toggleSidebar() {
    this.sidebarToggle.emit();
  }
  //validate nav item access by admin or not
  validateNavItem(label: string) {
    return !this.isAdmin && (label == 'Staff' || label == 'Configurations');
  }
  //validate nav item access by admin or not
  validateNavItemChildren(label: string) {
    return !this.isAdmin && label == 'Daily Activity Summary';
  }
  toggleMenuItem(item: MenuItem) {
    // Only toggle if sidebar is not collapsed and item has children
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
  //get user
  getUser() {
    return this.auth.getUserData();
  }
  toggleCollapse(event: Event) {
    event.preventDefault();
    const element = document.getElementById('leave');
    if (element) {
      element.classList.toggle('show');
    }
  }
  onSidebarToggle() {  
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
