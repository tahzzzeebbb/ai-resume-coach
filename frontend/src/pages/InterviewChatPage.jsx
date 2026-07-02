import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Send, Loader2, Bot, User, Trophy,
  Star, Lightbulb, CheckCircle
} from 'lucide-react';

// Render markdown-ish text with bold and line breaks
const MessageContent = ({ content }) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </div>
  );
};

const ScoreBadge = ({ score }) => {
  const color = score >= 8 ? 'bg-green-100 text-green-700' : score >= 6 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      <Star className="w-3 h-3" /> {score}/10
    </span>
  );
};

export default function InterviewChatPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState({});
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    api.get(`/interview/${id}`)
      .then(res => setSession(res.data.session))
      .catch(() => toast.error('Failed to load session'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSubmit = async () => {
    if (!answer.trim() || submitting) return;
    if (session?.status === 'completed') return toast.error('This interview is already complete.');

    setSubmitting(true);
    try {
      const res = await api.post(`/interview/${id}/answer`, { answer: answer.trim() });
      setSession(res.data.session);
      setAnswer('');
      textareaRef.current?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleFeedback = (idx) => {
    setShowFeedback(f => ({ ...f, [idx]: !f[idx] }));
  };

  const questionCount = session?.messages.filter(m => m.role === 'user').length || 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  if (!session) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Session not found.</p>
      <Link to="/interview" className="btn-primary mt-4 inline-block">Back</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <Link to="/interview" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">{session.role} Interview</h1>
          <p className="text-xs text-gray-500">
            {session.status === 'completed'
              ? `Completed · Score: ${session.overallScore}/100`
              : `Question ${questionCount + 1} of 5`}
          </p>
        </div>
        {session.status === 'active' && (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className={`w-2 h-2 rounded-full ${n <= questionCount ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        )}
        {session.status === 'completed' && session.overallScore && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
            session.overallScore >= 75 ? 'bg-green-100 text-green-700' :
            session.overallScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            <Trophy className="w-4 h-4" />
            {session.overallScore}/100
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {session.messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-gray-200'
            }`}>
              {msg.role === 'assistant'
                ? <Bot className="w-4 h-4 text-white" />
                : <User className="w-4 h-4 text-gray-600" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'assistant'
                  ? 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'
                  : 'bg-indigo-600 text-white rounded-tr-sm'
              }`}>
                <MessageContent content={msg.content} />
              </div>

              {/* User message: show score badge & feedback toggle */}
              {msg.role === 'user' && msg.score && (
                <div className="flex items-center gap-2">
                  <ScoreBadge score={msg.score} />
                  <button
                    onClick={() => toggleFeedback(idx)}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" />
                    {showFeedback[idx] ? 'Hide' : 'View'} feedback
                  </button>
                </div>
              )}

              {/* Feedback panel */}
              {msg.role === 'user' && showFeedback[idx] && msg.feedback && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm max-w-sm">
                  <p className="font-medium text-amber-800 mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Feedback
                  </p>
                  <p className="text-amber-700">{msg.feedback}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {submitting && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Completed state */}
      {session.status === 'completed' ? (
        <div className="flex-shrink-0 card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Interview Complete!</p>
              <p className="text-sm text-gray-600">Final Score: <span className="font-bold text-indigo-600">{session.overallScore}/100</span></p>
            </div>
            <Link to="/interview" className="btn-primary text-sm">
              New Interview
            </Link>
          </div>
        </div>
      ) : (
        /* Input area */
        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-xl p-3">
          <textarea
            ref={textareaRef}
            rows={3}
            className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            placeholder="Type your answer here… (Press Enter to submit, Shift+Enter for new line)"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">{answer.length > 0 ? `${answer.length} chars` : 'Be detailed in your answers for better feedback'}</p>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Analyzing...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
