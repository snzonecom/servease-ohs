import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedAccountsComponent } from './suspended-accounts.component';

describe('SuspendedAccountsComponent', () => {
  let component: SuspendedAccountsComponent;
  let fixture: ComponentFixture<SuspendedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuspendedAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuspendedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
