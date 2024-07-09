import { Assessment } from "./assessment";

export class Cart{
    id:number ; 
    arrAssessments:Assessment[] ;
    userId:number ; 
    quantity:number[] ;
    total:number ; 
    constructor(id:number , userId:number,  arrAssessments:Assessment[] , quantity:number[] , total:number){
        this.id = id ; 
        this.userId = userId ; 
        this.arrAssessments = arrAssessments ; 
        this.quantity = quantity ; 
        this.total = total ; 
    }
}