import { Component } from '@angular/core';
import { AuthenticationModel } from '../../models/authentication-model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageService } from 'primeng/api';
import { AuthRequest } from '../../core/user';
import { environment } from '../../../../environments/environment.development';
import { AuthResponse } from '../../core/auth-response';

@Component({
  selector: 'app-auth-verify',
  templateUrl: './auth-verify.component.html',
  styleUrl: './auth-verify.component.scss',
})
export class AuthVerifyComponent {
  //declare auth model
  authModel: AuthenticationModel;
  //constructor
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private messageService: MessageService
  ) {
    //initialize auth model
    this.authModel = new AuthenticationModel(authService);
    //get code from redirected url
    this.route.queryParams.subscribe((params) => {
      
      const authCode = params['code'];
      if (authCode) {
        this.getToken(authCode);
      } else {
        console.error('Authorization code not found in URL');
      }
    });
  }
  //get token after login using authorization code
  getToken(code: string) {
    
    const email=localStorage.getItem('mail');
    const request: AuthRequest = {
      Email: email,
      Password: '',
      AuthorizationCode: code,
      LoginType: 'login-ms',
    };
    if (code !== '') {
      this.authModel.LoginWithEmailAndPassword(request).then((data) => {
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
  }
  //display message
  showMessgae(severity, summary, message) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }
}
