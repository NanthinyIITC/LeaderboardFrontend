export interface LeaveRequest{
    leaveTypeId: 0,
    startDate?:Date,
    endDate?: Date,
    numberOfDays: number,
    staffId: number,
    description:string,
    isHalfday:boolean,
    isMorningHalfday:boolean,
    isAfternoonHalfday:boolean,   
    adminComment:string,
    leaveStatusId:number
}
export interface LeaveDetails{   
    startDate?:Date,
    endDate?: Date,
    year: number,
    numberOfDays: number,
    staffId: number,
    description:string,
    isHalfday:boolean,
    isMorningHalfday:boolean,
    isAfternoonHalfday:boolean,   
    adminComment:string,
    LeaveStatus:string
    leaveType: string   
  
}
export interface CalenderDetails {
    title?: string;
    start?: Date;
    end?: Date;
    color?: string;  
    LeaveName: string;
}