import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToastMobileComponent } from './error-toast-mobile.component';

describe('ErrorToastMobileComponent', () => {
  let component: ErrorToastMobileComponent;
  let fixture: ComponentFixture<ErrorToastMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorToastMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorToastMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
