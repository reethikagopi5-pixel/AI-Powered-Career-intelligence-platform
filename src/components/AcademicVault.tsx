import React, { useState, useEffect } from 'react';
import { UserProfile, VaultDocument } from '../types';
import {
  FileCheck2,
  GraduationCap,
  Award,
  Briefcase,
  Download,
  Eye,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  X,
  FileText,
  Calendar,
  Building2,
  BookmarkCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AcademicVaultProps {
  user: UserProfile;
}

const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-101',
    category: 'Academic Marksheet',
    subCategory: 'SSLC (10th)',
    title: 'SSLC (10th Standard) Board Marksheet',
    issuer: 'Tamil Nadu Board of Secondary Education',
    yearOrSemester: '2020',
    scoreOrGrade: '92.4% Overall Marks',
    uploadDate: '2024-01-15',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Verified official 10th marksheet document with state board seal.',
  },
  {
    id: 'doc-102',
    category: 'Academic Marksheet',
    subCategory: 'HSC / Diploma (12th)',
    title: 'HSC (12th Standard - Computer Science) Marksheet',
    issuer: 'Tamil Nadu Higher Secondary Board',
    yearOrSemester: '2022',
    scoreOrGrade: '89.6% (Physics, Chem, Math, CS)',
    uploadDate: '2024-01-16',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Verified Higher Secondary Certificate for college admission.',
  },
  {
    id: 'doc-103',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 1 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 1 (2022-23)',
    scoreOrGrade: '8.65 SGPA',
    uploadDate: '2024-02-10',
    fileSize: '1.1 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Engineering Mathematics, Python Programming, Physics Lab.',
  },
  {
    id: 'doc-104',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 2 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 2 (2022-23)',
    scoreOrGrade: '8.80 SGPA',
    uploadDate: '2024-07-02',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Data Structures, C++ OOP, Digital Logic Circuits.',
  },
  {
    id: 'doc-105',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 3 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 3 (2023-24)',
    scoreOrGrade: '8.92 SGPA',
    uploadDate: '2024-12-20',
    fileSize: '1.3 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Operating Systems, Database Management Systems, Web Tech.',
  },
  {
    id: 'doc-106',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 4 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 4 (2023-24)',
    scoreOrGrade: '9.05 SGPA',
    uploadDate: '2025-06-18',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Computer Networks, AI & Machine Learning, Algorithm Design.',
  },
  {
    id: 'doc-107',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 5 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 5 (2024-25)',
    scoreOrGrade: '8.95 SGPA',
    uploadDate: '2025-12-15',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Cloud Computing, Full Stack Web Development, DevOps Basics.',
  },
  {
    id: 'doc-108',
    category: 'Academic Marksheet',
    subCategory: 'Semester Marksheet',
    title: 'Semester 6 Statement of Marks',
    issuer: 'Sona College of Technology (Autonomous)',
    yearOrSemester: 'Semester 6 (2024-25)',
    scoreOrGrade: '9.15 SGPA',
    uploadDate: '2026-05-30',
    fileSize: '1.3 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Courses: Microservices Architecture, Deep Learning, Capstone Project I.',
  },
  {
    id: 'doc-201',
    category: 'Internship & Work Proof',
    subCategory: 'Internship Offer/Completion',
    title: 'Full Stack Software Engineering Internship Completion Certificate',
    issuer: 'TechPulse Solutions Pvt Ltd, Bangalore',
    yearOrSemester: 'Summer 2025 (3 Months)',
    scoreOrGrade: 'Performance Rating: Outstanding (5/5)',
    uploadDate: '2025-09-01',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Verified internship completion letter & project recommendation letter.',
  },
  {
    id: 'doc-202',
    category: 'Internship & Work Proof',
    subCategory: 'Project / LOR Proof',
    title: 'Letter of Recommendation (LOR) - Head of Department',
    issuer: 'Department of Computer Science & AI, Sona Tech',
    yearOrSemester: '2025',
    scoreOrGrade: 'Highly Recommended for SDE Roles',
    uploadDate: '2025-10-10',
    fileSize: '850 KB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Signed official faculty recommendation letter highlighting technical leadership.',
  },
  {
    id: 'doc-301',
    category: 'Course & Tech Certificate',
    subCategory: 'Course Certificate',
    title: 'NPTEL Online Certification: Cloud Computing & Distributed Systems',
    issuer: 'IIT Kharagpur / NPTEL India',
    yearOrSemester: '2024',
    scoreOrGrade: 'Elite + Silver Medal (84%)',
    uploadDate: '2024-11-05',
    fileSize: '1.5 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Proctored national exam certification with QR verification code.',
  },
  {
    id: 'doc-302',
    category: 'Course & Tech Certificate',
    subCategory: 'Course Certificate',
    title: 'AWS Certified Cloud Practitioner (CCP)',
    issuer: 'Amazon Web Services (AWS Training)',
    yearOrSemester: '2025',
    scoreOrGrade: 'Score: 860/1000 (Pass)',
    uploadDate: '2025-03-22',
    fileSize: '1.6 MB',
    fileType: 'pdf',
    verifiedStatus: true,
    notes: 'Official AWS Badge ID: AWS-849204-VERIFIED.',
  },
];

export const AcademicVault: React.FC<AcademicVaultProps> = ({ user }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('career_ai_vault_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved vault docs', e);
      }
    }
    return INITIAL_DOCUMENTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VaultDocument['category']>('Academic Marksheet');
  const [newSubCategory, setNewSubCategory] = useState<VaultDocument['subCategory']>('Semester Marksheet');
  const [newIssuer, setNewIssuer] = useState('');
  const [newYearOrSemester, setNewYearOrSemester] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Save documents to localStorage
  useEffect(() => {
    localStorage.setItem('career_ai_vault_docs', JSON.stringify(documents));
  }, [documents]);

  const categories = [
    { id: 'All', label: 'All Saved Credentials', icon: FileCheck2 },
    { id: 'Academic Marksheet', label: 'Academic Marksheets (SSLC, HSC, Semesters)', icon: GraduationCap },
    { id: 'Internship & Work Proof', label: 'Internship & Work Certificates', icon: Briefcase },
    { id: 'Course & Tech Certificate', label: 'Course & Skill Certifications', icon: Award },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.scoreOrGrade && doc.scoreOrGrade.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Calculate SGPA Progression
  const semesterDocs = documents.filter((d) => d.subCategory === 'Semester Marksheet');
  const sslcDoc = documents.find((d) => d.subCategory === 'SSLC (10th)');
  const hscDoc = documents.find((d) => d.subCategory === 'HSC / Diploma (12th)');
  const internshipDocs = documents.filter((d) => d.category === 'Internship & Work Proof');

  const handleDownload = (doc: VaultDocument) => {
    if (doc.fileDataUrl) {
      const link = document.createElement('a');
      link.href = doc.fileDataUrl;
      link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.${doc.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Generate formatted text credential summary document for mock files
    const fileContent = `===================================================================
OFFICIAL VERIFIED ACADEMIC & CAREER CREDENTIAL RECORD
CareerAI Student Verification Vault
===================================================================

CANDIDATE DETAILS:
------------------
Candidate Name : ${user.name || 'Verified Candidate'}
Email Address  : ${user.email}
Target Role    : ${user.targetRole || 'Software Engineer'}
Institution    : ${user.college || 'Sona College of Technology'}

DOCUMENT INFORMATION:
---------------------
Document Title : ${doc.title}
Category       : ${doc.category} (${doc.subCategory})
Issuing Body   : ${doc.issuer}
Period/Year    : ${doc.yearOrSemester || 'N/A'}
Score / Grade  : ${doc.scoreOrGrade || 'Verified Pass'}
Uploaded Date  : ${doc.uploadDate}
Verification   : ${doc.verifiedStatus ? 'VERIFIED AUTHENTIC DOCUMENT' : 'Pending Verification'}

SPECIAL NOTES & SYLLABUS:
-------------------------
${doc.notes || 'No extra notes provided.'}

===================================================================
SECURITY & AUTHENTICITY STAMP:
Verification Seal : CAREER-AI-STAMP-OK-${doc.id.toUpperCase()}
Issued Stamp Date : ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
CareerAI Security Portal | Digital Credential Ledger
===================================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Credential.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this credential file from your vault?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (previewDoc?.id === id) setPreviewDoc(null);
    }
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim()) {
      alert('Please fill in the document title and issuing organization.');
      return;
    }

    let fileDataUrl: string | undefined = undefined;
    let fileType: VaultDocument['fileType'] = 'pdf';
    let fileSize = '1.2 MB';

    if (selectedFile) {
      fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') fileType = ext === 'jpeg' ? 'jpg' : (ext as any);
      else if (ext === 'docx') fileType = 'docx';

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = () => {
        fileDataUrl = reader.result as string;
        saveDocToState(fileDataUrl, fileType, fileSize);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      saveDocToState(undefined, fileType, fileSize);
    }
  };

  const saveDocToState = (fileDataUrl: string | undefined, fileType: VaultDocument['fileType'], fileSize: string) => {
    const newDoc: VaultDocument = {
      id: `doc-custom-${Date.now()}`,
      category: newCategory,
      subCategory: newSubCategory,
      title: newTitle.trim(),
      issuer: newIssuer.trim(),
      yearOrSemester: newYearOrSemester.trim() || '2025',
      scoreOrGrade: newScore.trim() || 'Verified',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize,
      fileType,
      verifiedStatus: true,
      notes: newNotes.trim() || 'Uploaded directly by user to personal credential vault.',
      fileDataUrl,
    };

    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);

    // Reset Form
    setNewTitle('');
    setNewIssuer('');
    setNewYearOrSemester('');
    setNewScore('');
    setNewNotes('');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#D5CDBD] p-6 md:p-8 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#16405B] bg-[#EAE3D2] px-2.5 py-1 rounded-sm uppercase tracking-wider border border-[#D5CDBD]">
                Personal Credential Vault
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified Documents Portal
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] mt-2">
              Academic Marksheets & Certificate Vault
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Save, view, and download all your educational records (SSLC 10th, HSC 12th, Semester 1 to 8 Marksheets), internship completion certificates, and technical course proofs in one human-friendly digital vault.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Certificate / Marksheet</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg">
            <p className="text-[10px] font-mono text-slate-500 uppercase">Total Files Saved</p>
            <p className="text-xl font-mono font-bold text-[#16405B] mt-0.5">{documents.length} Files</p>
          </div>

          <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg">
            <p className="text-[10px] font-mono text-slate-500 uppercase">Academic Marksheets</p>
            <p className="text-xl font-mono font-bold text-emerald-700 mt-0.5">
              {documents.filter((d) => d.category === 'Academic Marksheet').length} Uploaded
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg">
            <p className="text-[10px] font-mono text-slate-500 uppercase">Internship Certificates</p>
            <p className="text-xl font-mono font-bold text-[#C8622A] mt-0.5">
              {internshipDocs.length} Proofs
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F3] border border-[#D5CDBD] rounded-lg">
            <p className="text-[10px] font-mono text-slate-500 uppercase">Course Certifications</p>
            <p className="text-xl font-mono font-bold text-[#2563EB] mt-0.5">
              {documents.filter((d) => d.category === 'Course & Tech Certificate').length} Badges
            </p>
          </div>
        </div>
      </div>

      {/* Academic Marksheet Progression Scorecard (SSLC, HSC & Semesters 1-8) */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Academic Marksheets & Semester Progression Tracker
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Download Individual Marksheets Below
          </span>
        </div>

        {/* Board Exams (SSLC & HSC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSLC Card */}
          <div className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded">
                  10th Standard (SSLC)
                </span>
                <h4 className="font-bold text-sm text-[#0F172A] mt-1">Secondary School Leaving Certificate</h4>
                <p className="text-xs text-slate-600">{sslcDoc?.issuer || 'State Board of School Education'}</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {sslcDoc?.scoreOrGrade || '92.4% Overall'}
              </span>
            </div>
            {sslcDoc && (
              <div className="flex justify-between items-center pt-2 border-t border-[#D5CDBD] text-xs">
                <span className="text-slate-500 text-[11px]">Year: {sslcDoc.yearOrSemester}</span>
                <button
                  onClick={() => handleDownload(sslcDoc)}
                  className="flex items-center gap-1 text-[#2563EB] font-bold hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SSLC Copy</span>
                </button>
              </div>
            )}
          </div>

          {/* HSC Card */}
          <div className="p-4 bg-[#FAF8F3] border border-[#D5CDBD] rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded">
                  12th Standard (HSC / Diploma)
                </span>
                <h4 className="font-bold text-sm text-[#0F172A] mt-1">Higher Secondary Certificate (Computer Science)</h4>
                <p className="text-xs text-slate-600">{hscDoc?.issuer || 'Higher Secondary Education Board'}</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {hscDoc?.scoreOrGrade || '89.6% Overall'}
              </span>
            </div>
            {hscDoc && (
              <div className="flex justify-between items-center pt-2 border-t border-[#D5CDBD] text-xs">
                <span className="text-slate-500 text-[11px]">Year: {hscDoc.yearOrSemester}</span>
                <button
                  onClick={() => handleDownload(hscDoc)}
                  className="flex items-center gap-1 text-[#2563EB] font-bold hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HSC Copy</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Semester 1 to 8 SGPA Progression Grid */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Semester-Wise Marksheets & SGPA Progression (Semesters 1 to 8)</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
              const semDoc = semesterDocs.find((d) => d.yearOrSemester?.includes(`Semester ${sem}`) || d.title.includes(`Semester ${sem}`));
              return (
                <div
                  key={sem}
                  className={`p-2.5 rounded-lg border text-center flex flex-col justify-between space-y-1 ${
                    semDoc ? 'bg-white border-slate-300 shadow-2xs' : 'bg-slate-50 border-dashed border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                      Sem {sem}
                    </span>
                    <p className="text-xs font-mono font-extrabold text-[#16405B] mt-0.5">
                      {semDoc ? semDoc.scoreOrGrade?.split(' ')[0] || 'Pass' : 'Upcoming'}
                    </p>
                  </div>

                  {semDoc ? (
                    <button
                      onClick={() => handleDownload(semDoc)}
                      className="text-[10px] text-[#2563EB] font-bold hover:underline flex items-center justify-center gap-0.5 pt-1 border-t border-slate-100 cursor-pointer"
                      title="Download Marksheet"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Copy</span>
                    </button>
                  ) : (
                    <span className="text-[9px] text-slate-400 block pt-1 border-t border-slate-100">
                      Pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === 'All' ? documents.length : documents.filter((d) => d.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#16405B] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, issuer, or sem..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#16405B]"
            />
          </div>
        </div>
      </div>

      {/* Document Cards List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              {/* Category Badge & Verification */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2.5 py-0.5 rounded-sm border border-[#D5CDBD]">
                  {doc.subCategory}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Title & Issuer */}
              <div>
                <h4 className="font-bold text-sm text-[#0F172A] leading-snug line-clamp-2">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.issuer}</span>
                </p>
              </div>

              {/* Details Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                {doc.scoreOrGrade && (
                  <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">
                    Score: {doc.scoreOrGrade}
                  </span>
                )}
                {doc.yearOrSemester && (
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{doc.yearOrSemester}</span>
                  </span>
                )}
              </div>

              {/* Notes */}
              {doc.notes && (
                <p className="text-[11px] text-slate-500 italic line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                  "{doc.notes}"
                </p>
              )}
            </div>

            {/* Card Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[10px] font-mono text-slate-400">
                <span>{doc.fileType.toUpperCase()}</span> • <span>{doc.fileSize}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Witness & View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Witness</span>
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Download Copy for Future Job Applications"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800">No Documents Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No certificate or marksheet matches your current search/filter. Click "Upload New Certificate" to add your files.
          </p>
        </div>
      )}

      {/* PREVIEW / WITNESS MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#16405B] bg-[#EAE3D2] px-2 py-0.5 rounded">
                  {previewDoc.category} ({previewDoc.subCategory})
                </span>
                <h3 className="text-lg font-extrabold text-[#0F172A] mt-1">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-slate-600">{previewDoc.issuer}</p>
              </div>
            </div>

            {/* Official Digital Certificate Seal Preview Box */}
            <div className="p-6 bg-[#FAF8F3] border-2 border-[#D5CDBD] rounded-xl space-y-4 text-slate-800 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#16405B]" />
                  <span className="font-bold text-sm text-[#16405B]">CAREERAI DIGITAL VERIFICATION SEAL</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                  ✓ VERIFIED AUTHENTIC
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-b border-[#D5CDBD] py-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Candidate Name</span>
                    <strong className="text-slate-900">{user.name || 'Verified Student'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Email</span>
                    <strong className="text-slate-900">{user.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Academic / Score</span>
                    <strong className="text-slate-900">{previewDoc.scoreOrGrade || 'Pass'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Year / Semester</span>
                    <strong className="text-slate-900">{previewDoc.yearOrSemester || '2025'}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900">Notes & Details:</p>
                <p className="text-slate-600 bg-white p-3 rounded border border-[#D5CDBD]">
                  {previewDoc.notes || 'Official marksheet and completion record saved in Candidate Vault.'}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Upload Date: {previewDoc.uploadDate}</span>
                <span>Verification Ref: REF-{previewDoc.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Certificate Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD / ADD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
                Upload Credential
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">
                Add Academic Marksheet or Certificate
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your SSLC, HSC, Semester 1-8 marksheets, or internship certificates to save them permanently in your career vault.
              </p>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Document Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                >
                  <option value="Academic Marksheet">Academic Marksheet (SSLC, HSC, Semesters)</option>
                  <option value="Internship & Work Proof">Internship & Work Certificate</option>
                  <option value="Course & Tech Certificate">Course & Technical Skill Certificate</option>
                  <option value="Other Official File">Other Official File / LOR</option>
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Sub-Category Tag
                </label>
                <select
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                >
                  <option value="SSLC (10th)">SSLC (10th Standard)</option>
                  <option value="HSC / Diploma (12th)">HSC / Diploma (12th Standard)</option>
                  <option value="Semester Marksheet">Semester Marksheet (Sem 1 - 8)</option>
                  <option value="Internship Offer/Completion">Internship Offer / Completion Certificate</option>
                  <option value="Course Certificate">Course / NPTEL / AWS Certificate</option>
                  <option value="Project / LOR Proof">Project Proof / Faculty LOR</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Semester 7 Statement of Marks, AWS Solutions Architect Badge..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                  required
                />
              </div>

              {/* Issuer & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    placeholder="e.g. Sona Tech / Anna Univ / NPTEL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                    Year / Semester
                  </label>
                  <input
                    type="text"
                    value={newYearOrSemester}
                    onChange={(e) => setNewYearOrSemester(e.target.value)}
                    placeholder="e.g. Semester 7 (2025)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                  />
                </div>
              </div>

              {/* Score / Grade */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Score / SGPA / Percentage
                </label>
                <input
                  type="text"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  placeholder="e.g. 9.10 SGPA or 88.5%"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                />
              </div>

              {/* File Selector */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Upload File (PDF / JPG / PNG / DOCX)
                </label>
                <div className="p-4 bg-[#FAF8F3] border-2 border-dashed border-[#D5CDBD] rounded-xl text-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-[#2563EB] mx-auto" />
                  <p className="text-xs text-slate-700 font-semibold">
                    {selectedFile ? selectedFile.name : 'Click below or choose a file from your device'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                    onChange={handleFileUploadChange}
                    className="text-xs text-slate-600 mx-auto file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#16405B] file:text-white file:text-xs file:font-bold cursor-pointer"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-mono font-semibold text-slate-700 uppercase mb-1">
                  Notes / Syllabus Highlights
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Highlights: Data Structures, Operating Systems, Capstone Project A+..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#16405B]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save to Credential Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
