import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Assessment } from '../../models/assessment';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss']
})
export class ViewDetailsComponent implements OnInit {
  assessment: Assessment = new Assessment(0, "", "", "", [], 0, 0, "" , true);

  constructor(private activatedRoute: ActivatedRoute, private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const assessmentId = +params['id'];
      this.loadAssessmentDetails(assessmentId);
    });
  }

  loadAssessmentDetails(id: number): void {
    this.assessmentService.getAssessmentById(id).subscribe((assessment: Assessment) => {
      this.assessment = assessment;
    }, error => {
      console.error('Error fetching assessment:', error);
    });
  }

  addToCart(assessmentId: number): void {
    console.log(`Adding assessment with ID ${assessmentId} to cart`);
    // Implement add to cart functionality here
  }
}
