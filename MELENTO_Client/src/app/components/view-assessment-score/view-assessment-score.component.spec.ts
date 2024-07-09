import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentScoreComponent } from './view-assessment-score.component';

describe('ViewAssessmentScoreComponent', () => {
  let component: ViewAssessmentScoreComponent;
  let fixture: ComponentFixture<ViewAssessmentScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAssessmentScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
