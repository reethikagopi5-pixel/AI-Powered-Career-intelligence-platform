import fs from 'fs';
import path from 'path';
import { UserProfile, ResumeRecord, AnalysisResult, AnalysisHistoryItem } from '../src/types.js';
import { generateSQLiteFile } from './sqlite.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface UserAuthRecord extends UserProfile {
  passwordHash: string;
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESUMES_FILE = path.join(DATA_DIR, 'resumes.json');
const ANALYSES_FILE = path.join(DATA_DIR, 'analyses.json');

// Ensure database JSON files exist on startup
if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);
if (!fs.existsSync(RESUMES_FILE)) writeJSON(RESUMES_FILE, []);
if (!fs.existsSync(ANALYSES_FILE)) writeJSON(ANALYSES_FILE, []);

// Initial generation of SQLite file on boot
generateSQLiteFile().catch((err) => console.error('Initial SQLite sync error:', err));

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    // Sync to SQLite database file asynchronously
    generateSQLiteFile().catch((err) => console.error('SQLite sync error on write:', err));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export function calculateProfileCompletion(user: Partial<UserProfile>): number {
  let score = 0;
  if (user.name) score += 15;
  if (user.email) score += 10;
  if (user.phone) score += 10;
  if (user.targetRole) score += 15;
  if (user.college || user.education) score += 15;
  if (user.experienceYears && user.experienceYears > 0) score += 10;
  if (user.skills && user.skills.length > 0) score += 15;
  if (user.certifications && user.certifications.length > 0) score += 5;
  if (user.projects && user.projects.length > 0) score += 5;
  return Math.min(100, score);
}

// USER OPS
export function findUserByEmail(email: string): UserAuthRecord | undefined {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): UserAuthRecord | undefined {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  return users.find((u) => u.id === id);
}

export function createUser(user: UserAuthRecord): UserAuthRecord {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  user.profileCompletion = calculateProfileCompletion(user);
  users.push(user);
  writeJSON(USERS_FILE, users);
  return user;
}

export function updateUserProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const current = users[index];
  const updatedUser: UserAuthRecord = {
    ...current,
    ...updates,
    skills: updates.skills ?? current.skills ?? [],
    certifications: updates.certifications ?? current.certifications ?? [],
    projects: updates.projects ?? current.projects ?? [],
    careerInterests: updates.careerInterests ?? current.careerInterests ?? [],
  };

  updatedUser.profileCompletion = calculateProfileCompletion(updatedUser);
  users[index] = updatedUser;
  writeJSON(USERS_FILE, users);

  const { passwordHash, ...profile } = updatedUser;
  return profile;
}

// RESUME OPS
export function getResumesByUserId(userId: string): ResumeRecord[] {
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  return resumes.filter((r) => r.userId === userId);
}

export function getResumeById(id: string): ResumeRecord | undefined {
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  return resumes.find((r) => r.id === id);
}

export function saveResumeRecord(record: ResumeRecord): ResumeRecord {
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  // If this resume is set to active, deactivate other resumes for this user
  if (record.isActive) {
    resumes.forEach((r) => {
      if (r.userId === record.userId) r.isActive = false;
    });
  }
  const existingIdx = resumes.findIndex((r) => r.id === record.id);
  if (existingIdx !== -1) {
    resumes[existingIdx] = record;
  } else {
    // If first resume for user, make it active automatically
    const userResumes = resumes.filter((r) => r.userId === record.userId);
    if (userResumes.length === 0) {
      record.isActive = true;
    }
    resumes.push(record);
  }
  writeJSON(RESUMES_FILE, resumes);
  return record;
}

export function setActiveResume(userId: string, resumeId: string): boolean {
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  let found = false;
  resumes.forEach((r) => {
    if (r.userId === userId) {
      if (r.id === resumeId) {
        r.isActive = true;
        found = true;
      } else {
        r.isActive = false;
      }
    }
  });
  if (found) {
    writeJSON(RESUMES_FILE, resumes);
  }
  return found;
}

export function deleteResumeRecord(userId: string, resumeId: string): boolean {
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  const index = resumes.findIndex((r) => r.id === resumeId && r.userId === userId);
  if (index === -1) return false;

  const [removed] = resumes.splice(index, 1);
  if (removed.filePath && fs.existsSync(removed.filePath)) {
    try {
      fs.unlinkSync(removed.filePath);
    } catch (e) {
      console.error('Failed to delete resume file:', e);
    }
  }

  // If deleted resume was active, set the first remaining resume as active
  if (removed.isActive) {
    const remaining = resumes.filter((r) => r.userId === userId);
    if (remaining.length > 0) {
      remaining[0].isActive = true;
    }
  }

  writeJSON(RESUMES_FILE, resumes);
  return true;
}

// ANALYSIS OPS
export function saveAnalysisResult(analysis: AnalysisResult): AnalysisResult {
  const analyses = readJSON<AnalysisResult[]>(ANALYSES_FILE, []);
  analyses.unshift(analysis); // newest first
  writeJSON(ANALYSES_FILE, analyses);
  return analysis;
}

export function getAnalysesByUserId(userId: string): AnalysisHistoryItem[] {
  const analyses = readJSON<AnalysisResult[]>(ANALYSES_FILE, []);
  return analyses
    .filter((a) => a.userId === userId)
    .map((a) => ({
      id: a.id,
      resumeId: a.resumeId,
      resumeName: a.resumeName,
      targetRole: a.targetRole,
      atsScore: a.atsScore,
      createdAt: a.createdAt,
      matchPercentage: a.skillGap.matchPercentage,
    }));
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  const analyses = readJSON<AnalysisResult[]>(ANALYSES_FILE, []);
  return analyses.find((a) => a.id === id);
}

export function getLatestAnalysisByUserId(userId: string): AnalysisResult | undefined {
  const analyses = readJSON<AnalysisResult[]>(ANALYSES_FILE, []);
  return analyses.find((a) => a.userId === userId);
}

// DB BROWSER / ADMIN API HELPERS
export function getAllUsersSanitized(): Omit<UserAuthRecord, 'passwordHash'>[] {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  return users.map(({ passwordHash, ...user }) => user);
}

export function getAllResumesAdmin(): ResumeRecord[] {
  return readJSON<ResumeRecord[]>(RESUMES_FILE, []);
}

export function getAllAnalysesAdmin(): AnalysisResult[] {
  return readJSON<AnalysisResult[]>(ANALYSES_FILE, []);
}

export function getDatabaseSummaryStats() {
  const users = readJSON<UserAuthRecord[]>(USERS_FILE, []);
  const resumes = readJSON<ResumeRecord[]>(RESUMES_FILE, []);
  const analyses = readJSON<AnalysisResult[]>(ANALYSES_FILE, []);

  return {
    userCount: users.length,
    resumeCount: resumes.length,
    analysisCount: analyses.length,
    collections: [
      { name: 'users', count: users.length, description: 'Registered user profiles and career metadata' },
      { name: 'resumes', count: resumes.length, description: 'Uploaded resumes and extracted candidate metadata' },
      { name: 'analyses', count: analyses.length, description: 'AI ATS analysis results, skill gaps, & salary predictions' },
    ],
  };
}

export function getRawCollection(collection: string): any[] {
  if (collection === 'users') {
    return getAllUsersSanitized();
  } else if (collection === 'resumes') {
    return getAllResumesAdmin();
  } else if (collection === 'analyses') {
    return getAllAnalysesAdmin();
  }
  return [];
}

export function saveRawCollection(collection: string, data: any[]): boolean {
  if (!Array.isArray(data)) return false;
  if (collection === 'users') {
    // Preserve existing password hashes when updating users via raw editor
    const existing = readJSON<UserAuthRecord[]>(USERS_FILE, []);
    const passMap = new Map(existing.map((u) => [u.id, u.passwordHash]));
    const updated = data.map((u) => ({
      ...u,
      passwordHash: passMap.get(u.id) || u.passwordHash || '',
    }));
    writeJSON(USERS_FILE, updated);
    return true;
  } else if (collection === 'resumes') {
    writeJSON(RESUMES_FILE, data);
    return true;
  } else if (collection === 'analyses') {
    writeJSON(ANALYSES_FILE, data);
    return true;
  }
  return false;
}

export { UPLOADS_DIR };
