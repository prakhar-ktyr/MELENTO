export class Course {
    courseName: string;
    courseDescription: string;
    categoryId: number;
    constructor(id: string, cName: string, cDescription: string, cId: number) {
        this.courseName = cName;
        this.courseDescription = cDescription;
        this.categoryId = cId;
    }
}