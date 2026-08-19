import React, { useState, useRef } from 'react';
import { ResumeRecord, ExtractedResumeData, AnalysisResult } from '../types';
import { ExtractedDataViewer } from './ExtractedDataViewer';
import {
  UploadCloud,
  FileText,
  Download,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileCode,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ResumeAnalyzerProps {
  resumes: ResumeRecord[];
  activeResume: ResumeRecord | null;
  onUpload: (file: File) => Promise<void>;
  onReplace: (id: string, file: File) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownload: (id: string) => void;
  onAnalyze: (resumeId?: string) => Promise<AnalysisResult>;
  isAnalyzing: boolean;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  resumes,
  activeResume,
  onUpload,
  onReplace,
  onActivate,
  onDelete,
  onDownload,
  onAnalyze,
  isAnalyzing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [latestExtracted, setLatestExtracted] = useState<ExtractedResumeData | null>(
    activeResume?.extractedData || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const allowed = ['.pdf', '.docx', '.txt', '.doc', '.rtf', '.odt', '.jpg', '.jpeg', '.png'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowed.includes(ext)) {
      setUploadError(`Invalid file format (${ext}). Supported: PDF, DOCX, TXT, DOC, RTF, ODT, JPG, PNG.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (replacingId) {
        await onReplace(replacingId, file);
        setReplacingId(null);
        setUploadSuccess(`Resume replaced successfully with "${file.name}"!`);
      } else {
        await onUpload(file);
        setUploadSuccess(`Resume "${file.name}" uploaded and parsed successfully! Marked as active.`);
      }
    } catch (err: any) {
      setUploadError(err.message || 'File processing failed');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(null), 6000);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = ''; // Reset input value so re-selecting file fires onChange
      await processFile(file);
    }
  };

  const triggerReplace = (id: string) => {
    setReplacingId(id);
    replaceInputRef.current?.click();
  };

  // Sync extracted data if active resume changes
  React.useEffect(() => {
    if (activeResume?.extractedData) {
      setLatestExtracted(activeResume.extractedData);
    }
  }, [activeResume]);

  const handleLoadSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const sampleText = `Alex Taylor
Senior Full Stack Engineer | Bengaluru, India
Email: alex.taylor@example.com | Phone: +91 98765 43210
GitHub: github.com/alextaylor | LinkedIn: linkedin.com/in/alextaylor

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 4+ years of experience building high-performance web applications using React, Node.js, TypeScript, and AWS. Proven track record of optimizing database queries, leading frontend architectures, and implementing automated CI/CD pipelines.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
- Frontend: React.js, Next.js, Redux, Tailwind CSS, Webpack
- Backend: Node.js, Express.js, REST APIs, GraphQL, PostgreSQL, MongoDB
- DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2), Jest, CI/CD

PROFESSIONAL EXPERIENCE
Senior Full Stack Developer | Tech Corp Solutions | 2022 - Present
- Architected and scaled microservices processing 2.5M+ monthly requests with 99.95% uptime using Node.js and AWS.
- Improved frontend load times by 42% by implementing code splitting and server-side rendering in React/Next.js.
- Reduced PostgreSQL query latency by 35% through index optimization and Redis caching layer implementation.

Software Engineer | Innovate AI Labs | 2020 - 2022
- Developed responsive React web dashboards utilized by 150k+ active daily users.
- Automated deployment workflows using GitHub Actions, cutting staging release cycles from 45 mins to 8 mins.

EDUCATION
B.Tech in Computer Science & Engineering | National Institute of Technology (2016 - 2020)
`;

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], 'Alex_Taylor_Software_Engineer_Resume.txt', { type: 'text/plain' });
    await processFile(sampleFile);
  };

  return (
    <div className="space-y-8">
      {/* Active Resume Status Card */}
      {activeResume && (
        <div className="bg-[#FAF8F3] border border-[#D5CDBD] rounded-xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-[#16405B] text-white rounded-lg flex items-center justify-center shrink-0 shadow-2xs">
              <FileCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  ✓ Active Resume Document
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Uploaded {new Date(activeResume.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#0F172A] break-all">
                {activeResume.originalName}
              </h3>
              <p className="text-xs text-slate-600">
                Format: <span className="font-mono font-bold uppercase">{activeResume.fileType}</span> • Size: <span className="font-mono">{(activeResume.size / 1024).toFixed(0)} KB</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onAnalyze(activeResume.id)}
              disabled={isAnalyzing}
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}</span>
            </button>
            <button
              type="button"
              onClick={() => onDownload(activeResume.id)}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Drag & Drop Upload Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
            Expanded Multi-Format Parser
          </span>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-2">Upload & Manage Resume Documents</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Upload your latest CV in PDF, DOCX, TXT, DOC, RTF, ODT or Scanned Image formats. The backend automatically extracts candidate demographics and technical competencies.
          </p>
        </div>

        {/* Upload Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#2563EB] bg-blue-50/50 scale-[1.005]'
              : 'border-slate-300 bg-[#FDFCF7] hover:border-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.doc,.rtf,.odt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.doc,.rtf,.odt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0F172A]">
            {uploading ? (
              <div className="w-6 h-6 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7 text-[#2563EB]" />
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-base">
            {uploading ? 'Parsing & Extracting Text...' : 'Drag and drop your resume file here'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Supports <span className="font-mono font-semibold text-slate-700">PDF, DOCX, TXT, DOC, RTF, ODT, JPG, PNG</span> up to 5MB.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Browse Computer</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={uploading}
              className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Sample Resume</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              Active Document Updated
            </span>
          </div>
        )}
      </div>

      {/* 2. Structured Extracted Data Viewer (Sanity Check Card) */}
      {latestExtracted && (
        <ExtractedDataViewer
          data={latestExtracted}
          filename={activeResume?.originalName}
          onRunAnalysis={() => onAnalyze(activeResume?.id)}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* 3. Resume Management Table / Collection */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Uploaded Resumes ({resumes.length})</h3>
            <p className="text-xs text-slate-500">
              Manage multiple stored resume versions. Mark one active as the reference for AI analyses.
            </p>
          </div>
          <button
            onClick={() => onAnalyze(activeResume?.id)}
            disabled={isAnalyzing || resumes.length === 0}
            className="hidden sm:flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-lg font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run AI Scoring</span>
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No resumes uploaded yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload your first resume file above to enable career intelligence scoring.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-3 px-3">Document Name</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Upload Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {resumes.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-xs">
                            {res.originalName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: #{res.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono uppercase text-[10px] text-slate-700 font-semibold">
                        {res.fileType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {(res.size / 1024).toFixed(0)} KB
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {new Date(res.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3">
                      {res.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-[10px] uppercase">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onActivate(res.id)}
                          className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono cursor-pointer"
                        >
                          Set Active
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onDownload(res.id)}
                          title="Download Original File"
                          className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => triggerReplace(res.id)}
                          title="Replace File"
                          className="p-1.5 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(res.id)}
                          title="Delete Resume"
                          className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
