const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  preferredSkills: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  workMode: {
    type: String,
    required: true,
    enum: ['On-site', 'Remote', 'Hybrid']
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  stipend: {
    type: String,
    required: true,
    trim: true
  },
  stipendAmount: {
    type: Number,
    default: 0
  },
  applicationDeadline: {
    type: Date
  },
  openings: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    required: true,
    enum: ['Engineering', 'Design', 'Data Science', 'Product', 'Marketing', 'Other'],
    default: 'Engineering'
  },
  logo: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Internship', internshipSchema);
