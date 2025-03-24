import { Subscription } from "rxjs";
import { StaffService } from "../service/staff.service";
import { Staff } from "../core/staff";
import { ResponseMessage } from "../../common/response-message";
import { UserType } from "../core/user-type";




export class StaffModel{
     //Store subscriptions
     allSubscriptions: Subscription[] = [];
    constructor(private staffService:StaffService){

    }

    StaffList  : Staff[] = [];

    getStaffList(){
        return this.StaffList;
    }

     // Unsubscribe all
     UnsubscribeAll() {
        // Loop through the services
        for (let i = 0; i < this.allSubscriptions.length; i++) {
            this.allSubscriptions[i].unsubscribe();
        }
        // End of Loop through the services
    }

    // create new staff promise
    CreateNewStaff(staff:Staff) {
        var promise = new Promise((resolve, reject) => {
            this.allSubscriptions.push(this.staffService.CreateStaff(staff).subscribe(
                data => {
                    let returnData = <number>data;
                    // Resolve the promise
                    resolve(returnData);
                })
            );
        });
        // return the promise
        return promise;
    }
   // get all staff promise
   GetAllStaffs() {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.GetallStaffDetails().subscribe(
            data => {             
               this.StaffList = <Staff[]>data;
                // Resolve the promise
                resolve(this.StaffList);
            })
        );
    });
    // return the promise
    return promise;
}
  // get all staff promise
  GetAllStaffsWithPagination(currentPage:number,recordsPerPage:number) {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.GetallStaffDetailsWithPagination(currentPage,recordsPerPage).subscribe(
            data => {             
               this.StaffList = <Staff[]>data;
                // Resolve the promise
                resolve(this.StaffList);
            })
        );
    });
    // return the promise
    return promise;
}
 // get alluser types promise
 GetUserTypes() {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.GetUserTypes().subscribe(
            data => {
               const res = <UserType[]>data;
                // Resolve the promise
                resolve(res);
            })
        );
    });
    // return the promise
    return promise;
}
// get staff by id promise
GetStaff(id:number) {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.GetallStaffDetailsById(id).subscribe(
            data => {
                let returnData = <Staff>data;
                // Resolve the promise
                resolve(returnData);
            })
        );
    });
    // return the promise
    return promise;
}

// update staff promise
UpdateStaff(staff:Staff,id:number) {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.UpdateStaffDetails(id,staff).subscribe(
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

// remove staff details promise
DeleteStaff(id:number) {
    var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(this.staffService.RemoveStaffDetails(id).subscribe(
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