export class Attendance {
    userId: string;
    date: Date;
    status: string;
    constructor(uId: string, date: Date, status: string) {
        this.userId = uId;
        this.date = date;
        this.status = status;
    }

}