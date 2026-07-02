import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, FileText, X, CheckCircle, Loader2, Sparkles, Shield, Zap } from 'lucide-react';

const steps = [
  { label: 'Extracting text from PDF', icon: FileText },
  { label: 'Analyzing resume content', icon: Sparkles },
  { label: 'Scoring each section', icon: Zap },
  { label: 'Generating insights & tips', icon: CheckCircle },
];

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) return toast.error('Only PDF files under 5MB are allowed');
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF file');
    setLoading(true);
    setStep(0);
    const interval = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 2500);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      clearInterval(interval);
      toast.success('Resume analyzed! ✨');
      navigate(`/resume/${res.data.resume._id}`);
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.message || 'Upload failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Your Resume</h1>
        <p className="text-gray-500 mt-1">Get instant AI-powered analysis, scores, and improvement tips.</p>
      </div>

      {!loading ? (
        <div className="space-y-4">
          {/* Dropzone */}
          <div {...getRootProps()} className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 group
            ${isDragActive
              ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 bg-white'}
          `}>
            <input {...getInputProps()} />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${isDragActive ? 'bg-indigo-100 scale-110' : 'bg-gray-100 group-hover:bg-indigo-50 group-hover:scale-105'}`}>
              <Upload className={`w-8 h-8 transition-colors ${isDragActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`} />
            </div>
            {isDragActive ? (
              <p className="text-indigo-600 font-semibold text-lg">Drop it here!</p>
            ) : (
              <>
                <p className="text-gray-800 font-semibold text-lg mb-1">Drag & drop your resume</p>
                <p className="text-gray-400 text-sm mb-4">or click to browse your files</p>
                <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full">
                  <Shield className="w-3 h-3" /> PDF only · Max 5MB · Private & secure
                </span>
              </>
            )}
          </div>

          {/* Selected file */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-800 truncate">{file.name}</p>
                <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB · Ready to analyze</p>
              </div>
              <button onClick={() => setFile(null)} className="text-green-500 hover:text-green-700 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <button onClick={handleUpload} disabled={!file}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Analyze with AI
          </button>

          {/* What you get */}
          <div className="card mt-2">
            <p className="text-sm font-semibold text-gray-700 mb-3">What you'll get instantly:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                '✅ Overall resume score',
                '✅ Section breakdown',
                '✅ Strengths & weaknesses',
                '✅ Actionable suggestions',
                '✅ Skill gap analysis',
                '✅ Learning roadmap',
              ].map(item => <p key={item} className="text-sm text-gray-600">{item}</p>)}
            </div>
          </div>
        </div>
      ) : (
        /* Loading state */
        <div className="card text-center py-16 animate-fadeIn">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            <div className="absolute inset-3 bg-indigo-50 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Analyzing your resume…</h3>
          <p className="text-gray-400 text-sm mb-8">This takes about 15–30 seconds</p>
          <div className="max-w-xs mx-auto space-y-3 text-left">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < step ? 'bg-green-100' : i === step ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  {i < step
                    ? <CheckCircle className="w-4 h-4 text-green-600" />
                    : i === step
                    ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    : <Icon className="w-4 h-4 text-gray-400" />}
                </div>
                <span className={i <= step ? 'text-gray-800 font-medium' : 'text-gray-400'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
