import React from 'react';
import { AnalysisResult, UserProfile } from '../types';
import { Compass, GitMerge, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

interface CareerPathProps {
  analysis: AnalysisResult | null;
  user: UserProfile;
}

export const CareerPath: React.FC<CareerPathProps> = ({ analysis, user }) => {
  const careerData = analysis?.careerPath || {
    recommendedRole: user.targetRole || 'Senior Full Stack Developer',
    alignmentProbability: 84.5,
    roadmap: [
      {
        level: 'Step 01',
        title: 'Junior Software Engineer',
        timeline: '0 - 1 Years',
        requiredSkills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
        responsibilities: [
          'Deliver core UI component features',
          'Fix software defects & write unit tests',
          'Participate in agile sprint ceremonies',
        ],
        description: 'Master core web framework syntax and team development standards.',
      },
      {
        level: 'Step 02',
        title: user.targetRole || 'Senior Software Engineer',
        timeline: '1 - 3 Years',
        requiredSkills: ['TypeScript', 'Node.js', 'System Architecture', 'SQL'],
        responsibilities: [
          'Lead backend REST API service design',
          'Optimize client-side rendering & bundle size',
          'Collaborate with Product & UX stakeholders',
        ],
        description: 'Take full ownership of end-to-end module lifecycles.',
      },
      {
        level: 'Step 03',
        title: 'Lead Architect / Tech Lead',
        timeline: '3 - 5 Years',
        requiredSkills: ['Distributed Systems', 'Cloud DevOps', 'GraphQL', 'Microservices'],
        responsibilities: [
          'Drive long-term technical architecture RFCs',
          'Mentor junior and mid-level developers',
          'Manage infrastructure scalability & cost',
        ],
        description: 'Set technical engineering vision and lead multi-team delivery.',
      },
      {
        level: 'Step 04',
        title: 'Principal Engineer / Director of Tech',
        timeline: '5+ Years',
        requiredSkills: ['Engineering Leadership', 'Org Strategy', 'Vendor Systems'],
        responsibilities: [
          'Align technology initiatives with company business goals',
          'Represent engineering in executive leadership',
        ],
        description: 'Guide company-wide platform architecture and organizational strategy.',
      },
    ],
    alternatePaths: [
      {
        role: 'Technical Product Manager',
        matchScore: 88,
        description: 'Combine technical engineering background with product strategy and customer research.',
      },
      {
        role: 'DevOps / Site Reliability Engineer',
        matchScore: 76,
        description: 'Transition development background into automated cloud infrastructure and CI/CD operations.',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Roadmap & Progression Engine
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Career Trajectory & Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Target role progression mapped specifically for{' '}
              <span className="font-bold text-[#0F172A]">{careerData.recommendedRole}</span>.
            </p>
          </div>

          <div className="bg-[#0F172A] text-white p-5 rounded-xl flex items-center gap-6 min-w-64">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Target Alignment</p>
              <p className="text-3xl font-mono font-bold text-[#3B82F6] mt-0.5">
                {careerData.alignmentProbability}%
              </p>
            </div>
            <div className="border-l border-slate-700 pl-6 text-xs text-slate-300">
              <p className="font-semibold text-emerald-400">High Suitability</p>
              <p className="text-[10px] text-slate-400">Based on parsed experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Roadmap Timeline */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <h3 className="font-bold text-lg text-[#0F172A] mb-6 pb-3 border-b border-slate-200 flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#2563EB]" />
          <span>Step-by-Step Career Progression</span>
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 md:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-200">
          {careerData.roadmap.map((step, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row items-center gap-6 group">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold shrink-0 z-10 ${
                  idx === 1
                    ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                    : 'bg-[#0F172A] border-[#0F172A] text-white'
                }`}
              >
                {idx + 1}
              </div>

              <div className="w-full bg-[#FDFCF7] border border-slate-200 p-5 rounded-xl shadow-xs hover:border-[#0F172A] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      {step.level} • {step.timeline}
                    </span>
                    <h4 className="text-base font-bold text-[#0F172A]">{step.title}</h4>
                  </div>
                  {idx === 1 && (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-mono font-bold uppercase self-start sm:self-auto">
                      Current Target Level
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-3">{step.description}</p>

                {/* Skills & Responsibilities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                  <div>
                    <p className="font-mono text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {step.requiredSkills.map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-slate-200/70 text-slate-800 rounded text-[10px] font-mono font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Core Responsibilities
                    </p>
                    <ul className="space-y-0.5 text-slate-600 list-disc list-inside text-[11px]">
                      {step.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternate Pivots */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <h3 className="font-bold text-base text-[#0F172A] mb-4 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-[#2563EB]" />
          <span>Alternate Career Pivot Options</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerData.alternatePaths.map((alt, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-sm text-[#0F172A]">{alt.role}</h4>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {alt.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-slate-600">{alt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
