import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAssessmentComponent } from './attempt-assessment.component';

describe('AttemptAssessmentComponent', () => {
  let component: AttemptAssessmentComponent;
  let fixture: ComponentFixture<AttemptAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttemptAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttemptAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
