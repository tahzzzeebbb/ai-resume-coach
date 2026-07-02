// ============================================================
// MOCK AI — No API key needed! Works 100% offline.
// When you get a Gemini key later, replace this file with
// the real gemini.js from the original project.
// ============================================================

// Simulate a small delay so it feels like AI is thinking
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeResume = async (resumeText) => {
  await delay(1500);

  const hasReact = /react/i.test(resumeText);
  const hasNode = /node|express/i.test(resumeText);
  const hasPython = /python/i.test(resumeText);
  const hasDB = /mongodb|mysql|postgresql|database/i.test(resumeText);
  const hasGit = /git|github/i.test(resumeText);
  const hasProjects = /project|built|developed|created/i.test(resumeText);
  const wordCount = resumeText.split(' ').length;

  const techScore = [hasReact, hasNode, hasPython, hasDB, hasGit].filter(Boolean).length * 15 + 25;
  const projectScore = hasProjects ? 78 : 55;
  const expScore = wordCount > 300 ? 72 : 60;
  const presentScore = wordCount > 200 ? 75 : 62;
  const overall = Math.round((techScore + projectScore + expScore + presentScore) / 4);

  return {
    overallScore: Math.min(overall, 95),
    technicalSkills: Math.min(techScore, 95),
    projects: projectScore,
    experience: expScore,
    presentation: presentScore,
    summary: `Your resume demonstrates ${hasReact ? 'strong frontend skills with React' : 'foundational web development skills'}. ${hasNode ? 'Backend experience with Node.js is a great asset.' : 'Consider adding backend skills to become a full-stack developer.'} Overall presentation is ${wordCount > 250 ? 'well-structured' : 'a bit brief — consider adding more detail'}.`,
    strengths: [
      hasReact ? 'Strong React.js frontend experience' : 'Foundational HTML/CSS/JS skills',
      hasDB ? 'Database management experience' : 'Web development fundamentals',
      hasProjects ? 'Good portfolio of projects' : 'Eagerness to learn new technologies',
    ],
    weaknesses: [
      !hasNode ? 'No backend/Node.js experience mentioned' : 'Could add more backend project examples',
      !hasDB ? 'No database skills mentioned' : 'Could mention specific database achievements',
      wordCount < 300 ? 'Resume is too brief — add more detail' : 'Could quantify achievements better (e.g. "increased speed by 40%")',
    ],
    suggestions: [
      'Add measurable achievements e.g. "Reduced load time by 30%"',
      'Include a GitHub link and portfolio website URL',
      !hasNode ? 'Learn Node.js/Express to become a full-stack developer' : 'Add a full-stack project to showcase end-to-end skills',
      'Add a strong 2-line professional summary at the top',
    ],
  };
};

export const analyzeSkillGap = async (resumeText, targetRole) => {
  await delay(1500);

  const role = targetRole.toLowerCase();
  const isFullStack = /full.stack/i.test(role);
  const isFrontend = /frontend|front-end|react/i.test(role);
  const isBackend = /backend|back-end|node/i.test(role);

  const hasReact = /react/i.test(resumeText);
  const hasNode = /node/i.test(resumeText);
  const hasMongo = /mongo/i.test(resumeText);
  const hasTS = /typescript/i.test(resumeText);
  const hasDocker = /docker/i.test(resumeText);

  const existing = [];
  if (hasReact) existing.push('React.js');
  if (hasNode) existing.push('Node.js');
  if (hasMongo) existing.push('MongoDB');
  if (hasTS) existing.push('TypeScript');
  existing.push('HTML', 'CSS', 'JavaScript', 'Git');

  const missing = [];
  if (!hasReact && (isFrontend || isFullStack)) missing.push('React.js');
  if (!hasNode && (isBackend || isFullStack)) missing.push('Node.js & Express');
  if (!hasMongo && isFullStack) missing.push('MongoDB / Database Design');
  if (!hasTS) missing.push('TypeScript');
  if (!hasDocker) missing.push('Docker & Deployment');
  missing.push('REST API Design', 'System Design basics');

  return {
    existingSkills: existing,
    missingSkills: missing.slice(0, 6),
    learningRoadmap: [
      {
        week: 1,
        topic: missing[0] || 'TypeScript fundamentals',
        resources: ['Official Docs', 'YouTube - Traversy Media', 'freeCodeCamp']
      },
      {
        week: 2,
        topic: missing[1] || 'REST API Design',
        resources: ['The Odin Project', 'YouTube - Net Ninja', 'MDN Web Docs']
      },
      {
        week: 3,
        topic: missing[2] || 'Database & MongoDB',
        resources: ['MongoDB University (Free)', 'Mongoose Docs', 'YouTube - Web Dev Simplified']
      },
      {
        week: 4,
        topic: 'Build a full project + deploy on Vercel/Render',
        resources: ['Vercel Docs', 'Render.com', 'GitHub Pages']
      },
    ],
  };
};

export const generateInterviewQuestions = async (resumeText, role, count = 10) => {
  await delay(1000);

  const isReact = /react/i.test(resumeText) || /react/i.test(role);
  const isNode = /node/i.test(resumeText) || /node/i.test(role);
  const isFullStack = /full.stack/i.test(role);

  const questions = [
    { question: `Tell me about yourself and your journey into ${role} development.`, category: 'Behavioral', difficulty: 'easy' },
    { question: 'Walk me through your most challenging project. What problems did you solve?', category: 'Experience', difficulty: 'medium' },
    { question: isReact ? 'Explain the difference between useState and useEffect in React.' : 'Explain the difference between let, const, and var in JavaScript.', category: 'Technical', difficulty: 'medium' },
    { question: isNode ? 'How does Node.js handle asynchronous operations? Explain event loop.' : 'What is the difference between synchronous and asynchronous JavaScript?', category: 'Technical', difficulty: 'hard' },
    { question: 'How do you ensure your code is clean and maintainable?', category: 'Behavioral', difficulty: 'medium' },
    { question: isReact ? 'What are React hooks and why were they introduced?' : 'What is the DOM and how does JavaScript interact with it?', category: 'Technical', difficulty: 'medium' },
    { question: 'Tell me about a time you worked in a team and faced a conflict. How did you handle it?', category: 'Behavioral', difficulty: 'easy' },
    { question: 'What is REST API? Have you built or consumed any APIs?', category: 'Technical', difficulty: 'medium' },
    { question: 'Where do you see yourself in 3 years as a developer?', category: 'Situational', difficulty: 'easy' },
    { question: isFullStack ? 'Explain the full flow of a web request from browser to database and back.' : 'What tools do you use for debugging JavaScript code?', category: 'Technical', difficulty: 'hard' },
    { question: 'How do you stay updated with new technologies?', category: 'Behavioral', difficulty: 'easy' },
    { question: 'What is your experience with version control (Git)? Describe your workflow.', category: 'Technical', difficulty: 'easy' },
    { question: 'Describe a situation where you had to learn something quickly. How did you approach it?', category: 'Situational', difficulty: 'medium' },
    { question: 'What is the difference between SQL and NoSQL databases?', category: 'Technical', difficulty: 'medium' },
    { question: 'How do you handle feedback and code reviews?', category: 'Behavioral', difficulty: 'easy' },
  ];

  return questions.slice(0, count);
};

export const getInterviewFeedback = async (question, answer, role) => {
  await delay(1000);

  const wordCount = answer.split(' ').length;
  const hasExample = /for example|for instance|i built|i worked|i created|i developed|when i/i.test(answer);
  const isTooShort = wordCount < 20;
  const isGood = wordCount > 50 && hasExample;

  const score = isTooShort ? Math.floor(Math.random() * 3) + 3
    : isGood ? Math.floor(Math.random() * 2) + 8
    : Math.floor(Math.random() * 3) + 5;

  const feedbacks = {
    low: [
      'Your answer is too brief. Try to elaborate with specific examples from your experience.',
      'Good start, but interviewers expect more detail. Use the STAR method: Situation, Task, Action, Result.',
    ],
    mid: [
      'Decent answer! Adding a real project example would make it much stronger.',
      'Good response. Try to quantify your impact — numbers make answers memorable.',
    ],
    high: [
      'Excellent answer! You gave a clear, specific example which is exactly what interviewers want.',
      'Very strong response! You demonstrated both knowledge and practical experience.',
    ],
  };

  const feedbackList = isTooShort ? feedbacks.low : isGood ? feedbacks.high : feedbacks.mid;
  const feedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];

  return {
    score,
    feedback,
    improved_answer: `A stronger answer would start with a brief direct response, then give a specific example: "In my [project name], I faced [challenge] and solved it by [action], which resulted in [outcome]."`,
    tips: [
      'Use the STAR method: Situation → Task → Action → Result',
      'Always back up your answer with a real project or experience',
    ],
  };
};
