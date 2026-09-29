import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'eduflex.sqlite');

export async function getDb(): Promise<Database> {
  if (db) return db;

  if (!SQL) {
    SQL = await initSqlJs();
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    try {
      const filebuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(filebuffer);
      console.log('[SQLite] Loaded existing database from data/eduflex.sqlite');
      return db;
    } catch (e) {
      console.warn('[SQLite] Failed to load existing database, initializing fresh one:', e);
    }
  }

  db = new SQL.Database();
  initSchema(db);
  saveDb();
  console.log('[SQLite] Created new SQLite database schema');
  return db;
}

export function saveDb(): void {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('[SQLite] Error saving database:', err);
  }
}

function initSchema(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      points INTEGER DEFAULT 850,
      streak INTEGER DEFAULT 6,
      medal TEXT DEFAULT 'Silver',
      overall_score INTEGER DEFAULT 78,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      file_type TEXT DEFAULT 'pdf',
      text_content TEXT NOT NULL,
      detected_topics_json TEXT,
      priorities_json TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS test_attempts (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      test_title TEXT NOT NULL,
      subject TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      topic_scores_json TEXT,
      gaps_json TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS study_plans (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      day_label TEXT NOT NULL,
      topic TEXT NOT NULL,
      description TEXT NOT NULL,
      estimated_minutes INTEGER DEFAULT 45,
      is_completed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      badge_key TEXT NOT NULL,
      title TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      unlocked_at TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      material_id TEXT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      source_reference TEXT,
      created_at TEXT
    );
  `);

  // Seed default student: Vyshnavi
  database.run(`
    INSERT OR REPLACE INTO students (id, name, email, points, streak, medal, overall_score, created_at)
    VALUES ('vyshnavi-1', 'Vyshnavi', 'vyshnavi@eduflex.ai', 850, 6, 'Silver', 78, datetime('now'));
  `);

  // Seed default badges
  database.run(`
    INSERT OR REPLACE INTO badges (id, student_id, badge_key, title, icon, description, unlocked_at)
    VALUES 
    ('b1', 'vyshnavi-1', 'consistency', 'Consistency', '🔥', 'Maintained a 6-day learning streak', datetime('now')),
    ('b2', 'vyshnavi-1', 'quick_learner', 'Quick Learner', '🚀', 'Completed diagnostic test within target time', datetime('now'));
  `);

  // Seed default study plan items
  database.run(`
    INSERT OR REPLACE INTO study_plans (id, student_id, day_number, day_label, topic, description, estimated_minutes, is_completed)
    VALUES
    ('sp-1', 'vyshnavi-1', 1, 'Day 1 - Monday', 'Loops Basics', 'Review for and while loop constructs, iteration bounds, and accumulator patterns.', 40, 1),
    ('sp-2', 'vyshnavi-1', 2, 'Day 2 - Tuesday', 'Loop Practice & Debugging', 'Solve 5 nested loop traversal problems and off-by-one edge cases.', 50, 0),
    ('sp-3', 'vyshnavi-1', 3, 'Day 3 - Wednesday', 'Functions Basics', 'Master local vs global scope, default arguments, and return vs print.', 45, 0),
    ('sp-4', 'vyshnavi-1', 4, 'Day 4 - Thursday', 'Revision Test', 'Comprehensive test covering Loops & Functions targeted gaps.', 35, 0),
    ('sp-5', 'vyshnavi-1', 5, 'Day 5 - Friday', 'Advanced Concept Re-Test', 'Final assessment to verify mastery and earn the Big Improvement badge.', 30, 0);
  `);
}
