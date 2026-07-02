import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  analysis: {
    overallScore: { type: Number, default: 0 },
    technicalSkills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    presentation: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String]
  },
  skillGap: {
    targetRole: { type: String, default: '' },
    existingSkills: [String],
    missingSkills: [String],
    learningRoadmap: [
      {
        week: Number,
        topic: String,
        resources: [String]
      }
    ]
  },
  interviewQuestions: [
    {
      question: String,
      category: String,
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resumeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Resume', resumeSchema);
