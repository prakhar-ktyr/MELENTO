export class AssessmentTrainees {
  assessmentId: string;
  traineeId: string;
  quantity:number; 
  constructor(assessmentId: string, traineeId: string , quantity:number) {
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.quantity = quantity ; 
  }
}
