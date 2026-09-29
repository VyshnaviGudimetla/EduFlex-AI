import React from 'react';
import {
  Sparkles,
  Upload,
  Play,
  Eye,
  CheckCircle2,
  ArrowRight,
  Brain,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';

interface LandingPageProps {
  onStartLearning: () => void;
  onUploadClick: () => void;
  onViewDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onUploadClick,
  onViewDemo
}) => {
  const steps = [
    { num: '01', title: 'Upload Study Material', desc: 'PDF notes, handouts or subject docs' },
    { num: '02', title: 'AI Topic Detection', desc: 'Identifies topics, priorities & summaries' },
    { num: '03', title: 'Diagnostic Assessment', desc: 'Evaluates baseline understanding' },
    { num: '04', title: 'Gap Detection & Advice', desc: 'Catches critical weak concepts' },
    { num: '05', title: 'Adaptive Practice', desc: 'Difficulty climbs or eases dynamically' },
    { num: '06', title: 'Targeted Re-Test', desc: 'Verify score jumps (+42%) & earn medals' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
            <span>Next-Generation Personalized Exam Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            EduFlex AI
          </h1>

          <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
            "Your Pace. Your Path. Your Reward."
          </p>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An AI-powered learning assistant that transforms your study materials into a personalized learning experience.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={onUploadClick}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Study Material</span>
            </button>

            <button
              onClick={onStartLearning}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md shadow-slate-300 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Learning</span>
            </button>

            <button
              onClick={onViewDemo}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50/50 text-indigo-700 font-semibold text-sm border-2 border-indigo-200 hover:border-indigo-300 shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              <span>View Demo (Vyshnavi's Journey)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Demo Baseline</span>
              <p className="text-lg font-bold text-slate-900">78% Overall</p>
              <span className="text-[11px] text-amber-600 font-semibold">2 gaps detected</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Target Re-Test</span>
              <p className="text-lg font-bold text-emerald-600">84% (+42% jump)</p>
              <span className="text-[11px] text-emerald-700 font-semibold">Loops 40% → 82%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Gamification</span>
              <p className="text-lg font-bold text-indigo-700">850 → 1100 pts</p>
              <span className="text-[11px] text-indigo-600 font-semibold">Silver 🥈 Medal</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">Intelligence</span>
              <p className="text-lg font-bold text-purple-700">Grounded AI</p>
              <span className="text-[11px] text-purple-600 font-semibold">Strictly in your PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Learning Cycle */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            The EduFlex Closed-Loop Learning Process
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Not just a chatbot. Real personalization driven by diagnostic testing, performance gap analysis, and adaptive mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-indigo-200 group-hover:text-indigo-600 transition-colors">
                  {step.num}
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Architectural Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
              Engineering Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Built for Real Students & Rigorous Exams
            </h2>
            <p className="text-sm text-slate-300">
              Supporting both Technical Learning (Python, Java, SQL, Data Structures) and Academic Learning (Computer Networks, DBMS, Mathematics).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold">Grounded Material Chat</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Ask EduFlex 🤖" answers strictly from your notes. If a concept is missing, it explicitly informs you rather than hallucinating answers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold">Adaptive Mastery Engine</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Difficulty scales Easy → Medium → Hard when answering correctly, or steps down with explanations and examples when struggling.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold">Offline-Friendly Mode</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stores your tests, notes, study planner, and charts locally with SQLite fallback so you can study anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
