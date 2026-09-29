import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  GitCompare,
  ArrowUpRight,
  Info,
  Sparkles,
  Download
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface ProgressGraphsProps {
  analytics: AnalyticsData;
}

export const ProgressGraphs: React.FC<ProgressGraphsProps> = ({ analytics }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const { lineGraph, topicBarGraph, comparisonGraph } = analytics;

  // SVG dimensions for Line Graph
  const svgWidth = 600;
  const svgHeight = 240;
  const padding = 40;

  // Calculate coordinates for Line Graph
  const maxScore = 100;
  const minScore = 40;
  const scoreRange = maxScore - minScore;

  const points = lineGraph.map((item, index) => {
    const x = padding + (index / Math.max(1, lineGraph.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((item.score - minScore) / scoreRange) * (svgHeight - padding * 2);
    return { ...item, x, y };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Progress & Mastery Visualizations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Analytics & Score Trajectory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual telemetry updated automatically as diagnostic tests, adaptive drills, and re-tests are recorded.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Trajectory: +29% Net Gain
          </span>
        </div>
      </div>

      {/* GRAPH 1: Overall Score Progress (Line Graph) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
              GRAPH 1: Historical Progression
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Overall Score Progress (Line Graph)
            </h3>
            <p className="text-xs text-slate-500">
              Score history over consecutive test attempts demonstrating consistent upward trajectory
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
            <span>Test Score %</span>
          </div>
        </div>

        {/* SVG Line Graph */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 60, 80, 100].map((level) => {
                const y = svgHeight - padding - ((level - minScore) / scoreRange) * (svgHeight - padding * 2);
                return (
                  <g key={level}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={svgWidth - padding}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fill */}
              {areaD && <path d={areaD} fill="url(#lineGrad)" />}

              {/* Main Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt, i) => (
                <g
                  key={i}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === i ? 7 : 5}
                    className="fill-white stroke-indigo-600 stroke-[3] transition-all"
                  />
                  {/* Score Label above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    className="text-[11px] font-bold fill-slate-800"
                  >
                    {pt.score}%
                  </text>
                  {/* X Axis Label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 15}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-500 font-medium"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Starting Baseline: 55%</span>
          <span className="font-bold text-emerald-600">Peak Performance: 84% (Re-Test Mastery)</span>
        </div>
      </div>

      {/* GRAPH 2 & GRAPH 3 Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRAPH 2: Topic-wise Performance (Bar Chart) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
              GRAPH 2: Current Competency
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Topic-Wise Performance (Bar Chart)
            </h3>
            <p className="text-xs text-slate-500">
              Mastery percentage across individual syllabus domains
            </p>
          </div>

          <div className="space-y-4">
            {topicBarGraph.map((item) => (
              <div
                key={item.topic}
                className="space-y-1.5"
                onMouseEnter={() => setHoveredTopic(item.topic)}
                onMouseLeave={() => setHoveredTopic(null)}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.topic}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900">{item.score}%</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                        item.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Improving'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color || '#4F46E5'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            📊 <strong>Benchmark:</strong> Topics scoring ≥ 80% are classified as Strong (Green). Topics between 60-79% are Improving (Yellow). Below 60% are flagged as Needs Attention (Red).
          </div>
        </div>

        {/* GRAPH 3: Before vs After Improvement (Comparison Bar Chart) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              GRAPH 3: Remediation Impact
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Before vs After Improvement (Comparison Chart)
            </h3>
            <p className="text-xs text-slate-500">
              Demonstrating direct score jump following personalized study plan execution
            </p>
          </div>

          {/* Comparison Legend */}
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>
              <span className="text-slate-600">Before (Diagnostic)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
              <span className="text-slate-600">After (Targeted Re-Test)</span>
            </div>
          </div>

          <div className="space-y-5">
            {comparisonGraph.map((item) => (
              <div key={item.topic} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.topic}</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {item.gain}
                  </span>
                </div>

                {/* Dual Bars */}
                <div className="space-y-1.5">
                  {/* Before Bar */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="w-12 text-slate-400 text-[10px] font-medium">Before:</span>
                    <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{ width: `${item.before}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-bold text-slate-600 text-xs">
                      {item.before}%
                    </span>
                  </div>

                  {/* After Bar */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="w-12 text-emerald-700 text-[10px] font-bold">After:</span>
                    <div className="flex-1 bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${item.after}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-black text-emerald-800 text-xs">
                      {item.after}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            🎯 <strong>Proof of Learning:</strong> The Loops gap closed from <strong>40% to 82%</strong>, turning the student’s weakest area into a verified strength.
          </div>
        </div>
      </div>
    </div>
  );
};
