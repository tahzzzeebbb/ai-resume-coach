import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import protect from '../middleware/auth.js';
import Resume from '../models/Resume.js';
import { analyzeResume, analyzeSkillGap, generateInterviewQuestions } from '../utils/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Helper to extract text from PDF
const extractPdfText = async (filePath) => {
  const pdfParse = (await import('pdf-parse')).default;
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// POST /api/resume/upload
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const extractedText = await extractPdfText(req.file.path);

    if (!extractedText || extractedText.trim().length < 50) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Could not extract text from PDF. Please ensure the PDF is not scanned/image-based.' });
    }

    // Analyze with Gemini
    const analysis = await analyzeResume(extractedText);

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      extractedText,
      analysis: {
        overallScore: analysis.overallScore,
        technicalSkills: analysis.technicalSkills,
        projects: analysis.projects,
        experience: analysis.experience,
        presentation: analysis.presentation,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions
      }
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, resume });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/resume/:id/skill-gap
router.post('/:id/skill-gap', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const { targetRole } = req.body;
    if (!targetRole) return res.status(400).json({ success: false, message: 'Target role is required' });

    const skillGapData = await analyzeSkillGap(resume.extractedText, targetRole);

    resume.skillGap = {
      targetRole,
      existingSkills: skillGapData.existingSkills,
      missingSkills: skillGapData.missingSkills,
      learningRoadmap: skillGapData.learningRoadmap
    };

    await resume.save();
    res.json({ success: true, skillGap: resume.skillGap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/resume/:id/questions
router.post('/:id/questions', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const { role = 'Software Developer', count = 10 } = req.body;
    const questions = await generateInterviewQuestions(resume.extractedText, role, count);

    resume.interviewQuestions = questions;
    await resume.save();

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/resume/my-resumes
router.get('/my-resumes', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-extractedText')
      .sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/resume/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/resume/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
