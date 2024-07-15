import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step0Component } from './step-0.component';

describe('Step0Component', () => {
  let component: Step0Component;
  let fixture: ComponentFixture<Step0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
