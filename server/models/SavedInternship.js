const mongoose = require('mongoose');

const savedInternshipSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can't save the same internship twice
savedInternshipSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

module.exports = mongoose.model('SavedInternship', savedInternshipSchema);
