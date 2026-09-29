import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './server/db.ts';
import {
  analyzeStudyMaterial,
  askEduFlexChat,
  generateTestQuestions
} from './server/ai.ts';
import type { QuestionItem } from './server/ai.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'EduFlex AI',
    tagline: 'Your Pace. Your Path. Your Reward.',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Student profile
app.get('/api/student', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const students = db.exec("SELECT * FROM students WHERE id = 'vyshnavi-1'");
    let student: any = null;

    if (students.length > 0 && students[0].values.length > 0) {
      const cols = students[0].columns;
      const vals = students[0].values[0];
      student = {};
      cols.forEach((col, i) => {
        student[col] = vals[i];
      });
    }

    const badgesRes = db.exec("SELECT * FROM badges WHERE student_id = 'vyshnavi-1'");
    const badges: any[] = [];
    if (badgesRes.length > 0) {
      const cols = badgesRes[0].columns;
      badgesRes[0].values.forEach(row => {
        const item: any = {};
        cols.forEach((col, i) => {
          item[col] = row[i];
        });
        badges.push(item);
      });
    }

    res.json({ student, badges });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Study Material Upload & Text Analysis
app.post('/api/materials/upload', async (req: Request, res: Response) => {
  try {
    const { title, subject, textContent, fileType } = req.body;
    if (!title || !textContent) {
      return res.status(400).json({ error: 'Title and textContent are required' });
    }

    const analysis = await analyzeStudyMaterial(title, textContent);
    const db = await getDb();
    const id = 'mat-' + Date.now();

    const stmt = db.prepare(`
      INSERT INTO materials (id, title, subject, file_type, text_content, detected_topics_json, priorities_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run([
      id,
      title,
      subject || 'General Study',
      fileType || 'pdf',
      textContent,
      JSON.stringify(analysis.topics),
      JSON.stringify(analysis.priorities)
    ]);
    stmt.free();
    saveDb();

    res.json({
      success: true,
      materialId: id,
      title,
      subject,
      analysis,
      message: 'Your study material is ready.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Materials List
app.get('/api/materials', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const resList = db.exec("SELECT id, title, subject, file_type, detected_topics_json, priorities_json, created_at FROM materials ORDER BY created_at DESC");
    const materials: any[] = [];

    if (resList.length > 0) {
      const cols = resList[0].columns;
      resList[0].values.forEach(row => {
        const item: any = {};
        cols.forEach((col, i) => {
          item[col] = row[i];
        });
        if (item.detected_topics_json) {
          try { item.detected_topics = JSON.parse(item.detected_topics_json); } catch (e) { item.detected_topics = []; }
        }
        if (item.priorities_json) {
          try { item.priorities = JSON.parse(item.priorities_json); } catch (e) { item.priorities = null; }
        }
        materials.push(item);
      });
    }

    res.json({ materials });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze on-demand
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { title, text } = req.body;
    const analysis = await analyzeStudyMaterial(title || 'Document', text || '');
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ask EduFlex 🤖 Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { question, materialTitle, materialText, chatHistory } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await askEduFlexChat(
      question,
      materialTitle || 'General Notes',
      materialText || '',
      chatHistory || []
    );

    // Save chat entry in SQLite
    const db = await getDb();
    const stmt = db.prepare(`
      INSERT INTO chat_history (id, student_id, role, content, source_reference, created_at)
      VALUES (?, 'vyshnavi-1', 'user', ?, ?, datetime('now'))
    `);
    stmt.run(['msg-' + Date.now(), question, null]);
    stmt.free();

    const stmtAi = db.prepare(`
      INSERT INTO chat_history (id, student_id, role, content, source_reference, created_at)
      VALUES (?, 'vyshnavi-1', 'assistant', ?, ?, datetime('now'))
    `);
    stmtAi.run(['msg-ai-' + Date.now(), result.answer, result.sourceReference || null]);
    stmtAi.free();
    saveDb();

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI Test Generator
app.post('/api/tests/generate', async (req: Request, res: Response) => {
  try {
    const { subject, topic, difficulty, questionTypes, count, materialText } = req.body;
    const questions = await generateTestQuestions({
      subject: subject || 'Python Basics',
      topic: topic || 'All Topics',
      difficulty: difficulty || 'Medium',
      questionTypes: questionTypes || ['MCQ', '2-mark', 'short-answer'],
      count: count || 5,
      materialText: materialText || ''
    });

    res.json({
      testId: 'test-' + Date.now(),
      subject,
      topic,
      difficulty,
      questions
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test Submission & Performance Gap Analysis
app.post('/api/tests/submit', async (req: Request, res: Response) => {
  try {
    const { testTitle, subject, answers, questions, isReTest } = req.body;
    const db = await getDb();

    let totalMarks = 0;
    let earnedMarks = 0;
    const topicStats: Record<string, { total: number; earned: number }> = {};

    questions.forEach((q: QuestionItem) => {
      const qMarks = q.marks || 2;
      totalMarks += qMarks;
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, earned: 0 };
      }
      topicStats[q.topic].total += qMarks;

      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();

      // Check MCQ or keyphrase match
      let isCorrect = false;
      if (q.questionType === 'MCQ') {
        const optionLetter = correctAns.charAt(0);
        isCorrect = studentAns === correctAns || studentAns.startsWith(optionLetter);
      } else {
        // Simple keyword match for short answers
        const keyWords = correctAns.split(' ').filter(w => w.length > 3);
        const matches = keyWords.filter(w => studentAns.includes(w));
        isCorrect = matches.length >= Math.ceil(keyWords.length * 0.4) || studentAns.length > 20;
      }

      if (isCorrect) {
        earnedMarks += qMarks;
        topicStats[q.topic].earned += qMarks;
      }
    });

    const scorePercentage = Math.round((earnedMarks / Math.max(1, totalMarks)) * 100);

    // Topic categorizations: Strong (>=80%), Improving (60-79%), Needs Attention (<60%)
    const topicScores: Record<string, number> = {};
    const strongTopics: string[] = [];
    const improvingTopics: string[] = [];
    const needsAttentionTopics: string[] = [];

    Object.keys(topicStats).forEach(topic => {
      const pct = Math.round((topicStats[topic].earned / topicStats[topic].total) * 100);
      topicScores[topic] = pct;
      if (pct >= 80) strongTopics.push(topic);
      else if (pct >= 60) improvingTopics.push(topic);
      else needsAttentionTopics.push(topic);
    });

    // Learning gaps detected
    const learningGaps = needsAttentionTopics.map(t => ({
      topic: t,
      score: topicScores[t] || 0,
      severity: 'Critical Gap',
      advice: `Focus on fundamental principles, boundary conditions, and step-by-step examples for ${t}.`
    }));

    // Calculate Points & Badges
    let pointsAwarded = 100; // completion bonus
    if (scorePercentage >= 80) pointsAwarded += 100;
    if (isReTest && scorePercentage > 75) pointsAwarded += 250; // Big improvement reward

    // Determine Medal
    let medal = 'Bronze';
    if (scorePercentage >= 90) medal = 'Gold';
    else if (scorePercentage >= 75) medal = 'Silver';

    // Update Student in SQLite
    const curStudent = db.exec("SELECT points, streak FROM students WHERE id = 'vyshnavi-1'");
    let newPoints = 850;
    let newStreak = 6;
    if (curStudent.length > 0 && curStudent[0].values.length > 0) {
      newPoints = (curStudent[0].values[0][0] as number) + pointsAwarded;
      newStreak = (curStudent[0].values[0][1] as number);
    }

    const updateStmt = db.prepare(`
      UPDATE students 
      SET points = ?, medal = ?, overall_score = ? 
      WHERE id = 'vyshnavi-1'
    `);
    updateStmt.run([newPoints, medal, scorePercentage]);
    updateStmt.free();

    // Check if Big Improvement badge unlocked
    let unlockedBadge: any = null;
    if (isReTest && scorePercentage >= 75) {
      const badgeStmt = db.prepare(`
        INSERT OR REPLACE INTO badges (id, student_id, badge_key, title, icon, description, unlocked_at)
        VALUES ('b-big-imp', 'vyshnavi-1', 'big_improvement', 'Big Improvement', '📈', 'Significantly improved score on Re-Test (+42%)', datetime('now'))
      `);
      badgeStmt.run([]);
      badgeStmt.free();
      unlockedBadge = {
        title: 'Big Improvement',
        icon: '📈',
        description: 'Significantly improved from previous attempt!'
      };
    }

    // Save test attempt
    const attemptId = 'att-' + Date.now();
    const attStmt = db.prepare(`
      INSERT INTO test_attempts (id, student_id, test_title, subject, score, total_questions, topic_scores_json, gaps_json, created_at)
      VALUES (?, 'vyshnavi-1', ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    attStmt.run([
      attemptId,
      testTitle || 'Custom Assessment',
      subject || 'Python Basics',
      scorePercentage,
      questions.length,
      JSON.stringify(topicScores),
      JSON.stringify(learningGaps)
    ]);
    attStmt.free();
    saveDb();

    // Generate personalized study plan recommendations
    const updatedPlan = [
      { day: 1, title: `${needsAttentionTopics[0] || 'Loops'} Deep Dive`, desc: 'Targeted walkthrough of logic traps and accumulator patterns.' },
      { day: 2, title: `${needsAttentionTopics[0] || 'Loops'} Practice Problems`, desc: 'Solve 5 hands-on adaptive practice exercises.' },
      { day: 3, title: `${improvingTopics[0] || 'Functions'} Refinement`, desc: 'Scope hierarchies, parameter contracts, and return values.' },
      { day: 4, title: 'Speed & Accuracy Mock Test', desc: 'Timed review covering all newly mastered topics.' },
      { day: 5, title: 'Final Mastery Assessment', desc: 'Secure Gold medal benchmark score.' }
    ];

    res.json({
      attemptId,
      score: scorePercentage,
      earnedMarks,
      totalMarks,
      medal,
      pointsAwarded,
      newTotalPoints: newPoints,
      topicScores,
      strongTopics,
      improvingTopics,
      needsAttentionTopics,
      gapsDetectedCount: learningGaps.length,
      learningGaps,
      updatedPlan,
      unlockedBadge,
      message: scorePercentage >= 75 ? 'Great improvement! 🎉' : 'Assessment completed.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics & Visualizations API
app.get('/api/analytics', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    // 1. Overall Score History (Line Graph data)
    const attemptsRes = db.exec("SELECT test_title, score, created_at FROM test_attempts WHERE student_id = 'vyshnavi-1' ORDER BY created_at ASC");
    let lineData = [
      { label: 'Test 1', score: 55, date: 'Day 1' },
      { label: 'Test 2', score: 64, date: 'Day 2' },
      { label: 'Test 3', score: 72, date: 'Day 3' },
      { label: 'Diagnostic', score: 78, date: 'Day 4' },
      { label: 'Re-Test', score: 84, date: 'Day 6' }
    ];

    if (attemptsRes.length > 0 && attemptsRes[0].values.length > 2) {
      lineData = attemptsRes[0].values.map((row, idx) => ({
        label: (row[0] as string) || `Test ${idx + 1}`,
        score: row[1] as number,
        date: `Attempt ${idx + 1}`
      }));
    }

    // 2. Topic-wise Performance (Bar Chart data)
    const topicData = [
      { topic: 'Variables', score: 90, status: 'Strong', color: '#10B981' },
      { topic: 'Conditions', score: 85, status: 'Strong', color: '#10B981' },
      { topic: 'Loops', score: 82, status: 'Improving', color: '#F59E0B' },
      { topic: 'Functions', score: 75, status: 'Improving', color: '#F59E0B' },
      { topic: 'Lists', score: 88, status: 'Strong', color: '#10B981' },
      { topic: 'Problem Solving', score: 80, status: 'Strong', color: '#10B981' }
    ];

    // 3. Before vs After Improvement (Comparison Chart data)
    const comparisonData = [
      { topic: 'Loops', before: 40, after: 82, gain: '+42%', status: 'Needs Attention -> Improving' },
      { topic: 'Functions', before: 55, after: 75, gain: '+20%', status: 'Needs Attention -> Improving' },
      { topic: 'Problem Solving', before: 62, after: 80, gain: '+18%', status: 'Improving -> Strong' },
      { topic: 'Conditions', before: 78, after: 85, gain: '+7%', status: 'Improving -> Strong' }
    ];

    res.json({
      lineGraph: lineData,
      topicBarGraph: topicData,
      comparisonGraph: comparisonData
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Study Planner items
app.get('/api/study-plan', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const plansRes = db.exec("SELECT * FROM study_plans WHERE student_id = 'vyshnavi-1' ORDER BY day_number ASC");
    const plans: any[] = [];

    if (plansRes.length > 0) {
      const cols = plansRes[0].columns;
      plansRes[0].values.forEach(row => {
        const item: any = {};
        cols.forEach((col, i) => {
          item[col] = row[i];
        });
        plans.push(item);
      });
    }

    res.json({ plans });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle study plan item
app.post('/api/study-plan/toggle', async (req: Request, res: Response) => {
  try {
    const { planId, isCompleted } = req.body;
    const db = await getDb();
    const stmt = db.prepare('UPDATE study_plans SET is_completed = ? WHERE id = ?');
    stmt.run([isCompleted ? 1 : 0, planId]);
    stmt.free();

    // Reward points for task completion
    if (isCompleted) {
      const pointStmt = db.prepare("UPDATE students SET points = points + 50 WHERE id = 'vyshnavi-1'");
      pointStmt.run([]);
      pointStmt.free();
    }
    saveDb();

    res.json({ success: true, earnedBonusPoints: isCompleted ? 50 : 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Classroom Leaderboard
app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const studentRes = db.exec("SELECT name, points, medal FROM students WHERE id = 'vyshnavi-1'");
    let myPoints = 850;
    let myMedal = 'Silver';
    let myName = 'Vyshnavi';

    if (studentRes.length > 0 && studentRes[0].values.length > 0) {
      myName = studentRes[0].values[0][0] as string;
      myPoints = studentRes[0].values[0][1] as number;
      myMedal = studentRes[0].values[0][2] as string;
    }

    const leaderboard = [
      { rank: 1, student: 'Aisha', points: 1250, medal: 'Gold', badgeIcons: ['🚀', '🔥', '💯'], note: 'Top of class' },
      { rank: 2, student: 'Rahul', points: 1100, medal: 'Gold', badgeIcons: ['🏆', '💯'], note: 'Consistent solver' },
      { rank: 3, student: `${myName} (You)`, points: myPoints, medal: myMedal, badgeIcons: ['📈', '🔥', '🚀'], isCurrentUser: true },
      { rank: 4, student: 'Ananya', points: 850, medal: 'Silver', badgeIcons: ['🚀'], note: 'Active learner' },
      { rank: 5, student: 'Dev', points: 720, medal: 'Bronze', badgeIcons: ['🔥'], note: 'Improving pace' },
      { rank: 6, student: 'Karan', points: 640, medal: 'Bronze', badgeIcons: ['🚀'], note: 'Active learner' }
    ];

    // Sort dynamically by points
    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((item, index) => {
      item.rank = index + 1;
    });

    res.json({
      leaderboard,
      disclaimer: 'Leaderboard uses demo data.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Demo State (For judges/testing)
app.post('/api/reset-demo', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    db.run("UPDATE students SET points = 850, streak = 6, medal = 'Silver', overall_score = 78 WHERE id = 'vyshnavi-1'");
    db.run("DELETE FROM badges WHERE badge_key = 'big_improvement'");
    db.run("UPDATE study_plans SET is_completed = 0 WHERE id != 'sp-1'");
    db.run("UPDATE study_plans SET is_completed = 1 WHERE id = 'sp-1'");
    saveDb();
    res.json({ success: true, message: 'Demo state reset to initial baseline successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Seed default documents if materials table is empty
async function seedDefaultMaterials() {
  const db = await getDb();
  const existing = db.exec('SELECT COUNT(*) FROM materials');
  const count = existing.length > 0 ? (existing[0].values[0][0] as number) : 0;

  if (count === 0) {
    const netDoc = `COMPUTER NETWORKS UNIT 3: WIRELESS COMMUNICATION & MULTIPLE ACCESS

1. INTRODUCTION TO MULTIPLE ACCESS TECHNIQUES
Multiple access schemes allow multiple mobile users to share the finite allocated radio spectrum simultaneously in wireless cellular communication. The three fundamental conventional multiple access schemes are FDMA, TDMA, and CDMA.

2. FREQUENCY DIVISION MULTIPLE ACCESS (FDMA)
- In FDMA, the total available radio bandwidth is divided into discrete, non-overlapping frequency bands or channels.
- Each user is assigned an exclusive frequency band for the entire duration of the call session.
- Guard bands are mandatory between adjacent frequency slots to avoid cross-channel interference.
- High spectral inefficiency occurs if a user is silent because the frequency cannot be reallocated on a millisecond basis.

3. TIME DIVISION MULTIPLE ACCESS (TDMA)
- In TDMA, the entire radio frequency channel is shared in the time domain by dividing time into cyclical frames containing multiple discrete time slots.
- Each user transmits digital data packets exclusively during their allocated time slot.
- Guard times are required to account for signal propagation delays and synchronization jitter between distant mobile stations.
- Extensively utilized in GSM cellular systems (8 time slots per 200 kHz radio carrier).

4. CODE DIVISION MULTIPLE ACCESS (CDMA)
- In CDMA, all mobile users transmit simultaneously over the entire available broad frequency channel.
- Separation of user signals is achieved through the use of unique, mutually orthogonal pseudo-random noise (PN) or Walsh codes.
- The receiver executes cross-correlation with the specific assigned code, extracting the desired signal while treating all other simultaneous transmissions as background white Gaussian noise.
- Features 'Soft Capacity': No absolute theoretical boundary on user capacity; system performance degrades gracefully as user numbers increase.
- Crucial Engineering Constraint: The Near-Far Problem. A transmitter near the base station will overpower distant transmitters unless rapid closed-loop Power Control is enforced to equalize received power levels.

5. GLOBAL SYSTEM FOR MOBILE COMMUNICATIONS (GSM)
- GSM is the global second-generation (2G) digital cellular communications standard.
- Operates on a hybrid FDMA/TDMA structure with 200 kHz channel spacing and 8 time slots per carrier frame.
- Core Architecture consists of:
  * Mobile Station (MS): Mobile equipment and Subscriber Identity Module (SIM).
  * Base Station Subsystem (BSS): Base Transceiver Stations (BTS) and Base Station Controller (BSC).
  * Network Switching Subsystem (NSS): Mobile Switching Center (MSC), Home Location Register (HLR), Visitor Location Register (VLR), and Authentication Center (AuC).

6. CELLULAR ARCHITECTURE & FREQUENCY REUSE
- Cellular systems divide geographical terrain into geometric cells (represented as regular hexagons for theoretical coverage modeling).
- Frequency Reuse Principle: Cells spaced sufficiently apart can reuse the identical set of radio frequencies without causing unacceptable co-channel interference.
- Cluster Size N must satisfy N = i^2 + ij + j^2 where i and j are non-negative integers (common values N = 3, 4, 7, 12).
- Handoff / Handover: Mechanism of transferring an active call or data session from one cell's base station to another as the user moves. Hard Handover (Break-before-make in GSM) vs Soft Handover (Make-before-break in CDMA).`;

    const pyDoc = `PYTHON FUNDAMENTALS & ALGORITHMIC PROBLEM SOLVING

1. VARIABLES AND OBJECT REFERENCES
- In Python, variables are labels (pointers) referencing objects allocated in dynamic heap memory.
- Fundamental types:
  * Immutable: int, float, str, tuple, frozenset, bytes.
  * Mutable: list, dict, set, bytearray.
- Assignment with mutable objects creates alias references: y = x binds y to the same underlying heap object. Modifying y alters x.

2. CONDITIONAL BRANCHING & TRUTHINESS
- Expressions are evaluated in boolean context.
- Falsy values: False, None, numeric zero (0, 0.0), empty collections ("", (), [], {}, set()).
- Truthy values: All non-empty objects and non-zero values (including string "0" and list [False]).
- Short-circuit evaluation in 'and' and 'or' halts execution as soon as truth value is determined.

3. ITERATION CONSTRUCTS: FOR & WHILE LOOPS
- 'for' loops execute definite iteration through iterables via the iterator protocol (__iter__ and __next__).
- range(start, stop, step): Generates integers from start up to, but NOT including, stop.
  * Common exam trap: range(1, 5) yields 1, 2, 3, 4 (4 iterations, not 5).
- 'while' loops execute indefinite iteration dependent upon a condition.
  * Off-by-one errors occur when loop counters increment incorrectly or condition bounds use '<' instead of '<='.
- Control statements:
  * break: Terminates the innermost enclosing loop immediately.
  * continue: Aborts the remainder of current iteration and proceeds to the next iteration test.
  * else clause on loops: Executes ONLY if the loop finishes naturally without encountering a break statement.

4. FUNCTIONS & SCOPE HIERARCHY (LEGB RULE)
- Functions defined via 'def' keyword with parameters, default values, *args, and **kwargs.
- Variable scope resolution follows LEGB:
  * L (Local): Variables declared inside current function.
  * E (Enclosing): Variables in enclosing functions (closures).
  * G (Global): Module-level variables.
  * B (Built-in): Predefined Python namespace (print, len, range).
- Modifying a global or enclosing variable inside a local scope requires explicit 'global' or 'nonlocal' declaration.

5. LISTS, SLICING & ACCUMULATOR PATTERNS
- List slicing syntax: list[start:stop:step]. Step of -1 reverses list efficiently (nums[::-1]).
- Accumulator pattern: Initializing sum_val = 0 before an iteration block and updating inside the loop.`;

    const mat1Id = 'mat-cn-unit3';
    const mat2Id = 'mat-python-basics';

    const stmt1 = db.prepare(`
      INSERT OR REPLACE INTO materials (id, title, subject, file_type, text_content, detected_topics_json, priorities_json, created_at)
      VALUES (?, ?, ?, 'pdf', ?, ?, ?, datetime('now'))
    `);
    stmt1.run([
      mat1Id,
      'Computer Networks Unit 3.pdf',
      'Computer Networks',
      netDoc,
      JSON.stringify(['CDMA', 'GSM', 'FDMA', 'TDMA', 'Cellular Architecture']),
      JSON.stringify({
        high: ['CDMA', 'GSM'],
        medium: ['FDMA', 'TDMA'],
        quickRevision: ['Cellular Architecture']
      })
    ]);
    stmt1.free();

    const stmt2 = db.prepare(`
      INSERT OR REPLACE INTO materials (id, title, subject, file_type, text_content, detected_topics_json, priorities_json, created_at)
      VALUES (?, ?, ?, 'pdf', ?, ?, ?, datetime('now'))
    `);
    stmt2.run([
      mat2Id,
      'Python Basics & Problem Solving.pdf',
      'Python Basics',
      pyDoc,
      JSON.stringify(['Variables', 'Conditions', 'Loops', 'Functions', 'Lists']),
      JSON.stringify({
        high: ['Loops', 'Functions'],
        medium: ['Lists', 'Basic problem solving'],
        quickRevision: ['Variables', 'Conditions']
      })
    ]);
    stmt2.free();
    saveDb();
    console.log('[SQLite] Seeded default study materials: Computer Networks Unit 3 & Python Basics');
  }
}

async function startServer() {
  await seedDefaultMaterials();

  // In development, hook up Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduFlex AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting EduFlex AI server:', err);
});
