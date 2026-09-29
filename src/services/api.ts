import {
  StudentProfile,
  Badge,
  MaterialItem,
  MaterialAnalysis,
  ChatMessage,
  Question,
  TestAttemptResult,
  StudyPlanItem,
  LeaderboardEntry,
  AnalyticsData
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', hasGeminiKey: false };
    }
  },

  async getStudent(): Promise<{ student: StudentProfile; badges: Badge[] }> {
    try {
      const res = await fetch(`${API_BASE}/student`);
      if (!res.ok) throw new Error('Failed to fetch student');
      const data = await res.json();
      localStorage.setItem('eduflex_cached_student', JSON.stringify(data));
      return data;
    } catch (e) {
      const cached = localStorage.getItem('eduflex_cached_student');
      if (cached) return JSON.parse(cached);
      return {
        student: {
          id: 'vyshnavi-1',
          name: 'Vyshnavi',
          email: 'vyshnavi@eduflex.ai',
          points: 850,
          streak: 6,
          medal: 'Silver',
          overall_score: 78
        },
        badges: [
          { id: 'b1', badge_key: 'consistency', title: 'Consistency', icon: '🔥', description: 'Maintained 6-day streak', unlocked: true },
          { id: 'b2', badge_key: 'quick_learner', title: 'Quick Learner', icon: '🚀', description: 'Quick accuracy in diagnostic', unlocked: true }
        ]
      };
    }
  },

  async getMaterials(): Promise<MaterialItem[]> {
    try {
      const res = await fetch(`${API_BASE}/materials`);
      if (!res.ok) throw new Error('Failed to fetch materials');
      const data = await res.json();
      return data.materials || [];
    } catch (e) {
      return [
        {
          id: 'mat-cn-unit3',
          title: 'Computer Networks Unit 3.pdf',
          subject: 'Computer Networks',
          file_type: 'pdf',
          detected_topics: ['CDMA', 'GSM', 'FDMA', 'TDMA', 'Cellular Architecture'],
          priorities: {
            high: ['CDMA', 'GSM'],
            medium: ['FDMA', 'TDMA'],
            quickRevision: ['Cellular Architecture']
          }
        },
        {
          id: 'mat-python-basics',
          title: 'Python Fundamentals & Problem Solving.pdf',
          subject: 'Python Basics',
          file_type: 'pdf',
          detected_topics: ['Variables', 'Conditions', 'Loops', 'Functions', 'Lists'],
          priorities: {
            high: ['Loops', 'Functions'],
            medium: ['Lists', 'Basic problem solving'],
            quickRevision: ['Variables', 'Conditions']
          }
        }
      ];
    }
  },

  async uploadMaterial(payload: {
    title: string;
    subject: string;
    textContent: string;
    fileType?: string;
  }): Promise<{ success: boolean; materialId: string; analysis: MaterialAnalysis; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/materials/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch (e) {
      // Offline fallback
      return {
        success: true,
        materialId: 'offline-mat-' + Date.now(),
        message: 'Your study material is ready (Offline mode).',
        analysis: {
          topics: ['Core Concepts', 'Architectures', 'Operational Principles', 'Problem Analysis'],
          summaries: [
            { topic: 'Core Concepts', summary: 'Foundational models and notation from your uploaded material.' }
          ],
          keyConcepts: ['Key definitions', 'Process diagrams', 'Comparative trade-offs'],
          priorities: {
            high: ['Core Concepts'],
            medium: ['Architectures'],
            quickRevision: ['Problem Analysis']
          },
          recommendedOrder: ['Core Concepts', 'Architectures', 'Operational Principles'],
          examTips: ['AI Recommendation: Review recurring definitions in your document summary.']
        }
      };
    }
  },

  async askChat(payload: {
    question: string;
    materialTitle: string;
    materialText: string;
    chatHistory: { role: string; content: string }[];
  }): Promise<{ answer: string; sourceFound: boolean; sourceReference?: string; suggestedFollowUps: string[] }> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Chat request failed');
      return await res.json();
    } catch (e) {
      return {
        answer: 'Operating in offline mode. Please reconnect or check previous notes for instant answers.',
        sourceFound: false,
        suggestedFollowUps: ['Review saved topics', 'Attempt offline practice test']
      };
    }
  },

  async generateTest(payload: {
    subject: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questionTypes: string[];
    count: number;
    materialText?: string;
  }): Promise<{ testId: string; questions: Question[] }> {
    try {
      const res = await fetch(`${API_BASE}/tests/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Test generation failed');
      return await res.json();
    } catch (e) {
      return {
        testId: 'test-fallback-' + Date.now(),
        questions: [
          {
            id: 'fb-1',
            topic: payload.topic || 'General',
            questionType: 'MCQ',
            question: 'What is the primary role of iteration in algorithm optimization?',
            options: ['A) Repeat instructions systematically', 'B) Terminate memory', 'C) Compress storage', 'D) None'],
            correctAnswer: 'A) Repeat instructions systematically',
            explanation: 'Iteration repeatedly executes code blocks until a termination condition is met.',
            marks: 2
          }
        ]
      };
    }
  },

  async submitTest(payload: {
    testTitle: string;
    subject: string;
    answers: Record<string, string>;
    questions: Question[];
    isReTest?: boolean;
  }): Promise<TestAttemptResult> {
    const res = await fetch(`${API_BASE}/tests/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Submission failed');
    return await res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (e) {
      return {
        lineGraph: [
          { label: 'Test 1', score: 55, date: 'Day 1' },
          { label: 'Test 2', score: 64, date: 'Day 2' },
          { label: 'Test 3', score: 72, date: 'Day 3' },
          { label: 'Test 4', score: 84, date: 'Day 4' }
        ],
        topicBarGraph: [
          { topic: 'Variables', score: 90, status: 'Strong', color: '#10B981' },
          { topic: 'Conditions', score: 85, status: 'Strong', color: '#10B981' },
          { topic: 'Loops', score: 40, status: 'Needs Attention', color: '#EF4444' },
          { topic: 'Functions', score: 55, status: 'Improving', color: '#F59E0B' }
        ],
        comparisonGraph: [
          { topic: 'Loops', before: 40, after: 82, gain: '+42%', status: 'Needs Attention -> Improving' },
          { topic: 'Functions', before: 55, after: 75, gain: '+20%', status: 'Needs Attention -> Improving' }
        ]
      };
    }
  },

  async getStudyPlan(): Promise<StudyPlanItem[]> {
    try {
      const res = await fetch(`${API_BASE}/study-plan`);
      if (!res.ok) throw new Error('Failed to fetch plan');
      const data = await res.json();
      return data.plans || [];
    } catch (e) {
      return [
        { id: 'sp-1', student_id: 'vyshnavi-1', day_number: 1, day_label: 'Day 1 - Monday', topic: 'Loops Basics', description: 'Review for/while syntax and boundary traps.', estimated_minutes: 40, is_completed: 1 },
        { id: 'sp-2', student_id: 'vyshnavi-1', day_number: 2, day_label: 'Day 2 - Tuesday', topic: 'Loop Practice', description: 'Solve 5 nested loop traversal problems.', estimated_minutes: 50, is_completed: 0 },
        { id: 'sp-3', student_id: 'vyshnavi-1', day_number: 3, day_label: 'Day 3 - Wednesday', topic: 'Functions Basics', description: 'Master local vs global scope and returns.', estimated_minutes: 45, is_completed: 0 },
        { id: 'sp-4', student_id: 'vyshnavi-1', day_number: 4, day_label: 'Day 4 - Thursday', topic: 'Revision Test', description: 'Comprehensive diagnostic on weak gaps.', estimated_minutes: 35, is_completed: 0 }
      ];
    }
  },

  async toggleStudyPlan(planId: string, isCompleted: boolean) {
    const res = await fetch(`${API_BASE}/study-plan/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, isCompleted })
    });
    return await res.json();
  },

  async getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[]; disclaimer: string }> {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    } catch (e) {
      return {
        disclaimer: 'Leaderboard uses demo data.',
        leaderboard: [
          { rank: 1, student: 'Aisha', points: 1250, medal: 'Gold', badgeIcons: ['🚀', '🔥', '💯'], note: 'Top of class' },
          { rank: 2, student: 'Rahul', points: 1100, medal: 'Gold', badgeIcons: ['🏆', '💯'], note: 'Consistent solver' },
          { rank: 3, student: 'Vyshnavi (You)', points: 850, medal: 'Silver', badgeIcons: ['📈', '🔥'], isCurrentUser: true },
          { rank: 4, student: 'Ananya', points: 850, medal: 'Silver', badgeIcons: ['🚀'], note: 'Active learner' }
        ]
      };
    }
  },

  async resetDemo() {
    const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
    return await res.json();
  }
};
