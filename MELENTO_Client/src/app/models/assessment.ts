import { Question } from './questions';

export class Assessment {
    id: number;
    assessmentName: string ;
    assessmentDescription: string;
    assessmentImage: string;
    questions: Question[];
    price: number; 
    facultyId: number;
    time: string;
    isActive:boolean = true;
    constructor(id: number , name: string, description: string, assessmentImage: string, questions: Question[], price: number , facultyId:number, time: string , isActive:boolean=true) {
        this.id = id;
        this.assessmentName = name;
        this.assessmentDescription = description;
        this.assessmentImage = assessmentImage;
        this.questions = questions;
        this.price = price; 
        this.facultyId = facultyId ; 
        this.time = time;
        this.isActive = isActive
    }
}
