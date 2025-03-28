import { Subscription } from "rxjs";
import { AuthenticationService } from "../service/authentication.service";
import { AuthRequest, User } from "../core/user";
import { AuthResponse } from "../core/auth-response";
import { environment } from "../../../environments/environment.development";



export class AuthenticationModel{
     //Store subscriptions
     allSubscriptions: Subscription[] = [];
    constructor(private authService:AuthenticationService){

    }
     // Unsubscribe all
     UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // login
    LoginWithEmailAndPassword(user:AuthRequest) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.authService.LoginUser(user).subscribe(
                data => {
                    let returnData = <AuthResponse>data;
                  
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }
   
}