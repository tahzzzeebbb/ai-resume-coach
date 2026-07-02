# 🤖 AI Resume & Interview Coach

A full-stack AI-powered app that analyzes resumes, detects skill gaps, generates interview questions, and simulates live interviews with real-time feedback.

**Tech Stack:** React · Tailwind CSS · Node.js · Express · MongoDB · Google Gemini AI · Vercel · Render

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 Resume Upload | Upload PDF, AI extracts & analyzes text |
| 🎯 Resume Score | Overall score + Technical, Projects, Experience, Presentation |
| 💡 AI Analysis | Strengths, weaknesses, and actionable suggestions |
| 🔍 Skill Gap | Missing skills for any target role |
| 🗺️ Learning Roadmap | Week-by-week plan to close skill gaps |
| ❓ Interview Questions | AI-generated questions tailored to your resume |
| 🎤 Interview Simulator | Live chat with AI, real-time score & feedback per answer |

---

## 🚀 Local Setup (Step by Step)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

---

### Step 1 — Clone and install

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-resume-coach.git
cd ai-resume-coach

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

---

### Step 2 — Set up environment variables

**Backend** — create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-coach
JWT_SECRET=your_very_long_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

**Frontend** — create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3 — Run the app

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Server starts at http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## ☁️ Deployment

### Backend → Render (Free)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
7. Click **Deploy** → copy the URL (e.g. `https://ai-resume-coach-api.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:
   - `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Click **Deploy**

---

## 📁 Project Structure

```
ai-resume-coach/
├── backend/
│   ├── server.js              # Express entry point
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Resume.js
│   │   │   └── InterviewSession.js
│   │   ├── routes/
│   │   │   ├── auth.js        # Register, Login, Me
│   │   │   ├── resume.js      # Upload, Analyze, Skill Gap, Questions
│   │   │   └── interview.js   # Start session, Submit answer
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT protect middleware
│   │   └── utils/
│   │       └── gemini.js      # All Gemini AI functions
│   └── uploads/               # Temp PDF storage
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── ResumeDetailPage.jsx
    │   │   ├── InterviewPage.jsx
    │   │   └── InterviewChatPage.jsx
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── utils/
    │       └── api.js
    └── vite.config.js
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/resume/upload` | ✅ | Upload & analyze PDF |
| GET | `/api/resume/my-resumes` | ✅ | List user resumes |
| GET | `/api/resume/:id` | ✅ | Get resume detail |
| POST | `/api/resume/:id/skill-gap` | ✅ | Run skill gap analysis |
| POST | `/api/resume/:id/questions` | ✅ | Generate interview questions |
| DELETE | `/api/resume/:id` | ✅ | Delete resume |
| POST | `/api/interview/start` | ✅ | Start interview session |
| POST | `/api/interview/:id/answer` | ✅ | Submit answer, get feedback |
| GET | `/api/interview/sessions` | ✅ | List user sessions |
| GET | `/api/interview/:id` | ✅ | Get session detail |

---

## 🛠️ Getting a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click **Get API Key** → **Create API Key**
4. Copy the key into your `backend/.env`

---

## 📸 Screenshots

| Landing | Dashboard | Resume Analysis |
|---|---|---|
| Hero page with features | Stats + recent resumes | Score ring + skill breakdown |

| Skill Gap | Interview Chat |
|---|---|
| Missing skills + roadmap | Live AI interview simulator |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use and modify.
