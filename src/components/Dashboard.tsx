import React from 'react';
import {
  Flame,
  Award,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  Play,
  RotateCcw,
  BookOpen,
  Calendar
} from 'lucide-react';
import { StudentProfile, Badge } from '../types';

interface DashboardProps {
  student: StudentProfile | null;
  badges: Badge[];
  onNavigate: (tab: string) => void;
  onTakeDiagnostic: () => void;
  onTakeReTest: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  badges,
  onNavigate,
  onTakeDiagnostic,
  onTakeReTest
}) => {
  const currentMedal = student?.medal || 'Silver';
  const overallScore = student?.overall_score || 78;
  const points = student?.points || 850;
  const streak = student?.streak || 6;
  const studentName = student?.name || 'Vyshnavi';

  // Demo baseline topic distribution
  const topics = [
    { name: 'Variables', score: 90, status: 'Strong', tag: 'Mastered' },
    { name: 'Conditions', score: 85, status: 'Strong', tag: 'Mastered' },
    { name: 'Loops', score: 40, status: 'Needs Attention', tag: 'Critical Gap' },
    { name: 'Functions', score: 55, status: 'Improving', tag: 'In Progress' }
  ];

  const strongTopics = topics.filter(t => t.status === 'Strong');
  const weakTopics = topics.filter(t => t.status === 'Needs Attention' || t.status === 'Improving');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome & Recommendation Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                Personalized Assistant Active
              </span>
              <span className="text-xs text-indigo-200 font-medium">
                Syllabus: Python Basics & Computer Networks
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {studentName}! 👋
            </h1>

            <p className="text-sm text-indigo-100/90 leading-relaxed">
              EduFlex AI analyzed your recent diagnostic test. We identified <strong className="text-amber-300">2 learning gaps</strong> in Loops & Functions. Here is your adaptive learning path to reach Gold medal status!
            </p>

            {/* Recommended Next Action */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-300">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-amber-200 font-medium uppercase tracking-wider">
                  Recommended Next Topic
                </span>
                <p className="text-base font-bold text-white">
                  "Revise Loops & CDMA Multiple Access"
                </p>
              </div>
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px]">
            <button
              onClick={onTakeDiagnostic}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-indigo-900 text-indigo-900" />
              <span>Take Diagnostic Test</span>
            </button>

            <button
              onClick={onTakeReTest}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Targeted Re-Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              %
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{overallScore}%</span>
            <span className="text-xs font-semibold text-emerald-600">+14% this week</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Total Points */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Points
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{points}</span>
            <span className="text-xs font-semibold text-purple-600">+250 on re-test</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Earn points by completing tests and daily revision.
          </p>
        </div>

        {/* Current Medal */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Medal
            </span>
            <div className="text-xl">
              {currentMedal === 'Gold' ? '🥇' : currentMedal === 'Silver' ? '🥈' : '🥉'}
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{currentMedal}</span>
            <span className="text-xs text-slate-500 font-medium">Tier 2</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Score ≥ 90% on Re-Test to unlock <span className="font-bold text-amber-600">Gold 🥇</span>!
          </p>
        </div>

        {/* Learning Streak */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Learning Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{streak} days</span>
            <span className="text-xs font-semibold text-orange-600">🔥 On Fire!</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">
            Keep practicing daily to unlock the Consistency badge.
          </p>
        </div>
      </div>

      {/* Topic Mastery Breakdown: Strong vs Weak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics / Needs Attention */}
        <div className="p-6 rounded-2xl bg-white border border-red-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detected Learning Gaps
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted for personalized adaptive review
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
              2 Gaps
            </span>
          </div>

          <div className="space-y-3">
            {weakTopics.map(topic => {
              const isCrit = topic.status === 'Needs Attention';
              return (
                <div
                  key={topic.name}
                  className="p-3.5 rounded-xl border transition-colors bg-red-50/40 border-red-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-800">
                      {topic.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-red-700">{topic.score}%</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          isCrit
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {topic.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-red-200/50 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCrit ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${topic.score}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {topic.name === 'Loops'
                      ? 'AI Advice: Off-by-one errors in range() and while loop accumulation.'
                      : 'AI Advice: Parameter passing and LEGB variable scope traps.'}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="w-full mt-2 inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Start Adaptive Practice on Weak Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Strong Topics / Mastered */}
        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Mastered Topics (Strong)
                </h3>
                <p className="text-xs text-slate-500">
                  High mastery — No need to waste extra study time
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Mastered
            </span>
          </div>

          <div className="space-y-3">
            {strongTopics.map(topic => (
              <div
                key={topic.name}
                className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-800">
                    {topic.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-emerald-700">{topic.score}%</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                      Strong
                    </span>
                  </div>
                </div>
                <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${topic.score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Excellent understanding of {topic.name.toLowerCase()} rules and boolean conditions.
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            💡 <strong>Smart Optimization:</strong> EduFlex AI will allocate 0 minutes of your schedule to re-explaining Variables and Conditions, concentrating your available hours on Loops and Functions.
          </div>
        </div>
      </div>

      {/* Gamification & Badges Preview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Unlocked Medals & Special Badges
            </h3>
          </div>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View Classroom Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <h4 className="text-xs font-bold text-slate-800 truncate">{b.title}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{b.description}</p>
              <span
                className={`inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                  b.unlocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {b.unlocked ? 'Unlocked ✓' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
