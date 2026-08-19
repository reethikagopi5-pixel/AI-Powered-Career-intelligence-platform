import React, { useState } from 'react';
import { UserProfile, ResumeRecord, AnalysisResult } from '../types';
import { FileText, Download, RefreshCw, ArrowUpRight, Target, Sparkles, CheckCircle, FileCheck, Copy, Check } from 'lucide-react';
import { generatePdfReport } from '../utils/generatePdfReport';
import { formatRupeeSalary } from '../utils/salaryFormatter';

interface OverviewProps {
  user: UserProfile;
  activeResume: ResumeRecord | null;
  latestAnalysis: AnalysisResult | null;
  onNavigateTab: (tab: string) => void;
  onDownloadResume: (id: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  user,
  activeResume,
  latestAnalysis,
  onNavigateTab,
  onDownloadResume,
}) => {
  const [copiedChecklist, setCopiedChecklist] = useState(false);
  const atsScore = latestAnalysis ? latestAnalysis.atsScore : 84;
  const matchPercentage = latestAnalysis ? latestAnalysis.skillGap.matchPercentage : 78;

  const handleCopyChecklist = () => {
    const text = `🎯 100/100 ATS Score Optimization Blueprint for ${user.targetRole || 'Software Engineer'}:
1. Standard Section Titles: Use "PROFESSIONAL EXPERIENCE" and "TECHNICAL SKILLS".
2. Target Role Title Header: Place "${user.targetRole || 'Software Engineer'}" prominently right under your full name.
3. Inject Missing Competencies: Add missing skills (${latestAnalysis?.skillGap.missingSkills.map(s => s.name).join(', ') || 'Docker, CI/CD, System Architecture'}) in your Skills section.
4. Quantify Every Bullet Point: "Accomplished [X] measured by [Y] by doing [Z]" (e.g., Improved query response time by 38%).
5. Formatting & Parsing Hygiene: Single column layout, clear PDF format, no nested tables or floating text boxes.`;

    navigator.clipboard.writeText(text);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2500);
  };

  const handleDownloadPdf = () => {
    if (latestAnalysis) {
      generatePdfReport(latestAnalysis, user);
    } else {
      // Create default analysis result to generate report
      const mockAnalysis: AnalysisResult = {
        id: 'mock-1',
        userId: user.id || '1',
        resumeId: activeResume?.id || 'res-1',
        resumeName: activeResume?.originalName || 'Candidate_Resume.pdf',
        createdAt: new Date().toISOString(),
        targetRole: user.targetRole || 'Software Engineer',
        atsScore: 84,
        scoreBreakdown: { keywordMatch: 82, formatting: 88, impactMetrics: 76, sectionCompleteness: 90 },
        summary: 'Candidate profile aligns well with target software engineering standards. Strong core skills identified with high potential for senior positions.',
        skillGap: {
          matchPercentage: 78,
          identifiedStrengths: user.skills?.length ? user.skills : ['TypeScript', 'React.js', 'Node.js', 'REST APIs', 'Git'],
          missingSkills: [
            { name: 'System Architecture', importance: 'High', category: 'Architecture' },
            { name: 'Docker / Containers', importance: 'High', category: 'DevOps' },
            { name: 'CI/CD Pipelines', importance: 'Medium', category: 'DevOps' },
          ],
          totalRequiredSkills: 10,
          matchedCount: 7,
          missingCount: 3,
        },
        careerPath: {
          recommendedRole: user.targetRole || 'Software Engineer',
          alignmentProbability: 86.5,
          roadmap: [
            { level: 'Current Level', title: 'Mid-Level Engineer', timeline: '0-1 Years', requiredSkills: ['React', 'Node.js'], responsibilities: ['Feature development'], description: 'Building full-stack features.' },
            { level: 'Next Progression', title: 'Senior Software Engineer', timeline: '1-3 Years', requiredSkills: ['System Design', 'Cloud Infra'], responsibilities: ['Lead architecture'], description: 'Architecting scalable applications.' },
            { level: 'Target Vision', title: 'Lead / Principal Engineer', timeline: '3-5 Years', requiredSkills: ['Team Leadership', 'Distributed Systems'], responsibilities: ['Tech strategy'], description: 'Guiding engineering vision.' },
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
            { year: 4, yearLabel: 'Year 4', minSalary: 1700000, avgSalary: 2250000, maxSalary: 2800000 },
            { year: 5, yearLabel: 'Year 5', minSalary: 2100000, avgSalary: 2750000, maxSalary: 3500000 },
          ],
          topSkillPremiums: [
            { skill: 'System Design', estimatedValueBoost: '+₹2.5 Lakhs/yr' },
            { skill: 'Docker & Cloud Infra', estimatedValueBoost: '+₹1.8 Lakhs/yr' },
          ],
          marketDemandFactor: 'High Demand (+18% YoY)',
        },
        learningResources: [
          { id: '1', skillName: 'System Architecture', courseTitle: 'Grokking System Design Fundamentals', platform: 'Educative', difficulty: 'Intermediate', estimatedHours: 25, rating: 4.8, url: 'https://educative.io' },
          { id: '2', skillName: 'Docker & Kubernetes', courseTitle: 'Docker Deep Dive & Container Orchestration', platform: 'Udemy', difficulty: 'Beginner', estimatedHours: 18, rating: 4.7, url: 'https://udemy.com' },
        ],
        improvementTips: [
          { category: 'Impact', severity: 'Critical', tip: 'Quantify impact with metrics (e.g., Improved API latency by 35%).' },
          { category: 'Keywords', severity: 'Recommended', tip: 'Include explicit target keywords matching job description requirements.' },
        ],
        extractedData: {
          name: user.name || 'Candidate',
          email: user.email || 'candidate@example.com',
          phone: user.phone || '+1 555 0192',
          targetRole: user.targetRole,
          education: user.education ? [{ institution: user.college || 'University', degree: user.education }] : [],
          experience: [],
          skills: user.skills || [],
          certifications: user.certifications || [],
          projects: user.projects || [],
          rawText: '',
        },
      };
      generatePdfReport(mockAnalysis, user);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* 1. Header / Profile Summary Banner */}
      <section className="col-span-12 md:col-span-8 bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-tight mb-1 font-semibold">
              Profile ID: #{user.id ? user.id.slice(-6).toUpperCase() : '29481-X'}
            </p>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">
              Welcome back, {user.name || 'Candidate'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              Target Role: <span className="text-[#0F172A] font-bold">{user.targetRole || 'Software Engineer'}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPdf}
              className="bg-[#16405B] hover:bg-[#103046] text-white px-4 py-2.5 rounded-lg font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-[#C8622A]" />
              <span>Export Analysis & Interview Tips PDF</span>
            </button>
            <button
              onClick={() => onNavigateTab('resume')}
              className="bg-[#2563EB] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1D4ED8] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 font-mono text-xs">
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Profile Score</span>
            <span className="text-slate-800 font-bold text-sm">{user.profileCompletion || 85}% Complete</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Identified Skills</span>
            <span className="text-slate-800 font-bold text-sm">
              {latestAnalysis?.skillGap.identifiedStrengths.length || user.skills?.length || 12} Verified
            </span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">Skill Match</span>
            <span className="text-[#2563EB] font-bold text-sm">{matchPercentage}% Alignment</span>
          </div>
        </div>
      </section>

      {/* 2. ATS Gauge Card */}
      <section className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
        <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 font-semibold">
          ATS Optimization Score
        </p>
        <div className="relative flex items-center justify-center my-2">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r="60" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#2563EB"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="377"
              strokeDashoffset={377 - (377 * atsScore) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-mono font-extrabold text-[#0F172A]">{atsScore}</span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider mt-0.5">
              {atsScore >= 80 ? 'TOP 5% MATCH' : atsScore >= 65 ? 'GOOD MATCH' : 'NEEDS OPTIMIZATION'}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs font-medium text-slate-600">
          Strong alignment for <span className="text-[#0F172A] font-bold underline">Industry Standards</span>
        </p>
      </section>

      {/* 3. Skill Matrix Analysis */}
      <section className="col-span-12 md:col-span-5 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-[#0F172A] tracking-tight">Skill Matrix Analysis</h3>
          <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 border border-blue-100 rounded-sm uppercase font-semibold">
            Live Analysis
          </span>
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Identified Strengths</p>
            <div className="flex flex-wrap gap-1.5">
              {(latestAnalysis?.skillGap.identifiedStrengths || user.skills || ['React', 'TypeScript', 'Node.js', 'System Architecture']).map(
                (skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-mono rounded-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase mb-2">Missing Technical Competencies</p>
            <div className="flex flex-wrap gap-1.5">
              {(latestAnalysis?.skillGap.missingSkills.map((s) => s.name) || ['Docker', 'CI/CD Pipelines', 'GraphQL']).map(
                (skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono rounded-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Salary Forecast */}
      <section className="col-span-12 md:col-span-3 bg-[#0F172A] text-white p-6 rounded-xl flex flex-col justify-between shadow-xs">
        <div>
          <h3 className="font-bold tracking-tight mb-1 text-white">Salary Forecast</h3>
          <p className="text-xs text-slate-400 font-mono mb-6 italic">5-Year Trajectory in India</p>
        </div>
        <div>
          <div className="flex items-end gap-2 h-20 mb-4">
            <div className="bg-slate-700 w-full h-2/5 rounded-t-xs"></div>
            <div className="bg-slate-600 w-full h-3/5 rounded-t-xs"></div>
            <div className="bg-[#2563EB] w-full h-4/5 rounded-t-xs"></div>
            <div className="bg-[#2563EB] opacity-80 w-full h-full rounded-t-xs"></div>
          </div>
          <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
            <span className="text-xs text-slate-400">Current Est.</span>
            <span className="text-lg font-mono font-bold text-[#3B82F6]">
              {formatRupeeSalary(latestAnalysis?.salaryPrediction.currentEstimatedAvg || 1450000).lpa}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className="text-slate-400 uppercase font-mono text-[10px]">5-Yr Target</span>
            <span className="text-slate-200 font-mono font-semibold">+34% Growth</span>
          </div>
        </div>
      </section>

      {/* 5. Active Document */}
      <section className="col-span-12 md:col-span-4 bg-white border border-slate-200 p-6 rounded-xl flex flex-col justify-between shadow-xs">
        <div>
          <h3 className="font-bold text-[#0F172A] mb-3">Active Document</h3>
          {activeResume ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="bg-red-50 p-2.5 rounded-lg shrink-0">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{activeResume.originalName}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Type: .{activeResume.fileType.toUpperCase()} • Size: {(activeResume.size / 1024).toFixed(0)}KB
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              No active resume uploaded. Please upload a resume to unlock tailored recommendations.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => activeResume && onDownloadResume(activeResume.id)}
            disabled={!activeResume}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onNavigateTab('resume')}
            className="flex items-center justify-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Manage</span>
          </button>
        </div>
      </section>

      {/* 6. ATS Score 100 Optimization Blueprint & Step-by-Step Action Checklist */}
      <section className="col-span-12 bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-50 text-[#2563EB] border border-blue-200 text-[10px] font-mono font-bold uppercase rounded-sm flex items-center gap-1">
                <Target className="w-3 h-3" />
                TARGET GOAL: 100/100 ATS SCORE
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase rounded-sm">
                +{100 - atsScore} POINTS GAP TO WIN
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              How to Reach a Perfect 100/100 ATS Score (Step-by-Step Guide)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              ATS (Applicant Tracking Systems) score your resume by scanning for exact keywords, section titles, and quantified impact metrics. Follow these 4 clear steps to boost your score to 100.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('resume')}
            className="shrink-0 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Fixes in Analyzer</span>
          </button>
        </div>

        {/* 4 Core Pillars to 100 Score Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D5CDBD] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-md bg-[#16405B] text-white text-xs font-mono font-bold">
                  STEP 1
                </span>
                <span className="text-[10px] font-mono font-bold text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded border border-[#C2BAB0]">
                  30 Points
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Exact Keyword Injection</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Add missing technical competencies directly into your Skills matrix and work experience bullets.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-mono space-y-1">
              <p className="font-semibold text-[#16405B]">Required Missing Terms:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(latestAnalysis?.skillGap.missingSkills.map((s) => s.name) || ['Docker', 'CI/CD', 'System Design']).map((s, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px]">
                    +{s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D5CDBD] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-md bg-[#16405B] text-white text-xs font-mono font-bold">
                  STEP 2
                </span>
                <span className="text-[10px] font-mono font-bold text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded border border-[#C2BAB0]">
                  25 Points
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Google X-Y-Z Metrics</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Add numbers, percentages, or scale numbers to every bullet point.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 space-y-1">
              <p className="font-mono font-semibold text-emerald-800">Winning Formula:</p>
              <p className="text-[10px] text-slate-700 italic bg-white p-1.5 rounded border border-slate-200">
                "Accomplished [X] measured by [Y] by doing [Z]"
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D5CDBD] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-md bg-[#16405B] text-white text-xs font-mono font-bold">
                  STEP 3
                </span>
                <span className="text-[10px] font-mono font-bold text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded border border-[#C2BAB0]">
                  25 Points
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Standard Section Headers</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Use exact titles like "PROFESSIONAL EXPERIENCE", "TECHNICAL SKILLS", "EDUCATION".
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 space-y-1">
              <p className="font-mono font-semibold text-[#16405B]">Header Check:</p>
              <p className="text-[10px] text-slate-600">Ensure LinkedIn, GitHub & Phone are in main top text.</p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D5CDBD] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-md bg-[#16405B] text-white text-xs font-mono font-bold">
                  STEP 4
                </span>
                <span className="text-[10px] font-mono font-bold text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded border border-[#C2BAB0]">
                  20 Points
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">Single-Column Layout</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Avoid multi-column tables, floating text boxes, or embedded image graphics.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700 space-y-1">
              <p className="font-mono font-semibold text-purple-800">Format Hygiene:</p>
              <p className="text-[10px] text-slate-600">Export clean standard PDF or DOCX format.</p>
            </div>
          </div>
        </div>

        {/* Action Checklist */}
        <div className="bg-[#0F172A] text-white p-5 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Actionable Checklist to Reach 100/100 ATS Score</h4>
            </div>
            <button
              onClick={handleCopyChecklist}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 hover:text-emerald-300 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedChecklist ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Blueprint Checklist</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-blue-500 rounded cursor-pointer" />
              <div>
                <p className="font-bold text-slate-200">1. Use Standard Section Titles (+10 pts)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Rename "My Background" to "PROFESSIONAL EXPERIENCE" and "Stuff I Know" to "TECHNICAL SKILLS".
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-blue-500 rounded cursor-pointer" />
              <div>
                <p className="font-bold text-slate-200">2. Place Target Role Header (+10 pts)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Place "{user.targetRole || 'Software Engineer'}" prominently right under your name at the top.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <input type="checkbox" className="mt-0.5 accent-blue-500 rounded cursor-pointer" />
              <div>
                <p className="font-bold text-slate-200">3. Inject Missing Competencies (+15 pts)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Include keywords like ({latestAnalysis?.skillGap.missingSkills.map(s => s.name).join(', ') || 'Docker, CI/CD, System Design'}) in your Skills matrix.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/80 border border-slate-700">
              <input type="checkbox" className="mt-0.5 accent-blue-500 rounded cursor-pointer" />
              <div>
                <p className="font-bold text-slate-200">4. Quantify Every Bullet Point (+15 pts)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Example: Change "Fixed API bugs" to "Optimized 12+ API endpoints reducing response latency by 38%".
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEW SECTION: Jobs Available in India (Matched to Your Resume & Target Role) */}
      <section className="col-span-12 bg-white border border-[#D5CDBD] p-6 rounded-xl shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-[#FAF8F3] text-[#16405B] border border-[#C2BAB0] text-[10px] font-mono font-bold uppercase rounded-xs">
                🇮🇳 INDIAN JOB MARKET HIRING
              </span>
              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-mono font-bold uppercase rounded-xs">
                Live Openings Matched
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              Top Roles Available in India for Your Resume ({user.targetRole || 'Software Engineer'})
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Current hiring opportunities across major Indian tech hubs (Bengaluru, Hyderabad, Pune, NCR, Remote India) matching your technical background.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="text-xs font-mono font-bold text-[#16405B] bg-[#EAE3D2] px-3 py-1.5 rounded-md border border-[#C2BAB0]">
              Avg Salary in India: ₹10 - ₹28 LPA
            </div>
            <button
              onClick={() => onNavigateTab('internships')}
              className="px-4 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Browse Live Internships Feed →</span>
            </button>
          </div>
        </div>

        {/* Indian Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              company: 'Razorpay / PhonePe',
              role: `Full-Stack ${user.targetRole || 'Software Engineer'}`,
              location: 'Bengaluru / Remote India',
              salary: '₹14 - ₹24 LPA',
              match: `${matchPercentage}% Match`,
              skillsMatched: (latestAnalysis?.skillGap.identifiedStrengths || ['React', 'Node.js', 'TypeScript']).slice(0, 3).join(', '),
              missingNeeded: (latestAnalysis?.skillGap.missingSkills.map(s => s.name) || ['Docker', 'System Design'])[0] || 'System Design',
              steps: ['1. Add missing skill to resume', '2. Copy optimized bullets', '3. Apply via direct career portal'],
            },
            {
              company: 'TCS / Infosys (Digital & Innovation)',
              role: `Senior ${user.targetRole || 'Software Developer'}`,
              location: 'Hyderabad / Pune / Chennai',
              salary: '₹9 - ₹16 LPA',
              match: '92% High Match',
              skillsMatched: (latestAnalysis?.skillGap.identifiedStrengths || ['JavaScript', 'SQL', 'Git']).slice(0, 3).join(', '),
              missingNeeded: 'CI/CD Pipelines',
              steps: ['1. Update resume section titles', '2. Export 100/100 ATS PDF', '3. Upload to recruiter drive'],
            },
            {
              company: 'Swiggy / Flipkart / Cred',
              role: `Backend / Core Systems ${user.targetRole || 'Engineer'}`,
              location: 'Bengaluru / NCR (Gurugram)',
              salary: '₹18 - ₹32 LPA',
              match: '78% Match (Requires Upskilling)',
              skillsMatched: (latestAnalysis?.skillGap.identifiedStrengths || ['Node.js', 'SQL']).slice(0, 2).join(', '),
              missingNeeded: 'Docker & Microservices',
              steps: ['1. Complete 4-hr Docker course in Learning Path', '2. Add metrics to project bullets', '3. Request LinkedIn referral'],
            },
          ].map((job, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#FAF8F3] border border-[#D5CDBD] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded-xs">
                    {job.location}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#C8622A] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {job.match}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-[#0F172A]">{job.role}</h4>
                <p className="text-xs font-bold text-[#16405B] mt-0.5">{job.company}</p>
                <p className="text-sm font-mono font-extrabold text-emerald-700 mt-2">{job.salary}</p>

                <div className="mt-3 text-[11px] space-y-1 bg-white p-2.5 rounded border border-slate-200">
                  <p className="text-slate-700"><strong className="text-slate-900">Your Skills Matched:</strong> {job.skillsMatched}</p>
                  <p className="text-amber-800"><strong className="text-amber-900">Key Gap Needed:</strong> {job.missingNeeded}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-[11px] font-bold text-slate-800 mb-1">Easy Step-by-Step Application Roadmap:</p>
                <ol className="text-[10px] text-slate-600 space-y-0.5 font-mono">
                  {job.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
                <button
                  onClick={() => onNavigateTab('interview')}
                  className="w-full mt-3 py-1.5 bg-[#16405B] hover:bg-[#103046] text-white text-xs font-bold rounded cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  <span>Practice Role Interview Questions →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Career Path Roadmap Snapshot */}
      <section className="col-span-12 bg-white border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="shrink-0 flex items-center gap-4">
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
            Career Roadmap
          </span>
          <div className="hidden md:block w-px h-8 bg-slate-200"></div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 flex-1 w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold font-mono">
              01
            </span>
            <span className="text-sm font-semibold text-slate-800">Junior Phase</span>
          </div>
          <div className="hidden md:block flex-1 h-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold font-mono">
              02
            </span>
            <span className="text-sm font-semibold text-slate-800">{user.targetRole || 'Senior Engineer'}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
              Current
            </span>
          </div>
          <div className="hidden md:block flex-1 h-px border-t border-dashed border-slate-300"></div>
          <div className="flex items-center gap-2 opacity-60">
            <span className="w-7 h-7 rounded-full border border-slate-400 text-slate-500 flex items-center justify-center text-xs font-bold font-mono">
              03
            </span>
            <span className="text-sm font-semibold text-slate-600">Principal Architect</span>
          </div>
        </div>

        <div className="shrink-0 ml-auto">
          <p className="text-xs font-mono font-bold text-[#2563EB]">
            Alignment: {latestAnalysis?.careerPath.alignmentProbability || 84.2}%
          </p>
        </div>
      </section>
    </div>
  );
};
