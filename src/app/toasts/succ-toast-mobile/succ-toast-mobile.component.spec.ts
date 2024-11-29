import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccToastMobileComponent } from './succ-toast-mobile.component';

describe('SuccToastMobileComponent', () => {
  let component: SuccToastMobileComponent;
  let fixture: ComponentFixture<SuccToastMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccToastMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccToastMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
