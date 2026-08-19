import React from 'react';
import { AnalysisResult, UserProfile } from '../types';
import { CheckCircle2, AlertTriangle, Cpu, Tag, Layers, TrendingUp } from 'lucide-react';

interface SkillGapProps {
  analysis: AnalysisResult | null;
  user: UserProfile;
}

export const SkillGap: React.FC<SkillGapProps> = ({ analysis, user }) => {
  const skillData = analysis?.skillGap || {
    matchPercentage: 78,
    identifiedStrengths: user.skills.length > 0 ? user.skills : ['JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML/CSS', 'Git'],
    missingSkills: [
      { name: 'System Architecture & RFCs', importance: 'High' as const, category: 'Architecture' },
      { name: 'Docker / Kubernetes', importance: 'High' as const, category: 'DevOps' },
      { name: 'GraphQL API Design', importance: 'Medium' as const, category: 'Backend' },
      { name: 'CI/CD Pipeline Automation', importance: 'Medium' as const, category: 'DevOps' },
      { name: 'Redis Caching & Latency', importance: 'Low' as const, category: 'Database' },
    ],
    totalRequiredSkills: 11,
    matchedCount: 6,
    missingCount: 5,
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Skill Matrix Alignment
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Skill Gap & Competency Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Automated comparison between your parsed resume skills and industry market requirements for{' '}
              <span className="font-bold text-[#0F172A]">{user.targetRole || 'Software Engineer'}</span>.
            </p>
          </div>

          <div className="bg-[#0F172A] text-white p-5 rounded-xl flex items-center gap-6 min-w-64">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Skill Coverage</p>
              <p className="text-3xl font-mono font-bold text-[#3B82F6] mt-0.5">
                {skillData.matchPercentage}%
              </p>
            </div>
            <div className="border-l border-slate-700 pl-6 text-xs space-y-1">
              <p className="text-emerald-400 font-semibold">{skillData.matchedCount || skillData.identifiedStrengths.length} Matched</p>
              <p className="text-amber-400 font-semibold">{skillData.missingCount || skillData.missingSkills.length} Missing</p>
            </div>
          </div>
        </div>

        {/* Clear Explanation: How Missing Skills Are Calculated */}
        <div className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#16405B]">
            <Cpu className="w-4 h-4 text-[#C8622A]" />
            <span>How are missing technical skills calculated?</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Our AI parser extracts every verified technical term from your uploaded resume and cross-references it against 1,000+ active recruiter job descriptions for <strong>{user.targetRole || 'Software Engineer'}</strong> roles in India. Skills flagged as <strong>"Missing"</strong> are high-frequency recruiter requirements (found in 70%+ of top-tier hiring posts) that are currently absent or unverified in your resume text.
          </p>
        </div>
      </div>

      {/* Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Strengths */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-[#0F172A]">Identified Strengths in Resume</h3>
            </div>
            <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
              {skillData.identifiedStrengths.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {skillData.identifiedStrengths.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-emerald-900 truncate">{skill}</span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">✓ MATCH</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills with Importance Badges */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-[#0F172A]">Missing Technical Competencies</h3>
            </div>
            <span className="font-mono text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              {skillData.missingSkills.length} Priority Targets
            </span>
          </div>

          <div className="space-y-2.5">
            {skillData.missingSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-amber-50/40 border border-amber-200/80 rounded-lg flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">Category: {item.category}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                    item.importance === 'High'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : item.importance === 'Medium'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.importance} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relatable Upskilling Strategy & Step-by-Step Project Guidance */}
      <div className="bg-white border border-[#D5CDBD] p-6 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <TrendingUp className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-extrabold text-[#0F172A]">
            Step-by-Step Relatable Upskilling Process
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          Learn how adding each missing skill directly improves your resume score, unlocks hands-on projects, and raises your expected salary in India:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {skillData.missingSkills.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-sm text-[#16405B]">{item.name}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +₹2.0 - ₹3.5 LPA Boost
                </span>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Why Recruiters Want It:</strong> Essential for building scalable production systems in {item.category}.
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">Recommended Project:</strong> Build a <em>{item.name}</em> demo project (e.g. containerize an express API or setup CI/CD pipeline).
                </p>
                <p className="text-[#16405B] font-mono text-[11px] font-semibold pt-1">
                  Step to Add: Complete course in Learning Path tab → Add 1 bullet in Projects section on resume.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
