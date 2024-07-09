export class Attendance {
    id: string;
    userId: string;
    date: Date;
    status: string;
    constructor(id: string, uId: string, date: Date, status: string) {
        this.id = id;
        this.userId = uId;
        this.date = date;
        this.status = status;
    }

}