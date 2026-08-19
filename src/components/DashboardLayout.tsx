import React, { useState } from 'react';
import { UserProfile, ResumeRecord, AnalysisResult } from '../types';
import { Overview } from './Overview';
import { MasterDashboard } from './MasterDashboard';
import { ResumeAnalyzer } from './ResumeAnalyzer';
import { SkillGap } from './SkillGap';
import { CareerPath } from './CareerPath';
import { SalaryPrediction } from './SalaryPrediction';
import { LearningPath } from './LearningPath';
import { InterviewPrep } from './InterviewPrep';
import { History } from './History';
import { Profile } from './Profile';
import { AcademicVault } from './AcademicVault';
import { InternshipsFeed } from './InternshipsFeed';
import { AIMentor } from './AIMentor';
import { ResumeImprover } from './ResumeImprover';
import { AdminDashboard } from './AdminDashboard';
import {
  LayoutDashboard,
  FileCheck,
  Cpu,
  Compass,
  IndianRupee,
  BookOpen,
  History as HistoryIcon,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Bot,
  Server,
  Zap,
} from 'lucide-react';

interface DashboardLayoutProps {
  user: UserProfile;
  activeResume: ResumeRecord | null;
  resumes: ResumeRecord[];
  latestAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onUploadResume: (file: File) => Promise<void>;
  onReplaceResume: (id: string, file: File) => Promise<void>;
  onActivateResume: (id: string) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onDownloadResume: (id: string) => void;
  onRunAnalysis: (resumeId?: string) => Promise<AnalysisResult>;
  onSelectHistoricalAnalysis: (analysis: AnalysisResult) => void;
  onSignOut: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  activeResume,
  resumes,
  latestAnalysis,
  isAnalyzing,
  onUpdateUser,
  onUploadResume,
  onReplaceResume,
  onActivateResume,
  onDeleteResume,
  onDownloadResume,
  onRunAnalysis,
  onSelectHistoricalAnalysis,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState('master');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      category: 'DASHBOARDS',
      items: [
        { id: 'master', label: 'Master Dashboard', icon: LayoutDashboard },
        { id: 'overview', label: 'Overview & Readiness', icon: LayoutDashboard },
      ],
    },
    {
      category: 'RESUME & DOCUMENTS',
      items: [
        { id: 'resume', label: 'Resume Analyzer & ATS Score', icon: FileCheck },
        { id: 'improver', label: 'AI Resume Rewriter', icon: Zap },
        { id: 'vault', label: 'Academic & Certificate Vault', icon: ShieldCheck },
      ],
    },
    {
      category: 'SKILLS & CAREER ROADMAP',
      items: [
        { id: 'skillgap', label: 'Skill Gap Analysis', icon: Cpu },
        { id: 'careerpath', label: 'Career Path Roadmap', icon: Compass },
        { id: 'learning', label: '30-60-90 Day Learning Path', icon: BookOpen },
      ],
    },
    {
      category: 'JOBS & SALARY',
      items: [
        { id: 'internships', label: 'Internships & Hiring Feed', icon: Briefcase },
        { id: 'salary', label: 'Salary Forecast (₹)', icon: IndianRupee },
      ],
    },
    {
      category: 'AI COACHING & SYSTEM',
      items: [
        { id: 'mentor', label: '24/7 AI Career Coach', icon: Bot },
        { id: 'interview', label: 'Interview Prep & Practice', icon: Sparkles },
        { id: 'history', label: 'Analysis History', icon: HistoryIcon },
        { id: 'admin', label: 'Admin & SQLite DB', icon: Server },
        { id: 'profile', label: 'Profile Settings', icon: User },
      ],
    },
  ];


  return (
    <div className="flex h-screen overflow-hidden text-slate-900 bg-blueprint bg-[#F7F4EB] font-sans">
      {/* Sidebar - Deep Steel Navy #16405B */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#16405B] text-slate-200 flex flex-col justify-between p-5 transition-transform duration-300 md:relative md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4 flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-between shrink-0 pb-2 border-b border-[#205274]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 border border-slate-400 bg-[#1D4A69] rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-[#C8622A] rounded-full"></div>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                CareerAI
              </h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Categorized Nav Sections */}
          <nav className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300/80">
                  {section.category}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#24587A] text-white font-semibold shadow-2xs border-l-2 border-amber-400'
                          : 'text-slate-300 hover:text-white hover:bg-[#1D4A69]/50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile Section matching Screenshot 3 */}
        <div className="mt-auto pt-6 border-t border-[#205274] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C8622A] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name || 'User'}</p>
              <p className="text-[11px] text-slate-300 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs font-medium text-[#E88A58] hover:text-[#D46227] transition-colors cursor-pointer pl-1"
          >
            <span>• Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-[#16405B] text-white px-4 py-3 flex items-center justify-between border-b border-[#205274]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-slate-400 bg-[#1D4A69] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-[#C8622A] rounded-full"></div>
            </div>
            <span className="font-bold text-base">CareerAI</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-blueprint bg-[#F7F4EB]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title & Plan Banner */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A]">
                Welcome back, {user.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Thursday's plan: run your first resume analysis to unlock your dashboard.
              </p>
            </div>

            {activeTab === 'master' && (
              <MasterDashboard
                user={user}
                activeResume={activeResume}
                latestAnalysis={latestAnalysis}
                onNavigateTab={setActiveTab}
                onDownloadResume={onDownloadResume}
              />
            )}

            {activeTab === 'overview' && (
              <Overview
                user={user}
                activeResume={activeResume}
                latestAnalysis={latestAnalysis}
                onNavigateTab={setActiveTab}
                onDownloadResume={onDownloadResume}
              />
            )}

            {activeTab === 'internships' && (
              <InternshipsFeed
                user={user}
                analysis={latestAnalysis}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeAnalyzer
                resumes={resumes}
                activeResume={activeResume}
                onUpload={onUploadResume}
                onReplace={onReplaceResume}
                onActivate={onActivateResume}
                onDelete={onDeleteResume}
                onDownload={onDownloadResume}
                onAnalyze={onRunAnalysis}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === 'improver' && <ResumeImprover user={user} analysis={latestAnalysis} />}

            {activeTab === 'mentor' && <AIMentor user={user} analysis={latestAnalysis} />}

            {activeTab === 'admin' && <AdminDashboard user={user} />}

            {activeTab === 'skillgap' && <SkillGap analysis={latestAnalysis} user={user} />}

            {activeTab === 'careerpath' && <CareerPath analysis={latestAnalysis} user={user} />}

            {activeTab === 'salary' && <SalaryPrediction analysis={latestAnalysis} user={user} />}

            {activeTab === 'learning' && <LearningPath analysis={latestAnalysis} user={user} />}

            {activeTab === 'interview' && <InterviewPrep analysis={latestAnalysis} user={user} />}

            {activeTab === 'vault' && <AcademicVault user={user} />}

            {activeTab === 'history' && (
              <History
                onSelectAnalysis={(selected) => {
                  onSelectHistoricalAnalysis(selected);
                  setActiveTab('overview');
                }}
              />
            )}

            {activeTab === 'profile' && (
              <Profile
                user={user}
                activeResume={activeResume}
                onUpdateUser={onUpdateUser}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
