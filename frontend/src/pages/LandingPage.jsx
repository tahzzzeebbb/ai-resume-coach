import { Link } from 'react-router-dom';
import { BrainCircuit, FileText, Target, MessageSquare, TrendingUp, ArrowRight, Star, Zap, Shield } from 'lucide-react';

const features = [
  { icon: FileText, title: 'AI Resume Analysis', desc: 'Get detailed scores on technical skills, projects, experience, and presentation.', color: 'bg-blue-50 text-blue-600', delay: '0ms' },
  { icon: Target, title: 'Skill Gap Detection', desc: 'Know exactly what skills you are missing for your dream role.', color: 'bg-purple-50 text-purple-600', delay: '80ms' },
  { icon: MessageSquare, title: 'Interview Simulator', desc: 'Practice with AI-generated questions and get real-time feedback.', color: 'bg-green-50 text-green-600', delay: '160ms' },
  { icon: TrendingUp, title: 'Learning Roadmap', desc: 'Get a week-by-week learning plan to close your skill gaps fast.', color: 'bg-orange-50 text-orange-600', delay: '240ms' },
];

const scores = [
  { label: 'Technical Skills', score: 85, color: 'bg-blue-500' },
  { label: 'Projects', score: 80, color: 'bg-purple-500' },
  { label: 'Experience', score: 70, color: 'bg-amber-500' },
  { label: 'Presentation', score: 75, color: 'bg-green-500' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">AI Resume Coach</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Login</Link>
          <Link to="/register" className="btn-primary text-sm flex items-center gap-1.5">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-24 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 -translate-y-1/2" />

        <div className="relative animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Powered by AI — Land your dream job faster
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Your Resume,
            <span className="gradient-text"> Supercharged</span>
            <br />by AI
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, discover skill gaps, practice interviews with AI, and get a personalized roadmap — all in one beautiful app.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              Free to use
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              AI-powered
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" />
              Instant results
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to get hired</h2>
          <p className="text-gray-500 text-lg">Four powerful tools, one platform</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card-hover animate-slideUp group cursor-default">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Score Preview */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get a detailed resume score in seconds</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Our AI analyzes every section of your resume and gives you actionable scores so you know exactly where to improve.</p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 mt-6">
              Analyze My Resume <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Score card */}
          <div className="w-full max-w-xs glass rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Resume Score</h3>
              <div className="text-3xl font-extrabold gradient-text">78</div>
            </div>
            <div className="space-y-3">
              {scores.map(({ label, score, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{score}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to land your dream job?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Free forever. No credit card required.</p>
          <Link to="/register" className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all inline-flex items-center gap-2 shadow-lg">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="text-center py-6 text-gray-400 text-sm bg-white">
        © 2024 AI Resume Coach · Built with React, Node.js & AI
      </footer>
    </div>
  );
}
