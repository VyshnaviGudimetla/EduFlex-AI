export type MedalType = 'Bronze' | 'Silver' | 'Gold';

export interface StudentProfile {
  id: string;
  name: string;
  email?: string;
  points: number;
  streak: number;
  medal: MedalType;
  overall_score: number;
}

export interface Badge {
  id: string;
  badge_key: string;
  title: string;
  icon: string;
  description: string;
  unlocked_at?: string;
  unlocked: boolean;
}

export interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  file_type: string;
  text_content?: string;
  detected_topics: string[];
  priorities?: {
    high: string[];
    medium: string[];
    quickRevision: string[];
  };
  created_at?: string;
}

export interface MaterialAnalysis {
  topics: string[];
  summaries: { topic: string; summary: string }[];
  keyConcepts: string[];
  priorities: {
    high: string[];
    medium: string[];
    quickRevision: string[];
  };
  recommendedOrder: string[];
  examTips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourceReference?: string;
  sourceFound?: boolean;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface Question {
  id: string;
  topic: string;
  questionType: 'MCQ' | '2-mark' | 'short-answer' | 'long-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

export interface TestAttemptResult {
  attemptId: string;
  score: number;
  earnedMarks: number;
  totalMarks: number;
  medal: MedalType;
  pointsAwarded: number;
  newTotalPoints: number;
  topicScores: Record<string, number>;
  strongTopics: string[];
  improvingTopics: string[];
  needsAttentionTopics: string[];
  gapsDetectedCount: number;
  learningGaps: {
    topic: string;
    score: number;
    severity: string;
    advice: string;
  }[];
  updatedPlan?: { day: number; title: string; desc: string }[];
  unlockedBadge?: { title: string; icon: string; description: string };
  message: string;
}

export interface StudyPlanItem {
  id: string;
  student_id: string;
  day_number: number;
  day_label: string;
  topic: string;
  description: string;
  estimated_minutes: number;
  is_completed: number | boolean;
}

export interface LeaderboardEntry {
  rank: number;
  student: string;
  points: number;
  medal: MedalType;
  badgeIcons: string[];
  isCurrentUser?: boolean;
  note?: string;
}

export interface AnalyticsData {
  lineGraph: { label: string; score: number; date: string }[];
  topicBarGraph: { topic: string; score: number; status: 'Strong' | 'Improving' | 'Needs Attention'; color: string }[];
  comparisonGraph: { topic: string; before: number; after: number; gain: string; status: string }[];
}
