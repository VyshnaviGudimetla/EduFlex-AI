import React, { useState } from 'react';
import {
  FileCheck,
  Sparkles,
  Sliders,
  Layers,
  BookOpen,
  ArrowRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { MaterialItem, Question } from '../types';
import { api } from '../services/api';

interface TestGeneratorProps {
  activeMaterial: MaterialItem | null;
  onTestGenerated: (testTitle: string, subject: string, questions: Question[]) => void;
  onLaunchDiagnostic: () => void;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({
  activeMaterial,
  onTestGenerated,
  onLaunchDiagnostic
}) => {
  const [subject, setSubject] = useState(activeMaterial?.subject || 'Python Basics');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['MCQ', '2-mark', 'short-answer']);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const topicsList = activeMaterial?.detected_topics || [
    'Variables',
    'Conditions',
    'Loops',
    'Functions',
    'Lists',
    'Basic problem solving'
  ];

  const handleToggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateTest({
        subject,
        topic: selectedTopic,
        difficulty,
        questionTypes: selectedTypes,
        count: questionCount,
        materialText: activeMaterial?.text_content || ''
      });

      const testTitle = `${subject}: ${selectedTopic} (${difficulty})`;
      onTestGenerated(testTitle, subject, res.questions);
    } catch (err) {
      console.error('Test generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Test Generation Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Generate Practice & Exam Tests
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Questions are generated strictly from your uploaded notes with customizable difficulty and question formats.
          </p>
        </div>

        {/* Quick Launch Diagnostic button */}
        <button
          onClick={onLaunchDiagnostic}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <FileCheck className="w-4 h-4" />
          <span>Launch Diagnostic Test</span>
        </button>
      </div>

      {/* Generator Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Subject
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Python Basics', 'Computer Networks', 'Java', 'SQL & DBMS'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  subject === s
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Topic Focus
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedTopic('All Topics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                selectedTopic === 'All Topics'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              All Detected Topics
            </button>
            {topicsList.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { level: 'Easy', desc: 'Direct recalls & definitions', color: 'emerald' },
              { level: 'Medium', desc: 'Application & code prediction', color: 'amber' },
              { level: 'Hard', desc: 'Complex problem solving & traps', color: 'red' }
            ].map(({ level, desc }) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  difficulty === level
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{level}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      level === 'Easy'
                        ? 'bg-emerald-500'
                        : level === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  ></span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Question Types Multi-Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Question Types (Select multiple)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'MCQ', label: 'Multiple Choice (MCQ)' },
              { id: '2-mark', label: '2-Mark Questions' },
              { id: 'short-answer', label: 'Short-Answer Questions' },
              { id: 'long-answer', label: 'Long-Answer Questions' }
            ].map((type) => {
              const active = selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleToggleType(type.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-colors cursor-pointer flex items-center justify-between ${
                    active
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{type.label}</span>
                  <span className={`text-[10px] ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {active ? '✓' : '+'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Number of Questions
          </label>
          <div className="flex items-center space-x-4">
            {[5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuestionCount(num)}
                className={`w-16 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  questionCount === num
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {num} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Submit Generate Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>
              Source: <strong>{activeMaterial?.title || 'Active Study Notes'}</strong>
            </span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Test with AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
