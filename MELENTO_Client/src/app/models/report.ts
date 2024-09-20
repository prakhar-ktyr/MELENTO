export class Report{
    assessmentId:string ; 
    userId:string ; 
    marks:boolean[] = [] ; 
    score:string ; 
    date:string; 
    constructor( 
        assessmentId:string , 
        userId:string , 
        marks:boolean[] = [] , 
        score:string , date:string =  new Date().toISOString().split('T')[0] ){
            this.assessmentId = assessmentId ;
            this.userId = userId ; 
            this.marks = marks ; 
            this.score = score ; 
            this.date = date ; 
        }
}