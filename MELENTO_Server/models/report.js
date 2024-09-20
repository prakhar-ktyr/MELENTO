const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  assessmentId: { type: String, required: true },
  userId: { type: String, required: true },
  marks: { type: [Boolean], required: true }, // Array of boolean values
  score: { type: String, required: true }, // Score stored as string (e.g. "5/10")
  date: { type: String, default: new Date().toISOString().split('T')[0] } // Default to current date
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
