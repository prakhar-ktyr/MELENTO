import { Assessment } from "./assessment";

export class Cart{
    arrAssessments:Assessment[] ;
    userId:number ; 
    quantity:number[] ;
    total:number ; 
    constructor(userId:number,  arrAssessments:Assessment[] , quantity:number[] , total:number){
        this.userId = userId ; 
        this.arrAssessments = arrAssessments ; 
        this.quantity = quantity ; 
        this.total = total ; 
    }
}