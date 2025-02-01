import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNavComponent } from './provider-nav.component';

describe('ProviderNavComponent', () => {
  let component: ProviderNavComponent;
  let fixture: ComponentFixture<ProviderNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProviderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
