import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthenticationService } from '../../authentication/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  //declare user name
  username: string = '';
  //handle sidebar collapse events
  isSidebarCollapsed = false;

  constructor(private auth: AuthenticationService, private router: Router) {
    if (this.getUser() == null) {
      this.username = '';
    } else {
      this.username = this.getUser().userName;
    }
  }

  private logoutEndpoint =
    'https://login.microsoftonline.com/common/oauth2/v2.0/logout';
  private postLogoutRedirectUri = 'http://localhost:4200/'; // Redirect after logout
  //logout
  logout(): void {
    const type = localStorage.getItem('login-type');
    if (type == 'login-ms') {
      window.location.href = `${
        this.logoutEndpoint
      }?post_logout_redirect_uri=${encodeURIComponent(
        this.postLogoutRedirectUri
      )}`;
    }
    localStorage.removeItem(`${environment.appName}-auth`);
    localStorage.removeItem(`mail`);
    //navigate to login page
    this.router.navigate(['/login']);
  }
  //handle toggle events
  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  //get user
  getUser() {
    return this.auth.getUserData();
  }
}
