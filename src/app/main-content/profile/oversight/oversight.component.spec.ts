import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OversightComponent } from './oversight.component';

describe('OversightComponent', () => {
  let component: OversightComponent;
  let fixture: ComponentFixture<OversightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OversightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OversightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
