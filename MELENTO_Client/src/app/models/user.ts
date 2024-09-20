import { Address } from './address';

export class User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address[];
    password: string;
    dob: string;
    role: string;
    constructor(fName: string, lName: string, email: string, phone: string, address: Address[], password: string, dob: string, role: string) {
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