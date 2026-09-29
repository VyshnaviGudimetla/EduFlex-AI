import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Sparkles,
  Trophy,
  Flame,
  Info
} from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { api } from '../services/api';

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [disclaimer, setDisclaimer] = useState('Leaderboard uses demo data.');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.getLeaderboard();
        setEntries(res.leaderboard);
        setDisclaimer(res.disclaimer);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇 1st';
      case 2:
        return '🥈 2nd';
      case 3:
        return '🥉 3rd';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Classroom Gamification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Classroom Leaderboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Points are earned strictly through accuracy, score improvement, and maintaining consistent study habits.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{disclaimer}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold text-slate-500">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Total Points</th>
                <th className="py-4 px-6">Current Medal</th>
                <th className="py-4 px-6">Badges Unlocked</th>
                <th className="py-4 px-6 text-right">Activity Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr
                  key={entry.student}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-indigo-50/60 font-semibold'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                        entry.rank === 1
                          ? 'bg-amber-100 text-amber-900'
                          : entry.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : entry.rank === 3
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'text-slate-600'
                      }`}
                    >
                      {getRankBadge(entry.rank)}
                    </span>
                  </td>

                  {/* Student */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                        {entry.student.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">
                        {entry.student}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm bg-indigo-600 text-white uppercase">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="py-4 px-6">
                    <span className="font-black text-slate-900 text-sm">
                      {entry.points}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">pts</span>
                  </td>

                  {/* Medal */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base">
                        {entry.medal === 'Gold'
                          ? '🥇'
                          : entry.medal === 'Silver'
                          ? '🥈'
                          : '🥉'}
                      </span>
                      <span className="font-bold text-slate-700">{entry.medal}</span>
                    </div>
                  </td>

                  {/* Badges */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1.5">
                      {entry.badgeIcons.map((icon, idx) => (
                        <span
                          key={idx}
                          className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-xs"
                          title="Special Award Badge"
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Note */}
                  <td className="py-4 px-6 text-right text-slate-500 text-[11px]">
                    {entry.note || (entry.isCurrentUser ? 'Recently cleared Loops gap' : 'Regular practice')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
