export interface LeaveBalance{
    staffId: number,   
    leaveType:string,
    numberOfDays: number,
    year: number
}
export interface LeaveSummary{
    leaveType:string,
    numberOfDays:number
}
export interface CalenderDetails {
    title?: string;
    start?: Date;
    end?: Date;
    color?: string;
    isHalfday: boolean;
    isFullday: boolean;
    isMorningHalfday: boolean;
    isAfternoonHalfday: boolean;
    leaveName: string;
}