import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MessageSquare, FileText, Loader2, ChevronRight, Clock, Trophy } from 'lucide-react';

const popularRoles = [
  'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'React Developer', 'Node.js Developer', 'Python Developer',
  'Data Scientist', 'DevOps Engineer', 'UI/UX Designer', 'Product Manager'
];

export default function InterviewPage() {
  const [role, setRole] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [resumes, setResumes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/resume/my-resumes'),
      api.get('/interview/sessions')
    ]).then(([r, s]) => {
      setResumes(r.data.resumes);
      setSessions(s.data.sessions);
    }).catch(() => {});
  }, []);

  const handleStart = async () => {
    if (!role.trim()) return toast.error('Please enter a role');
    setLoading(true);
    try {
      const res = await api.post('/interview/start', {
        role,
        resumeId: resumeId || undefined
      });
      navigate(`/interview/${res.data.session._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Interview Coach</h1>
        <p className="text-gray-500 mt-1">Practice with an AI interviewer and get real-time feedback on every answer.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Start new session */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" /> Start New Interview
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Role *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. React Developer, Backend Engineer..."
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
            </div>

            {/* Quick role chips */}
            <div className="flex flex-wrap gap-2">
              {popularRoles.slice(0, 6).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    role === r
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Attach resume */}
            {resumes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach Resume <span className="text-gray-400 font-normal">(optional — improves question quality)</span>
                </label>
                <select
                  className="input"
                  value={resumeId}
                  onChange={e => setResumeId(e.target.value)}
                >
                  <option value="">No resume</option>
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.fileName}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading || !role.trim()}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Starting…</>
              ) : (
                <><MessageSquare className="w-4 h-4" /> Start Interview</>
              )}
            </button>
          </div>

          {/* How it works */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">How it works</p>
            <div className="space-y-2">
              {[
                'AI asks you 5 interview questions',
                'You type your answers',
                'Get instant score & feedback',
                'See improved answer suggestions',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Past sessions */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" /> Past Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No sessions yet. Start your first interview!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sessions.map(session => (
                <button
                  key={session._id}
                  onClick={() => navigate(`/interview/${session._id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{session.role}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {session.status}
                      </span>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {session.overallScore && (
                      <p className={`text-lg font-bold ${scoreColor(session.overallScore)}`}>
                        {session.overallScore}
                      </p>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
