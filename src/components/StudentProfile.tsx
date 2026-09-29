import React, { useState } from 'react';
import {
  User,
  Award,
  Sparkles,
  Flame,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Database,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { StudentProfile, Badge } from '../types';

interface StudentProfileProps {
  student: StudentProfile | null;
  badges: Badge[];
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  onResetDemo: () => void;
}

export const StudentProfileView: React.FC<StudentProfileProps> = ({
  student,
  badges,
  isOnline,
  setIsOnline,
  onResetDemo
}) => {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    await onResetDemo();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>Student Dossier & Account</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Personal learning footprint, security posture, and offline synchronization credentials.
          </p>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetDone ? 'Demo Reset Complete!' : 'Reset Demo Baseline'}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {student?.name?.charAt(0) || 'V'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{student?.name || 'Vyshnavi'}</h3>
            <p className="text-xs text-slate-500">{student?.email || 'vyshnavi@eduflex.ai'}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Student
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Tier 2 Scholar
              </span>
            </div>
          </div>
        </div>

        {/* Core Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Points</span>
            <span className="text-lg font-black text-slate-900">{student?.points || 850} pts</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Medal</span>
            <div className="flex items-center space-x-1">
              <span>{student?.medal === 'Gold' ? '🥇' : '🥈'}</span>
              <span className="text-lg font-black text-slate-900">{student?.medal || 'Silver'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Learning Streak</span>
            <span className="text-lg font-black text-orange-600 flex items-center space-x-1">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{student?.streak || 6} days</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Mastery</span>
            <span className="text-lg font-black text-indigo-600">{student?.overall_score || 78}%</span>
          </div>
        </div>

        {/* Subjects & Competency */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Enrolled Subjects
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Python Basics (Exam Prep)',
              'Computer Networks (Unit 3)',
              'SQL & Relational Databases',
              'Data Structures'
            ].map((subj) => (
              <span
                key={subj}
                className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
              >
                {subj}
              </span>
            ))}
          </div>
        </div>

        {/* Badges Collection */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Badges Showcase
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3 rounded-xl border flex items-center space-x-3 ${
                  b.unlocked ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="text-xs">
                  <h5 className="font-bold text-slate-900">{b.title}</h5>
                  <p className="text-[10px] text-slate-500 leading-tight">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy, Security & Offline Policy Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold">Privacy, Security & Offline Guarantee</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong className="text-white block">Minimal Data Collection</strong>
            <p>
              Stores only essential educational metrics (name, scores, test history, points, and study tasks) in an isolated SQLite engine. No sensitive telemetry or password storage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <strong className="text-white block">Zero Client API Key Exposure</strong>
            <p>
              All AI generation is proxied strictly via server-side endpoints with user-agent headers. Client bundles contain zero secrets.
            </p>
          </div>
        </div>

        {/* Simulated Connection Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
          <div className="text-xs">
            <span className="text-slate-400">Offline-Friendly Mode Toggle: </span>
            <strong className={isOnline ? 'text-emerald-400' : 'text-amber-400'}>
              {isOnline ? '🟢 Online — AI features available' : '🟡 Offline — Basic learning mode'}
            </strong>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {isOnline ? 'Simulate Offline Mode' : 'Restore Online Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
