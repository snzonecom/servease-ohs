import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedProvidersComponent } from './deleted-providers.component';

describe('DeletedProvidersComponent', () => {
  let component: DeletedProvidersComponent;
  let fixture: ComponentFixture<DeletedProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletedProvidersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletedProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
