import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccToastComponent } from './succ-toast.component';

describe('SuccToastComponent', () => {
  let component: SuccToastComponent;
  let fixture: ComponentFixture<SuccToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
