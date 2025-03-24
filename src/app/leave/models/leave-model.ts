import { Subscription } from 'rxjs';
import { LeaveService } from '../service/leave.service';
import {
  CalenderDetails,
  LeaveDetails,
  LeaveRequest,
} from '../core/leave-request';
import { ResponseMessage } from '../../common/response-message';
import { LeaveType } from '../core/leave-type';
import { LeaveBalance, LeaveSummary } from '../core/leave-balance';

export class LeaveModel {
  //Store subscriptions
  allSubscriptions: Subscription[] = [];
  constructor(private leaveService: LeaveService) {}

  // Unsubscribe all
  UnsubscribeAll() {
    // Loop through the services
    for (let i = 0; i < this.allSubscriptions.length; i++) {
      this.allSubscriptions[i].unsubscribe();
    }
    // End of Loop through the services
  }

  // create leave request promise
  CreateNewleaveRequest(request: LeaveRequest) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.leaveService.createLeaveRequest(request).subscribe((data) => {
          let returnData = <ResponseMessage>data;
          // Resolve the promise
          resolve(returnData);
        })
      );
    });
    // return the promise
    return promise;
  }
  //  get-all leave types details promise
  GetAllleaveTypes() {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.leaveService.GetLeaveTypes().subscribe((data) => {
          let res = <LeaveType[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  // get leave details promise
  GetAllleaveDetails() {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.leaveService.getLeaveDetails().subscribe((data) => {
          let res = <CalenderDetails[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  // get leave balance of staff  promise
  GetAllleavebalanceDetails(staffId: number) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.leaveService.getLeaveBalance(staffId).subscribe((data) => {
          let res = <LeaveBalance[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
  //  // get applied leave staff details promise
  GetAllleaveAppliedDetails(staffId: number) {
    var promise = new Promise((resolve, reject) => {
      this.allSubscriptions.push(
        this.leaveService.getLeaveAppliedDetails(staffId).subscribe((data) => {
          let res = <LeaveSummary[]>data;
          // Resolve the promise
          resolve(res);
        })
      );
    });
    // return the promise
    return promise;
  }
    //  // get applied leave staff details promise
    GetleaveDetailsPerStaffPromise(staffId: number,year:number,currentPage:number,recordsPerPage:number) {
      var promise = new Promise((resolve, reject) => {
        this.allSubscriptions.push(
          this.leaveService.getStaffLeaveDetails(staffId,year,currentPage,recordsPerPage).subscribe((data) => {
            let res = <LeaveDetails[]>data;
            // Resolve the promise
            resolve(res);
          })
        );
      });
      // return the promise
      return promise;
    }
}
