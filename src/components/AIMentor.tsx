import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AnalysisResult, MentorChatMessage } from '../types';
import { api } from '../api';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Target,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Bot,
  User,
  Zap,
  BookOpen,
  DollarSign,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AIMentorProps {
  user: UserProfile;
  analysis: AnalysisResult | null;
}

export const AIMentor: React.FC<AIMentorProps> = ({ user, analysis }) => {
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hello ${user.name}! I am your **CareerAI Executive Mentor & Recruiter Coach**. I've analyzed your profile targeting **${user.targetRole || 'Software Engineer'}**. How can I help accelerate your career today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        `How can I improve my resume for ${user.targetRole}?`,
        'What interview questions should I expect this week?',
        'How do I negotiate for a higher starting salary?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Resume' | 'Interview' | 'Salary' | 'Roadmap'>('All');

  // Weekly Goals State
  const [weeklyGoals, setWeeklyGoals] = useState([
    { id: 'g1', title: 'Complete 1 resume ATS analysis scan', completed: true },
    { id: 'g2', title: 'Practice 3 STAR method behavioral questions', completed: false },
    { id: 'g3', title: 'Add 1 new project to GitHub / Portfolio', completed: false },
    { id: 'g4', title: 'Review System Architecture fundamentals', completed: false },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: MentorChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendMentorMessage(query, activeTab);
      const assistantMsg: MentorChatMessage = {
        id: 'a_' + Date.now(),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: res.suggestedFollowups,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: MentorChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: `Sorry, I encountered an issue connecting to my intelligence engine: ${err.message}. Please try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleGoal = (id: string) => {
    setWeeklyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const completedGoalsCount = weeklyGoals.filter((g) => g.completed).length;
  const goalsPct = Math.round((completedGoalsCount / weeklyGoals.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E3DDD0] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#16405B] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                24/7 AI Career Coach & Mentor
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Active Session
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Personalized guidance for {user.name} • Target Role: <strong className="text-[#16405B]">{user.targetRole || 'Software Engineer'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-500">
            Powered by Google Gemini AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Assistant (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-[#E3DDD0] rounded-xl shadow-xs h-[650px] overflow-hidden">
          {/* Category Filter Pills */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Topic:</span>
            {(['All', 'Resume', 'Interview', 'Salary', 'Roadmap'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#16405B] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white ${
                      isUser ? 'bg-[#C8622A]' : 'bg-[#16405B]'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
                  </div>

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#16405B] text-white rounded-tr-none'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line font-normal">{msg.text}</p>

                      {!isUser && (
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => speakText(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-[#16405B] transition-colors cursor-pointer"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                <span className="text-amber-600 font-semibold">Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggested Followups */}
                    {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedFollowups.map((fol, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fol)}
                            className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md transition-colors text-left font-medium cursor-pointer"
                          >
                            💡 {fol}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-[#16405B] flex items-center justify-center text-white">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <div className="bg-slate-100 border border-slate-200 text-slate-500 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-ping" />
                  <span>AI Mentor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask your AI Mentor about ${user.targetRole} interviews, resume tips, or salary...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#16405B] transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#16405B] hover:bg-[#103046] text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Career Tips & Weekly Goals (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Career Tip Card */}
          <div className="bg-gradient-to-br from-[#16405B] to-[#205274] text-white p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                  Daily Pro Tip
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-200">
                Aug 2026
              </span>
            </div>

            <p className="text-xs leading-relaxed font-normal text-slate-100">
              "Recruiters filter resumes by scanning for quantifiable metrics within 6 seconds. Rephrase 'managed APIs' to 'maintained 12+ REST endpoints handling 50k requests/day'."
            </p>

            <button
              onClick={() => handleSend("How can I add quantifiable metrics to my current resume?")}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
            >
              <span>Apply to my resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weekly Career Readiness Goals */}
          <div className="bg-white border border-[#E3DDD0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C8622A]" />
                <h4 className="font-bold text-sm text-[#0F172A]">Weekly Goals</h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#16405B]">
                {goalsPct}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#C8622A] h-2 transition-all duration-500 rounded-full"
                style={{ width: `${goalsPct}%` }}
              />
            </div>

            {/* Goal Checklist */}
            <div className="space-y-2.5">
              {weeklyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                      goal.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {goal.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span
                    className={`text-xs ${
                      goal.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                    }`}
                  >
                    {goal.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Prompts */}
          <div className="bg-white border border-[#E3DDD0] rounded-xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 font-mono">
              Quick AI Prompts
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => handleSend("Analyze my top 3 skill gaps and tell me how to fix them.")}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>🔍 Analyze top skill gaps</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => handleSend("Generate a 3-sentence elevator pitch for interviews.")}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>💬 Draft 3-sentence elevator pitch</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => handleSend("What certification holds the highest salary value for " + user.targetRole + "?")}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>🏆 Highest value certifications</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
