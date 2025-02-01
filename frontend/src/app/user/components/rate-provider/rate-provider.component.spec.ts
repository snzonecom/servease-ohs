import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateProviderComponent } from './rate-provider.component';

describe('RateProviderComponent', () => {
  let component: RateProviderComponent;
  let fixture: ComponentFixture<RateProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
