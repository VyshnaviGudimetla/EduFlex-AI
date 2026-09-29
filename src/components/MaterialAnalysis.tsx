import React from 'react';
import {
  Brain,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ListOrdered,
  BookOpen,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { MaterialAnalysis, MaterialItem } from '../types';

interface MaterialAnalysisProps {
  analysis: MaterialAnalysis | null;
  activeMaterial: MaterialItem | null;
  onStartTest: () => void;
  onAskChat: () => void;
}

export const MaterialAnalysisView: React.FC<MaterialAnalysisProps> = ({
  analysis,
  activeMaterial,
  onStartTest,
  onAskChat
}) => {
  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Brain className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Study Material Analyzed Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please upload a PDF notes file or load a sample document from the Upload section to view AI topic analysis.
        </p>
      </div>
    );
  }

  const { priorities, summaries, keyConcepts, recommendedOrder, examTips } = analysis;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Source Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>AI Syllabus & Material Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeMaterial?.title || 'Uploaded Document'} Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Subject: <strong>{activeMaterial?.subject || 'Academic'}</strong> | Grounded in student uploaded notes
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onAskChat}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <span>Ask EduFlex 🤖</span>
          </button>
          <button
            onClick={onStartTest}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Generate Test from Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clearly labeled AI Recommendation notice */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-2.5 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong>Transparency Notice:</strong> All topic priorities, summaries, and revision orders displayed below are <em>AI recommendations</em> synthesized directly from your uploaded material. EduFlex AI does not claim external board exam weighting unless explicitly present in your study text.
        </p>
      </div>

      {/* Priority Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* High Priority */}
        <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <h3 className="text-sm font-black uppercase tracking-wider text-red-900">
              HIGH PRIORITY (AI Recommended)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Foundational concepts with highest recurrence and mathematical/architectural depth.
          </p>
          <div className="space-y-2 pt-1">
            {priorities?.high?.map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-red-50/70 border border-red-200 text-xs font-bold text-red-950 flex items-center justify-between"
              >
                <span>{t}</span>
                <Flame className="w-3.5 h-3.5 text-red-500" />
              </div>
            )) || <p className="text-xs text-slate-400">None detected</p>}
          </div>
        </div>

        {/* Medium Priority */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-900">
              MEDIUM PRIORITY
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Core functional protocols and comparison frameworks.
          </p>
          <div className="space-y-2 pt-1">
            {priorities?.medium?.map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between"
              >
                <span>{t}</span>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              </div>
            )) || <p className="text-xs text-slate-400">None detected</p>}
          </div>
        </div>

        {/* Quick Revision */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h3 className="text-sm font-black uppercase tracking-wider text-emerald-900">
              QUICK REVISION
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Theoretical overviews, geometry, and high-level definitions.
          </p>
          <div className="space-y-2 pt-1">
            {priorities?.quickRevision?.map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-950 flex items-center justify-between"
              >
                <span>{t}</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            )) || <p className="text-xs text-slate-400">None detected</p>}
          </div>
        </div>
      </div>

      {/* Recommended Study Order Sequence */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2">
          <ListOrdered className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Recommended Study Order (AI Pedagogical Sequence)
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Sequenced to build prerequisite conceptual foundations before tackling complex multi-variable protocols.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 pt-2">
          {recommendedOrder?.map((topic, i) => (
            <React.Fragment key={topic}>
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-950">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  {i + 1}
                </span>
                <span>{topic}</span>
              </div>
              {i < (recommendedOrder.length - 1) && (
                <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Key Concepts Extracted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Frequently Important Concepts</span>
          </h3>
          <ul className="space-y-2.5">
            {keyConcepts?.map((c, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-1.5"></span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topic Summaries */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Topic Summaries</span>
          </h3>
          <div className="space-y-3">
            {summaries?.map((s, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-900">{s.topic}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
