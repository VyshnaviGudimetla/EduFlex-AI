import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Code,
  BookOpen,
  Award,
  Zap,
  RefreshCw
} from 'lucide-react';

interface PracticeQuestion {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  example: string;
}

export const AdaptivePractice: React.FC<{ onNavigateToReTest: () => void }> = ({
  onNavigateToReTest
}) => {
  const [currentLevel, setCurrentLevel] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Dynamic adaptive question pool specifically targeting weak topics (Loops & Functions)
  const questionPool: PracticeQuestion[] = [
    {
      id: 'ap-1',
      topic: 'Loops (While loop boundary)',
      difficulty: 'Medium',
      question: 'Consider this Python loop. What is the final value of count?\n\ncount = 0\nx = 10\nwhile x > 4:\n    count += 1\n    x -= 2',
      options: ['A) 2', 'B) 3', 'C) 4', 'D) 5'],
      correctAnswer: 'B) 3',
      explanation: 'The loop executes for x = 10 (count=1, x becomes 8), x = 8 (count=2, x becomes 6), and x = 6 (count=3, x becomes 4). When x = 4, the condition (4 > 4) is False, terminating the loop with count = 3.',
      example: '# Visualization of trace:\n# Step 1: x=10 -> condition True -> count=1, x=8\n# Step 2: x=8  -> condition True -> count=2, x=6\n# Step 3: x=6  -> condition True -> count=3, x=4\n# Step 4: x=4  -> condition False -> TERMINATE'
    },
    {
      id: 'ap-2',
      topic: 'Loops (For loop with range step)',
      difficulty: 'Hard',
      question: 'What is the exact output of this negative-step range?\n\nfor i in range(12, 3, -3):\n    print(i, end=" ")',
      options: ['A) 12 9 6 3', 'B) 12 9 6', 'C) 9 6 3', 'D) 12 10 8 6 4'],
      correctAnswer: 'B) 12 9 6',
      explanation: 'In range(start, stop, step) with a negative step, iteration stops strictly before reaching the stop value. Thus it yields 12, 9, 6. The number 3 is excluded!',
      example: 'list(range(12, 3, -3))\n# Returns: [12, 9, 6]\n# The stop value 3 is never touched!'
    },
    {
      id: 'ap-3',
      topic: 'Functions (LEGB Scope & default params)',
      difficulty: 'Hard',
      question: 'What is printed by this function?\n\nval = 10\ndef modify(num=val):\n    val = 20\n    return num\n\nprint(modify())',
      options: ['A) 20', 'B) 10', 'C) UnboundLocalError', 'D) None'],
      correctAnswer: 'B) 10',
      explanation: 'Python evaluates default argument expressions when the function definition is executed, not at call time. At definition time, val is 10, so num is permanently bound to default 10.',
      example: '# Default values are bound once at function definition time!\ndef foo(arg=10):\n    return arg'
    },
    {
      id: 'ap-4',
      topic: 'Loops (Accumulator logic)',
      difficulty: 'Easy',
      question: 'Which of the following creates a loop that executes exactly 5 times?',
      options: [
        'A) for i in range(5):',
        'B) for i in range(1, 5):',
        'C) for i in range(0, 4):',
        'D) while i < 5: (with i initialized to 1)'
      ],
      correctAnswer: 'A) for i in range(5):',
      explanation: 'range(5) produces integers 0, 1, 2, 3, 4 which is exactly 5 iterations.',
      example: 'for i in range(5):\n    print("Hello") # Prints 5 times (0, 1, 2, 3, 4)'
    }
  ];

  const currentQ = questionPool[questionIndex % questionPool.length];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setStreakCount((prev) => prev + 1);
      // Adaptive rule: If student performs well: Easy -> Medium -> Hard
      if (currentLevel === 'Easy') setCurrentLevel('Medium');
      else if (currentLevel === 'Medium') setCurrentLevel('Hard');
    } else {
      setStreakCount(0);
      // Adaptive rule: If student struggles: Hard -> Medium -> Easy
      if (currentLevel === 'Hard') setCurrentLevel('Medium');
      else if (currentLevel === 'Medium') setCurrentLevel('Easy');
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setQuestionIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Adaptive Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Adaptive Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Targeted Adaptive Practice
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Focuses on your detected weak spots. Questions dynamically shift between Easy ↔ Medium ↔ Hard based on each answer.
          </p>
        </div>

        {/* Dynamic Difficulty Tier Badge */}
        <div className="flex items-center space-x-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Tier
            </span>
            <div className="flex items-center space-x-1.5 font-bold text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  currentLevel === 'Easy'
                    ? 'bg-emerald-500'
                    : currentLevel === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
              ></span>
              <span className="text-slate-900">{currentLevel} Level</span>
            </div>
          </div>
          <div className="pl-3 border-l border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Accuracy Streak
            </span>
            <span className="text-sm font-extrabold text-indigo-600">
              🔥 {streakCount}
            </span>
          </div>
        </div>
      </div>

      {/* Adaptive Rules Summary Pill */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>
            <strong>Adaptive Policy:</strong> Success = Easy → Medium → Hard | Incorrect = Hard → Medium → Easy
          </span>
        </div>
        <button
          onClick={onNavigateToReTest}
          className="text-indigo-600 font-bold hover:underline shrink-0"
        >
          Ready for Re-Test? →
        </button>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              {currentQ.topic}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                currentQ.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentQ.difficulty}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 whitespace-pre-wrap font-sans">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = opt === currentQ.correctAnswer;

            let cardStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';
            if (isAnswered) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
              } else if (isSelected) {
                cardStyle = 'border-red-400 bg-red-50/80 text-red-950 font-bold';
              } else {
                cardStyle = 'border-slate-200 opacity-60 bg-white text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl text-xs sm:text-sm border text-left transition-all flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && (
                  <div>
                    {isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Incorrect / Feedback Explanation Section */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-300 ${
              isCorrect ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-extrabold text-emerald-900">
                      Correct! Difficulty increased for next question.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-extrabold text-red-900">
                      Incorrect. Here is the simple explanation & example:
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-1 text-xs font-bold">
                {isCorrect ? (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Level Up</span>
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center space-x-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Adjusting difficulty</span>
                  </span>
                )}
              </div>
            </div>

            {/* Explanation & Example */}
            <div className="space-y-2 pt-2 border-t border-black/5 text-xs">
              <div>
                <strong className="text-slate-900">Correct Answer:</strong>{' '}
                <span className="font-semibold text-indigo-700">{currentQ.correctAnswer}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <strong>Simple Explanation:</strong> {currentQ.explanation}
              </p>
              {currentQ.example && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                  <div className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <Code className="w-3 h-3 text-cyan-400" />
                    <span>Related Code Example:</span>
                  </div>
                  <pre>{currentQ.example}</pre>
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Next Adaptive Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
