import { Component } from '@angular/core';
import { AuthenticationService } from '../../../service/authentication.service';
import { Router } from '@angular/router';
import { AuthRequest, User } from '../../../core/user';
import { AuthenticationModel } from '../../../models/authentication-model';
import { AuthResponse } from '../../../core/auth-response';
import { environment } from '../../../../../environments/environment.development';
import { BaseTemplate } from '../../../../common/base-template';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent extends BaseTemplate {
  // Store the variable to store user email
  email: string = '';
  // Store the variable to store user password
  password: string = '';
  //declare auth model
  authModel: AuthenticationModel;
  //declare password visible
  passwordVisible: boolean = false;
  //set details of Azure active directory to login/register with microsoft authentication page
  private clientId = 'a34f0069-d3ee-45a8-989b-348b1a51be0e';
  private redirectUri = 'http://localhost:4200/auth-verify';
  private authEndpoint =
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  private scope = 'user.read';
  private responseType = 'code';
  private responseMode = 'query';
  private state = '12345';
  constructor(
    private aService: AuthenticationService,
    message: NzNotificationService,
    private messageService: MessageService,
    private router: Router,
    private route: Router
  ) {
    console.log('app');
    super(message);
    this.authModel = new AuthenticationModel(aService);
  }
  // user login
  loginUser() {
    localStorage.setItem('login-type',"login-email-only");
    //set values
    const user: AuthRequest = {
      Email: this.email,
      Password: this.password,
      AuthorizationCode: '',
      LoginType: 'login-email-only',
    };
    this.authModel.LoginWithEmailAndPassword(user).then((data) => {
      
      console.log(data)
       //get response
       const val = <AuthResponse>data;
       //if  token has value return success msg
       if (val.isAuthSuccess) {
         //set auth response to local storage
         localStorage.setItem(
           `${environment.appName}-auth`,
           JSON.stringify(val)
         );
         //display success message
         this.showMessgae(
           'success',
           'Success',
           'User authorized successfully....'
         );      
         
         this.router.navigateByUrl('main/staff-detail');
       } else {
         //if user not registered return unauthorized
         this.showMessgae('error', 'Error', 'Unauthorized....');
         //navigate to login page
         this.router.navigate(['/login']);
       }
    });
  }
  //handle email and password valid or not
  validateInput() {
    return this.email === '' && this.password === '';
  }
  //display message
  showMessgae(severity, summary, message) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }

  //handle visibility of password
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  // set to redirect microsoft auth page
  loginWithMicrosoft(): void {
    //set email to localstorage
    localStorage.setItem('login-type',"login-ms");
    localStorage.setItem('mail', this.email);
    //set uri
    const authUrl = `${this.authEndpoint}?client_id=${
      this.clientId
    }&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_mode=${
      this.responseMode
    }&state=${this.state}&response_type=${
      this.responseType
    }&scope=${encodeURIComponent(this.scope)}&login_hint=${this.email}`;

    window.location.href = authUrl; // Redirect to Microsoft login
  }
}
