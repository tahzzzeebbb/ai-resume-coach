import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, TrendingUp, Target, MessageSquare, CheckCircle,
  XCircle, Lightbulb, ChevronDown, ChevronUp, Loader2, BookOpen, Calendar
} from 'lucide-react';

const ScoreBar = ({ label, score, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{score}/100</span>
    </div>
    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const ScoreRing = ({ score }) => {
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <text x="50" y="50" textAnchor="middle" dy="0.35em" fontSize="18" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700'
};

export default function ResumeDetailPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');

  // Skill gap state
  const [targetRole, setTargetRole] = useState('');
  const [skillGapLoading, setSkillGapLoading] = useState(false);

  // Questions state
  const [qRole, setQRole] = useState('');
  const [qCount, setQCount] = useState(10);
  const [qLoading, setQLoading] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    api.get(`/resume/${id}`)
      .then(res => setResume(res.data.resume))
      .catch(() => toast.error('Failed to load resume'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSkillGap = async () => {
    if (!targetRole.trim()) return toast.error('Enter a target role');
    setSkillGapLoading(true);
    try {
      const res = await api.post(`/resume/${id}/skill-gap`, { targetRole });
      setResume(r => ({ ...r, skillGap: res.data.skillGap }));
      toast.success('Skill gap analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setSkillGapLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!qRole.trim()) return toast.error('Enter a role for questions');
    setQLoading(true);
    try {
      const res = await api.post(`/resume/${id}/questions`, { role: qRole, count: qCount });
      setResume(r => ({ ...r, interviewQuestions: res.data.questions }));
      toast.success(`${res.data.questions.length} questions generated!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setQLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  if (!resume) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Resume not found.</p>
      <Link to="/dashboard" className="btn-primary mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );

  const { analysis, skillGap, interviewQuestions } = resume;
  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'skillgap', label: 'Skill Gap', icon: Target },
    { id: 'questions', label: 'Interview Questions', icon: MessageSquare },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{resume.fileName}</h1>
          <p className="text-sm text-gray-500">Analyzed {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/interview" className="btn-primary text-sm">
          Practice Interview →
        </Link>
      </div>

      {/* Score Overview */}
      <div className="card mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <ScoreRing score={analysis?.overallScore || 0} />
          <p className="text-center text-sm text-gray-500 mt-1">Overall Score</p>
        </div>
        <div className="flex-1 w-full space-y-3">
          <ScoreBar label="Technical Skills" score={analysis?.technicalSkills || 0} color="bg-blue-500" />
          <ScoreBar label="Projects" score={analysis?.projects || 0} color="bg-purple-500" />
          <ScoreBar label="Experience" score={analysis?.experience || 0} color="bg-amber-500" />
          <ScoreBar label="Presentation" score={analysis?.presentation || 0} color="bg-green-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Analysis */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> AI Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{analysis?.summary}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Strengths
              </h3>
              <ul className="space-y-2">
                {analysis?.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" /> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis?.weaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500" /> Actionable Suggestions
            </h3>
            <ol className="space-y-3">
              {analysis?.suggestions?.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Tab: Skill Gap */}
      {activeTab === 'skillgap' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-1">Analyze Skill Gap</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your target role to see what skills you're missing.</p>
            <div className="flex gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="e.g. Junior Full-Stack Developer, React Engineer..."
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSkillGap()}
              />
              <button
                onClick={handleSkillGap}
                disabled={skillGapLoading}
                className="btn-primary flex items-center gap-2 flex-shrink-0"
              >
                {skillGapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                {skillGapLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {skillGap?.targetRole && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Your Existing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.existingSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" /> Missing Skills for {skillGap.targetRole}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.missingSkills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Roadmap */}
              {skillGap.learningRoadmap?.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" /> Learning Roadmap
                  </h3>
                  <div className="space-y-4">
                    {skillGap.learningRoadmap.map((week, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            W{week.week}
                          </div>
                          {i < skillGap.learningRoadmap.length - 1 && (
                            <div className="w-0.5 bg-indigo-100 flex-1 mt-2" />
                          )}
                        </div>
                        <div className="pb-4 flex-1">
                          <p className="font-medium text-gray-900 mb-1">{week.topic}</p>
                          <div className="flex flex-wrap gap-1">
                            {week.resources?.map((r, j) => (
                              <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                <BookOpen className="w-3 h-3 inline mr-1" />{r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Interview Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-1">Generate Interview Questions</h3>
            <p className="text-sm text-gray-500 mb-4">AI will generate targeted questions based on your resume.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="input flex-1"
                placeholder="e.g. React Developer, Backend Engineer..."
                value={qRole}
                onChange={e => setQRole(e.target.value)}
              />
              <select
                className="input w-full sm:w-32"
                value={qCount}
                onChange={e => setQCount(Number(e.target.value))}
              >
                {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} questions</option>)}
              </select>
              <button
                onClick={handleGenerateQuestions}
                disabled={qLoading}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {qLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                {qLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {interviewQuestions?.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{interviewQuestions.length} Questions Generated</h3>
                <Link to="/interview" className="btn-primary text-sm">
                  Practice Live →
                </Link>
              </div>
              <div className="space-y-2">
                {interviewQuestions.map((q, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-800 font-medium truncate">{q.question}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 hidden sm:inline">
                          {q.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                        {expandedQ === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>
                    {expandedQ === i && (
                      <div className="px-4 pb-4 pt-0 bg-gray-50 border-t border-gray-100">
                        <p className="text-sm text-gray-700 font-medium">{q.question}</p>
                        <p className="text-xs text-gray-500 mt-2">Category: {q.category} · Difficulty: {q.difficulty}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
