import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../environments/environment.development';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); 
   //set staff id
   
   const userjson=localStorage.getItem('auth')
   const user = JSON.parse(userjson); 
  if(user.userType=='Admin'){
    return true;
  }else if(user.userType=='Staff'){
    router.navigate(['/main/daily-report']);
    return false;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
  
};
