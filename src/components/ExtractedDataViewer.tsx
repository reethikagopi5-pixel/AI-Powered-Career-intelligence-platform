import React, { useState } from 'react';
import { ExtractedResumeData, PersonalInformation, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry, AchievementEntry } from '../types';
import { api } from '../api';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  FileText,
  CheckCircle,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  Save,
  RefreshCw,
} from 'lucide-react';

interface ExtractedDataViewerProps {
  data: ExtractedResumeData;
  filename?: string;
  onRunAnalysis?: () => void;
  isAnalyzing?: boolean;
  onProfileSynced?: () => void;
  onConfirmData?: (updatedData: ExtractedResumeData) => void;
}

export const ExtractedDataViewer: React.FC<ExtractedDataViewerProps> = ({
  data,
  filename,
  onRunAnalysis,
  isAnalyzing = false,
  onProfileSynced,
  onConfirmData,
}) => {
  // Local editable state initialized from data
  const [formData, setFormData] = useState<ExtractedResumeData>({
    ...data,
    personalInformation: data.personalInformation || {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    skillsCategorized: data.skillsCategorized || {
      technical_skills: data.skills || [],
    },
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(data.isConfirmed || false);

  // Updates local field
  const handlePersonalInfoChange = (field: keyof PersonalInformation, value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: field === 'name' ? value : prev.name,
      email: field === 'email' ? value : prev.email,
      phone: field === 'phone' ? value : prev.phone,
      personalInformation: {
        ...(prev.personalInformation as PersonalInformation),
        [field]: value,
      },
    }));
  };

  const handleSummaryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, summary: val }));
  };

  // Skill management
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
        skillsCategorized: {
          ...prev.skillsCategorized,
          technical_skills: [...(prev.skillsCategorized?.technical_skills || []), trimmed],
        },
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
      skillsCategorized: {
        ...prev.skillsCategorized,
        technical_skills: (prev.skillsCategorized?.technical_skills || []).filter((s) => s !== skillToRemove),
      },
    }));
  };

  // Save changes & Sync profile
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        name: formData.name || undefined,
        phone: formData.phone || undefined,
        targetRole: formData.targetRole || 'Software Engineer',
        college: formData.education?.[0]?.institution || undefined,
        education: formData.education?.[0]?.degree || undefined,
        experienceYears: formData.experienceYears || formData.experience?.length || 1,
        skills: formData.skills || [],
        certifications: formData.certifications || [],
        projects: formData.projects?.map((p) => (typeof p === 'string' ? p : p.name)) || [],
      });

      setSavedSuccess(true);
      setConfirmed(true);
      if (onConfirmData) {
        onConfirmData({ ...formData, isConfirmed: true });
      }
      if (onProfileSynced) onProfileSynced();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to save resume profile changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const personal = formData.personalInformation || {
    name: formData.name || '',
    email: formData.email || '',
    phone: formData.phone || '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-8">
      {/* Parsing Success & Detection Summary Banner */}
      <div className="bg-[#FAF8F3] border border-[#D5CDBD] rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resume Successfully Parsed</span>
            </span>
            {filename && (
              <span className="font-mono text-[10px] text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded">
                File: {filename}
              </span>
            )}
            {confirmed && (
              <span className="font-mono text-[10px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded">
                ✓ Confirmed Profile
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-[#0F172A] tracking-tight">Review & Confirm Your Resume Data</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            CareerAI extracted the following information from your resume. Please review, edit, or correct any section before continuing.
          </p>
        </div>

        {/* Section Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center shadow-2xs">
            <span className="block text-xs font-black text-[#0F172A]">{formData.skills?.length || 0}</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Skills</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center shadow-2xs">
            <span className="block text-xs font-black text-[#0F172A]">{formData.education?.length || 0}</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Education</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center shadow-2xs">
            <span className="block text-xs font-black text-[#0F172A]">{formData.experience?.length || 0}</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Experience</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-center shadow-2xs">
            <span className="block text-xs font-black text-[#0F172A]">{formData.projects?.length || 0}</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Projects</span>
          </div>
        </div>
      </div>

      {/* 1. PERSONAL INFORMATION CARD */}
      <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
            <User className="w-4 h-4 text-[#2563EB]" />
            <span>Personal Information</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
            className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingPersonal ? 'Done Editing' : 'Edit Contact Details'}</span>
          </button>
        </div>

        {isEditingPersonal ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">Full Name</label>
              <input
                type="text"
                value={personal.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">Email Address</label>
              <input
                type="email"
                value={personal.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">Phone Number</label>
              <input
                type="text"
                value={personal.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                value={personal.location || ''}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">LinkedIn URL</label>
              <input
                type="text"
                placeholder="linkedin.com/in/username"
                value={personal.linkedin || ''}
                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-mono text-[10px] uppercase mb-1 font-bold">GitHub URL</label>
              <input
                type="text"
                placeholder="github.com/username"
                value={personal.github || ''}
                onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Candidate Name</span>
              <span className="font-bold text-slate-900 text-sm">{personal.name || 'Not detected'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Email Address</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-800 font-medium truncate">{personal.email || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Phone Number</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-800 font-medium">{personal.phone || 'Not provided'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Location / Profiles</span>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {personal.location && <span className="font-medium text-slate-800 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personal.location}</span>}
                {personal.linkedin && <a href={`https://${personal.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><Linkedin className="w-3 h-3" />LinkedIn</a>}
                {personal.github && <a href={`https://${personal.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline flex items-center gap-1"><Github className="w-3 h-3" />GitHub</a>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. PROFESSIONAL SUMMARY CARD */}
      <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>Professional Summary / Objective</span>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingSummary(!isEditingSummary)}
            className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingSummary ? 'Done Editing' : 'Edit Summary'}</span>
          </button>
        </div>

        {isEditingSummary ? (
          <textarea
            rows={3}
            value={formData.summary || ''}
            onChange={(e) => handleSummaryChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded p-3 text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500"
          />
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-lg border border-slate-200">
            "{formData.summary || 'No explicit summary detected in raw resume file.'}"
          </p>
        )}
      </div>

      {/* 3. CATEGORIZED SKILLS CARD */}
      <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
            <Code className="w-4 h-4 text-[#2563EB]" />
            <span>Extracted Skills & Competencies ({formData.skills?.length || 0})</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="+ Add a missing skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-[#16405B] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#103046] transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {formData.skills && formData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 border border-slate-300 rounded-md text-xs font-mono font-semibold shadow-2xs group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skills added yet.</p>
        )}
      </div>

      {/* 4. EDUCATION & EXPERIENCE DUAL COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education List */}
        <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
              <GraduationCap className="w-4 h-4 text-[#2563EB]" />
              <span>Education Records ({formData.education?.length || 0})</span>
            </div>
          </div>

          {formData.education && formData.education.length > 0 ? (
            <div className="space-y-3">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900">{edu.degree || 'Degree'}</span>
                    <span className="font-mono text-[10px] text-slate-500">{edu.graduationYear || edu.year || 'Graduated'}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{edu.institution}</p>
                  {edu.cgpa && <span className="inline-block text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">CGPA/GPA: {edu.cgpa}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No education entries parsed.</p>
          )}
        </div>

        {/* Work Experience List */}
        <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm">
              <Briefcase className="w-4 h-4 text-[#2563EB]" />
              <span>Work Experience ({formData.experience?.length || 0})</span>
            </div>
          </div>

          {formData.experience && formData.experience.length > 0 ? (
            <div className="space-y-3">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    <span className="font-mono text-[10px] text-slate-500">{exp.duration || 'Recent'}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{exp.company}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pt-1">
                      {exp.highlights.slice(0, 3).map((h, hIdx) => (
                        <li key={hIdx} className="truncate">{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No work experience parsed.</p>
          )}
        </div>
      </div>

      {/* 5. PROJECTS & CERTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm pb-2 border-b border-slate-200">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <span>Extracted Projects ({formData.projects?.length || 0})</span>
          </div>

          {formData.projects && formData.projects.length > 0 ? (
            <div className="space-y-2.5">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                  <p className="font-bold text-slate-900">
                    {typeof proj === 'string' ? proj : proj.name}
                  </p>
                  {typeof proj !== 'string' && proj.description && (
                    <p className="text-slate-600 mt-0.5 text-[11px]">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No projects parsed.</p>
          )}
        </div>

        {/* Certifications */}
        <div className="bg-[#FDFCF7] border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#0F172A] font-bold text-sm pb-2 border-b border-slate-200">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <span>Certifications & Achievements</span>
          </div>

          {formData.certifications && formData.certifications.length > 0 ? (
            <div className="space-y-2">
              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No certifications parsed.</p>
          )}
        </div>
      </div>

      {/* CONFIRMATION & ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          Confirming saves these details to your CareerAI profile to power all career intelligence engines.
        </p>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              savedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Resume Data Confirmed & Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Confirm Resume Data</span>
              </>
            )}
          </button>

          {onRunAnalysis && (
            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-lg font-extrabold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running Deep ATS Analysis...</span>
                </>
              ) : (
                <>
                  <span>Continue to Deep ATS Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
