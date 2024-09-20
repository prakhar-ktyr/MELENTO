export class AssessmentScore {
  assessmentId: number;
  traineeId: number;
  score: number;
  constructor(
    assessmentId: number,
    traineeId: number,
    score: number
  ) {
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.score = score;
  }
}
