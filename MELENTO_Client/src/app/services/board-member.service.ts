import { Injectable } from '@angular/core';
import { Boardmember } from '../models/boardmember';

@Injectable({
  providedIn: 'root'
})
export class BoardMemberService {

  arrBoardMember : Boardmember[] = []; 
  constructor() { 
    
  }

  getBoardMember(){
    return this.arrBoardMember ; 
  }

  getBoardMemberByID(id:number){
    return this.arrBoardMember[id] ; 
  }
}
