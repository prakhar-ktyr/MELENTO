export class Question {
    text: string;
    type: string;
    choices: string[];
    correctAnswer: string;

    constructor(text: string, type: string, correctAnswer: string , choices: string[]) {
        this.text = text;
        this.type = type;
        this.correctAnswer = correctAnswer;
        this.choices = choices;
    }
}
