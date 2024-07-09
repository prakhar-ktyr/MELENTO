import { Address } from './address';

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address[];
    password: string;
    dob: string;
    role: string;
    constructor(id: string, fName: string, lName: string, email: string, phone: string, address: Address[], password: string, dob: string, role: string) {
        this.id = id;
        this.firstName = fName;
        this.lastName = lName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.password = password;
        this.dob = dob;
        this.role = role;

    }

}