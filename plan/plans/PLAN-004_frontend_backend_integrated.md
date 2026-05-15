# PLAN-004: Frontend UI + Backend API Integration — Build Together

**Status:** 📋 Ready for Review  
**Created:** 2026-05-15  
**Priority:** High (MVP Critical Path)  
**Approach:** Frontend UI and Backend API developed in parallel, integrated at each step

---

## Objective

Build the **complete Resume Analyzer application end-to-end** by developing frontend UI components and backend API endpoints simultaneously. Each major component (upload → analyze → display results) will have both frontend and backend ready at the same time.

**Scope:** This plan combines previous Steps into a cohesive, integrated workflow.

---

## Why Build Together (Not Separately)?

### Old Approach (Sequential)
1. Build all frontend components first (days 1-10)
2. Then build backend endpoints (days 11-15)
3. Then integrate and test (days 16-20)
❌ **Problem:** Can't test until end; long feedback loops; integration issues late

### New Approach (Parallel/Integrated) ✅
1. **Week 1:** Upload Component + PDF Analysis Endpoint
2. **Week 2:** Results Display + Entity Extraction
3. **Week 3:** Reports + Polish

✅ **Benefit:** Test full flow constantly; catch issues early; faster development

---

## Architecture: Full Stack Per Feature

### Feature A: Resume Upload & Text Extraction
```
Frontend (React)              Backend (FastAPI)
┌─────────────────┐           ┌──────────────────┐
│ UploadSection   │ ──POST──> │ /api/v1/upload   │
│ - Drag & drop   │ /api/v1/  │ - Extract text   │
│ - File picker   │ upload    │ - Return clean   │
│ - Loading       │ <─JSON──  │   text           │
└─────────────────┘           └──────────────────┘
```

### Feature B: Analyze Resume
```
Frontend (React)              Backend (FastAPI)
┌─────────────────┐           ┌──────────────────┐
│ ResultsPanel    │ ──POST──> │ /api/v1/analyze  │
│ - Job desc      │ /api/v1/  │ - Extract skills │
│ - Analyze btn   │ analyze   │ - Parse exp/edu  │
│ - Loading       │ <─JSON──  │ - Score fit      │
└─────────────────┘           └──────────────────┘
```

### Feature C: Display Results & Download
```
Frontend (React)              Backend (FastAPI)
┌─────────────────┐           ┌──────────────────┐
│ Results Display │           │ Report data      │
│ - Score card    │ ◄─────────┤ (from Step B)    │
│ - Skills        │           │                  │
│ - PDF download  │           │                  │
└─────────────────┘           └──────────────────┘
```

---

## Detailed Plan Structure

### **Phase 1: Upload & Text Extraction (3-4 days)**

#### Frontend Tasks (Phase 1)
- [ ] Build `UploadSection` component
  - Drag & drop zone (react-dropzone)
  - File picker button
  - File validation (type, size)
  - Show file name + remove button
  - Loading spinner while uploading

- [ ] Build `JobDescSection` component
  - Textarea for job description
  - Character counter
  - Clear button

- [ ] Create API service layer
  - `resumeService.uploadResume()` — POST to `/api/v1/upload`
  - Handle file upload (multipart/form-data)
  - Error handling & user messages

- [ ] Connect to Redux
  - `resumeSlice.setResumeText(text)`
  - `uiSlice.setLoading(true/false)`
  - `uiSlice.setError(message)`

#### Backend Tasks (Phase 1)
- [ ] Create `/api/v1/upload` endpoint
  - Accept: POST with file (PDF/text) or raw text
  - Use: `ResumeExtractor.extract_from_file()` or `.extract_from_string()`
  - Return: `{ status: "success", resume_text: "...", file_type: "pdf" }`
  - Error: Return 400 with error message

- [ ] Add request validation (Pydantic)
  - File size limits (5MB max)
  - File type validation
  - Text length limits

- [ ] Add error handling
  - Catch PDF parse errors
  - Catch file encoding errors
  - Return user-friendly errors

#### Integration Test (Phase 1)
```
1. Upload resume (PDF or text)
   ├─ Frontend shows loading spinner
   └─ Backend extracts text

2. See normalized text on screen (temp display)
   └─ Verify upload worked

3. Display "Ready to analyze" message
```

---

### **Phase 2: Analysis & Entity Extraction (4-5 days)**

#### Frontend Tasks (Phase 2)
- [ ] Build `ResultsPanel` component
  - Show: analysis loading state
  - Show: extracted data once ready
  - Show: fit score (if job description provided)

- [ ] Build result display cards:
  - `ScoreCard` — 0-100 score with color (red/yellow/green)
  - `SkillsCard` — List of extracted skills
  - `ExperienceCard` — Years of experience + job titles
  - `EducationCard` — Degrees, certifications

- [ ] Create analyze API call
  - `resumeService.analyzeResume(resumeText, jobDescription)`
  - POST to `/api/v1/analyze`
  - Handle loading state
  - Display results or error

- [ ] Connect to Redux
  - `analysisSlice.setAnalysis(result)`
  - Store in history
  - `uiSlice.setActiveTab('results')`

#### Backend Tasks (Phase 2)
- [ ] Implement `/api/v1/analyze` endpoint
  - Accept: POST with `{ resume_text, job_description? }`
  - Use: `ResumeParser.extract_skills()` — Return Skill[] with proficiency
  - Use: `ResumeParser.extract_experience()` — Return years, titles
  - Use: `ResumeParser.extract_education()` — Return Education[]
  - Return: Full `AnalyzeResumeResponse`

- [ ] Implement skill extraction using spaCy
  - Load pre-trained spaCy model
  - Match against 130+ skill database
  - Assign proficiency (beginner/intermediate/expert) based on context

- [ ] Implement experience parsing
  - Use regex + NER to find job titles
  - Parse years of experience from text
  - Extract company names if present

- [ ] Implement education parsing
  - Detect degrees (BS, MS, PhD, etc.)
  - Find certifications (AWS, Azure, GCP, etc.)
  - Extract graduation years

- [ ] (Optional) Implement fit scoring
  - Compare resume skills vs job description skills
  - Score 0-100 based on match %
  - Return matching_skills, missing_skills

#### Integration Test (Phase 2)
```
1. Upload resume → see extracted skills, experience, education
   ├─ Frontend displays ResultsPanel with cards
   └─ Backend returns structured ExtractedData

2. Add job description → see fit score
   ├─ Frontend shows score 0-100 with color
   └─ Backend calculates match

3. Results persist and display correctly
```

---

### **Phase 3: Reports & Download (2-3 days)**

#### Frontend Tasks (Phase 3)
- [ ] Build `ReportPreview` component
  - Show PDF preview (html2pdf or react-pdf)
  - Display formatted analysis data
  - "Download Report" button

- [ ] Implement PDF generation
  - Use html2pdf to convert results to PDF
  - Include: resume summary, skills, score, match details
  - Download as `analysis-{timestamp}.pdf`

- [ ] Build `History` tab
  - List past analyses
  - Click to view previous results
  - Delete option

- [ ] Polish & responsive design
  - Mobile optimization
  - Dark mode toggle
  - Error messages
  - Success notifications

#### Backend Tasks (Phase 3)
- [ ] (Optional) Add analysis history endpoint
  - GET `/api/v1/history` — Return list of past analyses
  - POST `/api/v1/history/{id}` — Retrieve specific analysis
  - DELETE endpoint for cleanup

- [ ] Add PDF generation endpoint (optional)
  - POST `/api/v1/report` with analysis data
  - Return PDF file download

#### Integration Test (Phase 3)
```
1. Full flow: Upload → Analyze → Download Report
   ├─ Works end-to-end
   └─ All data flows correctly

2. View history of past analyses

3. All UI looks good, responsive
```

---

## Day-by-Day Timeline

### **Start Date: 2026-05-16 (Friday)**

```
Week 1: Upload + Analysis Foundation
┌─────────────────────────────────────────────────────────┐
│ Day 1 (Fri)   | Setup folder structure + Redux store   │
│ Day 2 (Mon)   | Upload component (frontend)             │
│ Day 3 (Tue)   | /api/v1/upload endpoint (backend)       │
│ Day 4 (Wed)   | Test upload flow end-to-end             │
│ Day 5 (Thu)   | Skill extraction implementation         │
└─────────────────────────────────────────────────────────┘

Week 2: Entity Extraction + Display
┌─────────────────────────────────────────────────────────┐
│ Day 6 (Fri)   | /api/v1/analyze endpoint (backend)      │
│ Day 7 (Mon)   | Extract skills + experience (NLP)       │
│ Day 8 (Tue)   | ResultsPanel + display cards (frontend) │
│ Day 9 (Wed)   | Test analysis flow end-to-end           │
│ Day 10 (Thu)  | Fit scoring algorithm + integration     │
└─────────────────────────────────────────────────────────┘

Week 3: Reports + Polish
┌─────────────────────────────────────────────────────────┐
│ Day 11 (Fri)  | PDF report generation (frontend)        │
│ Day 12 (Mon)  | History page + backend storage (opt)    │
│ Day 13 (Tue)  | Mobile responsiveness + dark mode       │
│ Day 14 (Wed)  | Bug fixes + testing                     │
│ Day 15 (Thu)  | Final polish + deployment ready        │
└─────────────────────────────────────────────────────────┘

✅ MVP Ready: May 30, 2026 (15 days from start)
```

---

## Implementation Order (Recommended)

### **Step 1: Setup Foundation (1 day)**
- [ ] Create frontend folder structure (components/, pages/, services/, store/, types/, utils/)
- [ ] Initialize Redux store with slices (analysisSlice, uiSlice)
- [ ] Create Axios API client with `/api` base URL
- [ ] Create TypeScript interfaces for API requests/responses
- [ ] Update `App.tsx` with routing (HomePage, HistoryPage)

**Deliverable:** ✅ Foundation ready for components

### **Step 2: Upload Feature (3 days)**

**Frontend (Days 1-2):**
- Build `UploadSection` component (drag-drop, file picker)
- Build `JobDescSection` component (textarea)
- Create `resumeService.uploadResume()` API call
- Connect to Redux (store resume text)

**Backend (Day 2-3):**
- Create `/api/v1/upload` endpoint using ResumeExtractor
- Add Pydantic request validation
- Test with curl/Postman

**Integration (Day 3):**
- Test full upload flow: select file → API call → see result
- Debug any issues

**Deliverable:** ✅ Upload working end-to-end

### **Step 3: Analysis Feature (3-4 days)**

**Backend (Days 1-2):**
- Implement `/api/v1/analyze` endpoint
- Integrate ResumeParser for skill extraction
- Parse experience and education
- Implement fit scoring

**Frontend (Days 2-3):**
- Build ResultsPanel component
- Build ScoreCard, SkillsCard, ExperienceCard, EducationCard
- Call analyzeResume() API
- Display results with Redux

**Integration (Day 3-4):**
- Test full analysis flow
- Verify all data displays correctly

**Deliverable:** ✅ Analysis working end-to-end

### **Step 4: Reports + Polish (2-3 days)**

**Frontend (Days 1-2):**
- Add PDF download functionality
- Build History page
- Mobile responsiveness

**Backend (Optional):**
- Add history endpoints
- PDF generation endpoint

**Deliverable:** ✅ MVP complete

---

## API Endpoints to Build

### Upload Resume
```
POST /api/v1/upload
Content-Type: multipart/form-data

Request:
  - file: File (PDF or TXT, max 5MB)
  - OR raw_text: string (alternative)

Response (200 OK):
{
  "status": "success",
  "resume_text": "John Doe\n5 years Python...",
  "file_type": "pdf"
}

Error (400):
{
  "status": "error",
  "message": "File is too large (max 5MB)"
}
```

### Analyze Resume
```
POST /api/v1/analyze
Content-Type: application/json

Request:
{
  "resume_text": "John Doe\n5 years Python...",
  "job_description": "5+ years Python, React, AWS..."
}

Response (200 OK):
{
  "status": "success",
  "analysis_id": "uuid-123",
  "extracted_data": {
    "skills": [
      {"name": "Python", "proficiency": "expert"},
      {"name": "React", "proficiency": "intermediate"}
    ],
    "years_of_experience": 5,
    "education": [
      {"degree": "BS", "field": "Computer Science", "year": 2019}
    ],
    "certifications": [
      {"name": "AWS Solutions Architect", "year": 2023}
    ]
  },
  "fit_score": 85,
  "fit_details": {
    "matching_skills": ["Python", "React", "AWS"],
    "missing_skills": ["Kubernetes"],
    "experience_match": "Excellent (5 years required)"
  },
  "generated_at": "2026-05-16T10:30:00Z"
}

Error (400):
{
  "status": "error",
  "message": "Resume is empty"
}
```

### Get Analysis History (Optional)
```
GET /api/v1/history

Response:
{
  "status": "success",
  "history": [
    {
      "analysis_id": "uuid-1",
      "timestamp": "2026-05-16T10:30:00Z",
      "resume_filename": "john-doe.pdf",
      "fit_score": 85
    }
  ]
}
```

---

## Frontend Components to Build

### Phase 1
- [ ] `Header` — Logo, navigation
- [ ] `UploadSection` — Drag-drop, file picker, loading
- [ ] `JobDescSection` — Textarea for job description
- [ ] Layout with tabs (upload/results/history)

### Phase 2
- [ ] `ResultsPanel` — Container for results
- [ ] `ScoreCard` — Score 0-100 with color coding
- [ ] `SkillsCard` — List of skills with chips
- [ ] `ExperienceCard` — Years, titles, companies
- [ ] `EducationCard` — Degrees, certifications
- [ ] `LoadingSpinner` — Show during analysis

### Phase 3
- [ ] `ReportPreview` — PDF preview
- [ ] `HistoryPage` — List of past analyses
- [ ] `ReportDownload` — Download button

---

## Backend Functions to Implement

### Phase 1
- [ ] Create `src/api/routes.py` with FastAPI router
- [ ] Implement `/api/v1/upload` endpoint
- [ ] Use `ResumeExtractor.extract_from_file()` or `.extract_from_string()`
- [ ] Add request validation (Pydantic)
- [ ] Error handling

### Phase 2
- [ ] Implement `/api/v1/analyze` endpoint
- [ ] Implement `ResumeParser.extract_skills()` using spaCy
- [ ] Implement `ResumeParser.extract_experience()` with regex + NER
- [ ] Implement `ResumeParser.extract_education()` with pattern matching
- [ ] Implement fit scoring algorithm
- [ ] Add unit tests for each extractor

### Phase 3 (Optional)
- [ ] Implement `/api/v1/history` endpoint
- [ ] Add SQLite/database storage for analysis history
- [ ] Implement PDF generation endpoint

---

## Questions for Review

Before implementation, please confirm:

1. ✅ **Build Frontend + Backend Together?**
   - Yes, proceed with parallel development approach?
   - Or stick with sequential?

2. ✅ **Priority: Which Phase should we start with?**
   - Start with Phase 1 (Upload) this week?
   - Or do all three phases together?

3. ✅ **Fit Scoring Required in MVP?**
   - Include fit score 0-100 calculation?
   - Or skip for v1 and add in v2?

4. ✅ **History/Storage Required?**
   - Save analysis history to database?
   - Or keep simple (no persistence) for v1?

5. ✅ **Ready for detailed Step-by-Step breakdown?**
   - Should I create PLAN-004 Step 1 (Setup Foundation)?

---

## Expected Outcomes

### After Phase 1 (End of Week 1)
✅ User can upload resume PDF/text  
✅ Backend extracts and normalizes text  
✅ Full upload flow tested end-to-end

### After Phase 2 (End of Week 2)
✅ Backend analyzes resume (extracts skills, experience, education)  
✅ Frontend displays results in beautiful cards  
✅ Fit score calculated if job description provided  
✅ Full analysis flow tested end-to-end

### After Phase 3 (End of Week 3)
✅ User can download results as PDF  
✅ History of past analyses available  
✅ App is mobile responsive  
✅ **MVP complete and production-ready** 🎉

---

## Success Criteria

- [ ] All API endpoints respond correctly (tested with curl/Postman)
- [ ] Frontend components render without errors
- [ ] Redux store updates correctly
- [ ] Full flow tested: Upload → Analyze → Display → Download
- [ ] Mobile responsive on tablets & phones
- [ ] Error handling works (file too large, bad format, etc.)
- [ ] No console errors or warnings
- [ ] Unit tests pass for extractors and parsing
- [ ] Lighthouse score >80 on performance

---

## Deployment Checklist (After Phase 3)

- [ ] All tests passing
- [ ] No security vulnerabilities (npm audit, pip audit)
- [ ] Environment variables configured
- [ ] Docker images built and tested
- [ ] Frontend build optimized (tree-shake, minify)
- [ ] Backend error logging configured
- [ ] CORS properly configured
- [ ] Rate limiting (optional)
- [ ] Deployed to staging
- [ ] Final testing before production

---

## References

- React: https://react.dev
- FastAPI: https://fastapi.tiangolo.com
- Redux: https://redux-toolkit.js.org
- spaCy: https://spacy.io
- react-dropzone: https://react-dropzone.js.org

