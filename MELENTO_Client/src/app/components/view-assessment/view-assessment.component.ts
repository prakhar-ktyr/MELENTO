import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../services/assessment.service';
import { Assessment } from '../../models/assessment';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrls: ['./view-assessment.component.scss']
})
export class ViewAssessmentComponent implements OnInit {
  assessments: Assessment[] = [];

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments(): void {
    this.assessmentService.getAssessments().subscribe(
      (assessments: any) => {
        this.assessments = assessments;
        console.log('Assessments Loaded:', this.assessments);
      },
      error => {
        console.error('Error loading assessments:', error);
      }
    );
  }
}
