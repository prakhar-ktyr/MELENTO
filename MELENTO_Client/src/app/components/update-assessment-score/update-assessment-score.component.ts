import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessmentScore';

@Component({
  selector: 'app-update-assessment-score',
  templateUrl: './update-assessment-score.component.html',
  styleUrls: ['./update-assessment-score.component.scss'],
})
export class UpdateAssessmentScoreComponent implements OnInit {
  assessmentScoreUpdateForm: FormGroup;
  arrAssessmentScores: AssessmentScore[] = [];
  idUpdated: string = '';

  constructor(private fb: FormBuilder, private assessmentScoreService: AssessmentScoreService) {
    this.assessmentScoreUpdateForm = this.fb.group({
      id: ['', Validators.required],
      assessmentId: ['', Validators.required],
      traineeId: ['', Validators.required],
      score: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAssessmentScores();
  }

  loadAssessmentScores(): void {
    this.assessmentScoreService.getAssessmentScore().subscribe((assessmentScores: AssessmentScore[]) => {
      this.arrAssessmentScores = assessmentScores;
      console.log('Assessment Scores Loaded:', this.arrAssessmentScores);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.assessmentScoreUpdateForm.get(controlName);
    return control?.invalid && (control?.touched || !control?.pristine) || false;
  }

  onChangeType(evt: any): void {
    const selectedAssessmentScoreId = evt.target.value.split(':')[1].trim();
    console.log('Selected Assessment Score ID:', selectedAssessmentScoreId);

    const selectedAssessmentScore = this.arrAssessmentScores.find(score => score.id === selectedAssessmentScoreId);
    console.log('Selected Assessment Score:', selectedAssessmentScore);

    if (selectedAssessmentScore) {
      this.assessmentScoreUpdateForm.patchValue({
        id: selectedAssessmentScore.id,
        assessmentId: selectedAssessmentScore.assessmentId,
        traineeId: selectedAssessmentScore.traineeId,
        score: selectedAssessmentScore.score
      });
      console.log('Form Updated:', this.assessmentScoreUpdateForm.value);
    }
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const updatedAssessmentScore: AssessmentScore = {
      id: frmValue.id,
      assessmentId: frmValue.assessmentId,
      traineeId: frmValue.traineeId,
      score: frmValue.score
    };

    this.assessmentScoreService.updateAssessmentScore(updatedAssessmentScore).subscribe(
      (response: any) => {
        console.log('Assessment Score updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating assessment score', error);
      }
    );
  }
}
