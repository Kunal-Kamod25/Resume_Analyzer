# PLAN-002 Step 2: Folder Structure & Redux Store Setup

**Status:** 📋 Ready for Review  
**Created:** 2026-05-15  
**Priority:** High (Blocks Component Development)

---

## Objective (Step 2 Only)

Create the complete folder structure for React components, pages, services, and utilities. Initialize Redux Toolkit store with core slices (`analysisSlice` and `uiSlice`). After this step, we'll have the architectural foundation ready for building individual UI components.

---

## What We're Doing

### Current State
- ✅ Vite + TypeScript + dependencies installed (Step 1 complete)
- ✅ Dev server running on localhost:3001
- ❌ No folder structure (`components/`, `pages/`, `services/`, etc.)
- ❌ No Redux store configured
- ❌ No Redux slices (analysisSlice, uiSlice)
- ❌ No Axios API client setup
- ❌ No TypeScript types/interfaces defined

### After Step 2
- ✅ Complete folder structure organized by feature
- ✅ Redux store initialized with 2 core slices
- ✅ Axios API client with CORS proxy configured
- ✅ TypeScript interfaces for API requests/responses
- ✅ Root App.tsx with routing setup (basic)
- ✅ Global styles and CSS variables
- ✅ Ready to build individual components

---

## Tasks (Step 2)

### Task 2.1: Create Folder Structure

Create the complete source code organization:

```
frontend/src/
├── components/                    # Reusable UI components
│   ├── Header.tsx                # Top navigation bar
│   ├── UploadSection.tsx         # Resume upload section (drag-drop)
│   ├── JobDescSection.tsx        # Job description input
│   ├── ResultsPanel.tsx          # Analysis results display
│   ├── ScoreCard.tsx             # Fit score visualization
│   ├── SkillsCard.tsx            # Skills display
│   ├── ExperienceCard.tsx        # Experience display
│   ├── EducationCard.tsx         # Education/certifications
│   ├── LoadingSpinner.tsx        # Loading indicator
│   ├── ErrorAlert.tsx            # Error notification
│   └── ReportPreview.tsx         # PDF preview
│
├── pages/                         # Page-level components
│   ├── HomePage.tsx              # Main analysis page
│   ├── HistoryPage.tsx           # Past analyses (future)
│   └── NotFound.tsx              # 404 page
│
├── services/                      # Business logic & API calls
│   ├── api.ts                    # Axios instance + config
│   ├── resumeService.ts          # Resume analysis API calls
│   └── reportService.ts          # PDF generation logic
│
├── store/                         # Redux store & slices
│   ├── store.ts                  # Store configuration
│   ├── slices/
│   │   ├── analysisSlice.ts      # Analysis state + async thunks
│   │   ├── uiSlice.ts            # UI state (loading, errors)
│   │   └── historySlice.ts       # Analysis history (stub)
│   └── hooks.ts                  # Custom Redux hooks
│
├── types/                         # TypeScript interfaces
│   ├── api.ts                    # API request/response types
│   ├── analysis.ts               # Analysis result types
│   └── common.ts                 # Global/shared types
│
├── utils/                         # Helper functions
│   ├── formatters.ts             # Format scores, dates, numbers
│   ├── validators.ts             # Form validation logic
│   ├── pdfGenerator.ts           # PDF report generation
│   └── errorHandler.ts           # API error mapping
│
├── styles/                        # Global styles
│   ├── index.css                 # Global CSS reset
│   ├── variables.css             # CSS variables (colors, spacing)
│   └── responsive.css            # Mobile breakpoints
│
├── App.tsx                        # Main app component with routing
├── main.tsx                       # React entry point
└── index.css                      # Root CSS
```

**Action:** Create all these folders and placeholder files as shown below.

---

### Task 2.2: Create TypeScript Interfaces (types/)

**File:** `frontend/src/types/api.ts`

```typescript
/**
 * API request/response types for Resume Analyzer backend
 */

export interface AnalyzeResumeRequest {
  resume_text: string;
  job_description?: string;
  file_type: 'pdf' | 'text';
}

export interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience?: number;
}

export interface Education {
  degree: string;
  field: string;
  year?: number;
  institution?: string;
}

export interface Certification {
  name: string;
  year?: number;
  issuer?: string;
}

export interface ExtractedData {
  skills: Skill[];
  years_of_experience: number;
  education: Education[];
  certifications: Certification[];
  job_titles?: string[];
  summary?: string;
}

export interface AnalyzeResumeResponse {
  status: 'success' | 'error';
  analysis_id: string;
  extracted_data: ExtractedData;
  fit_score: number | null;
  fit_details?: {
    matching_skills: string[];
    missing_skills: string[];
    experience_match: string;
  };
  generated_at: string;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  status: string;
  message: string;
  errors?: string[];
}
```

**File:** `frontend/src/types/analysis.ts`

```typescript
/**
 * Analysis state and result types
 */

import { ExtractedData, AnalyzeResumeResponse } from './api';

export interface AnalysisResult {
  id: string;
  resumeText: string;
  jobDescription?: string;
  extractedData: ExtractedData;
  fitScore: number | null;
  fitDetails?: {
    matchingSkills: string[];
    missingSkills: string[];
    experienceMatch: string;
  };
  timestamp: string;
}

export interface AnalysisHistory {
  total: number;
  analyses: AnalysisResult[];
}
```

**File:** `frontend/src/types/common.ts`

```typescript
/**
 * Global/shared type definitions
 */

export interface ApiRequestState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export type AppEnv = 'development' | 'production' | 'test';

export interface AppConfig {
  apiBaseUrl: string;
  env: AppEnv;
  enableHistory: boolean;
  enableAuth: boolean;
}
```

---

### Task 2.3: Create Redux Store & Slices

**File:** `frontend/src/store/slices/analysisSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnalysisResult, ApiRequestState } from '../../types';
import { resumeService } from '../../services/resumeService';

interface AnalysisState {
  current: AnalysisResult | null;
  history: AnalysisResult[];
  resumeText: string;
  jobDescription: string;
  requestState: ApiRequestState;
}

const initialState: AnalysisState = {
  current: null,
  history: [],
  resumeText: '',
  jobDescription: '',
  requestState: {
    loading: false,
    error: null,
    success: false,
  },
};

// Async thunk for analyzing resume
export const analyzeResume = createAsyncThunk(
  'analysis/analyzeResume',
  async (
    { resumeText, jobDescription }: { resumeText: string; jobDescription?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resumeService.analyzeResume(resumeText, jobDescription);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to analyze resume');
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setResumeText: (state, action: PayloadAction<string>) => {
      state.resumeText = action.payload;
    },
    setJobDescription: (state, action: PayloadAction<string>) => {
      state.jobDescription = action.payload;
    },
    clearAnalysis: (state) => {
      state.current = null;
      state.resumeText = '';
      state.jobDescription = '';
      state.requestState = {
        loading: false,
        error: null,
        success: false,
      };
    },
    addToHistory: (state, action: PayloadAction<AnalysisResult>) => {
      state.history.unshift(action.payload);
      // Keep only last 10 analyses
      if (state.history.length > 10) {
        state.history.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.requestState.loading = true;
        state.requestState.error = null;
        state.requestState.success = false;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.requestState.loading = false;
        state.requestState.success = true;
        state.current = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.requestState.loading = false;
        state.requestState.error = action.payload as string;
        state.requestState.success = false;
      });
  },
});

export const { setResumeText, setJobDescription, clearAnalysis, addToHistory } =
  analysisSlice.actions;

export default analysisSlice.reducer;
```

**File:** `frontend/src/store/slices/uiSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  activeTab: 'upload' | 'results' | 'history';
  showReportPreview: boolean;
  darkMode: boolean;
}

const initialState: UIState = {
  loading: false,
  error: null,
  successMessage: null,
  activeTab: 'upload',
  showReportPreview: false,
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'upload' | 'results' | 'history'>) => {
      state.activeTab = action.payload;
    },
    setShowReportPreview: (state, action: PayloadAction<boolean>) => {
      state.showReportPreview = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setSuccessMessage,
  setActiveTab,
  setShowReportPreview,
  toggleDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;
```

**File:** `frontend/src/store/slices/historySlice.ts` (stub for now)

```typescript
import { createSlice } from '@reduxjs/toolkit';
import { AnalysisHistory } from '../../types';

interface HistoryState {
  history: AnalysisHistory;
}

const initialState: HistoryState = {
  history: {
    total: 0,
    analyses: [],
  },
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
});

export default historySlice.reducer;
```

**File:** `frontend/src/store/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './slices/analysisSlice';
import uiReducer from './slices/uiSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    ui: uiReducer,
    history: historyReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**File:** `frontend/src/store/hooks.ts`

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

### Task 2.4: Create Axios API Client

**File:** `frontend/src/services/api.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists (future)
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle global errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.warn('Unauthorized access');
    }
    if (error.response?.status === 500) {
      console.error('Server error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
```

**File:** `frontend/src/services/resumeService.ts`

```typescript
import api from './api';
import { AnalyzeResumeRequest, AnalyzeResumeResponse } from '../types/api';
import { AnalysisResult } from '../types/analysis';

export const resumeService = {
  async analyzeResume(
    resumeText: string,
    jobDescription?: string
  ): Promise<AnalysisResult> {
    try {
      const payload: AnalyzeResumeRequest = {
        resume_text: resumeText,
        job_description: jobDescription,
        file_type: 'text',
      };

      const response = await api.post<AnalyzeResumeResponse>(
        '/api/v1/analyze',
        payload
      );

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Analysis failed');
      }

      // Transform API response to frontend format
      return {
        id: response.data.analysis_id,
        resumeText,
        jobDescription,
        extractedData: response.data.extracted_data,
        fitScore: response.data.fit_score,
        fitDetails: response.data.fit_details,
        timestamp: response.data.generated_at,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to analyze resume'
      );
    }
  },
};
```

**File:** `frontend/src/services/reportService.ts` (stub)

```typescript
import { AnalysisResult } from '../types/analysis';

export const reportService = {
  generatePDF(analysis: AnalysisResult): void {
    // PDF generation logic (html2pdf)
    console.log('Generating PDF for analysis:', analysis.id);
  },

  downloadPDF(analysis: AnalysisResult): void {
    // Trigger download
    console.log('Downloading PDF for analysis:', analysis.id);
  },
};
```

---

### Task 2.5: Create Utility Functions

**File:** `frontend/src/utils/formatters.ts`

```typescript
/**
 * Formatting utilities for display
 */

export const formatScore = (score: number | null): string => {
  if (score === null) return 'N/A';
  return `${Math.round(score)}/100`;
};

export const getScoreColor = (score: number | null): string => {
  if (score === null) return 'gray';
  if (score >= 71) return 'green'; // Excellent
  if (score >= 41) return 'orange'; // Moderate
  return 'red'; // Poor
};

export const getScoreLabel = (score: number | null): string => {
  if (score === null) return 'Not Scored';
  if (score >= 71) return 'Excellent Match';
  if (score >= 41) return 'Moderate Match';
  return 'Poor Match';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatYears = (years: number): string => {
  if (years === 1) return '1 year';
  return `${years} years`;
};
```

**File:** `frontend/src/utils/validators.ts`

```typescript
/**
 * Form validation utilities
 */

export const validateResumeText = (text: string): string | null => {
  if (!text || text.trim().length === 0) {
    return 'Resume text is required';
  }
  if (text.length < 50) {
    return 'Resume must be at least 50 characters';
  }
  if (text.length > 50000) {
    return 'Resume must be less than 50,000 characters';
  }
  return null;
};

export const validateJobDescription = (text: string): string | null => {
  if (text && text.length > 10000) {
    return 'Job description must be less than 10,000 characters';
  }
  return null;
};

export const validateFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'text/plain'];

  if (file.size > maxSize) {
    return 'File must be less than 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF and text files are allowed';
  }

  return null;
};
```

**File:** `frontend/src/utils/errorHandler.ts`

```typescript
/**
 * Global error handling utilities
 */

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors[0] || 'An error occurred';
  }

  return 'An unexpected error occurred';
};

export const parseApiError = (error: any) => {
  return {
    message: getErrorMessage(error),
    status: error?.response?.status,
    data: error?.response?.data,
  };
};
```

---

### Task 2.6: Create Global Styles

**File:** `frontend/src/styles/variables.css`

```css
/* CSS Variables - Theme Colors and Spacing */

:root {
  /* Primary Colors */
  --color-primary: #1976d2;
  --color-primary-light: #e3f2fd;
  --color-primary-dark: #1565c0;
  
  /* Secondary Colors */
  --color-secondary: #dc004e;
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-error: #f44336;
  --color-info: #2196f3;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #eeeeee;
  --color-gray-300: #e0e0e0;
  --color-gray-400: #bdbdbd;
  --color-gray-500: #9e9e9e;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**File:** `frontend/src/styles/index.css`

```css
@import './variables.css';
@import './responsive.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-gray-50);
  color: var(--color-gray-900);
}

body {
  line-height: 1.5;
  font-size: var(--font-size-base);
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
}

h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-primary-dark);
}

/* Buttons */
button {
  cursor: pointer;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s;
}

/* Form Elements */
input,
textarea,
select {
  font-family: inherit;
  font-size: var(--font-size-base);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.flex {
  display: flex;
  gap: var(--spacing-md);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-center {
  text-align: center;
}

.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }

.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
```

**File:** `frontend/src/styles/responsive.css`

```css
/* Mobile-First Responsive Design */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
  
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
  
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* Extra extra large devices (1400px and up) */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  body {
    font-size: 14px;
  }
  
  h1 { font-size: 20px; }
  h2 { font-size: 18px; }
  h3 { font-size: 16px; }
  
  .grid {
    gap: var(--spacing-sm);
  }
}
```

---

### Task 2.7: Create Root App Component

**File:** `frontend/src/App.tsx`

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import NotFound from './pages/NotFound';
import './styles/index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </Provider>
  );
}

export default App;
```

**File:** `frontend/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### Task 2.8: Create Placeholder Components & Pages

**File:** `frontend/src/components/Header.tsx`

```typescript
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>Resume Analyzer</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/history">History</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

**File:** `frontend/src/pages/HomePage.tsx`

```typescript
const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Resume Analyzer</h1>
      <p>Upload your resume and analyze how well it matches a job description.</p>
      {/* Components will be added here in next steps */}
    </div>
  );
};

export default HomePage;
```

**File:** `frontend/src/pages/HistoryPage.tsx`

```typescript
const HistoryPage = () => {
  return (
    <div className="history-page">
      <h1>Analysis History</h1>
      <p>Your past analyses will appear here.</p>
    </div>
  );
};

export default HistoryPage;
```

**File:** `frontend/src/pages/NotFound.tsx`

```typescript
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;
```

---

## Summary of Files to Create

**Total New Files:** 28

### Folders (empty):
- `src/components/`
- `src/pages/`
- `src/services/`
- `src/store/slices/`
- `src/types/`
- `src/utils/`
- `src/styles/`

### TypeScript Files:
- `src/types/api.ts`
- `src/types/analysis.ts`
- `src/types/common.ts`
- `src/store/store.ts`
- `src/store/hooks.ts`
- `src/store/slices/analysisSlice.ts`
- `src/store/slices/uiSlice.ts`
- `src/store/slices/historySlice.ts`
- `src/services/api.ts`
- `src/services/resumeService.ts`
- `src/services/reportService.ts`
- `src/utils/formatters.ts`
- `src/utils/validators.ts`
- `src/utils/errorHandler.ts`
- `src/components/Header.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/HistoryPage.tsx`
- `src/pages/NotFound.tsx`
- `src/App.tsx`
- `src/main.tsx`

### CSS Files:
- `src/styles/variables.css`
- `src/styles/index.css`
- `src/styles/responsive.css`

---

## Deliverables (After Step 2)

✅ Complete folder structure  
✅ Redux store configured with 3 slices  
✅ Core TypeScript interfaces  
✅ Axios API client with interceptors  
✅ Utility functions (formatters, validators, error handler)  
✅ Global styles with CSS variables  
✅ Root App component with routing  
✅ Placeholder pages (Home, History, 404)  
✅ Header component  

**Status After Completion:** Ready to build individual UI components (Step 3) 🚀

---

## Questions for You (Review)

Before I implement Step 2, please confirm:

1. ✅ **Does the folder structure look good?** Any changes needed?

2. ✅ **Redux slice design** — Do the `analysisSlice` and `uiSlice` capture the state you need?

3. ✅ **API types** — Do the TypeScript interfaces match what the backend will return?

4. ✅ **Proceed with implementation?** Once you approve, I'll:
   - Create all folders
   - Create all files
   - Verify dev server still runs
   - Commit to git

---

## 📊 Effort Estimate

**Time to Complete Step 2:** 2-3 hours
- Create folders: 5 min
- Create all files: 1.5 hours
- Verify setup: 30 min
- Testing: 30 min

---

## ✅ Success Criteria

After Step 2, you should be able to:
- [ ] Run `npm run dev` and see app load without errors
- [ ] See routing work (Home, History, 404 pages)
- [ ] Redux DevTools show store structure (install Redux extension if you want)
- [ ] No TypeScript type errors in IDE
- [ ] Console clean (no warnings)
- [ ] Component imports resolve correctly

---

## References

- Redux Toolkit: https://redux-toolkit.js.org
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- TypeScript: https://www.typescriptlang.org

