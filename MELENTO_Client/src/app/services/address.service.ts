import { Injectable } from '@angular/core';
import { Address } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  arrAddress:Address[] = []; 
  constructor() {

   }

  getAddress(){
    return this.arrAddress ; 
  }

  getAddressByID(id:number){
    return this.arrAddress[id] ; 
  }
}
