import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Flame
} from 'lucide-react';
import { StudyPlanItem } from '../types';
import { api } from '../services/api';

interface StudyPlannerProps {
  initialPlans: StudyPlanItem[];
  onTaskToggled: (planId: string, completed: boolean) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  initialPlans,
  onTaskToggled
}) => {
  const [plans, setPlans] = useState<StudyPlanItem[]>(initialPlans);
  const [dailyMinutes, setDailyMinutes] = useState(45);

  const handleToggle = async (plan: StudyPlanItem) => {
    const newStatus = !plan.is_completed;
    // Optimistic UI update
    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id ? { ...p, is_completed: newStatus } : p
      )
    );

    try {
      await api.toggleStudyPlan(plan.id, newStatus);
      onTaskToggled(plan.id, newStatus);
    } catch (err) {
      console.error('Failed to toggle plan task:', err);
    }
  };

  const completedCount = plans.filter((p) => p.is_completed).length;
  const progressPercent = Math.round((completedCount / Math.max(1, plans.length)) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Dynamic Schedule & Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Personalized Study Planner
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Calculated around your detected weak topics (Loops & Functions) while preventing wasted time on mastered topics.
          </p>
        </div>

        {/* Study Time Allocation Slider */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-3 shrink-0">
          <Clock className="w-4 h-4 text-indigo-600" />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Daily Study Target: </span>
            <strong className="text-slate-900">{dailyMinutes} mins/day</strong>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={dailyMinutes}
            onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Progress Bar for Weekly Plan */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">Weekly Roadmap Completion</span>
            <span className="font-black text-indigo-600">
              {completedCount} / {plans.length} Tasks Finished
            </span>
          </div>
          <span className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+50 Pts per completed task</span>
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Calendar Week List */}
      <div className="space-y-3">
        {plans.map((item, index) => {
          const isDone = !!item.is_completed;
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <button
                  type="button"
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                      : 'border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                      {item.day_label}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  ⏱ ~{item.estimated_minutes} mins
                </span>
                {isDone && (
                  <span className="block mt-1 text-[10px] font-bold text-emerald-600">
                    +50 Pts Claimed ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note about Mastered Topics */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p>
          <strong>Notice on Personalization:</strong> Topics where you previously demonstrated high competency (Variables 90%, Conditions 85%) are automatically exempted from this weekly remedial schedule, reducing total study burden by 40%.
        </p>
      </div>
    </div>
  );
};
