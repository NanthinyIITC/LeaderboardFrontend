import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  //set staff id
  const userjson = localStorage.getItem(`${environment.appName}-auth`);
  //convert as object
  const user = JSON.parse(userjson);
  debugger
  //check user null or not
  if (user !== null) {
    //check user type is admin or not
    if (user.userType == 'Admin') {
      return true;
    } else {
        router.navigate(['/main/daily-report']);
      return true;
    }
  } else {
    //navigate to login if user not logged in
    router.navigate(['/login']);
    return false;
  }
};
