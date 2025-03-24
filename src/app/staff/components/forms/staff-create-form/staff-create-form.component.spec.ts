import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCreateFormComponent } from './staff-create-form.component';

describe('StaffCreateFormComponent', () => {
  let component: StaffCreateFormComponent;
  let fixture: ComponentFixture<StaffCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffCreateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
