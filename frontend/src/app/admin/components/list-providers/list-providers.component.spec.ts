import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProvidersComponent } from './list-providers.component';

describe('ListProvidersComponent', () => {
  let component: ListProvidersComponent;
  let fixture: ComponentFixture<ListProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListProvidersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
