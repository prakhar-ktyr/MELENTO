export class AssessmentTrainees {
  id: string;
  assessmentId: string;
  traineeId: string;
  quantity:number; 
  constructor(id: string, assessmentId: string, traineeId: string , quantity:number) {
    this.id = id;
    this.assessmentId = assessmentId;
    this.traineeId = traineeId;
    this.quantity = quantity ; 
  }
}
