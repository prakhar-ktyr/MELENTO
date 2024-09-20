export class Address {
    houseNo: number;
    street: string;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    constructor(houseNo: number, street: string, area: string, city: string, state: string, country: string, pincode: string) {
        this.houseNo = houseNo;
        this.street = street;
        this.area = area;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode;
    }

}