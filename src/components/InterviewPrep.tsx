import React, { useState } from 'react';
import { UserProfile, AnalysisResult } from '../types';
import { generatePdfReport } from '../utils/generatePdfReport';
import {
  MessageSquare,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  Send,
  Lightbulb,
  FileText,
  Target,
  Wand2,
  ChevronRight,
  ShieldAlert,
  Download,
} from 'lucide-react';

interface InterviewPrepProps {
  analysis: AnalysisResult | null;
  user: UserProfile;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ analysis, user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'interview' | 'bullet' | 'coverletter' | 'thingsToAdd'>('interview');

  // Interview Questions state
  const targetRole = user.targetRole || 'Software Engineer';
  const userSkills = user.skills?.slice(0, 5) || ['React', 'Node.js', 'TypeScript', 'SQL'];

  // Resume-derived Model Questions
  const extractedSkills = analysis?.extractedData?.skills?.length
    ? analysis.extractedData.skills
    : userSkills;
  
  const extractedExperience = analysis?.extractedData?.experience || [];
  const primarySkill = extractedSkills[0] || 'React.js';
  const secondarySkill = extractedSkills[1] || 'Node.js';

  // Comprehensive Categorized Real-Life Interview Questions (10 Real-World Interview Sequence Categories)
  const categorizedQuestions = [
    {
      category: '1. Self Introduction & Elevator Pitch',
      questions: [
        {
          id: 101,
          type: 'Elevator Pitch',
          categoryName: 'Self Introduction',
          question: `Tell me about yourself. Walk me through your background, technical interests, and why you are targeting a ${targetRole} position.`,
          reasoning: 'Interviewers use this opening icebreaker to evaluate communication clarity, enthusiasm, concise storytelling, and alignment with the role.',
          starGuide: {
            situation: `Graduating in Computer Science/Engineering with hands-on focus on full-stack web architecture and ${primarySkill}.`,
            task: 'Aiming to apply engineering fundamentals to solve real-world industry problems at scale.',
            action: `Built production-grade projects using ${extractedSkills.slice(0, 3).join(', ')}, completed internships, and earned certifications.`,
            result: `Ready to contribute immediately as a dependable ${targetRole} with a strong work ethic.`,
          },
          keyKeywords: ['Engineering Background', primarySkill, 'Problem Solving', 'Production Projects', 'Team Collaboration'],
        },
      ],
    },
    {
      category: '2. Resume Walkthrough & Background',
      questions: [
        {
          id: 102,
          type: 'Resume Walkthrough',
          categoryName: 'Resume Walkthrough',
          question: `Looking at your resume, what is the single project or engineering task you are most proud of, and why?`,
          reasoning: 'Probes for genuine technical passion, depth of contribution, and whether you truly built what is listed on your resume.',
          starGuide: {
            situation: 'Faced with building a full-stack career platform with automated ATS resume parsing.',
            task: 'Engineered backend parsing services, database schemas, and responsive UI components.',
            action: 'Integrated REST APIs, optimized DB queries, and implemented clean error boundaries.',
            result: 'Achieved sub-200ms API response times and parsed 1,000+ test resumes with zero crashes.',
          },
          keyKeywords: ['System Architecture', 'API Integration', 'DB Optimization', 'Tech Stack', 'Ownership'],
        },
      ],
    },
    {
      category: '3. Internship & Workplace Experience',
      questions: [
        {
          id: 103,
          type: 'Internship Role & Impact',
          categoryName: 'Internship Experience',
          question: extractedExperience[0]?.company
            ? `Walk me through your internship at ${extractedExperience[0].company}. What was your core project responsibility, and how did your deliverables impact the team?`
            : `Describe your first engineering internship or client project. What was the core deliverable, and what challenges did you face?`,
          reasoning: 'Evaluates early workplace adaptability, code quality standards, Git workflows, and sprint deadline discipline.',
          starGuide: {
            situation: 'Assigned to deliver production UI components and backend REST endpoints during a 3-month internship.',
            task: 'Integrate APIs, write unit tests, and submit clean Pull Requests during daily agile sprints.',
            action: 'Collaborated with senior engineers, participated in peer code reviews, and fixed edge-case bugs.',
            result: 'Successfully deployed feature to 10,000+ active users on time with zero breaking changes.',
          },
          keyKeywords: ['Production Code', 'PR Reviews', 'Agile Standups', 'Feature Ownership', 'Sprint Deadlines'],
        },
      ],
    },
    {
      category: '4. Project Deep-Dives & Architecture',
      questions: [
        {
          id: 104,
          type: 'Project Architecture',
          categoryName: 'Project Deep-Dives',
          question: `In your main full-stack project, why did you select ${primarySkill} over alternative frameworks? What architectural trade-offs did you make?`,
          reasoning: 'Tests technical decision-making maturity. Good engineers justify technology selection based on performance, ecosystem, and team familiarity.',
          starGuide: {
            situation: 'Architecting a scalable application requiring fast initial page loads and seamless data re-rendering.',
            task: 'Evaluate frontend frameworks and state management tools under performance constraints.',
            action: `Selected ${primarySkill} for component reusability, Virtual DOM efficiency, and strong community ecosystem.`,
            result: 'Delivered a modular codebase with 95+ Lighthouse performance score.',
          },
          keyKeywords: [primarySkill, 'Framework Comparison', 'Virtual DOM', 'Component Modularization', 'Performance'],
        },
      ],
    },
    {
      category: '5. Technical Skills & Core Concepts',
      questions: [
        {
          id: 105,
          type: 'Deep Technical Concept',
          categoryName: 'Skills & Tech Stack',
          question: `You listed ${primarySkill} and ${secondarySkill} on your resume. How do you handle asynchronous operations, error logging, and prevent memory leaks?`,
          reasoning: 'Determines whether listed skills represent genuine hands-on mastery or simple keyword copying.',
          starGuide: {
            situation: 'Handling asynchronous REST API calls with concurrent user interactions.',
            task: 'Prevent race conditions, unhandled promise rejections, and UI freezes.',
            action: 'Implemented async/await try-catch wrappers, central error boundaries, and event cleanup hooks.',
            result: 'Eliminated silent crashes and achieved smooth 60fps browser rendering.',
          },
          keyKeywords: [primarySkill, secondarySkill, 'Async/Await', 'Error Boundaries', 'Event Cleanup'],
        },
      ],
    },
    {
      category: '6. Real-Life Production & Incident Scenarios',
      questions: [
        {
          id: 106,
          type: 'Real-Life Production Incident',
          categoryName: 'Production Scenarios',
          question: `Tell me about a real-life situation where a critical bug or performance slowdown occurred in your app right before a deadline. How did you debug and resolve it?`,
          reasoning: 'Evaluates real-world problem-solving composure, debugging methodology, and stress tolerance under tight pressure.',
          starGuide: {
            situation: 'An unexpected API rate-limit error occurred during demo testing.',
            task: 'Identify root cause immediately without pushing breaking changes to main.',
            action: 'Inspected browser network logs, identified missing debounce headers, and cached API responses.',
            result: 'Restored normal app functionality in under 30 minutes.',
          },
          keyKeywords: ['Root Cause Analysis', 'Browser DevTools', 'Caching Strategy', 'Graceful Degradation'],
        },
      ],
    },
    {
      category: '7. Certificates & Continuous Upskilling',
      questions: [
        {
          id: 107,
          type: 'Certification Application',
          categoryName: 'Certificates & Courses',
          question: `I see you completed specialized certifications (e.g., NPTEL, Cloud, Full Stack). How have you practically applied this knowledge in your projects?`,
          reasoning: 'Assesses whether certifications translate into tangible coding skills and project improvements.',
          starGuide: {
            situation: 'Completing an advanced certification course in Cloud & System Architecture.',
            task: 'Translate theoretical principles into a functional hands-on repository.',
            action: 'Built a containerized microservice API with automated test coverage and GitHub Actions.',
            result: 'Earned course certification with distinction and deployed live code to cloud production.',
          },
          keyKeywords: ['Certification', 'Hands-on Repository', 'Applied Knowledge', 'Continuous Learning'],
        },
      ],
    },
    {
      category: '8. Extracurriculars & Leadership',
      questions: [
        {
          id: 108,
          type: 'Leadership & Initiative',
          categoryName: 'Extracurriculars & Leadership',
          question: `Describe a hackathon, college tech club initiative, or team project where you led others or resolved a conflict.`,
          reasoning: 'Measures soft skills, emotional intelligence, team leadership, and passion beyond mandatory coursework.',
          starGuide: {
            situation: 'Leading a 4-person team during a 24-hour hackathon.',
            task: 'Align team members with conflicting ideas on tech stack and UI wireframes.',
            action: 'Facilitated objective trade-off evaluation and assigned modules based on individual strengths.',
            result: 'Completed the MVP on time and secured Top 3 placement among 50 competing teams.',
          },
          keyKeywords: ['Hackathon', 'Team Alignment', 'Conflict Resolution', 'Project Management'],
        },
      ],
    },
    {
      category: '9. Coding & System Design Basics',
      questions: [
        {
          id: 109,
          type: 'System Design & Scalability',
          categoryName: 'Coding & System Design',
          question: `How would you design a URL Shortener service (like bit.ly) or a Notification system? What database and caching mechanism would you select?`,
          reasoning: 'Tests system design fundamentals: database selection, hashing algorithms, caching layers, and API endpoint design.',
          starGuide: {
            situation: 'Designing a high-throughput system handling 1,000 requests/second.',
            task: 'Ensure low-latency lookups, unique URL hash generation, and scalable persistent storage.',
            action: 'Used Base62 encoding for short codes, Redis in-memory cache for hot links, and PostgreSQL DB.',
            result: 'Achieved sub-10ms lookup latency for cached URLs with 99.99% availability.',
          },
          keyKeywords: ['System Design', 'Redis Cache', 'Base62 Encoding', 'PostgreSQL', 'High Throughput'],
        },
      ],
    },
    {
      category: '10. HR & Behavioral (STAR Method)',
      questions: [
        {
          id: 110,
          type: 'Behavioral & HR',
          categoryName: 'HR & Behavioral',
          question: `Why should we hire you over other candidates? Where do you see yourself in 3 years?`,
          reasoning: 'Checks career commitment, self-awareness, personal growth orientation, and cultural fit within the company.',
          starGuide: {
            situation: 'Applying as a driven engineering graduate who combines strong technical foundation with fast learning agility.',
            task: 'Demonstrate long-term value creation and alignment with the company’s engineering culture.',
            action: 'Showcase track record of self-driven projects, certifications, and active problem-solving skills.',
            result: 'Eager to grow into a senior core contributor and lead impactful engineering initiatives in 3 years.',
          },
          keyKeywords: ['Culture Fit', 'Growth Mindset', 'Long-term Commitment', 'Continuous Improvement'],
        },
      ],
    },
  ];

  const allQuestions = categorizedQuestions.flatMap((cat) => cat.questions);
  const [selectedQuestion, setSelectedQuestion] = useState(allQuestions[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    const wordCount = userAnswer.trim().split(/\s+/).length;
    const matchedKeys = selectedQuestion.keyKeywords.filter((k) =>
      userAnswer.toLowerCase().includes(k.toLowerCase())
    );

    let feedback = '';
    if (wordCount < 25) {
      feedback = '⚠️ Your response is a bit brief. Try expanding using the STAR method (Situation, Task, Action, Result) to provide actionable depth.';
    } else if (matchedKeys.length === 0) {
      feedback = `💡 Good length (${wordCount} words)! To make it stand out to hiring managers, try incorporating industry keywords like: ${selectedQuestion.keyKeywords.join(', ')}.`;
    } else {
      feedback = `🎉 Excellent response! You included key technical concepts (${matchedKeys.join(', ')}) and structured your answer well (${wordCount} words). Ready for real interviews!`;
    }
    setAnswerFeedback(feedback);
  };

  // Bullet Optimizer State
  const [rawBullet, setRawBullet] = useState('Worked on frontend components and fixed backend bugs for the web app.');
  const [optimizedBullets, setOptimizedBullets] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copiedBulletIndex, setCopiedBulletIndex] = useState<number | null>(null);

  const handleOptimizeBullet = () => {
    if (!rawBullet.trim()) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setOptimizedBullets([
        `• Architected and modularized high-performance ${userSkills[0] || 'React'} UI components, reducing page load latency by 38% for 100k+ active users.`,
        `• Diagnosed and resolved 25+ critical backend API issues, implementing robust error-handling protocols that boosted system uptime to 99.9%.`,
        `• Engineered scalable full-stack features utilizing ${userSkills.join(', ')}, accelerating feature deployment release cycles by 25%.`,
      ]);
      setIsOptimizing(false);
    }, 600);
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIndex(index);
    setTimeout(() => setCopiedBulletIndex(null), 2000);
  };

  // Cover Letter State
  const [companyName, setCompanyName] = useState('Google / Top Tech Company');
  const [jobTitle, setJobTitle] = useState(targetRole);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copiedLetter, setCopiedLetter] = useState(false);

  const handleGenerateCoverLetter = () => {
    const letter = `Dear Hiring Manager at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} position. With a strong background in software engineering and hands-on expertise in ${userSkills.join(', ')}, I am eager to contribute to ${companyName}'s engineering excellence and innovation.

Throughout my career, I have focused on building scalable, reliable, and user-centric applications. My technical toolkit includes ${userSkills.slice(0, 4).join(', ')}, enabling me to drive end-to-end feature development from database schema design to responsive UI delivery.

Key highlights of what I bring to ${companyName}:
• Proven ability to engineer clean, maintainable codebases adhering to modern architecture patterns.
• Experience optimizing system performance, reducing load times, and enhancing user engagement.
• Collaborative mindset with a focus on cross-functional team success and continuous learning.

I would welcome the opportunity to discuss how my background and technical skills align with your upcoming engineering goals. Thank you for your time and consideration.

Sincerely,
${user.name}
Email: ${user.email} | Phone: ${user.phone || '+91 98765 43210'}`;

    setGeneratedLetter(letter);
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleExportPdf = () => {
    if (analysis) {
      generatePdfReport(analysis, user);
    } else {
      const defaultAnalysis: AnalysisResult = {
        id: 'prep-analysis',
        userId: user.id || '1',
        resumeId: 'res-1',
        resumeName: `${user.name?.replace(/\s+/g, '_') || 'Candidate'}_Resume.pdf`,
        createdAt: new Date().toISOString(),
        targetRole: user.targetRole || 'Software Engineer',
        atsScore: 85,
        scoreBreakdown: { keywordMatch: 84, formatting: 88, impactMetrics: 78, sectionCompleteness: 90 },
        summary: `Comprehensive career intelligence analysis and interview prep evaluation for ${user.name || 'Candidate'}.`,
        skillGap: {
          matchPercentage: 80,
          identifiedStrengths: user.skills?.length ? user.skills : ['React', 'Node.js', 'TypeScript', 'SQL'],
          missingSkills: [
            { name: 'System Architecture', importance: 'High', category: 'Architecture' },
            { name: 'Docker / Cloud Infra', importance: 'High', category: 'DevOps' },
          ],
          totalRequiredSkills: 10,
          matchedCount: 8,
          missingCount: 2,
        },
        careerPath: {
          recommendedRole: user.targetRole || 'Software Engineer',
          alignmentProbability: 88,
          roadmap: [
            { level: 'Current Level', title: user.targetRole || 'Software Engineer', timeline: '0-1 Years', requiredSkills: user.skills?.slice(0, 3) || ['React', 'Node.js'], responsibilities: ['Full-stack development'], description: 'Building scalable applications.' },
            { level: 'Target Level', title: `Senior ${user.targetRole || 'Software Engineer'}`, timeline: '1-3 Years', requiredSkills: ['System Design', 'Cloud Infra'], responsibilities: ['Lead Architecture'], description: 'Leading engineering initiatives.' },
          ],
          alternatePaths: [],
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
          ],
          topSkillPremiums: [{ skill: 'System Design', estimatedValueBoost: '+₹2.5 Lakhs/yr' }],
          marketDemandFactor: 'High Demand (+18% YoY)',
        },
        learningResources: [
          { id: '1', skillName: 'System Architecture', courseTitle: 'Grokking System Design', platform: 'Educative', difficulty: 'Intermediate', estimatedHours: 25, rating: 4.8, url: 'https://educative.io' },
        ],
        improvementTips: [
          { category: 'Impact', severity: 'Critical', tip: 'Quantify achievements with measurable percentages.' },
        ],
        extractedData: {
          name: user.name || 'Candidate',
          email: user.email || 'candidate@example.com',
          phone: user.phone || '+91 98765 43210',
          targetRole: user.targetRole || 'Software Engineer',
          skills: user.skills || ['React', 'Node.js', 'TypeScript'],
          experience: [],
          education: [],
          certifications: [],
          projects: [],
          rawText: '',
        }
      };
      generatePdfReport(defaultAnalysis, user);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#D5CDBD] p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px] font-mono font-bold uppercase rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2563EB]" />
              AI CAREER SUITE
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Interview Practice & Resume Bullet Optimizer
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            Practice role-specific interview questions, rewrite weak resume bullets with metrics, and generate instant cover letters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 bg-[#16405B] hover:bg-[#103046] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C8622A]" />
            <span>Export Analysis & Interview Tips PDF</span>
          </button>

          {/* Sub Navigation Buttons Container matching image */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1.5 rounded-xl border border-[#E2E8F0] shrink-0">
            <button
              onClick={() => setActiveSubTab('interview')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'interview'
                  ? 'bg-white text-[#2563EB] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <span>Interview Prep</span>
            </button>

            <button
              onClick={() => setActiveSubTab('bullet')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'bullet'
                  ? 'bg-white text-[#2563EB] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Bullet Rewriter</span>
            </button>

            <button
              onClick={() => setActiveSubTab('coverletter')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'coverletter'
                  ? 'bg-white text-[#2563EB] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={() => setActiveSubTab('thingsToAdd')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'thingsToAdd'
                  ? 'bg-white text-[#2563EB] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-extrabold">Things to Add to Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB TAB 1: INTERVIEW PREP */}
      {activeSubTab === 'interview' && (
        <div className="space-y-6">
          {/* Dedicated Section: Structured Real-Life Interview Sequence */}
          <div className="bg-white border border-[#D5CDBD] p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="px-2.5 py-0.5 bg-[#FAF8F3] text-[#16405B] border border-[#C2BAB0] text-[10px] font-mono font-bold uppercase rounded-xs">
                  🎯 Sequential Real-Life Interview Flow
                </span>
                <h3 className="text-lg font-extrabold text-[#0F172A] mt-1">
                  Categorized Questions (How Real Technical Interviews Flow)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Structured in exact interviewer order: <strong>Internship → Relatable Scenarios → Skills → Certificates → Extracurriculars</strong>.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-md self-start md:self-auto">
                5 Sequence Topics
              </span>
            </div>

            {/* Categorized Question Sequence Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {categorizedQuestions.map((cat, idx) => {
                const q = cat.questions[0];
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setAnswerFeedback(null);
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FAF8F3] border-[#16405B] ring-1 ring-[#16405B]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded-xs block truncate">
                          {cat.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-3 mb-1">
                        {q.question}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-[#16405B] font-semibold">
                      <span>Practice →</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Practice Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Question Selector List Grouped by Category */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2 pb-3 border-b border-slate-100">
                <Target className="w-4 h-4 text-[#16405B]" />
                <span>Sequence Navigator ({allQuestions.length} Topics)</span>
              </h3>

              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {categorizedQuestions.map((catGroup, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[11px] font-mono font-bold text-[#16405B] uppercase bg-[#FAF8F3] px-2.5 py-1 rounded border border-[#D5CDBD]">
                      {catGroup.category}
                    </p>
                    {catGroup.questions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          setSelectedQuestion(q);
                          setAnswerFeedback(null);
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedQuestion.id === q.id
                            ? 'bg-[#FAF8F3] border-[#16405B] shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#16405B]">
                            {q.type}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-2">
                          {q.question}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Canvas & STAR Guide */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-xl space-y-5 shadow-xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2.5 py-1 rounded border border-[#C2BAB0]">
                  {selectedQuestion.type} Question
                </span>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-2 leading-snug">
                  {selectedQuestion.question}
                </h3>
                {selectedQuestion.reasoning && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200 mt-2 italic">
                    <strong className="not-italic text-slate-800">Recruiter Context:</strong> {selectedQuestion.reasoning}
                  </p>
                )}
              </div>

              {/* STAR Framework Guidance */}
              <div className="bg-[#FAF8F3] border border-[#D5CDBD] p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#16405B]">
                  <Lightbulb className="w-4 h-4 text-[#C8622A]" />
                  <span>STAR Method Answer Blueprint</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-700 font-sans">
                  <div><strong className="text-slate-900">S (Situation):</strong> {selectedQuestion.starGuide.situation}</div>
                  <div><strong className="text-slate-900">T (Task):</strong> {selectedQuestion.starGuide.task}</div>
                  <div><strong className="text-slate-900">A (Action):</strong> {selectedQuestion.starGuide.action}</div>
                  <div><strong className="text-slate-900">R (Result):</strong> {selectedQuestion.starGuide.result}</div>
                </div>
              </div>

              {/* User Response Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Type your practice answer below:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={4}
                  placeholder="In my previous project, I faced a situation where..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#16405B] font-sans leading-relaxed"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Keywords: {selectedQuestion.keyKeywords.join(', ')}
                  </span>
                  <button
                    onClick={handleEvaluateAnswer}
                    className="px-4 py-2 bg-[#16405B] hover:bg-[#103046] text-white text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Get AI Feedback</span>
                  </button>
                </div>
              </div>

              {answerFeedback && (
                <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#16405B] text-xs text-slate-800 font-sans leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C8622A] shrink-0 mt-0.5" />
                  <div>{answerFeedback}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: BULLET REWRITER */}
      {activeSubTab === 'bullet' && (
        <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#2563EB]" />
              <span>Resume Bullet Point Optimizer (Google X-Y-Z Formula)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Transform weak responsibilities into quantified, high-impact ATS bullet points.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              Paste your raw or weak resume bullet point:
            </label>
            <textarea
              value={rawBullet}
              onChange={(e) => setRawBullet(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
            />
            <div className="flex justify-end">
              <button
                onClick={handleOptimizeBullet}
                disabled={isOptimizing}
                className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{isOptimizing ? 'Generating Metrics...' : 'Optimize Bullet Point'}</span>
              </button>
            </div>
          </div>

          {optimizedBullets.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Generated High-Impact Bullet Alternatives:
              </h4>

              <div className="space-y-3">
                {optimizedBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <p className="text-xs text-slate-800 font-sans leading-relaxed font-medium">
                      {bullet}
                    </p>
                    <button
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedBulletIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: COVER LETTER GENERATOR */}
      {activeSubTab === 'coverletter' && (
        <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2563EB]" />
              <span>Tailored Cover Letter Generator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Generate a personalized, ATS-friendly cover letter matching your profile and target company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Company Name:</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Job Title:</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleGenerateCoverLetter}
              className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Cover Letter</span>
            </button>
          </div>

          {generatedLetter && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Generated Cover Letter:
                </h4>
                <button
                  onClick={handleCopyCoverLetter}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono leading-relaxed text-slate-800 whitespace-pre-wrap">
                {generatedLetter}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 4: THINGS TO ADD TO IMPROVE YOUR RESUME */}
      {activeSubTab === 'thingsToAdd' && (
        <div className="space-y-6">
          {/* Main Title Banner */}
          <div className="bg-[#FAF8F3] border border-[#16405B] p-6 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#16405B] text-amber-300 text-[10px] font-mono font-bold uppercase rounded-xs">
                ★ High-Impact Career Upgrade Blueprint
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Actionable Things to Add to Improve Your Resume
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              Add these verified skills, high-impact project bullet points, certifications, and quantified metrics to your resume to pass ATS screeners and impress hiring managers instantly.
            </p>
          </div>

          {/* Section 1: Must-Have Technical Skills */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#16405B]" />
                <span>1. Essential High-Demand Skills to Add to Skills Section</span>
              </h4>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold">
                Categorized by Domain
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  🛠️ Developer Tools & VCS
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> Git, GitHub, VS Code, Postman, Bash/Linux CLI, JIRA, Docker basics.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: Required by 98% of technical recruiters for team collaboration.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  🌐 Web & Frontend
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> React.js, TypeScript, Next.js, Tailwind CSS, HTML5/CSS3, Redux Toolkit, Web Vitals.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: Shows ability to craft responsive, modern user interfaces.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  ⚡ Backend & Databases
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> Node.js, Express.js, REST APIs, PostgreSQL / MySQL, MongoDB, Redis, JWT Authentication.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: Proves capability in building production-ready API servers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  ☁️ DevOps & Cloud Basics
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> AWS (S3, EC2), GitHub Actions (CI/CD), Docker, Cloud Run / Vercel, Nginx.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: Cloud awareness elevates your resume above entry-level applicants.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  🧠 AI & Data Engineering
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> Google Gemini API, OpenAI SDK, Python, Pandas, SQL Query Optimization.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: High demand across modern AI-driven product engineering teams.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h5 className="text-xs font-bold text-slate-900 font-mono uppercase text-[#16405B]">
                  📐 Core Computer Science
                </h5>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong className="text-slate-800">Add:</strong> Data Structures & Algorithms, OOPs Concepts, System Design Basics, DBMS, OS.
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Why: Non-negotiable baseline for technical screening rounds.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Ready-to-Add High-Impact Projects */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>2. High-Impact Projects You Can Build & Add to Your Resume</span>
              </h4>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-bold border border-emerald-200">
                Full-Stack & AI Templates
              </span>
            </div>

            <div className="space-y-4">
              {/* Project Card 1 */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-slate-900 text-base">
                    🚀 Full-Stack AI Career Intelligence & ATS Resume Analyzer
                  </h5>
                  <span className="text-[10px] font-mono bg-[#16405B] text-white px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                    React • Node.js • TypeScript • Express • Gemini API
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  An automated resume parser and career analytics platform that parses candidate documents, extracts key technical skills, and generates tailored STAR interview prep plans.
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#16405B] uppercase block">
                    Copyable Resume Bullets for This Project:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-sans">
                    <li>Engineered an automated PDF resume parser extracting contact info, skills, and work history with sub-200ms backend latency.</li>
                    <li>Integrated Google Gemini AI API to calculate ATS keyword match percentages and deliver real-time career roadmap recommendations.</li>
                    <li>Built an interactive React dashboard with Recharts visualizations and exportable PDF analysis reports.</li>
                  </ul>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-slate-900 text-base">
                    💻 Real-Time Collaborative Code Snippet Editor
                  </h5>
                  <span className="text-[10px] font-mono bg-[#16405B] text-white px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                    React • WebSockets • Redis • Node.js • Docker
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A multi-user cloud code editor with WebSocket state synchronization and isolated sandboxed code execution environments.
                </p>
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#16405B] uppercase block">
                    Copyable Resume Bullets for This Project:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-sans">
                    <li>Architected a real-time collaborative code editor supporting multi-user simultaneous editing with low-latency WebSocket sync.</li>
                    <li>Implemented Docker container sandboxing to securely execute JavaScript, Python, and C++ code snippets in under 500ms.</li>
                    <li>Integrated Redis caching and Monaco Editor syntax highlighting to deliver a smooth desktop-class coding experience.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Must-Have Certifications & Credentials */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>3. High-Value Industry Certifications to Earn & List</span>
              </h4>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-bold">
                Industry Recognized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-xs font-bold text-slate-900">NPTEL / SWAYAM Govt. Certificates</strong>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">India Priority</span>
                </div>
                <p className="text-xs text-slate-600">
                  Programming in Java, DBMS, Operating Systems, or Data Structures. Highly respected by TCS, Infosys, Wipro, and Indian tech recruiters.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-xs font-bold text-slate-900">AWS Certified Cloud Practitioner (CCP)</strong>
                  <span className="text-[10px] font-mono text-blue-700 font-bold">Global Standard</span>
                </div>
                <p className="text-xs text-slate-600">
                  Demonstrates fundamental understanding of cloud compute, S3 storage, IAM security, and serverless architecture.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-xs font-bold text-slate-900">Meta / Google Professional Certificate</strong>
                  <span className="text-[10px] font-mono text-[#16405B] font-bold">Coursera</span>
                </div>
                <p className="text-xs text-slate-600">
                  Meta Front-End or Back-End Developer Certificate. Proves hands-on React, Node.js, and version control proficiency.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center">
                  <strong className="text-xs font-bold text-slate-900">FreeCodeCamp / HackerRank Verified Skills</strong>
                  <span className="text-[10px] font-mono text-slate-700 font-bold">Free & Immediate</span>
                </div>
                <p className="text-xs text-slate-600">
                  JavaScript Algorithms & Data Structures, SQL Advanced Certificate. Perfect for proving foundational coding accuracy.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Copy-and-Paste Action-Oriented Bullets */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#2563EB]" />
                <span>4. Ready-to-Copy Quantified Impact Bullets</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-500">1-Click Copy</span>
            </div>

            <div className="space-y-3">
              {[
                "• Architected modular frontend components using React and TypeScript, reducing page render latency by 35% and boosting Lighthouse performance score to 96+.",
                "• Designed and optimized PostgreSQL database schemas with indexed queries, accelerating API endpoint response times from 650ms to 120ms.",
                "• Implemented RESTful microservices with Express.js and JWT authentication, securely handling 10,000+ daily requests with zero downtime.",
                "• Automated testing and continuous integration using GitHub Actions, reducing bug occurrences in production releases by 40%.",
                "• Integrated Redis in-memory caching for frequently queried endpoints, reducing database read load by 45% during peak traffic."
              ].map((bullet, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-slate-800 leading-relaxed font-medium">
                    {bullet}
                  </p>
                  <button
                    onClick={() => handleCopyBullet(bullet, idx + 50)}
                    className="shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedBulletIndex === idx + 50 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
