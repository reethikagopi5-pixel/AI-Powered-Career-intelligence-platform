import React, { useState } from 'react';
import { UserProfile, InternshipListing, AnalysisResult } from '../types';
import {
  Home,
  Briefcase,
  Banknote,
  Calendar,
  FileText,
  Zap,
  Award,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Share2,
  Sparkles,
  MapPin,
  ExternalLink,
  X,
  Check,
} from 'lucide-react';

interface InternshipsFeedProps {
  user: UserProfile;
  analysis?: AnalysisResult | null;
}

const SAMPLE_INTERNSHIPS: InternshipListing[] = [
  {
    id: 'int-101',
    title: 'Python Development',
    company: 'Women First India Foundation',
    activelyHiring: true,
    locationType: 'Work from home',
    stipend: 'Unpaid',
    duration: '1 Month',
    description: 'Are you a passionate and driven individual looking to gain hands-on experience in Python development and software engineering...',
    skills: ['HTML', 'Python', 'Django', 'REST API'],
    postedTime: 'Few hours ago',
    earlyApplicantTag: true,
    jobOfferPostInternship: true,
    employmentType: 'Part time',
    matchScore: 94,
    portalName: 'Internshala',
    applyUrl: 'https://internshala.com/internships/python-django-internship/',
  },
  {
    id: 'int-102',
    title: 'Python Development & Full Stack',
    company: 'Amrata Solutions',
    activelyHiring: true,
    locationType: 'Work from home',
    stipend: '₹ 12,500 - 20,000 /month',
    duration: '3 Months',
    description: 'Are you passionate about software development and looking to kickstart your career in python cloud & web engineering...',
    skills: ['HTML', 'CSS', 'Python', 'Django', 'Machine Learning', 'REST API', 'Flask'],
    postedTime: 'Few hours ago',
    earlyApplicantTag: true,
    jobOfferPostInternship: true,
    employmentType: 'Full time',
    matchScore: 98,
    portalName: 'Internshala',
    applyUrl: 'https://internshala.com/internships/python-development-internship/',
  },
  {
    id: 'int-103',
    title: 'Game Development Mini-Games',
    company: 'PixelCraft Studios',
    activelyHiring: true,
    locationType: 'Work from home',
    stipend: '₹ 15,000 - 22,000 /month',
    duration: '2 Months',
    description: '1. Build and test mini-games using JavaScript + Cocos2d. 2. Implement basic gameplay, physics, animation cycles and canvas state...',
    skills: ['HTML', 'JavaScript', 'Game development', 'Cocos2d', 'Canvas API'],
    postedTime: '3 weeks ago',
    earlyApplicantTag: false,
    jobOfferPostInternship: true,
    employmentType: 'Part time',
    matchScore: 88,
    portalName: 'Unstop',
    applyUrl: 'https://unstop.com/internships',
  },
  {
    id: 'int-104',
    title: 'Frontend Web Development (React.js)',
    company: 'TechPulse India',
    activelyHiring: true,
    locationType: 'Hybrid',
    locationName: 'Bangalore, India',
    stipend: '₹ 18,000 - 25,000 /month',
    duration: '6 Months',
    description: 'Build responsive client dashboards, integrate RESTful microservices, optimize performance using React.js and Tailwind CSS...',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST API'],
    postedTime: 'Today',
    earlyApplicantTag: true,
    jobOfferPostInternship: true,
    employmentType: 'Full time',
    matchScore: 96,
    portalName: 'LinkedIn Jobs',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Frontend%20Developer%20Internship',
  },
  {
    id: 'int-105',
    title: 'AI & Data Science Intern',
    company: 'NeuralBytes Labs',
    activelyHiring: true,
    locationType: 'Work from home',
    stipend: '₹ 20,000 - 30,000 /month',
    duration: '3 Months',
    description: 'Train machine learning pipeline models, analyze NLP datasets, build GenAI prototype APIs with Python and PyTorch...',
    skills: ['Python', 'Machine Learning', 'PyTorch', 'Data Analysis', 'Scikit-Learn'],
    postedTime: '1 day ago',
    earlyApplicantTag: true,
    jobOfferPostInternship: true,
    employmentType: 'Full time',
    matchScore: 91,
    portalName: 'Unstop',
    applyUrl: 'https://unstop.com/internships?searchTerm=Data%20Science',
  },
  {
    id: 'int-106',
    title: 'Cloud & DevOps Engineering Intern',
    company: 'CloudMatrix Systems',
    activelyHiring: true,
    locationType: 'In-office',
    locationName: 'Chennai, India',
    stipend: '₹ 16,000 - 22,000 /month',
    duration: '3 Months',
    description: 'Setup CI/CD pipelines with GitHub Actions, containerize APIs using Docker, configure Kubernetes clusters on AWS...',
    skills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Python', 'Bash Scripting'],
    postedTime: '2 days ago',
    earlyApplicantTag: false,
    jobOfferPostInternship: true,
    employmentType: 'Full time',
    matchScore: 85,
    portalName: 'LinkedIn Jobs',
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=DevOps%20Internship',
  },
];

export const InternshipsFeed: React.FC<InternshipsFeedProps> = ({ user, analysis }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'All' | 'Work from home' | 'In-office' | 'Hybrid'>('All');
  const [stipendFilter, setStipendFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<InternshipListing | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredListings = SAMPLE_INTERNSHIPS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLoc = locationFilter === 'All' || item.locationType === locationFilter;
    const matchesStipend =
      stipendFilter === 'All' ||
      (stipendFilter === 'Paid' && item.stipend !== 'Unpaid') ||
      (stipendFilter === 'Unpaid' && item.stipend === 'Unpaid');

    return matchesSearch && matchesLoc && matchesStipend;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleQuickApply = (item: InternshipListing) => {
    setSelectedInternship(item);
    setShowApplyModal(true);
    setApplySuccess(false);
  };

  const confirmApplication = () => {
    if (selectedInternship) {
      setAppliedIds((prev) => [...prev, selectedInternship.id]);
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#D5CDBD] p-6 md:p-8 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#16405B] bg-[#EAE3D2] px-2.5 py-1 rounded-sm uppercase tracking-wider border border-[#D5CDBD]">
                Verified Opportunities Hub
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Live Internships Feed
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] mt-2">
              Internships & Early Career Opportunities
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore active hiring posts curated for <strong>{user.targetRole || 'Software Engineer'}</strong>. Apply directly using your uploaded ATS resume and verified skill scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg text-center">
              <p className="text-[10px] font-mono text-slate-500 uppercase">Target Role</p>
              <p className="text-sm font-bold text-[#16405B] mt-0.5">{user.targetRole || 'Software Engineer'}</p>
            </div>
            <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg text-center">
              <p className="text-[10px] font-mono text-slate-500 uppercase">Match Resume</p>
              <p className="text-sm font-mono font-bold text-emerald-700 mt-0.5">
                {analysis?.atsScore || 85}% Match Score
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-2 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, python, company, react..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#16405B]"
            />
          </div>

          {/* Location & Stipend Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-1">Type:</span>
              {(['All', 'Work from home', 'In-office', 'Hybrid'] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    locationFilter === loc
                      ? 'bg-[#16405B] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 px-1">Stipend:</span>
              {(['All', 'Paid', 'Unpaid'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStipendFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    stipendFilter === st
                      ? 'bg-[#16405B] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEED LIST OF INTERNSHIP CARDS (Replicating exact design from user screenshot) */}
      <div className="space-y-4">
        {filteredListings.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          const isBookmarked = bookmarkedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-xl shadow-xs transition-all space-y-4 relative"
            >
              {/* Top Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-600">{item.company}</span>
                    {item.activelyHiring && (
                      <span className="inline-flex items-center gap-1.5 border border-blue-300 text-blue-700 bg-blue-50/70 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                        Actively hiring
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Logo Badge on Top Right */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center font-extrabold text-[#16405B] text-xs shadow-2xs shrink-0 overflow-hidden">
                    {item.company.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Key Metadata Row with Icons (Home/Location, Stipend, Duration) */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700 font-medium pt-1">
                {/* Location */}
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>
                    {item.locationType}
                    {item.locationName ? ` • ${item.locationName}` : ''}
                  </span>
                </div>

                {/* Stipend */}
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-slate-500" />
                  <span>{item.stipend}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{item.duration}</span>
                </div>
              </div>

              {/* Description Bullet Line with Icon */}
              <div className="flex items-start gap-2.5 text-xs text-slate-700 pt-1">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              {/* Tech Skills Pills Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 font-medium">
                {item.skills.map((skill, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span className="text-slate-600">{skill}</span>
                    {sIdx < item.skills.length - 1 && <span className="text-slate-300">•</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Bottom Row: Posted Time + Highlights + Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span>↻</span>
                    <span>{item.postedTime}</span>
                  </span>

                  {item.earlyApplicantTag && (
                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Be an early applicant</span>
                    </span>
                  )}

                  {item.jobOfferPostInternship && (
                    <span className="bg-yellow-50 text-yellow-900 border border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-yellow-700" />
                      <span>Job offer post internship</span>
                    </span>
                  )}

                  <span className="text-slate-500 text-xs">• {item.employmentType}</span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Bookmark Job"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
                  </button>

                  <a
                    href={item.applyUrl || 'https://internshala.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (!isApplied) {
                        setAppliedIds((prev) => [...prev, item.id]);
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    title={`Open official listing on ${item.portalName || 'Portal'}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    <span>Official Site ({item.portalName || 'Portal'})</span>
                  </a>

                  {isApplied ? (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickApply(item)}
                      className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Apply Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredListings.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No Internships Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching postings for your search query or filters. Try selecting "All" locations or clearing search filters.
            </p>
          </div>
        )}
      </div>

      {/* QUICK APPLY MODAL */}
      {showApplyModal && selectedInternship && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {applySuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  Application Submitted & Redirecting!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your parsed ATS resume profile and verified skills scores have been recorded for <strong>{selectedInternship.company}</strong> recruiters.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded">
                    Direct External Job Application
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    Apply for {selectedInternship.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedInternship.company} • {selectedInternship.stipend} • Portal: <strong className="text-blue-700">{selectedInternship.portalName || 'Official Website'}</strong>
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-xl space-y-3 text-xs">
                  <p className="font-bold text-[#16405B] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C8622A]" />
                    <span>Your Verified Candidate Profile to be Submitted:</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Candidate Name</span>
                      <strong>{user.name || 'Sona Student'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Target Role</span>
                      <strong>{user.targetRole || 'Software Engineer'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">ATS Resume Match</span>
                      <strong className="text-emerald-700">{selectedInternship.matchScore}% Match Score</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">College</span>
                      <strong>{user.college || 'Sona College of Technology'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-blue-700" />
                    <span>Real Portal Redirection:</span>
                  </p>
                  <p className="text-[11px] text-blue-800 leading-normal">
                    Clicking <strong>"Go to Official Job Portal"</strong> will open the live posting on <strong className="underline">{selectedInternship.portalName || 'the official portal'}</strong> in a new tab so you can complete your application on their genuine platform.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedInternship.applyUrl) {
                        window.open(selectedInternship.applyUrl, '_blank', 'noopener,noreferrer');
                      }
                      confirmApplication();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#16405B] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-amber-300" />
                    <span>Go to Official Job Portal ({selectedInternship.portalName || 'Website'})</span>
                  </button>
                  <button
                    onClick={confirmApplication}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Submit with ATS Resume</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
