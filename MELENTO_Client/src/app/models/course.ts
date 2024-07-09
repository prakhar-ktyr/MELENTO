export class Course {
    id: string;
    courseName: string;
    courseDescription: string;
    categoryId: number;
    constructor(id: string, cName: string, cDescription: string, cId: number) {
        this.id = id;
        this.courseName = cName;
        this.courseDescription = cDescription;
        this.categoryId = cId;
    }

}