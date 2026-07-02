import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  role: {
    type: String,
    required: true
  },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      feedback: { type: String, default: '' },
      score: { type: Number, default: null },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  overallScore: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('InterviewSession', interviewSessionSchema);
