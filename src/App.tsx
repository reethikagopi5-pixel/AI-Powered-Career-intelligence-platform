import React, { useState, useEffect } from 'react';
import { api, getToken, removeToken } from './api';
import { UserProfile, ResumeRecord, AnalysisResult } from './types';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { DashboardLayout } from './components/DashboardLayout';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [loading, setLoading] = useState(true);

  // Resume & Analysis state
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeRecord | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-check existing session on load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { user: me } = await api.getMe();
      setUser(me);
      setView('dashboard');
      await loadDashboardContent();
    } catch (err) {
      // Stale or invalid session token (e.g. user missing from DB)
      removeToken();
      setUser(null);
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardContent = async () => {
    try {
      const data = await api.getDashboardData();
      setUser(data.user);
      setActiveResume(data.activeResume);
      setLatestAnalysis(data.latestAnalysis);

      const resList = await api.listResumes();
      setResumes(resList.resumes || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const handleAuthSuccess = async (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setView('dashboard');
    await loadDashboardContent();
  };

  const handleSignOut = () => {
    removeToken();
    setUser(null);
    setResumes([]);
    setActiveResume(null);
    setLatestAnalysis(null);
    setView('landing');
  };

  // RESUME HANDLERS
  const handleUploadResume = async (file: File) => {
    const res = await api.uploadResume(file);
    if (res.resume) {
      setActiveResume(res.resume);
    }
    await loadDashboardContent();

    if (res.resume?.id) {
      try {
        await handleRunAnalysis(res.resume.id);
      } catch (e) {
        console.warn('Auto analysis after upload failed:', e);
      }
    }
  };

  const handleReplaceResume = async (id: string, file: File) => {
    const res = await api.replaceResume(id, file);
    if (res.resume) {
      setActiveResume(res.resume);
    }
    await loadDashboardContent();

    if (res.resume?.id) {
      try {
        await handleRunAnalysis(res.resume.id);
      } catch (e) {
        console.warn('Auto analysis after replace failed:', e);
      }
    }
  };

  const handleActivateResume = async (id: string) => {
    await api.activateResume(id);
    await loadDashboardContent();
  };

  const handleDeleteResume = async (id: string) => {
    await api.deleteResume(id);
    await loadDashboardContent();
  };

  const handleDownloadResume = (id: string) => {
    const url = api.downloadResumeUrl(id);
    window.open(url, '_blank');
  };

  // ANALYSIS HANDLER
  const handleRunAnalysis = async (resumeId?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeResume({
        resumeId,
        targetRole: user?.targetRole,
      });
      setLatestAnalysis(res.analysis);
      return res.analysis;
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">
          Initializing CareerAI System...
        </p>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('auth')}
        onLogin={() => setView('auth')}
      />
    );
  }

  if (view === 'auth') {
    return (
      <Auth
        onSuccess={handleAuthSuccess}
        onNavigateHome={() => setView('landing')}
      />
    );
  }

  if (view === 'dashboard' && user) {
    return (
      <DashboardLayout
        user={user}
        activeResume={activeResume}
        resumes={resumes}
        latestAnalysis={latestAnalysis}
        isAnalyzing={isAnalyzing}
        onUpdateUser={setUser}
        onUploadResume={handleUploadResume}
        onReplaceResume={handleReplaceResume}
        onActivateResume={handleActivateResume}
        onDeleteResume={handleDeleteResume}
        onDownloadResume={handleDownloadResume}
        onRunAnalysis={handleRunAnalysis}
        onSelectHistoricalAnalysis={setLatestAnalysis}
        onSignOut={handleSignOut}
      />
    );
  }

  return null;
}
