const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: { type: String, required: true },
  type: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
