import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MaterialUpload } from './components/MaterialUpload';
import { MaterialAnalysisView } from './components/MaterialAnalysis';
import { ChatAssistant } from './components/ChatAssistant';
import { TestGenerator } from './components/TestGenerator';
import { TestRunner } from './components/TestRunner';
import { PerformanceModal } from './components/PerformanceModal';
import { AdaptivePractice } from './components/AdaptivePractice';
import { ReTestView } from './components/ReTestView';
import { ProgressGraphs } from './components/ProgressGraphs';
import { StudyPlanner } from './components/StudyPlanner';
import { Leaderboard } from './components/Leaderboard';
import { StudentProfileView } from './components/StudentProfile';
import {
  StudentProfile,
  Badge,
  MaterialItem,
  MaterialAnalysis,
  Question,
  TestAttemptResult,
  StudyPlanItem,
  AnalyticsData
} from './types';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<MaterialAnalysis | null>(null);
  const [studyPlans, setStudyPlans] = useState<StudyPlanItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    lineGraph: [
      { label: 'Test 1', score: 55, date: 'Day 1' },
      { label: 'Test 2', score: 64, date: 'Day 2' },
      { label: 'Test 3', score: 72, date: 'Day 3' },
      { label: 'Diagnostic', score: 78, date: 'Day 4' }
    ],
    topicBarGraph: [
      { topic: 'Variables', score: 90, status: 'Strong', color: '#10B981' },
      { topic: 'Conditions', score: 85, status: 'Strong', color: '#10B981' },
      { topic: 'Loops', score: 40, status: 'Needs Attention', color: '#EF4444' },
      { topic: 'Functions', score: 55, status: 'Improving', color: '#F59E0B' },
      { topic: 'Lists', score: 88, status: 'Strong', color: '#10B981' },
      { topic: 'Problem Solving', score: 80, status: 'Strong', color: '#10B981' }
    ],
    comparisonGraph: [
      { topic: 'Loops', before: 40, after: 82, gain: '+42%', status: 'Needs Attention -> Improving' },
      { topic: 'Functions', before: 55, after: 75, gain: '+20%', status: 'Needs Attention -> Improving' }
    ]
  });

  // Test Taking State
  const [activeTest, setActiveTest] = useState<{
    testTitle: string;
    subject: string;
    questions: Question[];
    isReTest?: boolean;
  } | null>(null);
  const [performanceResult, setPerformanceResult] = useState<TestAttemptResult | null>(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const studentData = await api.getStudent();
      setStudent(studentData.student);
      setBadges(studentData.badges);

      const matList = await api.getMaterials();
      setMaterials(matList);
      if (matList.length > 0) {
        setActiveMaterial(matList[0]);
        // Default analysis for initial active material
        setCurrentAnalysis({
          topics: matList[0].detected_topics || ['CDMA', 'GSM', 'FDMA', 'TDMA', 'Cellular Architecture'],
          summaries: [
            { topic: 'CDMA', summary: 'Simultaneous channel transmission using orthogonal Walsh codes; soft capacity limit.' },
            { topic: 'GSM', summary: 'Global 2G standard with hybrid FDMA/TDMA frame structures and SIM security authentication.' },
            { topic: 'FDMA', summary: 'Bandwidth sliced into continuous exclusive frequency channels requiring guard bands.' },
            { topic: 'TDMA', summary: 'Cyclic frames with dedicated 8 time slots; used extensively in GSM.' },
            { topic: 'Cellular Architecture', summary: 'Hexagonal tessellation with frequency reuse cluster geometry.' }
          ],
          keyConcepts: [
            'Orthogonal Walsh PN codes & cross-correlation',
            'Near-Far problem & closed-loop power control in CDMA',
            'Frequency reuse factor N = i^2 + ij + j^2',
            'Hard Handover (GSM) vs Soft Handover (CDMA)'
          ],
          priorities: {
            high: ['CDMA', 'GSM'],
            medium: ['FDMA', 'TDMA'],
            quickRevision: ['Cellular Architecture']
          },
          recommendedOrder: [
            'Cellular Architecture',
            'FDMA',
            'TDMA',
            'GSM',
            'CDMA'
          ],
          examTips: [
            'AI Recommendation: Focus on mathematical code orthogonality in CDMA and frame diagrams for GSM.',
            'AI Recommendation: Be prepared to contrast Hard Handover with CDMA Soft Handover.'
          ]
        });
      }

      const planList = await api.getStudyPlan();
      setStudyPlans(planList);

      const analyticsData = await api.getAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const handleUploadSuccess = (mat: MaterialItem, analysis: MaterialAnalysis) => {
    setActiveMaterial(mat);
    setCurrentAnalysis(analysis);
    setMaterials((prev) => [mat, ...prev]);
    setCurrentTab('analysis');
  };

  const handleLaunchDiagnosticTest = () => {
    const diagnosticQuestions: Question[] = [
      {
        id: 'diag-1',
        topic: 'Variables',
        questionType: 'MCQ',
        question: 'What is the output of the following Python snippet?\n\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
        options: ['A) 3', 'B) 4', 'C) Error', 'D) None'],
        correctAnswer: 'B) 4',
        explanation: 'Lists are mutable objects in Python. Variables hold references; mutating y directly alters x.',
        marks: 2
      },
      {
        id: 'diag-2',
        topic: 'Conditions',
        questionType: 'MCQ',
        question: 'Which of the following values evaluates to False (falsy) in a boolean condition?',
        options: ['A) bool("0")', 'B) bool([False])', 'C) bool([])', 'D) bool(-1)'],
        correctAnswer: 'C) bool([])',
        explanation: 'An empty list is falsy in Python.',
        marks: 2
      },
      {
        id: 'diag-3',
        topic: 'Loops',
        questionType: 'MCQ',
        question: 'How many iterations are executed by this loop?\n\nfor i in range(1, 10, 3):\n    print(i)',
        options: ['A) 3 iterations (1, 4, 7)', 'B) 4 iterations (1, 4, 7, 10)', 'C) 9 iterations', 'D) 2 iterations'],
        correctAnswer: 'A) 3 iterations (1, 4, 7)',
        explanation: 'range(1, 10, 3) yields values 1, 4, 7. It terminates before 10 because the stop parameter is exclusive.',
        marks: 2
      },
      {
        id: 'diag-4',
        topic: 'Loops',
        questionType: 'MCQ',
        question: 'What is the final value of total after this while loop terminates?\n\ntotal = 0\ni = 1\nwhile i <= 4:\n    if i % 2 == 0:\n        total += i\n    i += 1',
        options: ['A) 4', 'B) 6', 'C) 10', 'D) Infinite loop'],
        correctAnswer: 'B) 6',
        explanation: 'The loop adds even numbers 2 and 4, totaling 6.',
        marks: 2
      },
      {
        id: 'diag-5',
        topic: 'Functions',
        questionType: 'MCQ',
        question: 'What is printed by this function?\n\ndef greet(name, msg="Hello"):\n    return f"{msg}, {name}!"\n\nprint(greet("Vyshnavi"))',
        options: ['A) None', 'B) Hello, Vyshnavi!', 'C) Vyshnavi, Hello!', 'D) TypeError'],
        correctAnswer: 'B) Hello, Vyshnavi!',
        explanation: 'Default arguments are used when caller omits the corresponding parameter.',
        marks: 2
      },
      {
        id: 'diag-6',
        topic: 'Functions',
        questionType: 'short-answer',
        question: 'Explain what happens when an inner function assigns to a variable defined in an outer scope without using the "global" or "nonlocal" keyword.',
        correctAnswer: 'It creates a new local variable in the inner function scope instead of modifying the outer variable.',
        explanation: 'Python LEGB scope treats assignments as local bindings by default.',
        marks: 3
      },
      {
        id: 'diag-7',
        topic: 'Lists',
        questionType: 'MCQ',
        question: 'What is returned by the expression `[10, 20, 30, 40][::-1]`?',
        options: ['A) [40, 30, 20, 10]', 'B) [10, 20, 30]', 'C) [40]', 'D) Error'],
        correctAnswer: 'A) [40, 30, 20, 10]',
        explanation: 'A step size of -1 reverses the list.',
        marks: 2
      },
      {
        id: 'diag-8',
        topic: 'Basic problem solving',
        questionType: 'MCQ',
        question: 'Which container provides O(1) average lookup time for "val in container" in Python?',
        options: ['A) list', 'B) set', 'C) tuple', 'D) str'],
        correctAnswer: 'B) set',
        explanation: 'Sets are implemented via hash tables offering O(1) expected lookups.',
        marks: 2
      }
    ];

    setActiveTest({
      testTitle: 'Diagnostic Test: Python Basics & Problem Solving',
      subject: 'Python Basics',
      questions: diagnosticQuestions,
      isReTest: false
    });
  };

  const handleLaunchReTest = () => {
    const reTestQuestions: Question[] = [
      {
        id: 're-1',
        topic: 'Loops',
        questionType: 'MCQ',
        question: 'What is the exact output of this loop?\n\nfor i in range(12, 3, -3):\n    print(i, end=" ")',
        options: ['A) 12 9 6', 'B) 12 9 6 3', 'C) 9 6 3', 'D) 12 10 8'],
        correctAnswer: 'A) 12 9 6',
        explanation: 'The loop steps backwards by -3 and stops before 3. It prints 12, 9, 6.',
        marks: 2
      },
      {
        id: 're-2',
        topic: 'Loops',
        questionType: 'MCQ',
        question: 'What is the accumulator total in this loop?\n\ntotal = 0\nfor x in [2, 4, 6]:\n    total += x * 2\nprint(total)',
        options: ['A) 24', 'B) 12', 'C) 18', 'D) 30'],
        correctAnswer: 'A) 24',
        explanation: '(2*2) + (4*2) + (6*2) = 4 + 8 + 12 = 24.',
        marks: 2
      },
      {
        id: 're-3',
        topic: 'Functions',
        questionType: 'MCQ',
        question: 'What does the function return?\n\ndef calculate(a, b=5):\n    return a * b\n\nprint(calculate(4))',
        options: ['A) 20', 'B) 9', 'C) 25', 'D) Error'],
        correctAnswer: 'A) 20',
        explanation: 'b takes default value 5, resulting in 4 * 5 = 20.',
        marks: 2
      },
      {
        id: 're-4',
        topic: 'Functions',
        questionType: 'MCQ',
        question: 'In Python LEGB scope hierarchy, what does the letter "E" stand for?',
        options: ['A) Enclosing (Closure) scope', 'B) External scope', 'C) Error scope', 'D) Exclusive scope'],
        correctAnswer: 'A) Enclosing (Closure) scope',
        explanation: 'LEGB stands for Local, Enclosing, Global, Built-in.',
        marks: 2
      }
    ];

    setActiveTest({
      testTitle: 'Targeted Re-Test: Loops & Functions Remediation',
      subject: 'Python Basics',
      questions: reTestQuestions,
      isReTest: true
    });
  };

  const handleTestSubmitted = (result: TestAttemptResult) => {
    setActiveTest(null);
    setPerformanceResult(result);

    // Update student state locally
    if (student) {
      setStudent({
        ...student,
        points: result.newTotalPoints,
        medal: result.medal,
        overall_score: result.score
      });
    }

    // Update analytics dynamically
    setAnalytics((prev) => {
      const newLine = [
        ...prev.lineGraph,
        {
          label: result.attemptId.includes('retest') || performanceResult ? 'Re-Test' : 'Test Attempt',
          score: result.score,
          date: 'Recent'
        }
      ];

      const newTopicBars = prev.topicBarGraph.map((bar) => {
        if (result.topicScores[bar.topic] !== undefined) {
          const newScore = result.topicScores[bar.topic];
          return {
            ...bar,
            score: newScore,
            status: (newScore >= 80 ? 'Strong' : newScore >= 60 ? 'Improving' : 'Needs Attention') as any,
            color: newScore >= 80 ? '#10B981' : newScore >= 60 ? '#F59E0B' : '#EF4444'
          };
        }
        return bar;
      });

      return {
        ...prev,
        lineGraph: newLine,
        topicBarGraph: newTopicBars
      };
    });
  };

  const handleResetDemoState = async () => {
    try {
      await api.resetDemo();
      await loadInitialData();
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Navbar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveTest(null);
          setCurrentTab(tab);
        }}
        student={student}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        onResetDemo={handleResetDemoState}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Active Test Taking View Overlay */}
        {activeTest ? (
          <TestRunner
            testTitle={activeTest.testTitle}
            subject={activeTest.subject}
            questions={activeTest.questions}
            isReTest={activeTest.isReTest}
            onTestSubmitted={handleTestSubmitted}
            onCancel={() => setActiveTest(null)}
          />
        ) : (
          <>
            {currentTab === 'landing' && (
              <LandingPage
                onStartLearning={() => setCurrentTab('dashboard')}
                onUploadClick={() => setCurrentTab('upload')}
                onViewDemo={() => {
                  setCurrentTab('dashboard');
                }}
              />
            )}

            {currentTab === 'dashboard' && (
              <Dashboard
                student={student}
                badges={badges}
                onNavigate={(tab) => setCurrentTab(tab)}
                onTakeDiagnostic={handleLaunchDiagnosticTest}
                onTakeReTest={handleLaunchReTest}
              />
            )}

            {currentTab === 'upload' && (
              <MaterialUpload
                onUploadSuccess={handleUploadSuccess}
                onNavigateToAnalysis={() => setCurrentTab('analysis')}
              />
            )}

            {currentTab === 'analysis' && (
              <MaterialAnalysisView
                analysis={currentAnalysis}
                activeMaterial={activeMaterial}
                onStartTest={() => setCurrentTab('tests')}
                onAskChat={() => setCurrentTab('chat')}
              />
            )}

            {currentTab === 'chat' && (
              <ChatAssistant
                activeMaterial={activeMaterial}
                onNavigateToUpload={() => setCurrentTab('upload')}
              />
            )}

            {currentTab === 'tests' && (
              <TestGenerator
                activeMaterial={activeMaterial}
                onLaunchDiagnostic={handleLaunchDiagnosticTest}
                onTestGenerated={(title, subj, qList) => {
                  setActiveTest({
                    testTitle: title,
                    subject: subj,
                    questions: qList,
                    isReTest: false
                  });
                }}
              />
            )}

            {currentTab === 'practice' && (
              <AdaptivePractice
                onNavigateToReTest={() => setCurrentTab('retest')}
              />
            )}

            {currentTab === 'retest' && (
              <ReTestView
                student={student}
                onLaunchReTestModal={handleLaunchReTest}
                onNavigateToGraphs={() => setCurrentTab('analytics')}
                onNavigateToPlanner={() => setCurrentTab('planner')}
              />
            )}

            {currentTab === 'analytics' && (
              <ProgressGraphs analytics={analytics} />
            )}

            {currentTab === 'planner' && (
              <StudyPlanner
                initialPlans={studyPlans}
                onTaskToggled={(id, done) => {
                  if (done && student) {
                    setStudent({ ...student, points: student.points + 50 });
                  }
                }}
              />
            )}

            {currentTab === 'leaderboard' && <Leaderboard />}

            {currentTab === 'profile' && (
              <StudentProfileView
                student={student}
                badges={badges}
                isOnline={isOnline}
                setIsOnline={setIsOnline}
                onResetDemo={handleResetDemoState}
              />
            )}
          </>
        )}
      </main>

      {/* Post-Test Evaluation & Gap Analysis Modal */}
      {performanceResult && (
        <PerformanceModal
          result={performanceResult}
          onClose={() => setPerformanceResult(null)}
          onNavigateToAdaptive={() => {
            setPerformanceResult(null);
            setCurrentTab('practice');
          }}
          onNavigateToPlanner={() => {
            setPerformanceResult(null);
            setCurrentTab('planner');
          }}
          onNavigateToReTest={() => {
            setPerformanceResult(null);
            handleLaunchReTest();
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            EduFlex AI — "Your Pace. Your Path. Your Reward."
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Powered by SQLite + Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Academic & Technical Learning Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
