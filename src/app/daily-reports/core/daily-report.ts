export interface DailyReport{
    staffId:number;
    reports:ReportDetails[];
}
export interface ReportDetails{
    id :number;
    startTime:string;
    endTime:string;
    comments :string;
    percentage:number;
    duration :number;
    createdDate :Date;
    taskId :number;
    task :string;  
    totalRecords:number;
}
export interface ChartData{   
    label:string;
    data:number;   
}
export interface ReportChartSummary{   
    dailyReportChartData:ChartData[];
    totalWorkingTimeInMins:number; 
    totalWorkingDays  :number;
    totalActualWorkingDays:number;
    totalLeaveDays:number;
}
export interface ChartViewRequest{   
   staffId:number,
   taskId:number,
   start:string,
end:string
}