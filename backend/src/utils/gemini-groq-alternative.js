// ============================================================
// GROQ VERSION — 100% Free Alternative to Gemini
// 1. Get free key at: https://console.groq.com
// 2. npm install groq-sdk
// 3. Add to .env: GROQ_API_KEY=your_key_here
// 4. Replace backend/src/utils/gemini.js with this file
// ============================================================

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chat = async (prompt) => {
  const res = await groq.chat.completions.create({
    model: 'llama3-70b-8192', // Free, very capable
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });
  return res.choices[0].message.content.trim();
};

const parseJSON = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are an expert resume reviewer. Analyze the resume and return ONLY valid JSON (no markdown, no backticks).

Resume:
${resumeText}

Return exactly:
{
  "overallScore": <0-100>,
  "technicalSkills": <0-100>,
  "projects": <0-100>,
  "experience": <0-100>,
  "presentation": <0-100>,
  "summary": "<2-3 sentence assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>"]
}`;
  return parseJSON(await chat(prompt));
};

export const analyzeSkillGap = async (resumeText, targetRole) => {
  const prompt = `
You are a technical recruiter. Analyze this resume vs the target role. Return ONLY valid JSON.

Resume: ${resumeText}
Target Role: ${targetRole}

Return exactly:
{
  "existingSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": ["missing1", "missing2", "missing3"],
  "learningRoadmap": [
    { "week": 1, "topic": "<topic>", "resources": ["resource1", "resource2"] },
    { "week": 2, "topic": "<topic>", "resources": ["resource1", "resource2"] },
    { "week": 3, "topic": "<topic>", "resources": ["resource1", "resource2"] },
    { "week": 4, "topic": "<topic>", "resources": ["resource1", "resource2"] }
  ]
}`;
  return parseJSON(await chat(prompt));
};

export const generateInterviewQuestions = async (resumeText, role, count = 10) => {
  const prompt = `
Generate ${count} interview questions for ${role} based on this resume. Return ONLY a valid JSON array.

Resume: ${resumeText}

Return exactly:
[
  { "question": "<question>", "category": "<Technical|Behavioral|Situational|Experience>", "difficulty": "<easy|medium|hard>" }
]`;
  return parseJSON(await chat(prompt));
};

export const getInterviewFeedback = async (question, answer, role, resumeText) => {
  const prompt = `
You are an expert interviewer. Evaluate this answer. Return ONLY valid JSON.

Role: ${role}
Question: ${question}
Answer: ${answer}

Return exactly:
{
  "score": <1-10>,
  "feedback": "<2-3 sentence constructive feedback>",
  "improved_answer": "<better version in 2-3 sentences>",
  "tips": ["<tip 1>", "<tip 2>"]
}`;
  return parseJSON(await chat(prompt));
};
