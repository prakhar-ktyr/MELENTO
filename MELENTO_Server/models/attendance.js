const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // References the user collection, assuming userId is ObjectId
    required: true,
    ref: 'User'  // Replace 'User' with the actual user collection model name if applicable
  },
  date: {
    type: Date,
    default: Date.now,  // Automatically sets the current date if not provided
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'absent', 'pending'],  // You can customize these statuses based on your needs
    required: true
  }
}, {
  collection: 'attendance',  // Specifies the collection name
  timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Export the schema as a model
module.exports = mongoose.model('Attendance', attendanceSchema);
