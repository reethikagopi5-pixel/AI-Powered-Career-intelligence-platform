import React, { useState } from 'react';
import { UserProfile, AnalysisResult, ResumeRewriteResult } from '../types';
import { api } from '../api';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Award,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface ResumeImproverProps {
  user: UserProfile;
  analysis: AnalysisResult | null;
}

export const ResumeImprover: React.FC<ResumeImproverProps> = ({ user, analysis }) => {
  const [originalSummary, setOriginalSummary] = useState(
    analysis?.summary || 'Motivated software engineering candidate eager to contribute.'
  );
  const [loading, setLoading] = useState(false);
  const [rewriteData, setRewriteData] = useState<ResumeRewriteResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleGenerateRewrite = async () => {
    setLoading(true);
    try {
      const res = await api.improveResume(originalSummary, user.targetRole);
      setRewriteData(res.rewrite);
    } catch (err: any) {
      alert(err.message || 'Failed to generate resume improvements');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              AI Resume Rewriter & STAR Bullet Optimizer
            </h3>
            <span className="bg-[#16405B] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              Executive Grade
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Transform weak resume bullet points into high-impact STAR achievement statements for <strong className="text-[#16405B]">{user.targetRole || 'Software Engineer'}</strong>.
          </p>
        </div>

        <button
          onClick={handleGenerateRewrite}
          disabled={loading}
          className="bg-[#C8622A] hover:bg-[#B3531F] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? 'Optimizing with Gemini AI...' : 'Generate Improvements'}</span>
        </button>
      </div>

      {/* Input Summary Box */}
      <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
          Current Resume Summary / Intro:
        </label>
        <textarea
          rows={3}
          value={originalSummary}
          onChange={(e) => setOriginalSummary(e.target.value)}
          placeholder="Paste your existing resume summary or work bullets here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-[#16405B] transition-colors"
        />
        <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
          <span>Target Role: {user.targetRole || 'Software Engineer'}</span>
          <span>Click "Generate Improvements" above to rewrite using STAR framework</span>
        </div>
      </div>

      {/* Results Section */}
      {rewriteData && (
        <div className="space-y-6">
          {/* Executive Summary Upgrade Card */}
          <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#16405B]" />
                <h4 className="font-bold text-base text-[#0F172A]">
                  Upgraded Executive Summary
                </h4>
              </div>
              <button
                onClick={() => copyToClipboard(rewriteData.improvedSummary)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#16405B] hover:text-[#205274] bg-slate-50 px-3 py-1.5 rounded border border-slate-200 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-700 uppercase">
                  Before (Original)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rewriteData.originalSummary}"
                </p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  After (Optimized for ATS)
                </span>
                <p className="text-xs font-medium text-slate-900 leading-relaxed">
                  "{rewriteData.improvedSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side STAR Bullet Comparison */}
          <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-[#0F172A]">
                  STAR Method Bullet Improvements
                </h4>
                <p className="text-xs text-slate-500">
                  Replaced passive verbs with high-impact quantifiable metrics.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#C8622A] bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {rewriteData.bulletImprovements.length} Statements
              </span>
            </div>

            <div className="space-y-4">
              {rewriteData.bulletImprovements.map((item, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#16405B] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Metric: {item.impactMetric}
                      </span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(item.improved, idx)}
                      className="text-xs font-semibold text-slate-700 hover:text-[#16405B] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedIndex === idx ? 'Copied!' : 'Copy Bullet'}</span>
                    </button>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-xs text-slate-600 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                        Weak / Passive Draft:
                      </span>
                      <p className="bg-slate-100 p-2.5 rounded border border-slate-200 italic">
                        "{item.original}"
                      </p>
                    </div>

                    <div className="text-xs font-medium text-slate-900 space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1">
                        High-Impact Statement (Action Verb: {item.actionVerbUsed}):
                      </span>
                      <p className="bg-emerald-50/80 p-2.5 rounded border border-emerald-200">
                        • {item.improved}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Verbs & Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High-Impact Action Verbs */}
            <div className="bg-white border border-[#E3DDD0] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#16405B] font-mono flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Power Action Verbs
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {rewriteData.actionVerbs.map((verb, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-[#16405B] border border-blue-200 text-xs font-bold px-2.5 py-1 rounded"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing ATS Keywords */}
            <div className="bg-white border border-[#E3DDD0] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#C8622A] font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing ATS Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {rewriteData.missingKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggested Certifications */}
            <div className="bg-white border border-[#E3DDD0] rounded-xl p-5 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Top Certifications
              </h4>
              <div className="space-y-1.5">
                {rewriteData.certificationSuggestions.map((cert, idx) => (
                  <p key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    {cert}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
