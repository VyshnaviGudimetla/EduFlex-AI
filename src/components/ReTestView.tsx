import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ReTestViewProps {
  student: StudentProfile | null;
  onLaunchReTestModal: () => void;
  onNavigateToGraphs: () => void;
  onNavigateToPlanner: () => void;
}

export const ReTestView: React.FC<ReTestViewProps> = ({
  student,
  onLaunchReTestModal,
  onNavigateToGraphs,
  onNavigateToPlanner
}) => {
  // Fire confetti when reaching celebratory state
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const comparisons = [
    {
      topic: 'Loops',
      before: 40,
      after: 82,
      delta: '+42%',
      status: 'Critical Gap -> Improving Mastery',
      highlight: true
    },
    {
      topic: 'Functions',
      before: 55,
      after: 75,
      delta: '+20%',
      status: 'Needs Attention -> Strong Foundation',
      highlight: true
    },
    {
      topic: 'Variables',
      before: 90,
      after: 92,
      delta: '+2%',
      status: 'Sustained Mastery',
      highlight: false
    },
    {
      topic: 'Conditions',
      before: 85,
      after: 88,
      delta: '+3%',
      status: 'Sustained Mastery',
      highlight: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Celebration Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Targeted Re-Test Completed</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            "Great improvement!" 🎉
          </h2>

          <p className="text-sm text-emerald-50 leading-relaxed">
            Your personalized study schedule and adaptive drills directly closed your 2 learning gaps. Loops accelerated from <strong className="text-amber-200">40% to 82%</strong>!
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 flex items-center space-x-1 shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>+250 Points Awarded</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/20 text-white flex items-center space-x-1">
              <span>🥈 Silver Medal Retained & Upgrading</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/20 text-white flex items-center space-x-1">
              <span>📈 Big Improvement Badge Unlocked!</span>
            </span>
          </div>
        </div>
      </div>

      {/* Before vs After Topic Comparison Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Diagnostic vs Re-Test Mastery Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Direct verification of score gains across targeted topics
            </p>
          </div>
          <button
            onClick={onLaunchReTestModal}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-take Assessment Again</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisons.map((item) => (
            <div
              key={item.topic}
              className={`p-6 rounded-2xl bg-white border transition-all ${
                item.highlight
                  ? 'border-emerald-300 shadow-md ring-2 ring-emerald-500/10'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-slate-900">{item.topic}</span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.delta} Gain
                </span>
              </div>

              {/* Before vs After Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                    <span>Before (Diagnostic)</span>
                    <span className="font-bold text-slate-700">{item.before}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${item.before}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-emerald-700 mb-1 font-bold">
                    <span>After (Personalized Learning)</span>
                    <span className="font-black text-emerald-800">{item.after}%</span>
                  </div>
                  <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${item.after}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{item.status}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatic Plan & Recommendation Update Notice */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personalized Learning Path Automatically Updated
            </h3>
            <p className="text-xs text-slate-500">
              Because Loops & Functions are now resolved, your schedule shifts to advanced problem solving and mock tests.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onNavigateToGraphs}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Updated Progress Graphs</span>
          </button>

          <button
            onClick={onNavigateToPlanner}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Updated Weekly Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
