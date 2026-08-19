import React, { useState } from 'react';
import { AnalysisResult, UserProfile, LearningResource } from '../types';
import { BookOpen, ExternalLink, CheckCircle2, Award, Lightbulb, AlertCircle, Search, Filter } from 'lucide-react';

interface LearningPathProps {
  analysis: AnalysisResult | null;
  user: UserProfile;
}

export const LearningPath: React.FC<LearningPathProps> = ({ analysis, user }) => {
  const initialResources: LearningResource[] = analysis?.learningResources || [
    {
      id: 'lr_1',
      skillName: 'System Architecture & RFCs',
      courseTitle: 'Software Architecture & System Design Fundamentals',
      platform: 'Coursera',
      difficulty: 'Intermediate',
      estimatedHours: 22,
      rating: 4.8,
      url: 'https://www.coursera.org',
    },
    {
      id: 'lr_2',
      skillName: 'Docker & Kubernetes',
      courseTitle: 'Docker and Kubernetes: The Complete Developer’s Guide',
      platform: 'Pluralsight',
      difficulty: 'Intermediate',
      estimatedHours: 18,
      rating: 4.9,
      url: 'https://www.pluralsight.com',
    },
    {
      id: 'lr_3',
      skillName: 'GraphQL API Design',
      courseTitle: 'Production GraphQL Server Architecture with Node.js',
      platform: 'edX',
      difficulty: 'Advanced',
      estimatedHours: 14,
      rating: 4.7,
      url: 'https://www.edx.org',
    },
    {
      id: 'lr_4',
      skillName: 'CI/CD & DevOps Automation',
      courseTitle: 'Automated CI/CD Workflows with GitHub Actions and AWS',
      platform: 'Udemy',
      difficulty: 'Beginner',
      estimatedHours: 12,
      rating: 4.8,
      url: 'https://www.udemy.com',
    },
  ];

  const [resources, setResources] = useState<LearningResource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.platform.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      res.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const toggleComplete = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const tips = analysis?.improvementTips || [
    {
      category: 'Impact' as const,
      severity: 'Critical' as const,
      tip: 'Quantify project achievements with measurable metrics (e.g. reduced API response latency by 35%).',
      exampleText: 'Optimized PostgreSQL queries reducing average response times from 420ms to 180ms.',
    },
    {
      category: 'Keywords' as const,
      severity: 'Recommended' as const,
      tip: `Incorporate key target role keywords like ${user.skills.slice(0, 3).join(', ') || 'Docker, System Design'} directly into work history bullets.`,
      exampleText: 'Architected containerized microservices utilizing Docker and automated GitHub Actions.',
    },
    {
      category: 'Formatting' as const,
      severity: 'Minor' as const,
      tip: 'Ensure section headers use standardized names (e.g. "Work Experience", "Technical Skills") for ATS parser accuracy.',
    },
  ];

  const completedCount = resources.filter((r) => r.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Skill Acquisition Roadmap
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Recommended Learning Roadmap
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Curated course recommendations mapped directly to your identified skill gaps for{' '}
              <span className="font-bold text-[#0F172A]">{user.targetRole || 'Software Engineer'}</span>.
            </p>
          </div>

          <div className="bg-[#0F172A] text-white p-5 rounded-xl flex items-center gap-6 min-w-64">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Roadmap Progress</p>
              <p className="text-3xl font-mono font-bold text-[#3B82F6] mt-0.5">
                {completedCount} / {resources.length}
              </p>
            </div>
            <div className="border-l border-slate-700 pl-6 text-xs text-slate-300">
              <p className="font-semibold text-emerald-400">
                {resources.length > 0 ? Math.round((completedCount / resources.length) * 100) : 0}% Complete
              </p>
              <p className="text-[10px] text-slate-400">Courses completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-bold text-lg text-[#0F172A]">Curated Skills Mastery Courses</h3>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill or course..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 w-48 md:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-white text-[#2563EB] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
            No courses found matching "{searchQuery}" under level "{selectedDifficulty}". Try resetting filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className={`border p-5 rounded-xl flex flex-col justify-between transition-all ${
                  res.completed
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-[#FDFCF7] border-slate-200 hover:border-[#0F172A]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                      {res.skillName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{res.platform}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0F172A] leading-snug mb-2">
                    {res.courseTitle}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mb-4">
                    <span>Level: {res.difficulty}</span>
                    <span>•</span>
                    <span>{res.estimatedHours} hrs</span>
                    <span>•</span>
                    <span className="text-amber-600 font-bold">★ {res.rating}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleComplete(res.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      res.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{res.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Improvement Recommendations */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <h3 className="font-bold text-base text-[#0F172A] mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#2563EB]" />
          <span>Actionable Resume Quality Improvement Tips</span>
        </h3>

        <div className="space-y-4">
          {tips.map((tip, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    tip.severity === 'Critical'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : tip.severity === 'Recommended'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {tip.severity}
                </span>
                <span className="font-bold text-xs text-[#0F172A]">{tip.category} Enhancement</span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1">{tip.tip}</p>
              {tip.exampleText && (
                <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Example Implementation:</span>
                  "{tip.exampleText}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
