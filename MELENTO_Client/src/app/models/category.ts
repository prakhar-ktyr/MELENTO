export class Category {
    category: string;
    categoryDescription: string;
    constructor(id: string, c: string, cd: string) {
        this.category = c;
        this.categoryDescription = cd;
    }
}