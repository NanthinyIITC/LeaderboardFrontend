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
    private route: Router
  ) {
    console.log('app')
    super(message);
    this.authModel = new AuthenticationModel(aService);
  }
  // user login
  loginUser() {
    //set values
    const user: AuthRequest = { Email: this.email, Password: this.password,AuthorizationCode:'',LoginType:'login-email-only' };
    this.authModel.LoginWithEmailAndPassword(user).then((data) => {
      console.log(data);
      //if user exist redirect to home page else login/register
      const res = <AuthResponse>data;
      if (res.isAuthSuccess) {
        //set response to local storage
        localStorage.setItem('auth', JSON.stringify(res));
        // environment.userType=res.userType;
        // environment.userName=res.userName;
        // environment.staffId=res.staffId
        // this.createMessage('success','Success','Successfully Login')
        this.showMessgae('success', 'Success', 'Successfully Login');
        setTimeout(() => {
          this.route.navigateByUrl('/main');
        }, 10);
      } else {
        this.showMessgae('error', 'Error', 'Unauthorized....');
      }
    });
  }
  validateInput() {
    return this.email === '' && this.password === '';
  }
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
      debugger
      //set email to localstorage
     // localStorage.setItem('mail',this.email)
      //set uri
      const authUrl = `${this.authEndpoint}?client_id=${
        this.clientId
      }&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_mode=${
        this.responseMode
      }&state=${this.state}&response_type=${
        this.responseType
      }&scope=${encodeURIComponent(this.scope)}`;
  
      window.location.href = authUrl; // Redirect to Microsoft login
    }
}
