import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedBookingsComponent } from './confirmed-bookings.component';

describe('ConfirmedBookingsComponent', () => {
  let component: ConfirmedBookingsComponent;
  let fixture: ComponentFixture<ConfirmedBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmedBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmedBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
