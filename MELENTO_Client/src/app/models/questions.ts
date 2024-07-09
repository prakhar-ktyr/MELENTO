export class Question {
    id: number;
    text: string;
    type: string;
    choices: string[];
    correctAnswer: string;

    constructor(id: number, text: string, type: string, correctAnswer: string , choices: string[]) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.correctAnswer = correctAnswer;
        this.choices = choices;
    }
}
