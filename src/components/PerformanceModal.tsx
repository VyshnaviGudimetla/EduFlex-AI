import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar,
  X,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';
import { TestAttemptResult } from '../types';

interface PerformanceModalProps {
  result: TestAttemptResult;
  onClose: () => void;
  onNavigateToAdaptive: () => void;
  onNavigateToPlanner: () => void;
  onNavigateToReTest: () => void;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
  result,
  onClose,
  onNavigateToAdaptive,
  onNavigateToPlanner,
  onNavigateToReTest
}) => {
  const {
    score,
    earnedMarks,
    totalMarks,
    medal,
    pointsAwarded,
    newTotalPoints,
    topicScores,
    strongTopics,
    improvingTopics,
    needsAttentionTopics,
    gapsDetectedCount,
    learningGaps,
    unlockedBadge,
    message
  } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100">
              AI Performance Analysis
            </span>
            <span className="text-xs text-indigo-200">Test Completed</span>
          </div>

          <h2 className="text-2xl font-extrabold">{message}</h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            EduFlex AI evaluated your responses and identified specific mastery patterns.
          </p>
        </div>

        {/* Score & Rewards Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Score
            </span>
            <span className="text-2xl font-black text-indigo-600">{score}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {earnedMarks}/{totalMarks} marks
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Points Awarded
            </span>
            <span className="text-2xl font-black text-emerald-600">+{pointsAwarded}</span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              Total: {newTotalPoints} pts
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Current Medal
            </span>
            <div className="text-2xl flex items-center justify-center space-x-1">
              <span>{medal === 'Gold' ? '🥇' : medal === 'Silver' ? '🥈' : '🥉'}</span>
              <span className="text-base font-bold text-slate-800">{medal}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Tier Award</span>
          </div>
        </div>

        {/* Unlocked Special Badge Notice (If unlocked) */}
        {unlockedBadge && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-center space-x-3">
            <span className="text-3xl">{unlockedBadge.icon}</span>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 block">
                🎉 New Special Badge Unlocked!
              </span>
              <h4 className="text-sm font-bold">{unlockedBadge.title}</h4>
              <p className="text-xs text-amber-900 mt-0.5">{unlockedBadge.description}</p>
            </div>
          </div>
        )}

        {/* Topic-Wise Breakdown */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Topic-Wise Scores & Categorization
            </h3>
            {gapsDetectedCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                AI detected {gapsDetectedCount} learning gap{gapsDetectedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {Object.entries(topicScores).map(([t, val]) => {
              const status = val >= 80 ? 'Strong' : val >= 60 ? 'Improving' : 'Needs Attention';
              const colorClass =
                status === 'Strong'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : status === 'Improving'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900';

              const barColor =
                status === 'Strong'
                  ? 'bg-emerald-500'
                  : status === 'Improving'
                  ? 'bg-amber-500'
                  : 'bg-red-500';

              return (
                <div key={t} className={`p-3 rounded-xl border ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{t}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black">{val}%</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-white/70">
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${val}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Gaps Advice */}
          {learningGaps.length > 0 && (
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Personalized Remediation Advice:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-red-800">
                {learningGaps.map((gap, i) => (
                  <li key={i}>
                    • <strong>{gap.topic}:</strong> {gap.advice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onNavigateToPlanner}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>View Personalized Study Plan</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToAdaptive}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Start Adaptive Practice</span>
            </button>

            <button
              onClick={onNavigateToReTest}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Take Re-Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
