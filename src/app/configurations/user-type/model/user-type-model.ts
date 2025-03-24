import { Subscription } from "rxjs";
import { UserTypeService } from "../service/user-type.service";
import { ResponseMessage } from "../../../common/response-message";
import { UserType } from "../../../staff/core/user-type";
;




export class UserTypeModel{
     //Store subscriptions
     allSubscriptions: Subscription[] = [];
    constructor(private typeService:UserTypeService){

    }

// user type actions with promise
userTypeActionsPromisef(action:string,type:UserType) {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.typeService.UserTypeActions(action,type).subscribe(
            data => {
                let returnData = <ResponseMessage>data;
                // Resolve the promise
                resolve(returnData);
            })
        );
    });
    // return the promise
    return promise;
}



}