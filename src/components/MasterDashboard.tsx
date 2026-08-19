import React from 'react';
import { UserProfile, ResumeRecord, AnalysisResult } from '../types';
import {
  FileCheck,
  Cpu,
  Compass,
  IndianRupee,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Briefcase,
  User,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface MasterDashboardProps {
  user: UserProfile;
  activeResume: ResumeRecord | null;
  latestAnalysis: AnalysisResult | null;
  onNavigateTab: (tabId: string) => void;
  onDownloadResume: (id: string) => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  user,
  activeResume,
  latestAnalysis,
  onNavigateTab,
  onDownloadResume,
}) => {
  const atsScore = latestAnalysis?.atsScore || 78;
  const targetRole = user.targetRole || 'Software Engineer';
  const targetSalary = latestAnalysis?.salaryPrediction?.predictedRange
    ? latestAnalysis.salaryPrediction.predictedRange.replace(/\$/g, '₹ ')
    : '₹ 8.5 - 14.5 LPA';
  const matchedSkills = latestAnalysis?.skillsMatched || ['React.js', 'TypeScript', 'Node.js', 'Git'];
  const missingSkills = latestAnalysis?.skillGaps || ['Docker', 'AWS S3', 'GraphQL', 'System Design'];

  return (
    <div className="space-y-8">
      {/* Executive Master Dashboard Title Header */}
      <div className="bg-[#16405B] text-white p-6 md:p-8 rounded-2xl shadow-md border border-[#205274] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-mono font-extrabold uppercase rounded-xs">
                ★ MASTER DASHBOARD
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                Candidate: <strong className="text-white">{user.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Executive Career Control Center
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Consolidated real-time intelligence monitoring across all 12 platform modules: ATS optimization, skill gaps, live hiring feed, interview preparation, academic records, and salary trajectory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('resume')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Manage Resume</span>
            </button>
            <button
              onClick={() => onNavigateTab('internships')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>View Live Jobs</span>
            </button>
          </div>
        </div>

        {/* Top Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-[#205274]">
          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">ATS Score</p>
            <p className="text-lg font-extrabold text-amber-300 font-mono">{atsScore}%</p>
            <p className="text-[10px] text-slate-300">Optimized</p>
          </div>

          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">Target Role</p>
            <p className="text-xs font-bold text-white truncate">{targetRole}</p>
            <p className="text-[10px] text-emerald-400">High Match</p>
          </div>

          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">Skills Matched</p>
            <p className="text-lg font-extrabold text-emerald-300 font-mono">{matchedSkills.length}</p>
            <p className="text-[10px] text-slate-300">Verified</p>
          </div>

          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">Skill Gaps</p>
            <p className="text-lg font-extrabold text-rose-300 font-mono">{missingSkills.length}</p>
            <p className="text-[10px] text-slate-300">In Roadmap</p>
          </div>

          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">Predicted Salary</p>
            <p className="text-xs font-bold text-amber-200 truncate">{targetSalary}</p>
            <p className="text-[10px] text-slate-300">Industry Avg</p>
          </div>

          <div className="bg-[#1D4A69]/80 p-3 rounded-xl border border-[#2B638A]">
            <p className="text-[10px] font-mono text-slate-300 uppercase">Academic Vault</p>
            <p className="text-lg font-extrabold text-blue-300 font-mono">3 Docs</p>
            <p className="text-[10px] text-slate-300">Verified</p>
          </div>
        </div>
      </div>

      {/* Grid Layout of All Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Active Resume Document Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#16405B]" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">1. Active Resume Status</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            {activeResume ? (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800 truncate">{activeResume.originalName}</p>
                <p className="text-slate-500 text-[11px]">
                  Uploaded: {new Date(activeResume.uploadDate).toLocaleDateString()} • Format: <span className="uppercase font-mono">{activeResume.fileType}</span>
                </p>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Parsed Profile Data:</p>
                  <p className="text-[11px] text-slate-700 font-semibold truncate">
                    {activeResume.extractedData?.contactInfo?.name || user.name}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">
                    {activeResume.extractedData?.skills?.length || 0} skills parsed from document
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                No active resume document currently uploaded.
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('resume')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Resume Analyzer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: Skill Gap Analysis */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">2. Skill Gap Matrix</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Target: {targetRole}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Top Missing Competencies:</p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[11px] font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Verified Matching Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('skillgap')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Analyze Skill Gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: Career Path Progression */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C8622A]" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">3. Career Roadmap</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Level 1: Entry
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg space-y-2 text-xs">
              <p className="font-bold text-[#0F172A]">Current Target: Junior {targetRole}</p>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Milestone 1: Complete Full-Stack Projects</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>Milestone 2: Earn Cloud Practitioner Certification</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span>Milestone 3: Target Senior {targetRole} (3 Years)</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('careerpath')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Full Career Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 4: Internships & Hiring Feed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#16405B]" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">4. Live Hiring Feed</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                Live Openings
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Python / Django Developer Intern</p>
                  <p className="text-[10px] text-slate-500">TechCorp Solutions • ₹18,000/mo</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  94% Match
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Full Stack Web Development Intern</p>
                  <p className="text-[10px] text-slate-500">Innovate Labs • ₹25,000/mo</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  98% Match
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('internships')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Explore All Internships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 5: Salary Prediction */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">5. Salary Forecast</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Market Data
              </span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2 text-xs">
              <p className="text-[10px] font-mono uppercase text-emerald-900 font-bold">Estimated Starting Range:</p>
              <p className="text-lg font-extrabold text-emerald-900 font-mono">{targetSalary}</p>
              <p className="text-[11px] text-emerald-800">
                Adding Docker + Cloud Certification increases valuation by +18% (₹ 2.5 Lakhs/yr boost).
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('salary')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View 5-Year Salary Chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 6: Learning Path Courses */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">6. Learning Path</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                Recommended
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-bold text-slate-900">Docker & Containerization Mastery</p>
                <p className="text-[10px] text-slate-500">Platform: Udemy • Duration: 8 hours</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-bold text-slate-900">AWS Certified Cloud Practitioner</p>
                <p className="text-[10px] text-slate-500">Platform: Coursera • Duration: 15 hours</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('learning')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Explore Recommended Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 7: Interview Prep & STAR Answers */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">7. Interview Prep & Bullets</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                10 Categories
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Includes 10 real-world interview question categories with STAR method answer scripts and copyable resume bullets.
              </p>
              <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 space-y-1">
                <p className="font-bold text-[11px]">★ New: Things to Add to Resume Blueprint</p>
                <p className="text-[10px] text-amber-800">Essential skills, high-impact projects, and certifications.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('interview')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open Interview & Bullets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 8: Academic Vault & Certificates */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">8. Academic & Document Vault</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-bold text-slate-900 truncate">B.Tech Degree Certificate & Transcripts</p>
                <p className="text-[10px] text-slate-500">CGPA: {user.cgpa || '8.5/10.0'} • Status: Verified</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-bold text-slate-900 truncate">NPTEL Cloud Computing Certificate</p>
                <p className="text-[10px] text-slate-500 font-mono">ID: NPTEL26CS88</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('vault')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open Academic Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 9: User Profile & Target Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">9. Profile Settings</h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                Settings
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#0F172A] font-bold">{user.name}</p>
              <p className="text-slate-500 truncate">{user.email}</p>
              <p className="text-slate-600">Target Role: <strong className="text-slate-900">{targetRole}</strong></p>
              <p className="text-slate-600">Experience Level: <strong className="text-slate-900">{user.experienceLevel || 'Entry Level'}</strong></p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Update Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
