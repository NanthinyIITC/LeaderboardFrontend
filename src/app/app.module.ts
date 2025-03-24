import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { SideNavBarComponent } from './common/side-nav-bar/side-nav-bar.component';
import { DashboardContentComponent } from './common/dashboard-content/dashboard-content.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { LoginFormComponent } from './authentication/components/forms/login-form/login-form.component';
import { MainComponent } from './common/main/main.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StaffDetailsComponent } from './staff/components/staff-details/staff-details.component'; 
import { StaffCreateFormComponent } from './staff/components/forms/staff-create-form/staff-create-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DailyRportComponent } from './daily-reports/components/daily-rport/daily-rport.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DailyReportHistoryComponent } from './daily-reports/components/daily-report-history/daily-report-history.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { LeaveDetailsComponent } from './leave/components/leave-details/leave-details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LeaveFormComponent } from './leave/components/forms/leave-form/leave-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { EditorModule } from 'primeng/editor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { UserTypeDetailsComponent } from './configurations/user-type/components/user-type-details/user-type-details.component';
import { UserTypeFormComponent } from './configurations/user-type/components/forms/user-type-form/user-type-form.component';
import { ViewLeavesComponent } from './leave/components/view-leaves/view-leaves.component';
import { DailyActivitySummaryComponent } from './daily-reports/components/daily-activity-summary/daily-activity-summary.component';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavBarComponent,
    DashboardContentComponent,
    LoginComponent,
    LoginFormComponent,
    MainComponent,
    StaffDetailsComponent,
    StaffCreateFormComponent,
    DailyRportComponent,
    DailyReportHistoryComponent,
    LeaveDetailsComponent,
    LeaveFormComponent,
    UserTypeDetailsComponent,
    UserTypeFormComponent,
    ViewLeavesComponent,
    DailyActivitySummaryComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,  
    FormsModule,
    HttpClientModule,
    TableModule ,
    DialogModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    FullCalendarModule ,
    CheckboxModule,
    TooltipModule,
    EditorModule,
    RadioButtonModule,
    ChartModule,
    CardModule
  ],
  providers: [MessageService,NzMessageService ,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
