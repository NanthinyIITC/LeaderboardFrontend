import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
constructor(){
  //remove from storage if any information exist
    localStorage.removeItem(`${environment.appName}-auth`);
      localStorage.removeItem(`mail`);
      localStorage.removeItem(`login-type`);
}
}
