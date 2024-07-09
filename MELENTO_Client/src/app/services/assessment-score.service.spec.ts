import { TestBed } from '@angular/core/testing';

import { AssessmentScoreService } from './assessment-score.service';

describe('AssessmentScoreService', () => {
  let service: AssessmentScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
