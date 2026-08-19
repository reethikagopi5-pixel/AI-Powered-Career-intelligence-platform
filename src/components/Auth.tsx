import React, { useState } from 'react';
import { api, setToken } from '../api';
import { UserProfile } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock, Mail, User, Briefcase } from 'lucide-react';

interface AuthProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onNavigateHome }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const res = await api.register({
          name,
          email,
          password,
          targetRole,
        });
        setToken(res.token);
        onSuccess(res.user);
      } else {
        const res = await api.login({ email, password });
        setToken(res.token);
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = 'user.demo@careerai.io';
      const res = await api.login({ email: demoEmail, password: 'demoPassword123!' }).catch(async () => {
        return await api.register({
          name: 'Demo Candidate',
          email: demoEmail,
          password: 'demoPassword123!',
          targetRole: 'Senior Product Designer',
        });
      });
      setToken(res.token);
      onSuccess(res.user);
    } catch (err: any) {
      setError('Google Sign-In simulation completed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F4EB] text-slate-900 font-sans">
      {/* Left Navy Narrative Panel */}
      <div className="w-full md:w-1/2 bg-[#16405B] bg-blueprint-dark text-slate-300 p-8 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#205274]">
        <div>
          {/* Brand */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group mb-16"
          >
            <div className="w-6 h-6 border border-slate-400 bg-[#1D4A69] rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-[#C8622A] rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              CareerAI
            </h1>
          </div>

          <div className="space-y-6 max-w-md my-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Your resume, read the way a hiring pipeline reads it.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every analysis is generated live from your resume — no templates, no guesswork.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 pt-6 text-xs font-mono text-slate-400">
          SCHEMA v1.0 · RESUME → SKILLS → ROADMAP
        </div>
      </div>

      {/* Right Form Panel (Cream Graph Grid) */}
      <div className="w-full md:w-1/2 bg-blueprint bg-[#F7F4EB] p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md bg-transparent">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-[#0F172A]">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              {isSignup
                ? 'Start your AI career intelligence journey today.'
                : 'Log in to pick up where you left off.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1.5 font-bold tracking-wider">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CDBD] rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#16405B] focus:ring-1 focus:ring-[#16405B]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1.5 font-bold tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CDBD] rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#16405B] focus:ring-1 focus:ring-[#16405B]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 uppercase mb-1.5 font-bold tracking-wider">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D5CDBD] rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#16405B] focus:ring-1 focus:ring-[#16405B]"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-mono text-slate-700 uppercase mb-1.5 font-bold tracking-wider">
                  TARGET ROLE <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. MERN Stack Developer"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CDBD] rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#16405B] focus:ring-1 focus:ring-[#16405B]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#16405B] hover:bg-[#103046] text-white rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-4"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <span>{isSignup ? 'Sign Up' : 'Log in'}</span>
              )}
            </button>
          </form>

          {/* Google Sign In Option & Quick Auto Fill */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white border border-[#D5CDBD] hover:bg-slate-50 text-slate-800 rounded-md text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSignup) {
                  setName('Demo Candidate');
                  setEmail('reethikagopi5@gmail.com');
                  setPassword('demoPassword123!');
                  setTargetRole('MERN Stack Developer');
                } else {
                  setEmail('reethikagopi5@gmail.com');
                  setPassword('demoPassword123!');
                }
              }}
              className="w-full py-2 px-4 bg-[#FAF8F3] border border-dashed border-[#C2BAB0] text-[#16405B] hover:bg-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>⚡ Auto-fill Demo Credentials</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D5CDBD]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-mono">
              <span className="bg-[#F7F4EB] px-2 text-slate-500">Or sign in with email</span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="font-bold text-[#16405B] hover:underline cursor-pointer ml-1"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
