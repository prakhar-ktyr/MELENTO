const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentTraineesSchema = new Schema({
  assessmentId: { type: String, required: true },  // ID of the assessment
  traineeId: { type: String, required: true },     // ID of the trainee (user)
  quantity: { type: Number, required: true }       // Number of attempts remaining or completed
});

const AssessmentTrainees = mongoose.model('AssessmentTrainees', assessmentTraineesSchema);
module.exports = AssessmentTrainees;
