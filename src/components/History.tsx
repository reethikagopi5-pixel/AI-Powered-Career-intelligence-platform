import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { AnalysisHistoryItem, AnalysisResult } from '../types';
import { History as HistoryIcon, Clock, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface HistoryProps {
  onSelectAnalysis: (analysis: AnalysisResult) => void;
}

export const History: React.FC<HistoryProps> = ({ onSelectAnalysis }) => {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      setHistoryItems(res.history || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSnapshot = async (id: string) => {
    try {
      const res = await api.getAnalysisById(id);
      if (res.analysis) {
        onSelectAnalysis(res.analysis);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load snapshot');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-semibold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Analysis History Log
            </span>
            <h2 className="text-2xl font-bold text-[#0F172A] mt-2">
              Historical Resume Analysis Snapshots
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              All previous ATS score evaluations and skill gap reports are saved to your account. Reload any past snapshot without re-parsing.
            </p>
          </div>

          <div className="bg-[#0F172A] text-white p-5 rounded-xl flex items-center gap-4 min-w-48">
            <HistoryIcon className="w-8 h-8 text-[#2563EB]" />
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-400">Total Saved</p>
              <p className="text-2xl font-mono font-bold text-white">{historyItems.length} Snapshots</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Loading analysis history...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No analysis history recorded</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload a resume and click "Run AI Analysis" to log your first evaluation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Target Role</th>
                  <th className="py-3 px-3">Resume Document</th>
                  <th className="py-3 px-3">ATS Score</th>
                  <th className="py-3 px-3">Skill Match</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{item.targetRole}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs text-slate-700 font-medium">
                          {item.resumeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className="font-bold text-[#2563EB] text-sm">{item.atsScore} / 100</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      {item.matchPercentage}% Alignment
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleLoadSnapshot(item.id)}
                        className="inline-flex items-center gap-1 bg-[#0F172A] hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <span>View Snapshot</span>
                        <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                      </button>
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
