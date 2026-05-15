# PLAN-002: Build Professional React Frontend UI for Resume Analyzer

**Status:** 📋 Ready for Review  
**Created:** 2026-05-15  
**Target Duration:** 2-3 weeks  
**Priority:** High (Blocks User Interaction)

---

## 🎯 Objective

Replace the skeleton React app with a **professional, feature-complete UI** that:
- Allows recruiters to upload resumes (PDF/text)
- Displays resume analysis results in a clear, interactive format
- Provides job description input for fit scoring
- Enables users to download reports as PDF
- Offers a smooth, intuitive user experience

---

## 📊 Current State Analysis

### What Exists
- ✅ Backend FastAPI server with health check endpoints
- ✅ CORS middleware configured
- ✅ Basic React 18 setup in `/frontend` folder
- ✅ Docker Compose orchestration
- ✅ NLP backend ready (placeholder)

### What's Missing
- ❌ Frontend UI components (upload, results, reports)
- ❌ API client/service layer
- ❌ State management (Redux/Context API)
- ❌ File upload handling (PDF + text)
- ❌ Results display & visualization
- ❌ Report generation (PDF download)
- ❌ Navigation/routing
- ❌ Error handling & loading states
- ❌ Mobile responsiveness

---

## 🏗️ Frontend Architecture

### Tech Stack

```
React 18 + TypeScript + Vite
├── State Management: Redux Toolkit (for API calls + UI state)
├── UI Library: Material-UI (MUI) or Tailwind CSS + shadcn/ui
├── HTTP Client: Axios with interceptors
├── Form Handling: React Hook Form + Zod validation
├── PDF Report: html2pdf or react-pdf
├── File Upload: Dropzone + react-hook-dropzone
├── Routing: React Router v6
├── Icons: React Icons
└── Testing: Vitest + React Testing Library
```

### Folder Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── UploadSection.tsx       # Resume upload (drag-drop + file picker)
│   │   ├── JobDescSection.tsx      # Job description input textarea
│   │   ├── ResultsPanel.tsx        # Main results display
│   │   ├── SkillsCard.tsx          # Extracted skills display
│   │   ├── ScoreCard.tsx           # Fit score visualization
│   │   ├── ExperienceCard.tsx      # Years of experience display
│   │   ├── EducationCard.tsx       # Education/certifications
│   │   ├── LoadingSpinner.tsx      # Loading state UI
│   │   ├── ErrorAlert.tsx          # Error notifications
│   │   └── ReportPreview.tsx       # PDF preview before download
│   │
│   ├── pages/
│   │   ├── HomePage.tsx            # Main page (upload + analysis)
│   │   ├── HistoryPage.tsx         # Past analyses (future feature)
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── services/
│   │   ├── api.ts                  # Axios instance + CORS config
│   │   ├── resumeService.ts        # API calls for resume analysis
│   │   └── reportService.ts        # PDF generation logic
│   │
│   ├── store/
│   │   ├── store.ts                # Redux store configuration
│   │   ├── slices/
│   │   │   ├── analysisSlice.ts    # Analysis state + thunks
│   │   │   ├── uiSlice.ts          # UI state (loading, errors)
│   │   │   └── historySlice.ts     # Analysis history (future)
│   │   └── hooks.ts                # Custom Redux hooks (useAppDispatch, useAppSelector)
│   │
│   ├── types/
│   │   ├── api.ts                  # API request/response types
│   │   ├── analysis.ts             # Analysis result types
│   │   └── common.ts               # Global types
│   │
│   ├── utils/
│   │   ├── formatters.ts           # Format scores, dates, numbers
│   │   ├── validators.ts           # Form validation rules
│   │   ├── pdfGenerator.ts         # PDF report generation
│   │   └── errorHandler.ts         # Error message mapping
│   │
│   ├── styles/
│   │   ├── index.css               # Global styles
│   │   ├── variables.css           # CSS variables (colors, spacing)
│   │   └── responsive.css          # Mobile breakpoints
│   │
│   ├── App.tsx                     # Main app component + routing
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Global CSS reset
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
└── .env.example
```

---

## 🎨 UI/UX Design

### Layout & Flow

```
┌─────────────────────────────────────────────────────┐
│                    HEADER + LOGO                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────┐     ┌──────────────────┐   │
│  │ UPLOAD SECTION     │     │  JOB DESC INPUT  │   │
│  │ (Drag & Drop)      │────▶│                  │   │
│  │ [Choose File]      │     │  [Paste or type] │   │
│  │                    │     │  [Analyze]       │   │
│  └────────────────────┘     └──────────────────┘   │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │           RESULTS SECTION                      │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐ ┌────────┐ │
│  │  │ SCORE  │  │SKILLS  │  │ YEARS  │ │EDUCATION
│  │  │ 85/100 │  │ Python │  │  5 yrs │ │ B.Tech
│  │  │        │  │ Java   │  │        │ │ AWS Cert
│  │  │  Good  │  │ React  │  │        │ │ ________
│  │  └────────┘  └────────┘  └────────┘ └────────┘ │
│  │                                                │ │
│  │  [Download Report as PDF]  [Analyze Again]   │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Key Sections

#### 1. **Header**
- Logo + Project name (left)
- Navigation links (right): Home, History (future)
- Color scheme: Professional blue/white or dark mode toggle

#### 2. **Upload Section**
- Drag-and-drop zone for PDF/text files
- File picker button as fallback
- File name display + file size validation
- Error states for large files or wrong formats

#### 3. **Job Description Input**
- Large textarea for pasting job description
- Character counter (0/5000)
- Clear button
- Optional: Saved job templates (future feature)

#### 4. **Analysis Results**
- **Score Card:** Big visual score (0-100) with color coding:
  - 🔴 0-40: Poor fit
  - 🟡 41-70: Moderate fit
  - 🟢 71-100: Excellent fit
- **Skills Card:** Extracted skills in pill/tag format with proficiency levels (optional)
- **Experience Card:** Years of experience breakdown by role
- **Education Card:** Degrees, certifications, training
- **Additional Insights:** Gaps, highlights, recommendations

#### 5. **Report Section**
- PDF preview (optional)
- Download button with spinner feedback
- Email report option (future)

---

## 🔌 Backend API Integration

### Required API Endpoints (Backend must provide)

```python
# Endpoint: POST /api/v1/analyze
# Request:
{
  "resume_text": "string (required)",
  "job_description": "string (optional)",
  "file_type": "pdf | text"
}

# Response (200 OK):
{
  "status": "success",
  "analysis_id": "uuid",
  "extracted_data": {
    "skills": [
      {"name": "Python", "proficiency": "expert"},
      {"name": "React", "proficiency": "intermediate"}
    ],
    "years_of_experience": 5,
    "education": [
      {"degree": "B.Tech", "field": "Computer Science", "year": 2019}
    ],
    "certifications": [
      {"name": "AWS Solutions Architect", "year": 2023}
    ]
  },
  "fit_score": null | 85,  # Only if job_description provided
  "generated_at": "2026-05-15T10:30:00Z"
}

# Error Response (400):
{
  "status": "error",
  "message": "Invalid file type",
  "errors": [...]
}
```

### Frontend → Backend Communication

1. **File Upload Flow:**
   - User selects PDF → Extract text using `pdfjs-dist` (browser-side)
   - OR paste text directly
   - Send to `/api/v1/analyze`

2. **Error Handling:**
   - Network errors → Show retry button
   - Invalid resume → Show specific error message
   - File too large → Reject before upload

3. **Loading States:**
   - Show spinner while backend analyzes ("Processing resume...")
   - Disable buttons during request
   - Timeout after 30 seconds with error

---

## 📦 Component Details

### Key Components to Build

#### 1. **UploadSection.tsx**
- React Dropzone for drag-and-drop
- File validation (type + size)
- Show file name after selection
- Error boundary for file errors
- Props: `onFileSelect(file: File)`

#### 2. **ResultsPanel.tsx**
- Conditional rendering based on `analysisState.status`
- Display all extracted data in card layout
- Handle empty/null values gracefully
- Props: `analysis: AnalysisResult`

#### 3. **ScoreCard.tsx**
- Circular progress indicator (85/100)
- Color gradient based on score
- Verbal description ("Excellent match")
- Animation on load
- Props: `score: number`

#### 4. **SkillsCard.tsx**
- Chip/tag list of skills
- Optional proficiency badges
- Search/filter (future feature)
- Props: `skills: Skill[]`

#### 5. **ReportDownload.tsx**
- HTML2PDF generation on client-side
- Copy button for email
- Share button (future)
- Props: `analysis: AnalysisResult, resume_text: string`

---

## 🔄 State Management (Redux Toolkit)

### Redux Slices

#### `analysisSlice.ts`
```typescript
interface AnalysisState {
  analysis: AnalysisResult | null
  resumeText: string
  jobDescription: string
  analysisId: string | null
  history: AnalysisResult[]
}

// Actions:
// - setResumeText(text: string)
// - setJobDescription(text: string)
// - submitAnalysis(ThunkAction)
// - clearAnalysis()
// - fetchHistory()
```

#### `uiSlice.ts`
```typescript
interface UIState {
  isLoading: boolean
  error: string | null
  successMessage: string | null
  selectedTab: "upload" | "results" | "history"
}

// Actions:
// - setLoading(boolean)
// - setError(string)
// - clearError()
// - setTab(tab)
```

---

## 🎯 Implementation Phases

### Phase 1: Core UI Setup (3-4 days)
- [ ] Set up React + TypeScript + Vite project
- [ ] Install MUI or Tailwind + shadcn/ui
- [ ] Create layout components (Header, Footer)
- [ ] Set up routing (React Router)
- [ ] Create mock data for development
- [ ] Output: Basic layout skeleton with routing

### Phase 2: Upload & Input Components (3-4 days)
- [ ] Build UploadSection with drag-drop
- [ ] Build JobDescSection textarea
- [ ] Connect to Redux store
- [ ] Add file validation
- [ ] Add error messages
- [ ] Output: Functional upload flow

### Phase 3: API Integration (3-4 days)
- [ ] Create Axios API client + interceptors
- [ ] Build Redux thunks for API calls
- [ ] Connect submit button to backend
- [ ] Handle loading states
- [ ] Add error handling + retry logic
- [ ] Output: End-to-end analysis flow working

### Phase 4: Results Display (3-4 days)
- [ ] Build ResultsPanel component
- [ ] Create ScoreCard with visualization
- [ ] Build SkillsCard, ExperienceCard, EducationCard
- [ ] Add responsive card layout
- [ ] Add data formatting utilities
- [ ] Output: Beautiful results display

### Phase 5: Report & Polish (2-3 days)
- [ ] Implement PDF download (html2pdf)
- [ ] Add loading spinners + animations
- [ ] Mobile responsiveness
- [ ] Dark mode toggle (optional)
- [ ] Add success notifications
- [ ] Performance optimization
- [ ] Output: Production-ready UI

### Phase 6: Testing & Deployment (2 days)
- [ ] Write unit tests for components
- [ ] Write integration tests for Redux
- [ ] Update Docker Compose frontend service
- [ ] Test full stack locally
- [ ] Clean up console warnings
- [ ] Output: Tested, deployable UI

---

## 📝 Dependencies to Add

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.3",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "react-dropzone": "^14.2.3",
    "pdfjs-dist": "^3.11.174",
    "html2pdf.js": "^0.10.1",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vitest": "^0.34.6",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.4"
  }
}
```

---

## ✅ Acceptance Criteria

- [ ] Upload resume (PDF or text) works end-to-end
- [ ] Backend `/api/v1/analyze` returns structured data
- [ ] Frontend displays extracted skills, experience, education
- [ ] Fit score (0-100) displays with color coding
- [ ] Download PDF report button works
- [ ] All forms have validation feedback
- [ ] Loading states show during processing
- [ ] Errors display user-friendly messages
- [ ] Mobile responsive on tablets & phones
- [ ] Lighthouse score >80 (performance, accessibility, best practices)
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari, Edge

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd frontend
npm install

# Add new dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run type-check
```

---

## 📋 Deliverables

1. ✅ React component library (reusable, well-typed)
2. ✅ Redux store + slices (centralized state)
3. ✅ API service layer (clean abstraction)
4. ✅ Responsive CSS/styling
5. ✅ Unit & integration tests
6. ✅ Updated Docker Compose for frontend
7. ✅ Environment variables (.env.example)
8. ✅ Documentation (component README, setup guide)

---

## 🔮 Future Enhancements (Post-MVP)

- Analysis history/saved reports
- User authentication + accounts
- Batch resume upload
- Compare multiple candidates
- Export to CSV/Excel
- Email report delivery
- Dark mode
- Mobile app (React Native)
- Advanced NLP (duplicate detection, profile matching)

---

## 👤 Assigned To

> [To be filled after review]

## 🗓️ Timeline

**Estimated:** 2-3 weeks  
**Start:** 2026-05-15  
**Target Completion:** 2026-06-01

---

## 📞 Open Questions

1. Should we use Tailwind CSS + shadcn/ui or Material-UI (MUI)?
2. Do we need analysis history in v1 or keep it simple (MVP)?
3. Should we add authentication in v1 or v2?
4. What's the preferred color scheme (blue/white or custom)?
5. Should the app work offline or always require backend connection?

---

## 📝 Notes

- Keep components small and focused (Single Responsibility Principle)
- Use TypeScript strictly for type safety
- Test redux logic thoroughly before UI changes
- Plan for mobile-first design
- Optimize bundle size (lazy load components)
- Ensure CORS is working between frontend (3000) and backend (8000)

