import React from 'react';
import {
  GraduationCap,
  Flame,
  Award,
  Wifi,
  WifiOff,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileCheck,
  TrendingUp,
  Calendar,
  Users,
  Brain,
  RotateCcw
} from 'lucide-react';
import { StudentProfile, MedalType } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  student: StudentProfile | null;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  student,
  isOnline,
  setIsOnline,
  onResetDemo
}) => {
  const medalColor = (medal: MedalType = 'Silver') => {
    switch (medal) {
      case 'Gold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Bronze':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const medalIcon = (medal: MedalType = 'Silver') => {
    switch (medal) {
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      case 'Bronze':
        return '🥉';
      default:
        return '🥈';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'upload', label: 'Upload Notes', icon: BookOpen },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'chat', label: 'Ask EduFlex 🤖', icon: MessageSquare },
    { id: 'tests', label: 'Tests & Diagnostic', icon: FileCheck },
    { id: 'practice', label: 'Adaptive Practice', icon: Sparkles },
    { id: 'retest', label: 'Re-Test', icon: RotateCcw },
    { id: 'analytics', label: 'Progress Graphs', icon: TrendingUp },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top tier brand bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-950 bg-clip-text text-transparent">
                  EduFlex AI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Hackathon Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                "Your Pace. Your Path. Your Reward."
              </p>
            </div>
          </div>

          {/* Gamification & Status Widgets */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Online / Offline status badge */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title="Click to toggle simulated Offline mode"
              className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Online — AI features available</span>
                  <span className="md:hidden">Online</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Offline — Basic learning mode</span>
                  <span className="md:hidden">Offline</span>
                </>
              )}
            </button>

            {/* Streak Badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-bounce" />
              <span>{student?.streak || 6} days</span>
            </div>

            {/* Points Badge */}
            <div className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{student?.points || 850} pts</span>
            </div>

            {/* Medal Badge */}
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 border rounded-full text-xs font-bold shadow-2xs ${medalColor(
                student?.medal
              )}`}
            >
              <span>{medalIcon(student?.medal)}</span>
              <span className="hidden sm:inline">{student?.medal || 'Silver'}</span>
            </div>

            {/* Student avatar */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                {student?.name?.charAt(0) || 'V'}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden lg:inline">
                {student?.name || 'Vyshnavi'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom tier Navigation links */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  active
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
