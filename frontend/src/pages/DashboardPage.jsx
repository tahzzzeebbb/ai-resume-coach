import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FileText, MessageSquare, Upload, TrendingUp, ChevronRight, Clock, Sparkles, Trophy } from 'lucide-react';

const ScoreRing = ({ score }) => {
  const r = 28, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 36 36)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="36" y="36" textAnchor="middle" dy="0.35em" fontSize="13" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/resume/my-resumes'), api.get('/interview/sessions')])
      .then(([r, s]) => { setResumes(r.data.resumes); setSessions(s.data.sessions); })
      .finally(() => setLoading(false));
  }, []);

  const avgScore = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + (r.analysis?.overallScore || 0), 0) / resumes.length)
    : 0;

  const stats = [
    { label: 'Resumes Analyzed', value: resumes.length, icon: FileText, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Interview Sessions', value: sessions.length, icon: MessageSquare, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Avg Resume Score', value: avgScore || '—', icon: TrendingUp, color: 'from-green-500 to-green-600', bg: 'bg-green-50', text: 'text-green-600' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-1">
          <Sparkles className="w-4 h-4" /> AI Resume Coach
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Track your progress and keep improving.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger">
        {stats.map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="card animate-slideUp hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${text}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link to="/upload" className="group relative overflow-hidden card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 relative">
            <p className="font-semibold text-gray-900">Upload Resume</p>
            <p className="text-sm text-gray-500">Get AI analysis & score instantly</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>

        <Link to="/interview" className="group relative overflow-hidden card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 relative">
            <p className="font-semibold text-gray-900">Practice Interview</p>
            <p className="text-sm text-gray-500">AI interviewer with live feedback</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </Link>
      </div>

      {/* Recent Resumes */}
      {loading ? (
        <div className="card space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : resumes.length > 0 ? (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Recent Resumes
            </h2>
            <Link to="/upload" className="text-sm text-indigo-600 hover:underline font-medium">+ Upload new</Link>
          </div>
          <div className="space-y-2">
            {resumes.slice(0, 4).map((resume, i) => (
              <Link key={resume._id} to={`/resume/${resume._id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group animate-slideUp"
                style={{ animationDelay: `${i * 60}ms` }}>
                <ScoreRing score={resume.analysis?.overallScore || 0} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{resume.fileName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(resume.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-16 border-dashed border-2">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No resumes yet</h3>
          <p className="text-gray-500 text-sm mb-5">Upload your first resume to get AI-powered feedback</p>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Resume
          </Link>
        </div>
      )}
    </div>
  );
}
