import { Injectable } from '@angular/core';
import { Question } from '../models/questions';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  arrQuestion : Question[] = []; 
  constructor() { 
    
  }

  getQuestion(){
    return this.arrQuestion ; 
  }

  getQuestionByID(id:number){
    return this.arrQuestion[id] ; 
  }
}
