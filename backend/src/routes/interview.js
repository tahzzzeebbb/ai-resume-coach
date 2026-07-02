import express from 'express';
import protect from '../middleware/auth.js';
import InterviewSession from '../models/InterviewSession.js';
import Resume from '../models/Resume.js';
import { getInterviewFeedback } from '../utils/gemini.js';

const router = express.Router();

// POST /api/interview/start
router.post('/start', protect, async (req, res) => {
  try {
    const { role, resumeId } = req.body;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required' });

    const session = await InterviewSession.create({
      user: req.user._id,
      resume: resumeId || null,
      role,
      messages: [{
        role: 'assistant',
        content: `Welcome to your ${role} interview! I'm your AI interviewer. Let's start with a classic question:\n\n**Tell me about yourself and your background in ${role}.**\n\nTake your time and give me a comprehensive answer.`,
        feedback: '',
        score: null
      }]
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/interview/:id/answer
router.post('/:id/answer', protect, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status === 'completed') return res.status(400).json({ success: false, message: 'Session already completed' });

    const { answer } = req.body;
    if (!answer) return res.status(400).json({ success: false, message: 'Answer is required' });

    // Get last question from assistant messages
    const assistantMessages = session.messages.filter(m => m.role === 'assistant');
    const lastQuestion = assistantMessages[assistantMessages.length - 1]?.content || '';

    // Get resume text if available
    let resumeText = '';
    if (session.resume) {
      const resume = await Resume.findById(session.resume).select('extractedText');
      resumeText = resume?.extractedText || '';
    }

    // Get AI feedback
    const feedbackData = await getInterviewFeedback(lastQuestion, answer, session.role, resumeText);

    // Add user's answer
    session.messages.push({
      role: 'user',
      content: answer,
      feedback: feedbackData.feedback,
      score: feedbackData.score
    });

    // Determine next question or wrap up
    const questionCount = session.messages.filter(m => m.role === 'user').length;
    let nextMessage = '';

    if (questionCount >= 5) {
      // End interview
      const avgScore = session.messages
        .filter(m => m.role === 'user' && m.score)
        .reduce((sum, m) => sum + m.score, 0) / questionCount;

      session.status = 'completed';
      session.overallScore = Math.round(avgScore * 10);

      nextMessage = `Great interview! Here's your feedback on that answer:\n\n**Score: ${feedbackData.score}/10**\n\n${feedbackData.feedback}\n\n**💡 Improved Answer:** ${feedbackData.improved_answer}\n\n---\n\n🎯 **Interview Complete!** Your overall score is **${session.overallScore}/100**.\n\nGreat work completing this mock interview! Review your answers and feedback to improve.`;
    } else {
      const followUpQuestions = [
        `Thanks for sharing! Here's your feedback:\n\n**Score: ${feedbackData.score}/10** - ${feedbackData.feedback}\n\n**💡 Tip:** ${feedbackData.tips[0]}\n\n---\n\nNext question: **Describe a challenging technical problem you solved recently. What was your approach?**`,
        `Good answer! **Score: ${feedbackData.score}/10** - ${feedbackData.feedback}\n\n---\n\nNext question: **What are your strongest technical skills relevant to ${session.role}? Give examples of projects where you used them.**`,
        `Excellent! **Score: ${feedbackData.score}/10** - ${feedbackData.feedback}\n\n---\n\nNext question: **How do you stay updated with the latest technologies in your field?**`,
        `Well done! **Score: ${feedbackData.score}/10** - ${feedbackData.feedback}\n\n---\n\nNext question: **Tell me about a time you had to work with a difficult team member. How did you handle it?**`,
        `Great response! **Score: ${feedbackData.score}/10** - ${feedbackData.feedback}\n\n---\n\nFinal question: **Where do you see yourself in 5 years, and how does this ${session.role} role fit into your career goals?**`
      ];

      nextMessage = followUpQuestions[Math.min(questionCount - 1, followUpQuestions.length - 1)];
    }

    session.messages.push({
      role: 'assistant',
      content: nextMessage,
      feedback: '',
      score: null
    });

    await session.save();
    res.json({ success: true, session, feedback: feedbackData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/interview/sessions
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .select('-messages')
      .sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/interview/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
