import { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

export default function SplashScreen({ onDone }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-600 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated rings */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border-4 border-white/20 animate-ping" />
        <div className="absolute w-24 h-24 rounded-full border-4 border-white/30 animate-pulse" />
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
          <BrainCircuit className="w-11 h-11 text-indigo-600" />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">AI Resume Coach</h1>
      <p className="text-indigo-200 text-sm font-medium">Your career, powered by AI</p>

      {/* Loading bar */}
      <div className="mt-10 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-[loading_1.8s_ease-in-out_forwards]" />
      </div>

      <style>{`
        @keyframes loading {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
}
