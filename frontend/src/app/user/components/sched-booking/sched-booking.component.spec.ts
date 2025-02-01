import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedBookingComponent } from './sched-booking.component';

describe('SchedBookingComponent', () => {
  let component: SchedBookingComponent;
  let fixture: ComponentFixture<SchedBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
