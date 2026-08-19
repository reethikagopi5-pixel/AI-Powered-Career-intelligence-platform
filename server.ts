import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  getResumesByUserId,
  getResumeById,
  saveResumeRecord,
  setActiveResume,
  deleteResumeRecord,
  saveAnalysisResult,
  getAnalysesByUserId,
  getAnalysisById,
  getLatestAnalysisByUserId,
  getAllUsersSanitized,
  getAllResumesAdmin,
  getAllAnalysesAdmin,
  getDatabaseSummaryStats,
  getRawCollection,
  saveRawCollection,
  UPLOADS_DIR,
} from './server/db.js';
import { generateSQLiteFile, SQLITE_FILE_PATH, DB_FILE_PATH } from './server/sqlite.js';
import { parseResumeFile } from './server/parser.js';
import { generateContentWithRetry } from './server/geminiHelper.js';
import { UserProfile, ResumeRecord, AnalysisResult } from './src/types.js';

const currentDirname = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const JWT_SECRET = process.env.JWT_SECRET || 'careerai-jwt-secret-key-2026';
const PORT = 3000;

const app = express();
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedExts = ['.pdf', '.docx', '.txt', '.doc', '.rtf', '.odt', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type (${ext}). Allowed: PDF, DOCX, TXT, DOC, RTF, ODT, JPG, PNG.`));
    }
  },
});

// Auth Middleware
interface AuthRequest extends Request {
  user?: UserProfile;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    const { passwordHash, ...profile } = user;
    req.user = profile;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
}

// ================= AUTH ENDPOINTS =================

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, targetRole } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const existing = findUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

    const newUser = createUser({
      id: userId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      targetRole: targetRole ? targetRole.trim() : 'Software Engineer',
      passwordHash,
      skills: [],
      certifications: [],
      projects: [],
      careerInterests: [],
      profileCompletion: 25,
    });

    const { passwordHash: _, ...profile } = newUser;
    const token = jwt.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = findUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const { passwordHash: _, ...profile } = user;
    const token = jwt.sign({ userId: profile.id, email: profile.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Update Profile
app.put('/api/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      name,
      phone,
      targetRole,
      college,
      education,
      experienceYears,
      skills,
      certifications,
      projects,
      careerInterests,
    } = req.body;

    const updated = updateUserProfile(userId, {
      name,
      phone,
      targetRole,
      college,
      education,
      experienceYears: experienceYears ? Number(experienceYears) : 0,
      skills: Array.isArray(skills) ? skills : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      projects: Array.isArray(projects) ? projects : [],
      careerInterests: Array.isArray(careerInterests) ? careerInterests : [],
    });

    if (!updated) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.json({ user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// ================= RESUME MANAGEMENT ENDPOINTS =================

// Upload Resume
app.post(
  '/api/resume/upload',
  authenticateToken,
  upload.single('resume'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No resume file uploaded' });
        return;
      }

      const userId = req.user!.id;
      const originalName = req.file.originalname;
      const fileExt = path.extname(originalName).replace('.', '').toLowerCase();

      // Parse text & extract structured data
      const { rawText, extractedData } = await parseResumeFile(
        req.file.path,
        originalName,
        req.file.mimetype
      );

      const resumeId = 'res_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

      const resumeRecord: ResumeRecord = {
        id: resumeId,
        userId,
        filename: req.file.filename,
        originalName,
        fileType: fileExt,
        size: req.file.size,
        uploadDate: new Date().toISOString(),
        isActive: true,
        extractedData,
        filePath: req.file.path,
      };

      const saved = saveResumeRecord(resumeRecord);

      // Auto-update user skills/contact if empty
      if (extractedData.skills.length > 0 && (!req.user!.skills || req.user!.skills.length === 0)) {
        updateUserProfile(userId, {
          skills: extractedData.skills,
          phone: extractedData.phone || req.user!.phone,
        });
      }

      res.json({
        message: 'Resume uploaded and parsed successfully',
        resume: saved,
        extractedData,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to parse and upload resume' });
    }
  }
);

// List User Resumes
app.get('/api/resume/list', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resumes = getResumesByUserId(req.user!.id);
    res.json({ resumes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch resumes' });
  }
});

// Download Original Resume
app.get('/api/resume/:id/download', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const resume = getResumeById(req.params.id);
    if (!resume || resume.userId !== req.user!.id) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    if (!resume.filePath || !fs.existsSync(resume.filePath)) {
      res.status(404).json({ error: 'Physical file not found on server disk' });
      return;
    }

    res.download(resume.filePath, resume.originalName);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Download failed' });
  }
});

// Replace Resume
app.put(
  '/api/resume/:id/replace',
  authenticateToken,
  upload.single('resume'),
  async (req: AuthRequest, res: Response) => {
    try {
      const existing = getResumeById(req.params.id);
      if (!existing || existing.userId !== req.user!.id) {
        res.status(404).json({ error: 'Resume not found' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No replacement file uploaded' });
        return;
      }

      // Delete old physical file if exists
      if (existing.filePath && fs.existsSync(existing.filePath)) {
        try {
          fs.unlinkSync(existing.filePath);
        } catch (e) {
          console.error('Old file deletion error:', e);
        }
      }

      const originalName = req.file.originalname;
      const fileExt = path.extname(originalName).replace('.', '').toLowerCase();

      const { extractedData } = await parseResumeFile(
        req.file.path,
        originalName,
        req.file.mimetype
      );

      const updatedRecord: ResumeRecord = {
        ...existing,
        filename: req.file.filename,
        originalName,
        fileType: fileExt,
        size: req.file.size,
        uploadDate: new Date().toISOString(),
        extractedData,
        filePath: req.file.path,
      };

      const saved = saveResumeRecord(updatedRecord);

      res.json({
        message: 'Resume replaced successfully',
        resume: saved,
        extractedData,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Replace failed' });
    }
  }
);

// Activate Resume
app.put('/api/resume/:id/activate', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const success = setActiveResume(req.user!.id, req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    const resumes = getResumesByUserId(req.user!.id);
    res.json({ message: 'Active resume updated', resumes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Activation failed' });
  }
});

// Delete Resume
app.delete('/api/resume/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const success = deleteResumeRecord(req.user!.id, req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    const resumes = getResumesByUserId(req.user!.id);
    res.json({ message: 'Resume deleted successfully', resumes });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Delete failed' });
  }
});

// ================= AI ANALYSIS ENGINE =================

async function runAIOrFallbackAnalysis(
  rawText: string,
  targetRole: string,
  userSkills: string[],
  resumeName: string
): Promise<Omit<AnalysisResult, 'id' | 'userId' | 'resumeId' | 'createdAt' | 'resumeName'>> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an expert AI Career Coach and ATS Scoring Engine.
Analyze the following resume text for a candidate targeting the role: "${targetRole}".

RESUME TEXT:
${rawText.slice(0, 4000)}

CANDIDATE KNOWN SKILLS: ${userSkills.join(', ')}

Provide a structured analysis in strictly valid JSON format matching this JSON schema:
{
  "atsScore": number (0-100),
  "scoreBreakdown": {
    "keywordMatch": number (0-100),
    "formatting": number (0-100),
    "impactMetrics": number (0-100),
    "sectionCompleteness": number (0-100)
  },
  "summary": "2-3 concise sentences summarizing key strengths and fit for ${targetRole}",
  "skillGap": {
    "matchPercentage": number (0-100),
    "identifiedStrengths": ["skill1", "skill2", ...],
    "missingSkills": [
      {
        "name": "Missing Skill Name",
        "importance": "High" | "Medium" | "Low",
        "category": "Technical" | "Soft Skills" | "Tools & Architecture"
      }
    ],
    "totalRequiredSkills": number,
    "matchedCount": number,
    "missingCount": number
  },
  "careerPath": {
    "recommendedRole": "${targetRole}",
    "alignmentProbability": number (e.g. 84.5),
    "roadmap": [
      {
        "level": "Step 01",
        "title": "Current Baseline / Junior Phase",
        "timeline": "0 - 1 Years",
        "requiredSkills": ["skillA", "skillB"],
        "responsibilities": ["responsibility 1", "responsibility 2"],
        "description": "Short milestone description"
      },
      {
        "level": "Step 02",
        "title": "Mid-Level ${targetRole}",
        "timeline": "1 - 3 Years",
        "requiredSkills": ["skillC", "skillD"],
        "responsibilities": ["responsibility 1", "responsibility 2"],
        "description": "Mid milestone description"
      },
      {
        "level": "Step 03",
        "title": "Senior / Lead ${targetRole}",
        "timeline": "3 - 5 Years",
        "requiredSkills": ["skillE", "skillF"],
        "responsibilities": ["responsibility 1", "responsibility 2"],
        "description": "Senior milestone description"
      },
      {
        "level": "Step 04",
        "title": "Principal / Staff Architect",
        "timeline": "5+ Years",
        "requiredSkills": ["Leadership", "System Architecture"],
        "responsibilities": ["Strategic vision", "Org-wide impact"],
        "description": "Leadership level description"
      }
    ],
    "alternatePaths": [
      {
        "role": "Alternate Role 1",
        "matchScore": number (0-100),
        "description": "Why this secondary path is a good pivot"
      },
      {
        "role": "Alternate Role 2",
        "matchScore": number (0-100),
        "description": "Why this secondary path is a good pivot"
      }
    ]
  },
  "salaryPrediction": {
    "currentEstimatedMin": number (e.g. 850000 in INR),
    "currentEstimatedAvg": number (e.g. 1450000 in INR),
    "currentEstimatedMax": number (e.g. 2400000 in INR),
    "currency": "₹",
    "trajectory": [
      { "year": 1, "yearLabel": "Year 1", "minSalary": 850000, "avgSalary": 1150000, "maxSalary": 1450000 },
      { "year": 2, "yearLabel": "Year 2", "minSalary": 1050000, "avgSalary": 1450000, "maxSalary": 1800000 },
      { "year": 3, "yearLabel": "Year 3", "minSalary": 1350000, "avgSalary": 1850000, "maxSalary": 2250000 },
      { "year": 4, "yearLabel": "Year 4", "minSalary": 1700000, "avgSalary": 2250000, "maxSalary": 2800000 },
      { "year": 5, "yearLabel": "Year 5", "minSalary": 2100000, "avgSalary": 2750000, "maxSalary": 3500000 }
    ],
    "topSkillPremiums": [
      { "skill": "Skill Name 1", "estimatedValueBoost": "+₹2.5 Lakhs/yr Boost" },
      { "skill": "Skill Name 2", "estimatedValueBoost": "+₹1.8 Lakhs/yr Boost" }
    ],
    "marketDemandFactor": "High Demand (Top 10% in Market)"
  },
  "learningResources": [
    {
      "id": "lr_1",
      "skillName": "Missing Skill 1",
      "courseTitle": "Mastering Missing Skill 1",
      "platform": "Coursera / Udemy",
      "difficulty": "Intermediate",
      "estimatedHours": 18,
      "rating": 4.8,
      "url": "https://www.coursera.org"
    },
    {
      "id": "lr_2",
      "skillName": "Missing Skill 2",
      "courseTitle": "Hands-On Missing Skill 2 Deep Dive",
      "platform": "pluralsight / edX",
      "difficulty": "Advanced",
      "estimatedHours": 24,
      "rating": 4.9,
      "url": "https://www.edx.org"
    }
  ],
  "improvementTips": [
    {
      "category": "Impact",
      "severity": "Critical",
      "tip": "Quantify project achievements using metrics (e.g. improved latency by 35%).",
      "exampleText": "Led optimization reducing response times from 450ms to 280ms."
    },
    {
      "category": "Keywords",
      "severity": "Recommended",
      "tip": "Incorporate key industry standard terms like Docker, CI/CD pipelines.",
      "exampleText": "Architected cloud deployment using Docker and automated GitHub Actions."
    }
  ]
}
Return ONLY valid JSON.
`;

      const response = await generateContentWithRetry(ai, {
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        let cleanText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        return {
          targetRole,
          atsScore: parsed.atsScore || 78,
          scoreBreakdown: parsed.scoreBreakdown || {
            keywordMatch: 80,
            formatting: 85,
            impactMetrics: 70,
            sectionCompleteness: 90,
          },
          summary:
            parsed.summary ||
            `Candidate demonstrates solid alignment for ${targetRole} with key proficiency in core skills.`,
          skillGap: parsed.skillGap || {
            matchPercentage: 75,
            identifiedStrengths: ['JavaScript', 'React', 'Problem Solving'],
            missingSkills: [
              { name: 'System Architecture', importance: 'High', category: 'Architecture' },
              { name: 'Docker / CI/CD', importance: 'Medium', category: 'DevOps' },
            ],
            totalRequiredSkills: 10,
            matchedCount: 7,
            missingCount: 3,
          },
          careerPath: parsed.careerPath,
          salaryPrediction: parsed.salaryPrediction,
          learningResources: parsed.learningResources || [],
          improvementTips: parsed.improvementTips || [],
          extractedData: {
            name: 'Candidate',
            email: '',
            phone: '',
            education: [],
            experience: [],
            skills: userSkills,
            certifications: [],
            projects: [],
            rawText,
          },
        };
      }
    } catch (err) {
      console.error('Gemini API call error, falling back to rule engine:', err);
    }
  }

  // Smart Rule-Based Engine Fallback
  const lowerText = rawText.toLowerCase();
  const knownStrengths = Array.from(
    new Set(
      userSkills.filter((s) => s.length > 1 && lowerText.includes(s.toLowerCase()))
    )
  );
  if (knownStrengths.length === 0) {
    knownStrengths.push('Software Fundamentals', 'Problem Solving', 'Technical Communication');
  }

  const roleKeywords: Record<string, string[]> = {
    'Software Engineer': ['React', 'Node.js', 'TypeScript', 'SQL', 'System Design', 'Git', 'Docker'],
    'Frontend Developer': ['React', 'TypeScript', 'Tailwind', 'HTML5/CSS3', 'Jest', 'UI/UX Design', 'Next.js'],
    'Full Stack Developer': ['React', 'Express', 'Node.js', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker'],
    'Data Scientist': ['Python', 'SQL', 'Pandas', 'Machine Learning', 'TensorFlow', 'Data Visualization', 'Statistics'],
    'Product Manager': ['Product Roadmap', 'Agile/Scrum', 'User Research', 'Data Analytics', 'JIRA', 'A/B Testing'],
  };

  const targetReqs = roleKeywords[targetRole] || ['Core Programming', 'System Architecture', 'Database Management', 'Cloud Infrastructure', 'Agile Methodologies'];
  const matched = targetReqs.filter((req) => lowerText.includes(req.toLowerCase()) || userSkills.some((s) => s.toLowerCase().includes(req.toLowerCase())));
  const missing = targetReqs.filter((req) => !matched.includes(req));

  const matchPct = Math.min(95, Math.max(55, Math.round((matched.length / targetReqs.length) * 100)));
  const atsScore = Math.min(98, Math.max(62, matchPct + 10));

  return {
    targetRole,
    atsScore,
    scoreBreakdown: {
      keywordMatch: matchPct,
      formatting: 88,
      impactMetrics: 72,
      sectionCompleteness: 92,
    },
    summary: `Your profile demonstrates strong alignment (${matchPct}%) for the ${targetRole} position. Strengthening key missing technical competencies will optimize recruiter ATS ranking.`,
    skillGap: {
      matchPercentage: matchPct,
      identifiedStrengths: knownStrengths.concat(matched),
      missingSkills: missing.map((m, idx) => ({
        name: m,
        importance: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low',
        category: 'Core Competency',
      })),
      totalRequiredSkills: targetReqs.length,
      matchedCount: matched.length,
      missingCount: missing.length,
    },
    careerPath: {
      recommendedRole: targetRole,
      alignmentProbability: parseFloat((matchPct * 0.95).toFixed(1)),
      roadmap: [
        {
          level: 'Step 01',
          title: `Junior ${targetRole}`,
          timeline: '0 - 1 Years',
          requiredSkills: matched.slice(0, 2),
          responsibilities: ['Feature development & bug fixes', 'Code review participation', 'Unit test writing'],
          description: 'Establish operational fluency with the stack and team workflows.',
        },
        {
          level: 'Step 02',
          title: `Mid-Level ${targetRole}`,
          timeline: '1 - 3 Years',
          requiredSkills: matched.concat(missing.slice(0, 1)),
          responsibilities: ['Module architecture ownership', 'Cross-functional collaboration', 'Performance optimization'],
          description: 'Lead standalone feature domains and mentor junior engineers.',
        },
        {
          level: 'Step 03',
          title: `Senior ${targetRole}`,
          timeline: '3 - 5 Years',
          requiredSkills: ['System Design', 'Technical Leadership', 'Cloud Architecture'],
          responsibilities: ['System architecture decisions', 'Technical strategy & RFCs', 'Team technical mentoring'],
          description: 'Drive high-impact engineering design and organizational alignment.',
        },
        {
          level: 'Step 04',
          title: 'Lead Architect / Tech Principal',
          timeline: '5+ Years',
          requiredSkills: ['Org Strategy', 'Distributed Systems', 'Engineering Management'],
          responsibilities: ['Company-wide tech vision', 'Strategic vendor & platform choices', 'Engineering excellence standards'],
          description: 'Shape long-term technical direction and strategic architecture.',
        },
      ],
      alternatePaths: [
        {
          role: targetRole.includes('Developer') ? 'Full Stack Architect' : 'Technical Product Manager',
          matchScore: Math.min(92, matchPct + 5),
          description: 'Strong technical baseline allows seamless transition into strategic technical planning.',
        },
        {
          role: 'DevOps / Platform Engineer',
          matchScore: Math.max(60, matchPct - 12),
          description: 'Leverage development experience to automate cloud infrastructure and CI/CD pipelines.',
        },
      ],
    },
    salaryPrediction: {
      currentEstimatedMin: 850000,
      currentEstimatedAvg: 1450000,
      currentEstimatedMax: 2400000,
      currency: '₹',
      trajectory: [
        { year: 1, yearLabel: 'Year 1', minSalary: 850000, avgSalary: 1150000, maxSalary: 1450000 },
        { year: 2, yearLabel: 'Year 2', minSalary: 1050000, avgSalary: 1450000, maxSalary: 1800000 },
        { year: 3, yearLabel: 'Year 3', minSalary: 1350000, avgSalary: 1850000, maxSalary: 2250000 },
        { year: 4, yearLabel: 'Year 4', minSalary: 1700000, avgSalary: 2250000, maxSalary: 2800000 },
        { year: 5, yearLabel: 'Year 5', minSalary: 2100000, avgSalary: 2750000, maxSalary: 3500000 },
      ],
      topSkillPremiums: [
        { skill: missing[0] || 'System Design', estimatedValueBoost: '+₹2.5 Lakhs/yr Valuation Boost' },
        { skill: missing[1] || 'Cloud Infrastructure', estimatedValueBoost: '+₹1.8 Lakhs/yr Valuation Boost' },
      ],
      marketDemandFactor: 'High Demand (Top 12% in Market)',
    },
    learningResources: (missing.length > 0 ? missing : ['System Design', 'Cloud DevOps']).map((sk, i) => ({
      id: `lr_${i + 1}`,
      skillName: sk,
      courseTitle: `Comprehensive ${sk} Mastery & Real-World Projects`,
      platform: i % 2 === 0 ? 'Coursera' : 'Pluralsight',
      difficulty: 'Intermediate' as const,
      estimatedHours: 16 + i * 8,
      rating: 4.8,
      url: 'https://www.coursera.org',
    })),
    improvementTips: [
      {
        category: 'Impact',
        severity: 'Critical',
        tip: 'Add metric-driven accomplishment bullets (e.g. "Reduced page render times by 40%").',
        exampleText: 'Optimized state rendering logic reducing dashboard load latency by 320ms.',
      },
      {
        category: 'Keywords',
        severity: 'Recommended',
        tip: `Include missing target keywords like ${missing.slice(0, 2).join(', ')} in skills and project descriptions.`,
        exampleText: `Architected containerized services utilizing ${missing[0] || 'Docker'}.`,
      },
      {
        category: 'Structure',
        severity: 'Minor',
        tip: 'Ensure section headers adhere to standard ATS names (e.g., "Work Experience", "Education").',
      },
    ],
    extractedData: {
      name: 'Candidate',
      email: '',
      phone: '',
      education: [],
      experience: [],
      skills: userSkills,
      certifications: [],
      projects: [],
      rawText,
    },
  };
}

// Run Analysis
app.post('/api/resume/analyze', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { resumeId, targetRole } = req.body;

    const resumes = getResumesByUserId(userId);
    let targetResume: ResumeRecord | undefined;

    if (resumeId) {
      targetResume = resumes.find((r) => r.id === resumeId);
    } else {
      targetResume = resumes.find((r) => r.isActive) || resumes[0];
    }

    if (!targetResume) {
      res.status(400).json({ error: 'No resume found. Please upload a resume first.' });
      return;
    }

    const effectiveRole = targetRole || req.user!.targetRole || 'Software Engineer';
    const rawText = targetResume.extractedData?.rawText || `Resume text for ${targetResume.originalName}`;

    const analysisOutput = await runAIOrFallbackAnalysis(
      rawText,
      effectiveRole,
      req.user!.skills || [],
      targetResume.originalName
    );

    const analysisResult: AnalysisResult = {
      id: 'anl_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      userId,
      resumeId: targetResume.id,
      resumeName: targetResume.originalName,
      createdAt: new Date().toISOString(),
      ...analysisOutput,
      extractedData: targetResume.extractedData || analysisOutput.extractedData,
    };

    const saved = saveAnalysisResult(analysisResult);
    res.json({ analysis: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// ================= AI MENTOR CHAT ENDPOINT =================
app.post('/api/mentor/chat', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { message, category } = req.body;
    const user = req.user!;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && message) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are CareerAI Mentor, an elite career coach, corporate recruiter, and hiring manager at a Fortune 500 tech company.
User details: Name: ${user.name}, Target Role: ${user.targetRole}, Skills: ${(user.skills || []).join(', ')}.
Provide direct, actionable, encouraging, and highly strategic career advice. Include 3 short relevant follow-up questions at the bottom formatted as JSON:
{
  "reply": "Your detailed advice...",
  "suggestedFollowups": ["Question 1?", "Question 2?", "Question 3?"]
}`;

        const response = await generateContentWithRetry(ai, {
          model: 'gemini-3.6-flash',
          contents: `User message: "${message}"`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          let cleanText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          res.json({
            reply: parsed.reply,
            suggestedFollowups: parsed.suggestedFollowups || [
              'How can I highlight this in my resume?',
              'What interview questions should I expect for this?',
              'Which online course covers this skill best?'
            ],
            category: category || 'General',
          });
          return;
        }
      } catch (e) {
        console.error('Gemini Mentor Chat error, using fallback:', e);
      }
    }

    // Fallback response matrix
    const lower = (message || '').toLowerCase();
    let reply = `To excel as a ${user.targetRole}, focus on quantifying your impact in every project bullet point. Incorporate high-demand keywords such as System Design, Cloud Architecture, and Automated Testing.`;
    let suggestedFollowups = [
      'How do I rewrite my resume to pass ATS filters?',
      'What are the top interview questions for ' + user.targetRole + '?',
      'How can I negotiate a higher starting salary?'
    ];

    if (lower.includes('resume') || lower.includes('ats')) {
      reply = `To maximize your ATS score for ${user.targetRole}:\n\n1. **Use standard section headings**: Work Experience, Education, Skills, Projects.\n2. **Incorporate role-specific keywords**: Add matching skills directly from the target job description.\n3. **Use the STAR Formula**: Situation + Task + Action = Measurable Result (e.g. "Optimized API latency by 35% using Redis caching").`;
      suggestedFollowups = ['Can you analyze my current resume?', 'What action verbs should I use?', 'How do I format projects without work experience?'];
    } else if (lower.includes('interview') || lower.includes('prepare')) {
      reply = `For ${user.targetRole} interviews:\n\n1. **Technical Prep**: Master core data structures, system design fundamentals, and your primary programming language.\n2. **Behavioral Prep**: Prepare 3-4 STAR stories covering conflict resolution, technical leadership, and failure recovery.\n3. **Mock Practice**: Speak your answers out loud to refine clarity and confidence.`;
      suggestedFollowups = ['Give me an HR interview practice question', 'What is a STAR method example?', 'How do I handle hard technical questions?'];
    } else if (lower.includes('salary') || lower.includes('pay') || lower.includes('negotiat')) {
      reply = `When negotiating compensation for ${user.targetRole}:\n\n1. **Research Market Rates**: Top candidates in your tier earn ₹12L - ₹24L/yr depending on company scale.\n2. **Highlight Skill Premiums**: Emphasize specialized knowledge like Distributed Systems or Cloud Architecture.\n3. **Never give the first number**: Ask for the budgeted salary band before stating expectations.`;
      suggestedFollowups = ['What is the average salary for my experience level?', 'How do I respond to "What are your salary expectations?"', 'What non-salary perks can I request?'];
    }

    res.json({ reply, suggestedFollowups, category: category || 'General' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Mentor chat failed' });
  }
});

// ================= RESUME REWRITER ENDPOINT =================
app.post('/api/resume/improve', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { originalSummary, targetRole } = req.body;
    const user = req.user!;
    const role = targetRole || user.targetRole || 'Software Engineer';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are an executive resume writer and ATS specialist.
Target Role: "${role}".
Original Candidate Summary: "${originalSummary || 'Motivated software engineering professional eager to contribute.'}"
Candidate Skills: ${(user.skills || []).join(', ')}.

Generate a high-impact resume upgrade in JSON format with:
{
  "originalSummary": "${originalSummary || 'Basic candidate summary'}",
  "improvedSummary": "A compelling 3-sentence executive summary with high-impact keywords and career focus.",
  "bulletImprovements": [
    {
      "original": "Worked on backend APIs and fixed bugs.",
      "improved": "Architected resilient RESTful microservices using Node.js and PostgreSQL, reducing server response latency by 32%.",
      "impactMetric": "32% Latency Reduction",
      "actionVerbUsed": "Architected",
      "category": "Quantified Result"
    },
    {
      "original": "Built frontend user interface for client web application.",
      "improved": "Engineered responsive, accessible React dashboard components utilized by 15,000+ monthly active users.",
      "impactMetric": "15,000+ Monthly Users",
      "actionVerbUsed": "Engineered",
      "category": "Leadership & Scale"
    }
  ],
  "actionVerbs": ["Architected", "Engineered", "Spearheaded", "Optimized", "Streamlined", "Orchestrated"],
  "missingKeywords": ["Microservices", "System Architecture", "CI/CD Pipelines", "Containerization"],
  "certificationSuggestions": ["AWS Certified Solutions Architect", "Docker & Kubernetes Mastery", "Meta Frontend Developer Professional"],
  "projectEnhancements": ["Add live hosted demo links", "Include metrics on data throughput/API load", "Detail architecture choices in README"]
}
Return ONLY valid JSON.
`;

        const response = await generateContentWithRetry(ai, {
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          let cleanText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          res.json({ rewrite: parsed });
          return;
        }
      } catch (e) {
        console.error('Gemini Resume Improve error, using fallback:', e);
      }
    }

    // Fallback response
    res.json({
      rewrite: {
        originalSummary: originalSummary || 'Dedicated software developer looking for opportunities.',
        improvedSummary: `Results-driven ${role} with proven expertise in developing scalable web applications, optimizing database performance, and driving technical solutions. Passionate about writing clean code, building responsive user interfaces, and delivering measurable business impact.`,
        bulletImprovements: [
          {
            original: 'Worked on backend APIs and fixed bugs.',
            improved: 'Architected resilient RESTful microservices with Node.js and PostgreSQL, reducing API latency by 35%.',
            impactMetric: '35% Latency Reduction',
            actionVerbUsed: 'Architected',
            category: 'Quantified Result',
          },
          {
            original: 'Built user interface components for the frontend.',
            improved: 'Engineered high-performance React UI components, improving lighthouse performance score from 68 to 94.',
            impactMetric: '+26 Lighthouse Score',
            actionVerbUsed: 'Engineered',
            category: 'Technical Depth',
          },
          {
            original: 'Helped team with deployment and testing.',
            improved: 'Automated CI/CD deployment pipelines using GitHub Actions, cutting release deployment cycle time by 50%.',
            impactMetric: '50% Faster Releases',
            actionVerbUsed: 'Automated',
            category: 'Leadership & Scale',
          },
        ],
        actionVerbs: ['Architected', 'Engineered', 'Spearheaded', 'Optimized', 'Streamlined', 'Orchestrated'],
        missingKeywords: ['Microservices', 'System Design', 'CI/CD Pipelines', 'Cloud Deployment'],
        certificationSuggestions: ['AWS Certified Developer', 'Meta Full Stack Developer Certificate', 'Docker & Kubernetes Fundamentals'],
        projectEnhancements: [
          'Add live demo URL and GitHub repository link',
          'Include benchmarking metrics for API response speed',
          'Add a system architecture diagram in project documentation',
        ],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Resume rewrite failed' });
  }
});

// ================= DYNAMIC INTERVIEW PREP ENDPOINT =================
app.post('/api/interview/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { company, difficulty, category } = req.body;
    const user = req.user!;
    const role = user.targetRole || 'Software Engineer';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
Generate 4 highly realistic interview practice questions for a candidate applying as a "${role}" at ${company || 'top tech companies'}.
Difficulty Level: ${difficulty || 'Medium'}.
Category Focus: ${category || 'All Categories (HR, Technical, Behavioral, Coding, System Design)'}.

Return strictly JSON format matching array of items:
[
  {
    "id": "q1",
    "question": "Question text...",
    "category": "Technical",
    "difficulty": "${difficulty || 'Medium'}",
    "companyTags": ["${company || 'Google'}", "Microsoft"],
    "starAnswer": {
      "situation": "Detailed situation...",
      "task": "Target objective...",
      "action": "Specific engineering steps taken...",
      "result": "Quantifiable outcome..."
    },
    "keyTakeaways": ["Takeaway 1", "Takeaway 2"],
    "codeSnippet": "// optional code snippet",
    "solutionCode": "// optional solution"
  }
]
`;

        const response = await generateContentWithRetry(ai, {
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          let cleanText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          res.json({ questions: parsed });
          return;
        }
      } catch (e) {
        console.error('Gemini Interview Prep error, using fallback:', e);
      }
    }

    // Fallback interview questions
    res.json({
      questions: [
        {
          id: 'q1',
          question: `How would you optimize an API endpoint for ${role} applications experiencing high latency under traffic spikes?`,
          category: 'Technical',
          difficulty: difficulty || 'Medium',
          companyTags: [company || 'Google', 'Amazon'],
          starAnswer: {
            situation: 'Our primary user dashboard endpoint started timing out during peak traffic hours with 5,000+ concurrent users.',
            task: 'Identify database bottlenecks and reduce response times from 1,200ms to under 200ms.',
            action: 'Implemented Redis caching for frequently queried user state, indexed database columns, and optimized SQL JOIN queries.',
            result: 'API response times dropped by 83% to 140ms and server CPU utilization stabilized below 40%.',
          },
          keyTakeaways: ['Explain profiling methodology first', 'Highlight caching strategy', 'Provide concrete latency metrics'],
          codeSnippet: `// Example Caching Middleware
const redisClient = require('./redis');

async function cacheMiddleware(req, res, next) {
  const cacheKey = req.originalUrl;
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }
  next();
}`,
        },
        {
          id: 'q2',
          question: 'Describe a situation where you had a technical disagreement with a team member. How did you resolve it?',
          category: 'Behavioral',
          difficulty: difficulty || 'Medium',
          companyTags: [company || 'Microsoft', 'TCS'],
          starAnswer: {
            situation: 'During a sprint planning session, a senior engineer preferred REST APIs while I advocated for GraphQL to minimize mobile over-fetching.',
            task: 'Reach alignment on the optimal API architecture without delaying the project deadline.',
            action: 'Built a quick 2-hour benchmark prototype comparing payload sizes and network latency for both approaches.',
            result: 'Data showed a 60% reduction in mobile payload size; team unanimously agreed on adopting GraphQL with proper caching.',
          },
          keyTakeaways: ['Focus on data-driven decision making', 'Maintain respect and collaboration', 'Highlight team alignment'],
        },
        {
          id: 'q3',
          question: 'Write a function to find the longest substring without repeating characters in O(n) time complexity.',
          category: 'Coding',
          difficulty: difficulty || 'Medium',
          companyTags: [company || 'Meta', 'Amazon'],
          starAnswer: {
            situation: 'Standard technical coding interview assessment requiring optimal algorithm design.',
            task: 'Implement two-pointer / sliding window technique with O(n) time complexity and O(min(n, m)) space complexity.',
            action: 'Maintained a hash map tracking the latest index of each character to contract/expand window boundary.',
            result: 'Passed all edge cases including empty strings, all identical characters, and max length sequences.',
          },
          keyTakeaways: ['Explain sliding window logic out loud', 'Discuss time and space complexity upfront', 'Handle edge cases explicitly'],
          solutionCode: `function lengthOfLongestSubstring(s: string): number {
  let maxLength = 0;
  let start = 0;
  const charMap = new Map<string, number>();

  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (charMap.has(char) && charMap.get(char)! >= start) {
      start = charMap.get(char)! + 1;
    }
    charMap.set(char, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}`,
        },
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Interview generation failed' });
  }
});

// ================= DASHBOARD & HISTORY ENDPOINTS =================

// Dashboard Overview Data
app.get('/api/dashboard', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = req.user!;
    const resumes = getResumesByUserId(userId);
    const activeResume = resumes.find((r) => r.isActive) || resumes[0];
    const latestAnalysis = getLatestAnalysisByUserId(userId);
    const history = getAnalysesByUserId(userId);

    res.json({
      user,
      activeResume: activeResume || null,
      latestAnalysis: latestAnalysis || null,
      resumeCount: resumes.length,
      historyCount: history.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch dashboard data' });
  }
});

// Get History List
app.get('/api/history', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const history = getAnalysesByUserId(req.user!.id);
    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch history' });
  }
});

// Get Latest Analysis
app.get('/api/analysis/latest', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const latest = getLatestAnalysisByUserId(req.user!.id);
    res.json({ analysis: latest || null });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch latest analysis' });
  }
});

// Get Single Analysis by ID
app.get('/api/analysis/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const analysis = getAnalysisById(req.params.id);
    if (!analysis || analysis.userId !== req.user!.id) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }
    res.json({ analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analysis' });
  }
});

// ================= DATABASE BROWSER ENDPOINTS =================

// Get Database Overview & Stats
app.get('/api/db/stats', authenticateToken, (_req: AuthRequest, res: Response) => {
  try {
    const stats = getDatabaseSummaryStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch database stats' });
  }
});

// Query DB Collection
app.get('/api/db/browser', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const collection = (req.query.collection as string) || 'users';
    const query = ((req.query.q as string) || '').toLowerCase().trim();

    let records: any[] = [];
    if (collection === 'users') {
      records = getAllUsersSanitized();
    } else if (collection === 'resumes') {
      records = getAllResumesAdmin();
    } else if (collection === 'analyses') {
      records = getAllAnalysesAdmin();
    } else {
      res.status(400).json({ error: 'Invalid collection. Choose users, resumes, or analyses.' });
      return;
    }

    if (query) {
      records = records.filter((rec) => {
        const jsonStr = JSON.stringify(rec).toLowerCase();
        return jsonStr.includes(query);
      });
    }

    res.json({
      collection,
      totalRecords: records.length,
      records,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to query database' });
  }
});

// Export raw JSON file for a collection
app.get('/api/db/export/:collection', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const collection = req.params.collection;
    let records: any[] = [];
    if (collection === 'users') records = getAllUsersSanitized();
    else if (collection === 'resumes') records = getAllResumesAdmin();
    else if (collection === 'analyses') records = getAllAnalysesAdmin();
    else {
      res.status(400).json({ error: 'Invalid collection' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${collection}-export-${Date.now()}.json"`);
    res.send(JSON.stringify(records, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

// View Raw JSON file
app.get('/api/db/raw/:collection', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const collection = req.params.collection;
    const records = getRawCollection(collection);
    res.json({ collection, fileName: `${collection}.json`, records });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to read raw collection' });
  }
});

// Save Raw JSON file
app.put('/api/db/raw/:collection', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const collection = req.params.collection;
    const { records } = req.body;
    if (!Array.isArray(records)) {
      res.status(400).json({ error: 'Payload must contain a "records" array' });
      return;
    }
    const success = saveRawCollection(collection, records);
    if (!success) {
      res.status(400).json({ error: 'Failed to update database collection file' });
      return;
    }
    res.json({ message: `Successfully updated ${collection}.json`, totalRecords: records.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save raw collection file' });
  }
});

// Download SQLite Database file for DB Browser for SQLite
app.get('/api/db/download-sqlite', async (_req: Request, res: Response) => {
  try {
    await generateSQLiteFile();
    if (!fs.existsSync(SQLITE_FILE_PATH)) {
      res.status(404).json({ error: 'SQLite database file not found' });
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.sqlite3');
    res.setHeader('Content-Disposition', 'attachment; filename="careerai.sqlite"');
    res.download(SQLITE_FILE_PATH, 'careerai.sqlite');
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate SQLite database file' });
  }
});

app.get('/api/db/sqlite', async (_req: Request, res: Response) => {
  try {
    await generateSQLiteFile();
    if (!fs.existsSync(DB_FILE_PATH)) {
      res.status(404).json({ error: 'Database .db file not found' });
      return;
    }
    res.setHeader('Content-Type', 'application/x-sqlite3');
    res.setHeader('Content-Disposition', 'attachment; filename="careerai.db"');
    res.download(DB_FILE_PATH, 'careerai.db');
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate .db file' });
  }
});

// Serve frontend in production or integrate with Vite dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
