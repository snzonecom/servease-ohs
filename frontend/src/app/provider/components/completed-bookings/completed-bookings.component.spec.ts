import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedBookingsComponent } from './completed-bookings.component';

describe('CompletedBookingsComponent', () => {
  let component: CompletedBookingsComponent;
  let fixture: ComponentFixture<CompletedBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedBookingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletedBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
