export class AssessmentScore {
  id: string;
  assessmentId: number;
  traineeId: number;
  score: number;
  constructor(
    id: string,
    assessmentId: number,
    traineeId: number,
    score: number
  ) {
    this.id = id;
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.score = score;
  }
}
