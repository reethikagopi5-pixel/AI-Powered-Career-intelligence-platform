import {
  UserProfile,
  ResumeRecord,
  AnalysisResult,
  AnalysisHistoryItem,
  ExtractedResumeData,
} from './types';

const API_BASE = '/api';

export function getToken(): string | null {
  return localStorage.getItem('careerai_token');
}

export function setToken(token: string): void {
  localStorage.setItem('careerai_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('careerai_token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error('Network error: Unable to connect to backend server');
  }

  let data: any = {};
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = { error: 'Failed to parse JSON response from server' };
    }
  } else {
    const text = await response.text();
    data = { error: text || `Server returned HTTP status ${response.status}` };
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to process request`);
  }

  return data;
}

export const api = {
  // AUTH
  register: (data: { name: string; email: string; password: string; targetRole?: string }) =>
    fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: (): Promise<{ user: UserProfile }> => fetchWithAuth('/auth/me'),

  updateProfile: (profileData: Partial<UserProfile>): Promise<{ user: UserProfile }> =>
    fetchWithAuth('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // RESUME
  uploadResume: (
    file: File
  ): Promise<{ message: string; resume: ResumeRecord; extractedData: ExtractedResumeData }> => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetchWithAuth('/resume/upload', {
      method: 'POST',
      body: formData,
    });
  },

  listResumes: (): Promise<{ resumes: ResumeRecord[] }> => fetchWithAuth('/resume/list'),

  downloadResumeUrl: (id: string) => `${API_BASE}/resume/${id}/download`,

  replaceResume: (
    id: string,
    file: File
  ): Promise<{ message: string; resume: ResumeRecord; extractedData: ExtractedResumeData }> => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetchWithAuth(`/resume/${id}/replace`, {
      method: 'PUT',
      body: formData,
    });
  },

  activateResume: (id: string): Promise<{ message: string; resumes: ResumeRecord[] }> =>
    fetchWithAuth(`/resume/${id}/activate`, { method: 'PUT' }),

  deleteResume: (id: string): Promise<{ message: string; resumes: ResumeRecord[] }> =>
    fetchWithAuth(`/resume/${id}`, { method: 'DELETE' }),

  // ANALYSIS
  analyzeResume: (params: {
    resumeId?: string;
    targetRole?: string;
  }): Promise<{ analysis: AnalysisResult }> =>
    fetchWithAuth('/resume/analyze', { method: 'POST', body: JSON.stringify(params) }),

  getDashboardData: (): Promise<{
    user: UserProfile;
    activeResume: ResumeRecord | null;
    latestAnalysis: AnalysisResult | null;
    resumeCount: number;
    historyCount: number;
  }> => fetchWithAuth('/dashboard'),

  getHistory: (): Promise<{ history: AnalysisHistoryItem[] }> => fetchWithAuth('/history'),

  getLatestAnalysis: (): Promise<{ analysis: AnalysisResult | null }> =>
    fetchWithAuth('/analysis/latest'),

  getAnalysisById: (id: string): Promise<{ analysis: AnalysisResult }> =>
    fetchWithAuth(`/analysis/${id}`),

  // AI MENTOR, RESUME REWRITER & INTERVIEW PREP
  sendMentorMessage: (
    message: string,
    category?: string
  ): Promise<{ reply: string; suggestedFollowups: string[]; category: string }> =>
    fetchWithAuth('/mentor/chat', { method: 'POST', body: JSON.stringify({ message, category }) }),

  improveResume: (
    originalSummary?: string,
    targetRole?: string
  ): Promise<{ rewrite: any }> =>
    fetchWithAuth('/resume/improve', {
      method: 'POST',
      body: JSON.stringify({ originalSummary, targetRole }),
    }),

  generateInterviewPrep: (
    company?: string,
    difficulty?: string,
    category?: string
  ): Promise<{ questions: any[] }> =>
    fetchWithAuth('/interview/generate', {
      method: 'POST',
      body: JSON.stringify({ company, difficulty, category }),
    }),

  // DB BROWSER
  getDbStats: (): Promise<{
    userCount: number;
    resumeCount: number;
    analysisCount: number;
    collections: { name: string; count: number; description: string }[];
  }> => fetchWithAuth('/db/stats'),

  queryDbBrowser: (
    collection: string,
    q: string = ''
  ): Promise<{ collection: string; totalRecords: number; records: any[] }> =>
    fetchWithAuth(`/db/browser?collection=${encodeURIComponent(collection)}&q=${encodeURIComponent(q)}`),

  exportDbCollectionUrl: (collection: string) => {
    const token = getToken();
    return `${API_BASE}/db/export/${collection}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  },

  getRawDbCollection: (
    collection: string
  ): Promise<{ collection: string; fileName: string; records: any[] }> =>
    fetchWithAuth(`/db/raw/${collection}`),

  saveRawDbCollection: (
    collection: string,
    records: any[]
  ): Promise<{ message: string; totalRecords: number }> =>
    fetchWithAuth(`/db/raw/${collection}`, {
      method: 'PUT',
      body: JSON.stringify({ records }),
    }),
};
