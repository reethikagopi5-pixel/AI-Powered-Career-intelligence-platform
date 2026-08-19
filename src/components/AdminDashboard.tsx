import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../api';
import {
  ShieldCheck,
  Database,
  Users,
  FileText,
  Activity,
  Download,
  Search,
  RefreshCw,
  Server,
  Code,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [dbStats, setDbStats] = useState<any>(null);
  const [activeCollection, setActiveCollection] = useState<string>('users');
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawEditorJson, setRawEditorJson] = useState('');
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System booted: SQLite engine active`,
    `[${new Date().toLocaleTimeString()}] Admin user authenticated: ${user.email}`,
    `[${new Date().toLocaleTimeString()}] JSON collections synced to careerai.sqlite`,
  ]);

  useEffect(() => {
    loadAdminData();
  }, [activeCollection]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const stats = await api.getDbStats();
      setDbStats(stats);

      const browserData = await api.queryDbBrowser(activeCollection, searchQuery);
      setTableData(browserData.records || []);

      const raw = await api.getRawDbCollection(activeCollection);
      setRawEditorJson(JSON.stringify(raw.records || [], null, 2));
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const browserData = await api.queryDbBrowser(activeCollection, searchQuery);
      setTableData(browserData.records || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRawJson = async () => {
    try {
      const parsed = JSON.parse(rawEditorJson);
      await api.saveRawDbCollection(activeCollection, parsed);
      alert(`Successfully saved updates to ${activeCollection}.json!`);
      setIsEditingRaw(false);
      await loadAdminData();
      setSystemLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Admin modified ${activeCollection}.json collection`,
        ...prev,
      ]);
    } catch (err: any) {
      alert(`JSON Syntax Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#16405B] text-white border border-[#205274] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#205274] rounded-xl flex items-center justify-center text-amber-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">
                Admin Control Panel & SQLite Database Inspector
              </h3>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                System Admin
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1">
              Manage system users, uploaded resumes, AI analysis logs, and raw SQLite database tables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/api/db/download-sqlite"
            download="careerai.sqlite"
            className="bg-[#C8622A] hover:bg-[#B3531F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download SQLite (.sqlite)</span>
          </a>
        </div>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E3DDD0] p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Total Users</span>
            <Users className="w-4 h-4 text-[#16405B]" />
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">{dbStats?.userCount || 0}</p>
          <p className="text-[11px] text-slate-500 font-mono">Registered candidate accounts</p>
        </div>

        <div className="bg-white border border-[#E3DDD0] p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">Resumes Uploaded</span>
            <FileText className="w-4 h-4 text-[#C8622A]" />
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">{dbStats?.resumeCount || 0}</p>
          <p className="text-[11px] text-slate-500 font-mono">PDF, DOCX & OCR records</p>
        </div>

        <div className="bg-white border border-[#E3DDD0] p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">AI Scans Executed</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0F172A]">{dbStats?.analysisCount || 0}</p>
          <p className="text-[11px] text-slate-500 font-mono">Gemini ATS analysis calls</p>
        </div>

        <div className="bg-white border border-[#E3DDD0] p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-mono font-bold uppercase">DB Engine</span>
            <Server className="w-4 h-4 text-[#16405B]" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">SQLite 3</p>
          <p className="text-[11px] text-slate-500 font-mono">Auto-synced JSON & .sqlite</p>
        </div>
      </div>

      {/* Main Database Table Inspector */}
      <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs space-y-4">
        {/* Collection Selector & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 font-mono uppercase mr-1">Collection:</span>
            {['users', 'resumes', 'analyses'].map((col) => (
              <button
                key={col}
                onClick={() => {
                  setActiveCollection(col);
                  setIsEditingRaw(false);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCollection === col
                    ? 'bg-[#16405B] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingRaw(!isEditingRaw)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
            >
              <Code className="w-3.5 h-3.5 text-[#16405B]" />
              <span>{isEditingRaw ? 'View Table Format' : 'Raw JSON Editor'}</span>
            </button>

            <a
              href={api.exportDbCollectionUrl(activeCollection)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export {activeCollection}.json</span>
            </a>
          </div>
        </div>

        {/* Search Bar */}
        {!isEditingRaw && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search records inside ${activeCollection}...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#16405B]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#16405B] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Filter
            </button>
          </form>
        )}

        {/* Content View */}
        {isEditingRaw ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 font-medium">
              <span>⚠️ Direct JSON Editor Mode: Editing records manually updates physical storage.</span>
              <button
                onClick={handleSaveRawJson}
                className="bg-[#C8622A] hover:bg-[#B3531F] text-white text-xs font-bold px-4 py-1.5 rounded transition-colors cursor-pointer"
              >
                Save JSON Changes
              </button>
            </div>
            <textarea
              rows={16}
              value={rawEditorJson}
              onChange={(e) => setRawEditorJson(e.target.value)}
              className="w-full bg-[#0F172A] text-emerald-400 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none leading-relaxed"
            />
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            Loading database records...
          </div>
        ) : tableData.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No records found in collection '{activeCollection}'.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono uppercase text-[10px] text-slate-500">
                <tr>
                  <th className="p-3">ID</th>
                  {activeCollection === 'users' && (
                    <>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Target Role</th>
                      <th className="p-3">Completion</th>
                    </>
                  )}
                  {activeCollection === 'resumes' && (
                    <>
                      <th className="p-3">Original Name</th>
                      <th className="p-3">User ID</th>
                      <th className="p-3">File Type</th>
                      <th className="p-3">Upload Date</th>
                    </>
                  )}
                  {activeCollection === 'analyses' && (
                    <>
                      <th className="p-3">Candidate/User</th>
                      <th className="p-3">Target Role</th>
                      <th className="p-3">ATS Score</th>
                      <th className="p-3">Created At</th>
                    </>
                  )}
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors font-mono">
                    <td className="p-3 font-bold text-[#16405B] truncate max-w-[120px]">{row.id}</td>
                    {activeCollection === 'users' && (
                      <>
                        <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="p-3 text-slate-600">{row.email}</td>
                        <td className="p-3 text-slate-800">{row.targetRole}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {row.profileCompletion || 100}%
                          </span>
                        </td>
                      </>
                    )}
                    {activeCollection === 'resumes' && (
                      <>
                        <td className="p-3 font-semibold text-slate-900">{row.originalName}</td>
                        <td className="p-3 text-slate-600">{row.userId}</td>
                        <td className="p-3 uppercase font-bold text-slate-700">{row.fileType}</td>
                        <td className="p-3 text-slate-500">{new Date(row.uploadDate).toLocaleDateString()}</td>
                      </>
                    )}
                    {activeCollection === 'analyses' && (
                      <>
                        <td className="p-3 font-semibold text-slate-900">{row.resumeName || row.userId}</td>
                        <td className="p-3 text-slate-800">{row.targetRole}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-[#16405B] text-[10px] font-bold px-2 py-0.5 rounded">
                            {row.atsScore}/100
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                      </>
                    )}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(JSON.stringify(row, null, 2))}
                        className="text-[11px] text-[#16405B] hover:underline font-semibold cursor-pointer"
                      >
                        Inspect JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Live System Activity Log */}
      <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#16405B]" />
            Live System Activity Log
          </h4>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            Live Stream
          </span>
        </div>

        <div className="bg-[#0F172A] text-slate-300 font-mono text-xs p-4 rounded-xl space-y-1.5 h-32 overflow-y-auto">
          {systemLogs.map((log, idx) => (
            <p key={idx} className="text-[11px]">
              <span className="text-emerald-400">INFO:</span> {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
