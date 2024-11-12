import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCompComponent } from './preview-comp.component';

describe('PreviewCompComponent', () => {
  let component: PreviewCompComponent;
  let fixture: ComponentFixture<PreviewCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewCompComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
