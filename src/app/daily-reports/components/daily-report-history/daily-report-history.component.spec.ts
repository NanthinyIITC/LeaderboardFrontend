import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportHistoryComponent } from './daily-report-history.component';

describe('DailyReportHistoryComponent', () => {
  let component: DailyReportHistoryComponent;
  let fixture: ComponentFixture<DailyReportHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyReportHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
