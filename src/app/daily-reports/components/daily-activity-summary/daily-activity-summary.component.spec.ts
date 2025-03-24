import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivitySummaryComponent } from './daily-activity-summary.component';

describe('DailyActivitySummaryComponent', () => {
  let component: DailyActivitySummaryComponent;
  let fixture: ComponentFixture<DailyActivitySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyActivitySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyActivitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
