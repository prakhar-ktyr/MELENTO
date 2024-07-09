import { Component, OnInit } from '@angular/core';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessmentScore';

@Component({
  selector: 'app-view-assessment-score',
  templateUrl: './view-assessment-score.component.html',
  styleUrls: ['./view-assessment-score.component.scss']
})
export class ViewAssessmentScoreComponent implements OnInit {
  arrAssessmentScores: AssessmentScore[] = [];

  constructor(private assessmentScoreService: AssessmentScoreService) {}

  ngOnInit(): void {
    this.assessmentScoreService.getAssessmentScore().subscribe(data => {
      this.arrAssessmentScores = data;
      console.log(data);
    });
  }
}
