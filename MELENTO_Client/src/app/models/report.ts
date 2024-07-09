export class Report{
    id:number ; 
    assessmentId:string ; 
    userId:string ; 
    marks:boolean[] = [] ; 
    score:string ; 
    date:string; 
    constructor( id:number , 
        assessmentId:string , 
        userId:string , 
        marks:boolean[] = [] , 
        score:string , date:string =  new Date().toISOString().split('T')[0] ){
            this.id = id ; 
            this.assessmentId = assessmentId ;
            this.userId = userId ; 
            this.marks = marks ; 
            this.score = score ; 
            this.date = date ; 
        }
}