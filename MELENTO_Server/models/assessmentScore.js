const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentScoreSchema = new Schema({
  assessmentId: { type: Number, required: true }, // ID of the assessment
  traineeId: { type: Number, required: true },    // ID of the trainee (user)
  score: { type: Number, required: true }         // The score obtained by the trainee
});

const AssessmentScore = mongoose.model('AssessmentScore', assessmentScoreSchema);
module.exports = AssessmentScore;
