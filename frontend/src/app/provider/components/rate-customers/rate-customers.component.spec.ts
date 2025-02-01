import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCustomersComponent } from './rate-customers.component';

describe('RateCustomersComponent', () => {
  let component: RateCustomersComponent;
  let fixture: ComponentFixture<RateCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateCustomersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
