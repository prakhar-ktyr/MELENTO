const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema = new Schema({
  assessmentName: { type: String, required: true },
  assessmentDescription: { type: String, required: true },
  assessmentImage: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
  price: { type: Number, required: true },
  facultyId: { type: Number, required: true },
  time: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;
