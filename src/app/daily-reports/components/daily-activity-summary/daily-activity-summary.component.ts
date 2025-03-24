import { Component, ElementRef, ViewChild } from '@angular/core';
import { DailyReportModel } from '../../models/daily-report-model';
import { StaffModel } from '../../../staff/models/staff-model';
import { DailyReportService } from '../../service/daily-report.service';
import { StaffService } from '../../../staff/service/staff.service';
import { MessageService } from 'primeng/api';
import { Staff } from '../../../staff/core/staff';

import { ChartViewRequest, ReportChartSummary } from '../../core/daily-report';
import { formatDate } from '@angular/common';
import { TaskType } from '../../core/task-type';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-daily-activity-summary',
  templateUrl: './daily-activity-summary.component.html',
  styleUrl: './daily-activity-summary.component.scss',
})
export class DailyActivitySummaryComponent {
  //declare daily report model
  dailyReportModel: DailyReportModel;
  //declare daily report model
  staffModel: StaffModel;
  //declare staff list
  staffList: Staff[] = [];
  //selected filtered date
  selectedDate: Date | null = null;
  //dropdownlist
  staffDrpList: any;
  //dropdownlist
  taskDrpList: any = [];
  //declare task id
  taskId: number = 0;
  //declare staffId
  staffId: number = 0;
  //declare start date formatted string
  selectedStart: string = '';
  //declare start date formatted string
  selectedEnd: string = '';
  //declare task type
  taskTypes: TaskType[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  //declare chart options
  chartData: any;
  chartOptions: any;
  //declare chart labels
  chartLabels: string[] = [];
  //declare chartdata
  dataToChart: number[] = [];
  //declare total working days
  totalWorkingDays: number = 0;
  //declare total actual working days
  totalActualWorkingdays: number = 0;
  //declare total actual working days
  totalLeavedays: number = 0;
  //chart element
  @ViewChild('chart', { static: false }) chart1: ElementRef;
  //pdf table
  tableData: string[] = [];
  constructor(
    private dailyReportService: DailyReportService,
    private staffService: StaffService,
    private messageS: MessageService
  ) {
    //set initial date value
    const now = new Date();

    //initialize models
    this.dailyReportModel = new DailyReportModel(dailyReportService);
    this.staffModel = new StaffModel(staffService);
    //get all task types
    this.getTaskTypes();
    //get staff liist
    this.getAllStaffDetails();
    this.defineChart();
    this.getStaffActivitySummary();
  }
  //define chart
  defineChart() {
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.dataToChart, // Adjust values as needed
          backgroundColor: ['#4CAF50', '#FFC107', '#03A9F4'], // Green, Yellow, Blue
          hoverBackgroundColor: ['#45A049', '#FFB300', '#0288D1'],
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#555',
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
  get getStaffName() {
    if (this.staffId > 0) {
      return this.staffList.find((staff) => staff.id == this.staffId).firstName;
    } else {
      return '';
    }
  }
  //filter while staff changes
  filterUsingStaff(event) {
    this.staffId = Number(event);
    //get report details of eac staff
    this.getStaffActivitySummary();
  }
  //filter while task changes
  filterUsingTasktype(event) {
    //get report details of eac staff
    this.getStaffActivitySummary();
  }
  //filtering while calender changes
  filterUsingStartDate(event) {
    //format date to string
    this.selectedStart = formatDate(
      this.selectedStartDate,
      'yyyy-MM-dd',
      'en-us'
    );
    //get all reports on the date
    this.getStaffActivitySummary();
  }
  //filtering while calender changes
  filterUsingEndDate(event) {
    //format date to string
    this.selectedEnd = formatDate(this.selectedEndDate, 'yyyy-MM-dd', 'en-us');
    //get all reports on the date
    this.getStaffActivitySummary();
  }
  // get staff details for admin usage
  getAllStaffDetails() {
    this.staffModel.GetAllStaffs().then((data) => {
      this.staffList = <Staff[]>data;
      this.staffDrpList = this.staffList.map((staff) => ({
        label: `${staff.firstName} ${staff.lastName}`, // Display Name
        value: staff.id, // The actual value stored
      }));
    });
  }

  showMessgae(severity, summary, message) {
    this.messageS.add({
      severity: severity,
      summary: summary,
      detail: message,
    });
  }
  //get task types
  getTaskTypes() {
    this.dailyReportModel.GetTaskTypes().then((data) => {
      const list = <TaskType[]>data;
      if (list) {
        //set tasks list
        this.taskTypes = list;

        const types = this.taskTypes.map((task) => ({
          label: task.name, // Display Name
          value: task.id, // The actual value stored
        }));
        this.taskDrpList = [
          {
            label: 'All', // Display Name
            value: 0,
          },
          ...types,
        ];
      }
    });
  }
  // get staff details for admin usage
  getStaffActivitySummary() {
    //define empty list initially
    this.chartLabels = [];
    this.dataToChart = [];
    this.totalActualWorkingdays = 0;
    this.totalLeavedays = 0;
    this.totalWorkingDays = 0;
    //initialize chartdata
    let chartData: ChartViewRequest = {
      staffId: this.staffId,
      taskId: this.taskId,
      start: this.selectedStart,
      end: this.selectedEnd,
    };
    if (
      this.staffId > 0 &&
      this.selectedStartDate !== null &&
      this.selectedEndDate !== null
    ) {
      this.dailyReportModel.DailyActivitySummary(chartData).then((data) => {
        //map to obj
        const res = <ReportChartSummary>data;
        //set to local variables
        this.totalWorkingDays = res.totalWorkingDays;
        this.totalActualWorkingdays = res.totalActualWorkingDays;
        this.totalLeavedays = res.totalLeaveDays;
        this.totalActualWorkingdays = res.totalActualWorkingDays;
        //insert elements to array
        res.dailyReportChartData.forEach((element) => {
          //label for chart
          this.chartLabels.push(element.label + ' (%)');
          //data for chart
          this.dataToChart.push(element.data);
          //date for pdf table
          this.tableData.push(element.label);
        });
        //call chart method to define after changes applied
        this.defineChart();
      });
    }
  }
  //enable or disable download button based on validation
  get isDownloadBtnValid(){
    return (this.selectedStartDate===null || this.selectedEndDate===null || this.staffId==0) ;
  }
  //handle download as pdf
  downloadPdf() {
    //call generate pdf method
    this.generatePDF();
  }
  //handle pdf download event
  async generatePDF() {
    await this.waitForChartRender();
    const pdf = new jsPDF('p', 'mm', 'a4');
    const leftMargin = 10;
    const rightMargin = 10;
    //set header to pdf
    this.addHeader(pdf, leftMargin, rightMargin);
    //set body to pdf
    await this.addPdfData(pdf, leftMargin, rightMargin);
    //setup to download
    const pdfData = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfData);
    pdf.save( this.getStaffName+'_Activity_Summary'+'_'+ this.selectedStart+'_to_'+this.selectedEnd);
  }
  private waitForChartRender(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }
  //set adjusted value for pdf view
  adjustedValue = 130;
  //add body to pdf
  async addPdfData(pdf: jsPDF, leftMargin: number, rightMargin: number) {
    let timePeriodY = 40;
    let highlightY = timePeriodY - 4;
    let highlightHeight = 6;
    //set header to content
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(234, 235, 240);
    pdf.rect(leftMargin, highlightY, 190, highlightHeight, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Overview', leftMargin + 3, timePeriodY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(
      `Start Date: ${this.selectedStart}`,
      leftMargin + 3,
      timePeriodY + 8
    );
    pdf.text(
      `End Date:   ${this.selectedEnd}`,
      leftMargin + this.adjustedValue,
      timePeriodY + 8
    );
    pdf.text(
      `Staff Name: ${this.getStaffName}`,
      leftMargin + 3,
      timePeriodY + 13
    );
    pdf.text(
      `Total Working Days:   ${this.totalWorkingDays}`,
      leftMargin + this.adjustedValue,
      timePeriodY + 13
    );
    pdf.text(
      `Actual Working Days: ${this.totalActualWorkingdays}`,
      leftMargin + 3,
      timePeriodY + 18
    );
    pdf.text(
      `Total leave Days: ${this.totalLeavedays}`,
      leftMargin + this.adjustedValue,
      timePeriodY + 18
    );
    //add table
    timePeriodY = 66;
    highlightY = timePeriodY - 4;
    //setup pie chart as image
    let chartImage = await this.getChartImage(this.chart1);
    pdf.addImage(chartImage, 'PNG', leftMargin + 60, timePeriodY, 75, 75);
    //add chart here
    timePeriodY = timePeriodY + 80;
    highlightY = timePeriodY - 4;
    //add table
    this.addTable(timePeriodY, pdf);
    //add footer
    this.addFooter(pdf, leftMargin, rightMargin);
  }
  //footer implementation
  addFooter(pdf: jsPDF, leftMargin: number, rightMargin: number) {
    const totalPages = pdf.getNumberOfPages();

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const footerText = `This PDF was generated on ${formattedDate} ${formattedTime}`;
    //loop through all pages to setup footer dynamically
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(125, 137, 147);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - rightMargin - 20,
        pageHeight - 10
      );

      pdf.text(footerText, leftMargin, pageHeight - 10);
      const lineY = 279;
      pdf.setDrawColor(63, 81, 181);
      pdf.setLineWidth(0.75);
      pdf.line(leftMargin, lineY, rightMargin + 190, lineY);
    }
  }
  //method to table implementation
  addTable(startY: number, pdf: jsPDF) {
    const tableData = this.dataToChart.map((val: number, index: number) => [
      this.tableData[index] || '',
      val,
    ]);
    //setup elements to table
    autoTable(pdf, {
      startY: startY + 15,
      head: [['Task', `Percentage (%)`]],
      body: tableData,
      styles: { fontSize: 9, minCellHeight: 5, cellPadding: 2 },
      columnStyles: {
        0: { halign: 'center' }, // Align "Task" column to the left
        1: { halign: 'center' }, // Align "Percentage (%)" column to the center
      },
      theme: 'grid',
      headStyles: {
        fillColor: [234, 235, 240],
        textColor: [0, 0, 0],
        halign: 'center',
      },
      bodyStyles: { textColor: [0, 0, 0] },
      didParseCell: (data) => {
        data.cell.styles.lineWidth = {
          top: 0.1,
          right: 0,
          bottom: 0.1,
          left: 0,
        };
        data.cell.styles.lineColor = [234, 235, 240];
        if (data.column.index === 0) {
          data.cell.styles.lineWidth = {
            top: 0.1,
            right: 0,
            bottom: 0.1,
            left: 0.1,
          };
        }
        if (data.column.index === 1) {
          data.cell.styles.lineWidth = {
            top: 0.1,
            right: 0.1,
            bottom: 0.1,
            left: 0,
          };
        }
      },
    });
  }
  //get chart image
  private getChartImage(ele: ElementRef): Promise<string> {
    return new Promise((resolve, reject) => {
      if (ele) {
        html2canvas(ele.nativeElement)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            resolve(imgData);
          })
          .catch((error) => {
            this.showMessgae('error', 'Error', error.message());
            reject(error);
          });
      } else {
        console.error('Chart element not found or not initialized.');
        reject('Chart element not found or not initialized.');
      }
    });
  }
  //add header to pdf
  addHeader(pdf: jsPDF, leftMargin: number, rightMargin: number) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(this.getStaffName +' Activity Summary', 10, 15);

    const lineY = 29;
    pdf.setDrawColor(63, 81, 181);
    pdf.setLineWidth(0.75);
    pdf.line(leftMargin, lineY, rightMargin + 190, lineY);
  }
}
