import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Compass,
  DollarSign,
  BookOpen,
  FileCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-blueprint text-slate-900 font-sans flex flex-col justify-between">
      {/* Navigation Bar */}
      <header className="bg-[#F7F4EB]/90 backdrop-blur-md border-b border-[#E3DDD0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-6 h-6 border border-[#C2BAB0] bg-[#FAF8F3] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-[#C8622A] rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              CareerAI
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-xs font-semibold text-slate-700 hover:text-[#0F172A] px-4 py-2 rounded-md border border-[#D5CDBD] hover:bg-white transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={onGetStarted}
              className="bg-[#16405B] hover:bg-[#103046] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Hero Narrative */}
          <div className="col-span-12 md:col-span-7 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>—</span>
              <span>AI-POWERED CAREER INTELLIGENCE</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight">
              Read your resume like a <span className="text-[#16405B]">recruiter’s ATS</span> would.
            </h2>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              Upload your resume once. CareerAI scores it, maps your skill gaps against real job requirements, predicts your salary trajectory, and lays out a learning path — all in under two minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-[#C8622A] hover:bg-[#B3531F] text-white px-6 py-3 rounded-md font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-[#A84A19]"
              >
                <span>Analyze my resume</span>
                <span>→</span>
              </button>

              <button
                onClick={onLogin}
                className="border border-[#D5CDBD] hover:border-[#0F172A] text-slate-800 bg-[#F7F4EB] hover:bg-white px-6 py-3 rounded-md font-semibold text-sm transition-colors cursor-pointer"
              >
                I already have an account
              </button>
            </div>

            <div className="pt-4 flex items-center gap-4 text-[11px] font-mono text-slate-500">
              <span>NO CREDIT CARD</span>
              <span>·</span>
              <span>RESULTS IN ~90 SECONDS</span>
              <span>·</span>
              <span>BUILT FOR ENGINEERING & TECH ROLES</span>
            </div>
          </div>

          {/* Right Hero Sample Gauge Dial */}
          <div className="col-span-12 md:col-span-5 flex justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Architectural Dial Tick Marks */}
              <div className="absolute inset-0 rounded-full border border-[#DCD4C5] flex items-center justify-center">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-[#C2BAB0]"
                    style={{
                      height: i % 5 === 0 ? '8px' : '4px',
                      transform: `rotate(${i * 6}deg) translateY(-148px)`,
                    }}
                  />
                ))}
              </div>

              {/* Circular Gauge Arc */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle cx="128" cy="128" r="104" stroke="#E3DDD0" strokeWidth="12" fill="transparent" />
                <circle
                  cx="128"
                  cy="128"
                  r="104"
                  stroke="#16405B"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="653"
                  strokeDashoffset="120"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Metric Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-extrabold text-[#16405B] tracking-tight">84</span>
                <span className="text-xs font-mono font-medium text-slate-500 tracking-widest mt-2">
                  ATS SCORE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Platform Objectives Grid (Matching Page 3 of Milestone PDF) */}
        <section className="mt-20 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-3 py-1 rounded uppercase tracking-wider">
              System Objectives
            </span>
            <h3 className="text-3xl font-extrabold text-[#0F172A] mt-2">10 Core Project Objectives</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete end-to-end AI career platform roadmap implemented in full compliance with Milestone specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Resume Analysis System</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parse PDF, DOCX, TXT, and scanned image resumes to extract candidates' contact details, work experience, skills, and education.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Identify Skill Gaps</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated skill matrix engine comparing candidate qualifications against target job requirements to highlight missing skills.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Recommend Suitable Career Paths</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates step-by-step role progression roadmaps with clear milestone goals and alternate career pivot directions.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  4
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Personalized Job Recommendations</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matches candidate profiles with relevant job opportunities, target role descriptions, and fit confidence scores.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  5
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Recommend Learning Resources</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides curated skill mastery courses from top platforms with estimated completion times and direct links.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  6
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Predict Salary Ranges</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                5-Year compensation forecast model and high-impact skill premium estimators based on market valuation metrics.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  7
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Improve Resume Quality</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Actionable tips for enhancing resume bullet points, quantifying accomplishments, and removing ATS formatting risks.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  8
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Scalable & User-Friendly Platform</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-stack architecture featuring JWT authentication, password hashing, SQLite database storage, and RESTful APIs.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  9
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Visualize Career Insights</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive gauges, salary growth bar charts, and skill coverage indicators providing clear graphical feedback.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs hover:border-[#2563EB] transition-colors md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 bg-[#2563EB] text-white font-mono font-bold rounded-md flex items-center justify-center text-xs">
                  10
                </span>
                <h4 className="font-bold text-sm text-[#0F172A]">Data-Driven Career Decisions</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Persisted snapshot history logging and analytical tracking to guide long-term career growth decisions with confidence.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 py-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#2563EB] rounded-sm flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
            <span className="font-bold text-white">CareerAI</span>
            <span className="text-slate-500">• AI-Powered Career Intelligence Platform</span>
          </div>
          <div className="font-mono text-slate-500 text-[11px]">
            Infosys Springboard Virtual Internship — Reethika G
          </div>
        </div>
      </footer>
    </div>
  );
};
