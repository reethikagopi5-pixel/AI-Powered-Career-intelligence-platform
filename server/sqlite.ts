import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
export const SQLITE_FILE_PATH = path.join(DATA_DIR, 'careerai.sqlite');
export const DB_FILE_PATH = path.join(DATA_DIR, 'careerai.db');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  targetRole?: string;
  college?: string;
  experienceYears?: number;
  profileCompletion?: number;
  skills?: string[];
  certifications?: string[];
  projects?: any[];
  passwordHash?: string;
}

interface ResumeRecord {
  id: string;
  userId: string;
  originalName: string;
  fileType: string;
  isActive: boolean;
  uploadDate: string;
  parsedText?: string;
}

interface AnalysisRecord {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  targetRole: string;
  atsScore: number;
  createdAt: string;
  skillGap?: {
    matchPercentage: number;
    missingSkills?: any[];
  };
}

let SQL: any = null;

async function getSQLInstance() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

export async function generateSQLiteFile(): Promise<string> {
  const SqlInstance = await getSQLInstance();
  const db: Database = new SqlInstance.Database();

  // 1. Create Schema for DB Browser for SQLite compatibility
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      target_role TEXT,
      college TEXT,
      experience_years INTEGER,
      profile_completion INTEGER,
      skills TEXT,
      certifications TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_type TEXT,
      is_active INTEGER DEFAULT 0,
      upload_date TEXT,
      parsed_text TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      resume_id TEXT NOT NULL,
      resume_name TEXT,
      target_role TEXT,
      ats_score INTEGER,
      match_percentage REAL,
      missing_skills TEXT,
      created_at TEXT,
      full_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
    );
  `);

  // 2. Load JSON Data
  const usersFile = path.join(DATA_DIR, 'users.json');
  const resumesFile = path.join(DATA_DIR, 'resumes.json');
  const analysesFile = path.join(DATA_DIR, 'analyses.json');

  const users: UserRecord[] = fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile, 'utf-8')) : [];
  const resumes: ResumeRecord[] = fs.existsSync(resumesFile) ? JSON.parse(fs.readFileSync(resumesFile, 'utf-8')) : [];
  const analyses: AnalysisRecord[] = fs.existsSync(analysesFile) ? JSON.parse(fs.readFileSync(analysesFile, 'utf-8')) : [];

  // 3. Populate users table
  const userStmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, phone, target_role, college, experience_years, profile_completion, skills, certifications, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of users) {
    userStmt.run([
      u.id || '',
      u.name || '',
      u.email || '',
      u.phone || '',
      u.targetRole || '',
      u.college || '',
      u.experienceYears || 0,
      u.profileCompletion || 0,
      JSON.stringify(u.skills || []),
      JSON.stringify(u.certifications || []),
      new Date().toISOString(),
    ]);
  }
  userStmt.free();

  // 4. Populate resumes table
  const resumeStmt = db.prepare(`
    INSERT OR REPLACE INTO resumes (id, user_id, original_name, file_type, is_active, upload_date, parsed_text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of resumes) {
    resumeStmt.run([
      r.id || '',
      r.userId || '',
      r.originalName || '',
      r.fileType || '',
      r.isActive ? 1 : 0,
      r.uploadDate || '',
      r.parsedText || '',
    ]);
  }
  resumeStmt.free();

  // 5. Populate analyses table
  const analysisStmt = db.prepare(`
    INSERT OR REPLACE INTO analyses (id, user_id, resume_id, resume_name, target_role, ats_score, match_percentage, missing_skills, created_at, full_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of analyses) {
    analysisStmt.run([
      a.id || '',
      a.userId || '',
      a.resumeId || '',
      a.resumeName || '',
      a.targetRole || '',
      a.atsScore || 0,
      a.skillGap?.matchPercentage || 0,
      JSON.stringify(a.skillGap?.missingSkills || []),
      a.createdAt || new Date().toISOString(),
      JSON.stringify(a),
    ]);
  }
  analysisStmt.free();

  // 6. Export binary SQLite database file
  const binaryData = db.export();
  const buffer = Buffer.from(binaryData);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Save as both .sqlite and .db for convenience with DB Browser for SQLite
  fs.writeFileSync(SQLITE_FILE_PATH, buffer);
  fs.writeFileSync(DB_FILE_PATH, buffer);

  db.close();

  console.log(`[SQLite Engine] Successfully generated SQLite database files at:\n - ${SQLITE_FILE_PATH}\n - ${DB_FILE_PATH}`);
  return SQLITE_FILE_PATH;
}
