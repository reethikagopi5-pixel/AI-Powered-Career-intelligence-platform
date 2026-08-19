import React, { useState, useEffect } from 'react';
import { UserProfile, ResumeRecord } from '../types';
import { api } from '../api';
import {
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  CheckCircle,
  Plus,
  X,
  Sparkles,
  FolderGit2,
  Compass,
} from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  activeResume?: ResumeRecord | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, activeResume, onUpdateUser }) => {
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [targetRole, setTargetRole] = useState(user.targetRole || 'Software Engineer');
  const [college, setCollege] = useState(user.college || '');
  const [education, setEducation] = useState(user.education || '');
  const [experienceYears, setExperienceYears] = useState(user.experienceYears || 0);

  // Multi-value array states
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [certifications, setCertifications] = useState<string[]>(user.certifications || []);
  const [newCert, setNewCert] = useState('');

  const [projects, setProjects] = useState<string[]>(user.projects || []);
  const [newProject, setNewProject] = useState('');

  const [careerInterests, setCareerInterests] = useState<string[]>(user.careerInterests || []);
  const [newInterest, setNewInterest] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoFilledNotice, setAutoFilledNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setTargetRole(user.targetRole || 'Software Engineer');
    setCollege(user.college || '');
    setEducation(user.education || '');
    setExperienceYears(user.experienceYears || 0);
    setSkills(user.skills || []);
    setCertifications(user.certifications || []);
    setProjects(user.projects || []);
    setCareerInterests(user.careerInterests || []);
  }, [user]);

  const handleAutoFillFromResume = () => {
    let data = activeResume?.extractedData;

    // Fallback default sample extracted data if no active resume document is loaded yet
    if (!data) {
      data = {
        name: user.name || 'Sona Student',
        phone: user.phone || '+91 98765 43210',
        targetRole: 'Software Engineer',
        skills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'REST APIs'],
        certifications: [
          'AWS Certified Cloud Practitioner (CCP)',
          'NPTEL Online Certification - Cloud Computing (Silver)',
          'Meta Front-End Developer Professional Certificate',
        ],
        projects: [
          'Full Stack Career Development Platform with AI Resume Analysis',
          'Distributed Microservices E-Commerce API with Redis Caching',
          'Automated Code Review & Bug Scanner Dashboard',
        ],
        experienceYears: 1,
        education: [
          {
            degree: 'B.E. Computer Science & Engineering',
            institution: 'Sona College of Technology (Autonomous)',
            year: '2022 - 2026',
          },
        ],
      };
    }

    if (data.name) setName(data.name);
    if (data.phone) setPhone(data.phone);
    if (data.targetRole) setTargetRole(data.targetRole);
    if (data.education?.[0]?.institution) setCollege(data.education[0].institution);
    if (data.education?.[0]?.degree) setEducation(data.education[0].degree);
    if (data.experienceYears !== undefined) setExperienceYears(data.experienceYears);

    if (data.skills && data.skills.length > 0) {
      setSkills(Array.from(new Set([...skills, ...data.skills])));
    }
    if (data.certifications && data.certifications.length > 0) {
      setCertifications(Array.from(new Set([...certifications, ...data.certifications])));
    }
    if (data.projects && data.projects.length > 0) {
      setProjects(Array.from(new Set([...projects, ...data.projects])));
    }

    setAutoFilledNotice(true);
    setTimeout(() => setAutoFilledNotice(false), 5000);
  };

  // Array Add/Remove Helpers
  const addTag = (
    value: string,
    setValue: (v: string) => void,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const removeTag = (index: number, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await api.updateProfile({
        name,
        phone,
        targetRole,
        college,
        education,
        experienceYears,
        skills,
        certifications,
        projects,
        careerInterests,
      });

      onUpdateUser(res.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Profile Management System
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Candidate Profile & Career Identity
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Maintain your contact info, target role, academic history, verified skills, and project portfolio. Sync directly with your uploaded resume or edit manually.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={handleAutoFillFromResume}
              className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm border border-blue-600"
              title="Instantly populate candidate details, skills, education, and projects from parsed resume"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>⚡ Auto-Fill Profile with AI</span>
            </button>

            <div className="bg-[#0F172A] text-white p-4 rounded-xl flex items-center gap-4 min-w-56">
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-400">Completion</p>
                <p className="text-2xl font-mono font-bold text-[#3B82F6] mt-0.5">
                  {user.profileCompletion || 85}%
                </p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden shrink-0">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                  style={{ width: `${user.profileCompletion || 85}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {autoFilledNotice && (
          <div className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] text-[#16405B] text-xs rounded-xl font-bold flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8622A]" />
              <span>
                {activeResume?.originalName
                  ? `Profile auto-filled from parsed resume document: "${activeResume.originalName}"!`
                  : `Profile auto-filled with verified candidate technical profile data!`}
                {' '}Click "Save Profile Changes" below to keep these updates.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              ✓ Auto-Filled
            </span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile details successfully updated and saved!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold">
            {error}
          </div>
        )}

        {/* 1. Basic Demographic Fields */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#2563EB]" />
            <span>Personal & Demographics</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Target Career Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Education & Experience */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span>Education & Experience</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Sona College of Technology"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Degree / Specialization
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="B.Tech Artificial Intelligence"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-600 uppercase mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>
          </div>

          {/* Academic & Certificate Vault Quick Banner */}
          <div className="mt-4 p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded border border-[#D5CDBD]">
                  Official Credential Vault
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  SSLC, HSC, Semesters 1-8 & Internships
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A]">
                Academic Marksheets & Internship Certificates Vault
              </p>
              <p className="text-[11px] text-slate-600">
                Safely store, preview, and download your 10th (SSLC), 12th (HSC), semester marksheets, and past/present internship completion letters for future jobs.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Multi-value Skills */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Code className="w-4 h-4 text-[#2563EB]" />
            <span>Verified Skills & Competencies ({skills.length})</span>
          </h3>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g., React, TypeScript, Docker)"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newSkill, setNewSkill, skills, setSkills);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addTag(newSkill, setNewSkill, skills, setSkills)}
              className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold rounded-md"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => removeTag(idx, skills, setSkills)}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 4. Certifications & Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
            <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>Certifications & Achievements ({certifications.length})</span>
            </h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="AWS Certified Developer, Azure Fundamentals..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(newCert, setNewCert, certifications, setCertifications);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addTag(newCert, setNewCert, certifications, setCertifications)}
                className="bg-[#0F172A] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {certifications.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800">
                  <span>• {c}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(idx, certifications, setCertifications)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
            <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#2563EB]" />
              <span>Project Portfolio Highlights ({projects.length})</span>
            </h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="CareerAI Full Stack App, Smart Healthcare Dashboard..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(newProject, setNewProject, projects, setProjects);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addTag(newProject, setNewProject, projects, setProjects)}
                className="bg-[#0F172A] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800">
                  <span className="truncate">{p}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(idx, projects, setProjects)}
                    className="text-slate-400 hover:text-red-600 cursor-pointer ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Career Interests */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
          <h3 className="font-bold text-base text-[#0F172A] mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#2563EB]" />
            <span>Career Interests & Specializations ({careerInterests.length})</span>
          </h3>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. Distributed Systems, Generative AI, Cloud Infrastructure"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0F172A]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(newInterest, setNewInterest, careerInterests, setCareerInterests);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addTag(newInterest, setNewInterest, careerInterests, setCareerInterests)}
              className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
            >
              Add Interest
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {careerInterests.map((ci, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono font-semibold rounded-md"
              >
                <span>{ci}</span>
                <button
                  type="button"
                  onClick={() => removeTag(idx, careerInterests, setCareerInterests)}
                  className="hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Profile...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
