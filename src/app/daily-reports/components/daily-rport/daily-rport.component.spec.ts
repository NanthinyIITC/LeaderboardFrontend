import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRportComponent } from './daily-rport.component';

describe('DailyRportComponent', () => {
  let component: DailyRportComponent;
  let fixture: ComponentFixture<DailyRportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyRportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyRportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
