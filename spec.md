# Resume Analyzer — Project Specification

> **Version:** 1.0
> **Created:** 2026-05-14
> **Last Updated:** 2026-05-14
> **Status:** 🟡 In Planning
>
> Living document — the AI agent updates **Codebase Inventory**, **Decision Log**, and **Current Focus**
> at the end of every working session. Do not edit those sections manually.

---

## Current Focus

- ✅ **Feature 0 (Pre-Work) completed**: Repository setup, Docker Compose, CI/CD, dependencies pinned, documentation
- 📅 **Next: Feature 1 (NLP Extraction)** — Create PLAN-002 for resume text extraction and skill parsing

---

## ⚠️ Critical Pre-Work (Do Before Any Feature Work)

- [ ] Initialize git repository with `.gitignore` (Python, node_modules, .env, __pycache__)
- [ ] Set up environment variable management (`.env` + `.env.example`)
- [ ] Audit and pin critical dependencies (no known CVEs)
- [ ] Set up CI/CD pipeline skeleton (GitHub Actions)
- [ ] Create initial project directory structure (`src/`, `tests/`, `frontend/`, `docs/`)
- [ ] Rotate and remove any exposed API keys from git history

---

## Project Overview

**Resume Analyzer** is an AI-powered web application that helps IT recruiters quickly assess technical resumes using Natural Language Processing (NLP). The app extracts key information (skills, experience, certifications, education), scores candidate fit against job descriptions, and flags relevant experience gaps or highlights. Recruiters save time on manual resume screening and make data-informed hiring decisions.

### Problem Statement

Recruiters manually review dozens of resumes per day, manually extracting skills, experience levels, and fit against open roles. This is time-consuming, inconsistent, and often misses qualified candidates. There is no standardized way to score and rank candidates based on technical qualifications.

### Target Users

- **Primary:** IT recruiters and hiring managers at staffing agencies and corporate HR departments
- **Secondary:** Job seekers who want a free resume feedback tool
- **Needs:** Fast resume analysis (< 5 seconds), actionable insights (skills extracted, fit scored), exportable reports

### Current Operational Reality (as of 2026-05-14)

Greenfield project. No existing codebase. Starting from scratch with this framework.

---

## Success Criteria (v1.0)

- [ ] Recruiters can upload a PDF or text resume and get analysis within 5 seconds
- [ ] App extracts: skills, experience years, certifications, education
- [ ] App scores resume fit (0–100) against a job description pasted by recruiter
- [ ] Users can generate and download an analysis report (PDF)
- [ ] At least 3 sample IT job descriptions work end-to-end
- [ ] Test suite passes with >80% coverage on core NLP logic
- [ ] App runs locally via Docker Compose
- [ ] No API keys or credentials in git history

---

## Constraints & Non-Negotiables

- **Team:** 1–2 developers (part-time)
- **Timeline:** MVP in 6 weeks (by end of June 2026)
- **Budget:** Infra must stay under $20/month (if deployed)
- **Compliance:** No sensitive personal data stored long-term; resumes deleted after analysis (privacy-first)
- **Non-negotiables:** Must work offline for local analysis; must support PDF and plain text resumes; must be deployable on any machine via Docker

---

## Tech Stack

### Current (planned for v1.0)

| Layer | Technology | Notes |
|---|---|---|
| Language | Python 3.11 | Core backend logic |
| Framework | FastAPI | REST API for resume analysis |
| NLP | spaCy + Hugging Face Transformers | Entity extraction, semantic similarity for fit scoring |
| Database | SQLite (local) | Store job descriptions, analysis history (optional; can omit for v1 MVP) |
| Frontend | React 18 + TypeScript | Web UI for uploading resumes, viewing reports |
| PDF Parsing | PyPDF2 + pdfplumber | Extract text from PDFs |
| Testing | pytest + pytest-asyncio | Backend tests |
| Frontend Testing | Jest + React Testing Library | React component tests |
| Containerisation | Docker + Docker Compose | Local dev and easy deployment |
| CI/CD | GitHub Actions | Auto-test on push; no auto-deploy for v1 |

### Target (future; v2.0+)

| Layer | Technology | Notes |
|---|---|---|
| Database | PostgreSQL 15 | Scale beyond local SQLite |
| Cache | Redis 7 | DPC and result caching |
| Auth | JWT (python-jose + React) | User accounts and resume history |
| Deployment | AWS Lambda + S3 | Serverless resume storage; pay-per-use |
| Frontend Host | Vercel | Auto-deploy React app on git push |

---

## Architectural Principles

- **API-first**: Every capability exposed as a versioned REST endpoint (`/api/v1/analyze`, `/api/v1/job-descriptions`)
- **NLP as a service**: NLP logic lives in standalone Python modules, testable without HTTP
- **Privacy-first**: Resumes processed in-memory; never persisted to disk unless user explicitly exports
- **Test-driven**: Write tests for NLP extraction and scoring *before* API integration
- **Stateless backend**: API server is stateless; job descriptions and analysis results passed in requests (no session management for v1)
- **Docker-first**: All dev and prod setup via Docker Compose; no manual dependency installation

---

## Codebase Inventory

| File | Role | Status | Last Updated |
|---|---|---|---|
| `.gitignore` | Git ignore rules (Python, Node, build artifacts) | ✅ Active | 2026-05-15 |
| `.env.example` | Environment variable template (no secrets) | ✅ Active | 2026-05-15 |
| `docker-compose.yml` | Development stack: backend + frontend services | ✅ Active | 2026-05-15 |
| `Dockerfile` | Backend Python image | ✅ Active | 2026-05-15 |
| `frontend/Dockerfile` | Frontend React image | ✅ Active | 2026-05-15 |
| `requirements.txt` | Pinned Python dependencies | ✅ Active | 2026-05-15 |
| `package.json` | Pinned Node.js dependencies | ✅ Active | 2026-05-15 |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD pipeline | ✅ Active | 2026-05-15 |
| `README.md` | Project overview and quick start guide | ✅ Active | 2026-05-15 |
| `docs/SETUP.md` | Detailed development setup guide | ✅ Active | 2026-05-15 |
| `src/main.py` | FastAPI application entrypoint (stub) | ✅ Active | 2026-05-15 |
| `tests/__init__.py` | Test package marker | ✅ Active | 2026-05-15 |
| `plan/rules.md` | Plan & Report authoring conventions | ✅ Active | 2026-05-14 |
| `plan/plans/PLAN-001_setup_security.md` | Feature 0 implementation plan | ✅ Completed | 2026-05-15 |
| `plan/reports/REPORT-001_setup_security.md` | Feature 0 implementation report | ✅ Active | 2026-05-15 |

---

## Feature Index

| # | Feature | Status | Priority | Notes |
|---|---|---|---|---|
| 0 | Pre-Work: Setup + Security + Dependencies | ✅ Complete | P0 | Docker Compose, .gitignore, CI/CD, docs created |
| 1 | NLP Core: Resume Text Extraction & Skill Parsing | [ ] | P0 | Extract text from PDF/plain text; identify skills, experience, education |
| 2 | NLP Core: Resume-to-Job Fit Scoring | [ ] | P0 | Score how well a resume matches a job description (0–100 scale) |
| 3 | API Layer: Analysis Endpoints | [ ] | P0 | REST endpoints for upload, analyze, export |
| 4 | Frontend: Upload & Display Results | [ ] | P1 | React UI for resume upload, results display, export PDF |
| 5 | Integration & End-to-End Testing | [ ] | P1 | Full E2E flow: upload → analyze → export |
| 6 | Deployment & Documentation | [ ] | P2 | Docker Compose, README, deployment guide |

---

## Known Issues & Technical Debt

- None yet (greenfield project).

---

## Known Unknowns

- **Exact job description format:** Will they be freeform text or structured fields (title, skills, experience required)?
- **Resume parsing accuracy:** How accurately will spaCy + Transformers extract skills from varied resume formats? May need fine-tuning.
- **Fit scoring algorithm:** Exact algorithm TBD; consider cosine similarity (embeddings) vs. rule-based matching.
- **User accounts:** v1 is anonymous (no login). Multi-user support deferred to v2.

---

## Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|---|---|---|---|
| 2026-05-14 | Created v1.0 spec.md | Project initialization; Resume Analyzer for IT recruiters | n/a |
| 2026-05-14 | Python + FastAPI for backend | Fast prototyping with mature NLP libraries (spaCy, HF); async support | Node.js + Express (less NLP integration) |
| 2026-05-14 | React for frontend | Standard SPA framework; good TypeScript support; React Testing Library | Vue (smaller library), Angular (overkill) |
| 2026-05-14 | spaCy + Hugging Face Transformers | Best-in-class open-source NLP; no cloud API dependency | AWS Textract (cost), Azure Cognitive Services (cost) |
| 2026-05-14 | Privacy-first: delete resumes after analysis | GDPR-friendly; builds user trust; no breach liability | Store for analytics (risky) |
| 2026-05-15 | Docker Compose for local dev | All developers get identical environment; no "works on my machine" issues | Manual setup (error-prone), Vagrant (slower) |
| 2026-05-15 | GitHub Actions for CI/CD foundation | Public repo, free tier, easy integration; tests every push | Jenkins (self-hosted), Travis CI (cost) |
| 2026-05-15 | Non-blocking security checks in CI | Reduce friction on initial PRs; reviewers catch issues in follow-up | Strict checks (blocks new contributors) |

---

---

# FEATURE 0 — Pre-Work: Setup & Security

## Goal

Establish a secure, reproducible development environment with all infrastructure and dependencies pinned before any business logic is written.

## Tasks

- [ ] Initialize git repository; set up `.gitignore` (Python, Node, DS artifacts)
- [ ] Create `.env.example` with all required env vars (API keys, DB URLs, etc.)
- [ ] Create Docker Compose file with services: backend (FastAPI), frontend (React dev server), optional SQLite volume
- [ ] Create initial directory structure: `src/`, `tests/`, `frontend/`, `docs/`
- [ ] Pin all Python and Node.js dependencies in `requirements.txt` and `package.json`
- [ ] Verify no secrets committed to git history
- [ ] Set up GitHub Actions CI skeleton (auto-test on push)
- [ ] Create README with local dev setup instructions

## Verification

- `git log --all -p | grep -i secret` returns nothing sensitive
- `docker-compose up` starts all services without errors
- All Python dependencies installable via `pip install -r requirements.txt`
- All Node dependencies installable via `npm install`
- CI runs successfully on empty push

---

# FEATURE 1 — NLP Core: Resume Text Extraction & Skill Parsing

## Goal

Build the foundation NLP module that extracts structured information from resumes (skills, experience years, education, certifications). This is the core engine; all downstream features depend on it working reliably.

## Existing Code to Reference

- None yet (Feature 0 sets up the scaffold).
- Reference data: common IT skills (Python, Java, AWS, Docker, etc.) — store in `src/nlp/data/skills.json`

## Tasks

- [ ] Write tests for skill extraction: test cases cover common IT skills, typos, synonyms (e.g., "Python" = "python", "JS" = "JavaScript")
- [ ] Write tests for experience extraction: e.g., "5 years of Python development" → 5 years
- [ ] Write tests for education parsing: degree, school, graduation year
- [ ] Write tests for certification parsing: AWS certified, GCP certified, etc.
- [ ] Implement `src/nlp/extractor.py` with functions: `extract_skills()`, `extract_experience()`, `extract_education()`, `extract_certifications()`
- [ ] Add spaCy NER model loading and custom entity rules (skills, certifications)
- [ ] Write integration test: sample resume (plain text) → all fields extracted correctly

## Acceptance Criteria

- [ ] All unit tests pass (>85% coverage on extractor module)
- [ ] Sample resume correctly returns: skills list, years of experience, education, certifications
- [ ] Handles edge cases: missing sections, typos, unusual formatting
- [ ] No external API calls (offline-first)
- [ ] Execution time < 500ms per resume

---

# FEATURE 2 — NLP Core: Resume-to-Job Fit Scoring

## Goal

Implement a scoring algorithm that compares a resume (parsed in Feature 1) against a job description and produces a fit score (0–100). This is what recruiters see as the headline result.

## Existing Code to Reference

- `src/nlp/extractor.py` (from Feature 1)

## Tasks

- [ ] Write tests for fit scoring: identical skills (100), partial match (50–70), no match (0–20)
- [ ] Write tests for experience filtering: job requires "3+ years", resume has "5 years" → pass; "1 year" → fail
- [ ] Implement `src/nlp/scorer.py` with function `score_resume_fit(resume_dict, job_description_text) → score_dict`
- [ ] Implement embedding-based similarity: convert resume skills + job requirements to embeddings; compute cosine similarity
- [ ] Implement rule-based filters: years of experience, min education level
- [ ] Write integration test: sample resume + job description → fit score with breakdown

## Acceptance Criteria

- [ ] Fit score algorithm reaches >80% accuracy on sample resumes (manual validation)
- [ ] Returned score includes: overall fit (0–100), skills match%, experience match%, reasoning
- [ ] Execution time < 1 second per comparison
- [ ] Tests pass with 100% green

---

# FEATURE 3 — API Layer: Analysis Endpoints

## Goal

Expose the NLP modules (Features 1–2) as REST API endpoints so the frontend and external tools can call them.

## Existing Code to Reference

- `src/nlp/extractor.py`, `src/nlp/scorer.py` (from Features 1–2)

## Tasks

- [ ] Write tests for `/api/v1/analyze` endpoint: accepts resume (text or PDF base64), job description; returns extracted fields + fit score
- [ ] Write tests for error cases: invalid input, malformed PDF, empty resume
- [ ] Implement `src/api/routes.py` with FastAPI routes
- [ ] Implement POST `/api/v1/analyze`: accept `{ resume_text: string, job_description: string }` → return analysis JSON
- [ ] Implement GET `/api/v1/health`: simple health check
- [ ] Add middleware: request logging, CORS (for frontend), error handling
- [ ] Write integration test: full HTTP request/response cycle

## Acceptance Criteria

- [ ] All endpoints return correct 200/400/500 status codes
- [ ] Response JSON matches specification (skills[], score, reasoning)
- [ ] Tests pass; no regressions in NLP tests
- [ ] API documentation available (FastAPI auto-docs at `/docs`)

---

# FEATURE 4 — Frontend: Upload & Display Results

## Goal

Build the React UI where recruiters upload resumes, input job descriptions, and see analysis results.

## Existing Code to Reference

- `src/api/routes.py` (from Feature 3)

## Tasks

- [ ] Write React component tests for ResumeUpload: file selection, input validation
- [ ] Write React component tests for ResultsDisplay: rendering skills, score, fit breakdown
- [ ] Implement `frontend/src/components/ResumeUpload.tsx`: file input, submission to API
- [ ] Implement `frontend/src/components/JobDescriptionInput.tsx`: textarea for pasting job description
- [ ] Implement `frontend/src/components/ResultsDisplay.tsx`: show extracted data, fit score, visual (progress bar)
- [ ] Implement `frontend/src/components/ExportButton.tsx`: download results as PDF
- [ ] Integrate API calls in App.tsx: connect components to backend endpoints
- [ ] Add basic styling: clean, intuitive layout

## Acceptance Criteria

- [ ] Upload form accepts PDF or text files
- [ ] Results display within 5 seconds of submission
- [ ] All React components render without errors
- [ ] Export PDF includes all analysis data
- [ ] Mobile-responsive layout (tablet + mobile)

---

# FEATURE 5 — Integration & End-to-End Testing

## Goal

Run the entire system end-to-end: upload resume → call API → display results. Ensure all pieces work together.

## Existing Code to Reference

- All features 1–4

## Tasks

- [ ] Write E2E test: Selenium/Cypress script that uploads sample resume, views results
- [ ] Test PDF export: verify PDF content includes skills, score, reasoning
- [ ] Test Docker Compose stack: `docker-compose up` → system ready in < 30 seconds
- [ ] Performance test: measure end-to-end latency (upload → analysis → display)
- [ ] Manual QA: recruiters review and provide feedback on UX, accuracy

## Acceptance Criteria

- [ ] E2E test passes 100% (upload → result → export)
- [ ] System latency < 10 seconds per full cycle
- [ ] Docker stack is reproducible on different machines
- [ ] No broken links or missing assets in frontend

---

# FEATURE 6 — Deployment & Documentation

## Goal

Package the app for real-world use: clear README, deployment guide, docker image ready.

## Existing Code to Reference

- All features 1–5

## Tasks

- [ ] Write comprehensive README: what the app does, how to run locally, how to deploy
- [ ] Create deployment guide: AWS Lambda, Vercel (for frontend) setup (optional for v1, document for v2)
- [ ] Create Docker image: production-optimized (multi-stage build, minimal size)
- [ ] Write API documentation: full endpoint reference, example requests/responses
- [ ] Create sample job descriptions: 3 IT roles for testing
- [ ] Add developer guide: how to extend NLP (add new skills, fine-tune models)

## Acceptance Criteria

- [ ] README is clear and complete; someone new can run the app in < 10 minutes
- [ ] Docker image builds and runs without errors
- [ ] All documentation is in the repo (no external wikis)
- [ ] Sample job descriptions work end-to-end
