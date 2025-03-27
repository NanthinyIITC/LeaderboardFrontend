import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './common/dashboard-content/dashboard-content.component';
import { LoginComponent } from './authentication/components/login/login.component';
import { MainComponent } from './common/main/main.component';
import { StaffDetailsComponent } from './staff/components/staff-details/staff-details.component';
import { StaffCreateFormComponent } from './staff/components/forms/staff-create-form/staff-create-form.component';
import { authGuard } from './auth.guard';
import { DailyRportComponent } from './daily-reports/components/daily-rport/daily-rport.component';
import { DailyReportHistoryComponent } from './daily-reports/components/daily-report-history/daily-report-history.component';
import { LeaveDetailsComponent } from './leave/components/leave-details/leave-details.component';
import { UserTypeDetailsComponent } from './configurations/user-type/components/user-type-details/user-type-details.component';
import { DailyActivitySummaryComponent } from './daily-reports/components/daily-activity-summary/daily-activity-summary.component';
import { AuthVerifyComponent } from './authentication/components/auth-verify/auth-verify.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth-verify', component: AuthVerifyComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: StaffDetailsComponent, canActivate: [authGuard] },
      {
        path: 'staff-detail',
        component: StaffDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'daily-report',
        component: DailyRportComponent,
        canActivate: [authGuard],
      },
      {
        path: 'daily-report-history',
        component: DailyReportHistoryComponent,
        canActivate: [authGuard],
      },
      {
        path: 'leave-details',
        component: LeaveDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'user-type',
        component: UserTypeDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'daily-activity-summary',
        component: DailyActivitySummaryComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
