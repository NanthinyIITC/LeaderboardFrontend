import { Component } from '@angular/core';
import { environment } from '../environments/environment.development';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EmployeemanagementApp';
  constructor(){
   
  }
  ngOnInit(): void {
   
    this.scheduleRefresh();
   
  }
  //set page refresh every 5min 
  private scheduleRefresh() {
    const refreshIntervalMillis = 60000;
    interval(refreshIntervalMillis).subscribe(() => {
      const currentDate = new Date();
      const currentMinutes = currentDate.getMinutes();
      if ([ 5, 15, 25, 35, 45, 55].includes(currentMinutes)) {
        this.refreshApplication();
      }
    });
  }
//page reload
  private refreshApplication() {
    window.location.reload();
  }
}
