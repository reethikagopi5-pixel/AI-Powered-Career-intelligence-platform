export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  targetRole: string;
  college?: string;
  education?: string;
  experienceYears?: number;
  skills: string[];
  certifications: string[];
  projects: string[];
  careerInterests: string[];
  profileCompletion: number;
}

export interface PersonalInformation {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  otherLinks?: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  specialization?: string;
  startDate?: string;
  endDate?: string;
  graduationYear?: string;
  cgpa?: string;
  percentage?: string;
  relevantCoursework?: string[];
  year?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  employmentType?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  highlights?: string[];
  responsibilities?: string[];
  achievements?: string[];
  technologiesUsed?: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies?: string[];
  tools?: string[];
  role?: string;
  responsibilities?: string[];
  achievements?: string[];
  duration?: string;
  githubLink?: string;
  demoLink?: string;
}

export interface SkillsCategorized {
  programming_languages?: string[];
  frameworks?: string[];
  libraries?: string[];
  databases?: string[];
  cloud?: string[];
  devops?: string[];
  tools?: string[];
  platforms?: string[];
  technical_skills?: string[];
  soft_skills?: string[];
  domain_skills?: string[];
  other_skills?: string[];
}

export interface CertificationEntry {
  name: string;
  issuingOrganization?: string;
  date?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementEntry {
  award: string;
  competition?: string;
  recognition?: string;
  description?: string;
  organization?: string;
  date?: string;
}

export interface LanguageEntry {
  language: string;
  proficiency?: string;
}

export interface ExtractedResumeData {
  name: string;
  email: string;
  phone: string;
  targetRole?: string;
  summary?: string;
  experienceYears?: number;
  personalInformation?: PersonalInformation;
  languages?: string[];
  languagesDetailed?: LanguageEntry[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  skillsCategorized?: SkillsCategorized;
  certifications: string[];
  certificationsDetailed?: CertificationEntry[];
  projects: Array<string | ProjectEntry>;
  projectsDetailed?: ProjectEntry[];
  achievements?: string[];
  achievementsDetailed?: AchievementEntry[];
  publications?: Array<{ title: string; publisher?: string; date?: string; url?: string }>;
  volunteerExperience?: Array<{ organization: string; role: string; duration?: string; description?: string }>;
  leadership?: Array<{ title: string; organization?: string; description?: string }>;
  rawText: string;
  isConfirmed?: boolean;
}

export interface ResumeRecord {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileType: string; // pdf, docx, txt, doc, rtf, odt, jpg, png
  size: number;
  uploadDate: string;
  isActive: boolean;
  extractedData?: ExtractedResumeData;
  filePath?: string;
}

export interface SkillGapAnalysis {
  matchPercentage: number;
  identifiedStrengths: string[];
  missingSkills: Array<{
    name: string;
    importance: 'High' | 'Medium' | 'Low';
    category: string;
  }>;
  totalRequiredSkills: number;
  matchedCount: number;
  missingCount: number;
}

export interface CareerPathStep {
  level: string;
  title: string;
  timeline: string;
  requiredSkills: string[];
  responsibilities: string[];
  description: string;
}

export interface CareerPathRecommendation {
  recommendedRole: string;
  alignmentProbability: number;
  roadmap: CareerPathStep[];
  alternatePaths: Array<{
    role: string;
    matchScore: number;
    description: string;
  }>;
}

export interface SalaryPrediction {
  currentEstimatedMin: number;
  currentEstimatedAvg: number;
  currentEstimatedMax: number;
  currency: string;
  trajectory: Array<{
    year: number;
    yearLabel: string;
    minSalary: number;
    avgSalary: number;
    maxSalary: number;
  }>;
  topSkillPremiums: Array<{
    skill: string;
    estimatedValueBoost: string;
  }>;
  marketDemandFactor: string;
}

export interface LearningResource {
  id: string;
  skillName: string;
  courseTitle: string;
  platform: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  rating: number;
  url: string;
  completed?: boolean;
}

export interface ImprovementTip {
  category: 'Impact' | 'Keywords' | 'Formatting' | 'Structure';
  severity: 'Critical' | 'Recommended' | 'Minor';
  tip: string;
  exampleText?: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  createdAt: string;
  targetRole: string;
  atsScore: number;
  scoreBreakdown: {
    keywordMatch: number;
    formatting: number;
    impactMetrics: number;
    sectionCompleteness: number;
  };
  summary: string;
  skillGap: SkillGapAnalysis;
  careerPath: CareerPathRecommendation;
  salaryPrediction: SalaryPrediction;
  learningResources: LearningResource[];
  improvementTips: ImprovementTip[];
  extractedData: ExtractedResumeData;
}

export interface AnalysisHistoryItem {
  id: string;
  resumeId: string;
  resumeName: string;
  targetRole: string;
  atsScore: number;
  createdAt: string;
  matchPercentage: number;
}

export interface VaultDocument {
  id: string;
  category: 'Academic Marksheet' | 'Internship & Work Proof' | 'Course & Tech Certificate' | 'Other Official File';
  subCategory: 'SSLC (10th)' | 'HSC / Diploma (12th)' | 'Semester Marksheet' | 'Internship Offer/Completion' | 'Course Certificate' | 'Project / LOR Proof';
  title: string;
  issuer: string;
  yearOrSemester?: string;
  scoreOrGrade?: string;
  uploadDate: string;
  fileSize: string;
  fileType: 'pdf' | 'png' | 'jpg' | 'docx';
  verifiedStatus: boolean;
  notes?: string;
  fileDataUrl?: string;
}

export interface InternshipListing {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  activelyHiring: boolean;
  locationType: 'Work from home' | 'In-office' | 'Hybrid';
  locationName?: string;
  stipend: string; // e.g. "Unpaid" or "₹ 12,500 - 20,000 /month"
  duration: string; // e.g. "1 Month", "3 Months"
  description: string;
  skills: string[];
  postedTime: string; // e.g. "Few hours ago", "3 weeks ago"
  earlyApplicantTag?: boolean;
  jobOfferPostInternship?: boolean;
  employmentType: 'Part time' | 'Full time';
  matchScore?: number;
  appliedStatus?: boolean;
  applyUrl?: string;
  portalName?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedFollowups?: string[];
  category?: 'General' | 'Resume' | 'Interview' | 'Salary' | 'Learning';
}

export interface BulletImprovementItem {
  original: string;
  improved: string;
  impactMetric: string;
  actionVerbUsed: string;
  category: 'Quantified Result' | 'Leadership & Scale' | 'Technical Depth';
}

export interface ResumeRewriteResult {
  originalSummary: string;
  improvedSummary: string;
  bulletImprovements: BulletImprovementItem[];
  actionVerbs: string[];
  missingKeywords: string[];
  certificationSuggestions: string[];
  projectEnhancements: string[];
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: 'HR' | 'Technical' | 'Behavioral' | 'Coding' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  starAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyTakeaways: string[];
  codeSnippet?: string;
  solutionCode?: string;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  company: string;
  title: string;
  appliedDate: string;
  status: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  matchScore: number;
  salaryText?: string;
  location?: string;
  notes?: string;
}

export interface RoadmapWeeklyModule {
  week: number;
  phaseTitle: string;
  timeframe: '30-Day Foundation' | '60-Day Deep Dive' | '90-Day Mastery';
  topics: string[];
  recommendedVideo: string;
  assignment: string;
  miniProject: string;
  mockInterviewFocus: string;
  completed: boolean;
}
