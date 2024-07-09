export class AssessmentTrainees {
  id: string;
  assessmentId: string;
  traineeId: string;
  quantity:string; 
  constructor(id: string, assessmentId: string, traineeId: string , quantity:string) {
    this.id = id;
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.quantity = quantity ; 
  }
}
