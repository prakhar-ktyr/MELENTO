import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAssessmentScoreComponent } from './update-assessment-score.component';

describe('UpdateAssessmentScoreComponent', () => {
  let component: UpdateAssessmentScoreComponent;
  let fixture: ComponentFixture<UpdateAssessmentScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateAssessmentScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAssessmentScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
