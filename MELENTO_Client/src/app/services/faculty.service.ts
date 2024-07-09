import { Injectable } from '@angular/core';
import { Faculty } from '../models/faculty';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  arrFaculty : Faculty[] = []; 
  constructor() { 
    
  }

  getFaculty(){
    return this.arrFaculty ; 
  }

  getFacultyByID(id:number){
    return this.arrFaculty[id] ; 
  }
}
