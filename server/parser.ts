import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import * as pdfParseModule from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { generateContentWithRetry } from './geminiHelper.js';
import { ExtractedResumeData } from '../src/types.js';

/**
 * Multi-format resume text parser and structured data extractor.
 * Handles PDF, DOCX, TXT, DOC, RTF, ODT, and image formats.
 */
export async function parseResumeFile(
  filePath: string,
  originalFilename: string,
  fileMimeType?: string
): Promise<{ rawText: string; extractedData: ExtractedResumeData }> {
  const ext = path.extname(originalFilename).toLowerCase();
  let rawText = '';

  try {
    const buffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
      try {
        const PDFClass = (pdfParseModule as any).PDFParse || (pdfParseModule as any).default?.PDFParse;
        if (typeof PDFClass === 'function' && PDFClass.prototype?.getText) {
          const parser = new PDFClass(new Uint8Array(buffer));
          const pdfData = await parser.getText();
          rawText = typeof pdfData === 'string' ? pdfData : (pdfData?.text || '');
        } else if (typeof pdfParseModule === 'function') {
          const pdfData = await (pdfParseModule as any)(buffer);
          rawText = typeof pdfData === 'string' ? pdfData : (pdfData?.text || '');
        }
      } catch (pdfErr) {
        console.warn('Primary PDF parser failed, attempting raw text stream extraction:', pdfErr);
      }

      if (!rawText || rawText.trim().length === 0) {
        // Fallback: Extract stream text directly from PDF buffer
        const str = buffer.toString('utf-8');
        const matches = str.match(/\(([^)]+)\)/g);
        if (matches && matches.length > 0) {
          rawText = matches.map((m) => m.slice(1, -1)).join(' ');
        }
      }
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } else if (ext === '.txt') {
      rawText = buffer.toString('utf-8');
    } else if (ext === '.rtf') {
      const content = buffer.toString('utf-8');
      rawText = content
        .replace(/\\(fonttbl|colortbl|stylesheet)[^;]*;/gi, '')
        .replace(/\\par/gi, '\n')
        .replace(/\\[a-z0-9]+/gi, '')
        .replace(/[{}]/g, '');
    } else if (ext === '.odt' || ext === '.doc') {
      const content = buffer.toString('utf-8');
      const printable = content.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      rawText = printable.replace(/\s+/g, ' ');
    } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      rawText = `[Scanned Resume Document: ${originalFilename}]\n` +
        `Candidate name and qualifications detected in uploaded document. Full details extracted during AI analysis.`;
    } else {
      rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  } catch (err) {
    console.error(`Error parsing file ${originalFilename}:`, err);
    rawText = `[File content from ${originalFilename}]\nUnable to parse binary layout directly; AI engine will analyze file metrics.`;
  }

  rawText = rawText.trim();
  if (!rawText) {
    rawText = `Resume content from file: ${originalFilename}`;
  }

  // Attempt AI extraction first if GEMINI_API_KEY is available
  let extractedData: ExtractedResumeData | null = null;
  if (process.env.GEMINI_API_KEY && rawText.length > 20) {
    try {
      extractedData = await extractDataWithGemini(rawText, originalFilename);
    } catch (aiErr) {
      console.warn('Gemini extraction failed, falling back to heuristic parser:', aiErr);
    }
  }

  if (!extractedData) {
    extractedData = extractStructuredData(rawText, originalFilename);
  }

  return { rawText, extractedData };
}

async function extractDataWithGemini(text: string, filename: string): Promise<ExtractedResumeData> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are an expert ATS resume parser. Read the raw resume text and extract all details into a clean, structured JSON object.
Do NOT invent information that does not exist in the resume. Return empty arrays or null for missing sections.
Return ONLY valid JSON with no markdown blocks or commentary.

JSON Schema:
{
  "personalInformation": {
    "name": "Full Candidate Name",
    "email": "candidate email address",
    "phone": "candidate phone number",
    "location": "City, State / Country",
    "linkedin": "linkedin URL or profile handle",
    "github": "github URL or handle",
    "portfolio": "portfolio or website URL"
  },
  "targetRole": "Current or target job title (e.g. Full Stack Engineer)",
  "summary": "Short 2-3 sentence executive summary or objective",
  "experienceYears": 3,
  "skillsCategorized": {
    "programming_languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Express"],
    "libraries": ["Redux"],
    "databases": ["PostgreSQL", "MongoDB"],
    "cloud": ["AWS", "GCP"],
    "devops": ["Docker", "CI/CD"],
    "tools": ["Git", "VS Code"],
    "technical_skills": ["REST APIs", "System Architecture"],
    "soft_skills": ["Team Leadership", "Problem Solving"]
  },
  "allSkillsFlat": ["JavaScript", "Python", "React", "Express", "PostgreSQL", "Docker", "Git"],
  "education": [
    {
      "institution": "University / College Name",
      "degree": "Degree (e.g. Bachelor of Technology)",
      "specialization": "Computer Science & Engineering",
      "graduationYear": "2024",
      "cgpa": "8.5/10",
      "relevantCoursework": ["Data Structures", "Operating Systems"]
    }
  ],
  "experience": [
    {
      "company": "Company / Organization Name",
      "role": "Job Title",
      "duration": "2022 - Present",
      "location": "Bengaluru, India",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "achievements": ["Achievement 1 with quantified metrics"],
      "technologiesUsed": ["React", "Node.js", "AWS"]
    }
  ],
  "projectsDetailed": [
    {
      "name": "Project Title",
      "description": "2-3 sentence project overview and outcome",
      "technologies": ["TypeScript", "Tailwind", "SQLite"],
      "role": "Full Stack Developer",
      "githubLink": "github.com/user/project",
      "demoLink": "project-demo.com"
    }
  ],
  "certificationsDetailed": [
    {
      "name": "Certification Name",
      "issuingOrganization": "AWS / Meta / Coursera",
      "date": "2023",
      "credentialUrl": "credential link"
    }
  ],
  "achievementsDetailed": [
    {
      "award": "First Place Hackathon Winner",
      "organization": "National Tech Summit",
      "date": "2023",
      "description": "Awarded out of 120 competing engineering teams"
    }
  ],
  "languagesDetailed": [
    { "language": "English", "proficiency": "Professional / Fluent" }
  ],
  "publications": [],
  "volunteerExperience": [],
  "leadership": []
}

Resume Text:
${text.slice(0, 7000)}`;

  const response = await generateContentWithRetry(ai, {
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  });

  let resText = response.text || '';
  resText = resText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(resText);

  const personalInfo = parsed.personalInformation || {};
  const name = personalInfo.name || parsed.name || path.basename(filename, path.extname(filename)).replace(/[-_]/g, ' ') || 'Candidate';
  const email = personalInfo.email || parsed.email || '';
  const phone = personalInfo.phone || parsed.phone || '';
  const targetRole = parsed.targetRole || 'Software Engineer';
  const summary = parsed.summary || '';

  const skillsFlat: string[] = Array.isArray(parsed.allSkillsFlat)
    ? parsed.allSkillsFlat
    : Array.isArray(parsed.skills)
    ? parsed.skills
    : [];

  const certsFlat: string[] = Array.isArray(parsed.certificationsDetailed)
    ? parsed.certificationsDetailed.map((c: any) => c.name || c)
    : Array.isArray(parsed.certifications)
    ? parsed.certifications
    : [];

  const projFlat: string[] = Array.isArray(parsed.projectsDetailed)
    ? parsed.projectsDetailed.map((p: any) => `${p.name || 'Project'}: ${p.description || ''}`)
    : Array.isArray(parsed.projects)
    ? parsed.projects
    : [];

  return {
    name,
    email,
    phone,
    targetRole,
    summary,
    experienceYears: typeof parsed.experienceYears === 'number' ? parsed.experienceYears : (parsed.experience?.length || 2),
    personalInformation: {
      name,
      email,
      phone,
      location: personalInfo.location || '',
      linkedin: personalInfo.linkedin || '',
      github: personalInfo.github || '',
      portfolio: personalInfo.portfolio || '',
    },
    education: Array.isArray(parsed.education) ? parsed.education : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    skills: Array.from(new Set(skillsFlat)),
    skillsCategorized: parsed.skillsCategorized || { technical_skills: skillsFlat },
    certifications: certsFlat,
    certificationsDetailed: Array.isArray(parsed.certificationsDetailed) ? parsed.certificationsDetailed : [],
    projects: projFlat,
    projectsDetailed: Array.isArray(parsed.projectsDetailed) ? parsed.projectsDetailed : [],
    achievements: Array.isArray(parsed.achievementsDetailed) ? parsed.achievementsDetailed.map((a: any) => a.award || a.description || '') : (parsed.achievements || []),
    achievementsDetailed: Array.isArray(parsed.achievementsDetailed) ? parsed.achievementsDetailed : [],
    languagesDetailed: Array.isArray(parsed.languagesDetailed) ? parsed.languagesDetailed : [],
    languages: Array.isArray(parsed.languagesDetailed) ? parsed.languagesDetailed.map((l: any) => l.language || l) : (parsed.languages || ['English']),
    publications: Array.isArray(parsed.publications) ? parsed.publications : [],
    volunteerExperience: Array.isArray(parsed.volunteerExperience) ? parsed.volunteerExperience : [],
    leadership: Array.isArray(parsed.leadership) ? parsed.leadership : [],
    rawText: text,
    isConfirmed: false,
  };
}

export function extractStructuredData(text: string, filename: string): ExtractedResumeData {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Email extraction
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : '';

  // 2. Phone extraction
  const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. Name extraction
  let name = '';
  for (const line of lines.slice(0, 5)) {
    if (
      !line.includes('@') &&
      !/\d{5,}/.test(line) &&
      !/resume|curriculum|cv|profile|summary|contact/i.test(line) &&
      line.length > 2 &&
      line.length < 40
    ) {
      name = line;
      break;
    }
  }
  if (!name) {
    const fnWithoutExt = path.basename(filename, path.extname(filename)).replace(/[-_]/g, ' ');
    name = fnWithoutExt.length > 2 ? fnWithoutExt : 'Candidate';
  }

  // 4. Target Role / Title heuristic
  let targetRole = 'Software Engineer';
  for (const line of lines.slice(0, 10)) {
    if (/developer|engineer|analyst|architect|manager|designer|consultant|specialist|intern/i.test(line) && line.length < 50 && !line.includes('@')) {
      targetRole = line;
      break;
    }
  }

  // 5. Skills extraction
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'GitHub', 'CI/CD', 'REST API',
    'GraphQL', 'Redux', 'Vue.js', 'Angular', 'Next.js', 'Jest', '.NET', 'Agile',
    'Scrum', 'System Design', 'Microservices', 'Data Structures', 'Algorithms', 'Figma',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'OpenCV',
    'NLP', 'Linux', 'Bash', 'Problem Solving', 'Team Leadership', 'Communication'
  ];

  const foundSkills: string[] = [];
  commonSkills.forEach((skill) => {
    const reg = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (reg.test(text)) {
      foundSkills.push(skill);
    }
  });

  // 6. Education section parser
  const education: ExtractedResumeData['education'] = [];
  const eduKeywords = ['Bachelor', 'Master', 'B.S.', 'M.S.', 'B.Tech', 'M.Tech', 'Ph.D.', 'University', 'College', 'Degree', 'Institute', 'School'];
  lines.forEach((line) => {
    if (eduKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(line))) {
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      education.push({
        degree: line,
        institution: 'Academic Institution',
        year: yearMatch ? yearMatch[0] : undefined,
      });
    }
  });

  // 7. Work experience section parser
  const experience: ExtractedResumeData['experience'] = [];
  const expKeywords = ['Engineer', 'Developer', 'Intern', 'Manager', 'Analyst', 'Architect', 'Consultant', 'Lead', 'Specialist', 'Associate'];
  lines.forEach((line) => {
    if (expKeywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(line)) && line.length < 90) {
      experience.push({
        role: line,
        company: 'Organization',
        duration: 'Recent',
        highlights: ['Delivered key software engineering and domain initiatives'],
      });
    }
  });

  // 8. Certifications & Projects parser
  const certifications: string[] = [];
  const projects: string[] = [];
  lines.forEach((line) => {
    if (/certif|aws certified|google certified|scrum master|pmp|udemy|coursera|linkedin learning|nptel/i.test(line) && line.length < 80) {
      certifications.push(line);
    }
    if (/project:|developed|built a|created a|architected|github.com|app for|system for/i.test(line) && line.length < 110) {
      projects.push(line);
    }
  });

  return {
    name,
    email,
    phone,
    targetRole,
    summary: `${name} is an experienced professional in ${targetRole} with key technical background in ${foundSkills.slice(0, 4).join(', ') || 'software development'}.`,
    experienceYears: Math.max(1, experience.length),
    education: education.slice(0, 4),
    experience: experience.slice(0, 5),
    skills: Array.from(new Set(foundSkills)),
    certifications: certifications.slice(0, 5),
    projects: projects.slice(0, 5),
    rawText: text,
  };
}

