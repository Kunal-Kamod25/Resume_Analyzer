# Resume Analyzer

**AI-powered resume analyzer for IT recruiters** using Natural Language Processing (NLP).

Quickly assess technical resumes, extract key information (skills, experience, certifications, education), and score candidate fit against job descriptions.

---

## 🎯 Features

- **Resume Analysis:** Extract skills, years of experience, education, and certifications from resumes (PDF or plain text)
- **Fit Scoring:** Score how well a resume matches a job description (0–100 scale)
- **Fast Processing:** < 5 seconds per resume
- **Privacy-First:** Resumes processed in-memory; never stored
- **Offline Support:** Works locally via Docker; no cloud API dependency
- **Exportable Reports:** Generate PDF summaries of analysis

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Python 3.11 + FastAPI |
| **NLP** | spaCy + Hugging Face Transformers |
| **Frontend** | React 18 + TypeScript |
| **PDF & Text** | PyPDF2 + pdfplumber |
| **Testing** | pytest + React Testing Library |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose installed
- Git

### Setup (< 5 minutes)

```bash
# Clone the repository
git clone https://github.com/Kunal-Kamod25/Resume_Analyzer.git
cd Resume_Analyzer

# Copy environment variables
cp .env.example .env

# Start the development stack
docker-compose up
```

Services will start at:
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Frontend:** http://localhost:3000

---

## 📝 Project Structure

```
Resume_Analyzer/
├── .github/workflows/          # GitHub Actions CI/CD
├── src/                        # Backend source code
│   ├── main.py                # FastAPI entrypoint
│   ├── nlp/                   # NLP logic (extraction, scoring)
│   ├── api/                   # REST endpoints
│   └── ...
├── frontend/                   # React SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── tests/                      # Backend tests
├── docs/                       # Documentation
├── plan/                       # AGENT_MD plans and reports
├── docker-compose.yml          # Development stack
├── Dockerfile                  # Backend image
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── spec.md                     # Project specification
└── README.md                   # This file
```

---

## 📖 Documentation

- **[Detailed Setup Guide](docs/SETUP.md)** — In-depth local dev setup, troubleshooting
- **[Project Specification](spec.md)** — Full requirements, tech stack, features
- **[Plans & Reports](plan/)** — Tracked work items, implementation decisions
- **[API Documentation](http://localhost:8000/docs)** — Interactive API docs (Swagger UI) when backend is running

---

## 🔧 API Overview

### POST `/api/v1/analyze`
Analyze a resume and score fit against a job description.

**Request:**
```json
{
  "resume_text": "John Doe\n5 years Python developer...",
  "job_description": "We seek a Senior Python developer with AWS experience..."
}
```

**Response:**
```json
{
  "skills": ["Python", "AWS", "Docker"],
  "years_experience": 5,
  "education": ["B.S. in Computer Science"],
  "certifications": ["AWS Solutions Architect"],
  "fit_score": 87,
  "fit_reasoning": "Strong skills match; experience level exceeds requirement"
}
```

### GET `/api/v1/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src

# Run specific test file
pytest tests/test_extractor.py -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests (E2E)
```bash
# Coming in Feature 5
```

---

## 🐳 Docker Commands

```bash
# Start all services (development mode)
docker-compose up

# Rebuild images
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## 🔒 Security

- ✅ No secrets in git history — `.env` is in `.gitignore`
- ✅ Environment variables managed via `.env.example` template
- ✅ Resumes processed in-memory only; never persisted to disk
- ✅ GitHub Actions checks for secrets on every push
- ✅ Dependencies scanned for CVEs during CI

**Before commiting:**
```bash
# Verify no secrets in git
git log --all -p | grep -i "secret\|password\|api.key"  # Should return nothing
```

---

## 📊 Development Workflow

We follow the **AGENT_MD framework** for structured, AI-assisted development:

1. **Specification** — `spec.md` defines what we're building
2. **Plans** — `plan/plans/PLAN-*.md` breaks down each feature
3. **Implementation** — Code written test-first (TDD)
4. **Reports** — `plan/reports/REPORT-*.md` documents what was done
5. **Reconciliation** — `reconciliation-*.md` tracks spec vs. reality

**Current Status:**
- ✅ **PLAN-001:** Feature 0 (Pre-Work: Setup & Security) — In Progress
- [ ] **PLAN-002:** Feature 1 (NLP Extraction) — Not Started
- [ ] **PLAN-003:** Feature 2 (Fit Scoring) — Not Started
- [ ] **PLAN-004:** Feature 3 (API Endpoints) — Not Started
- [ ] **PLAN-005:** Feature 4 (Frontend UI) — Not Started
- [ ] **PLAN-006:** Feature 5 (E2E Testing) — Not Started
- [ ] **PLAN-007:** Feature 6 (Deployment) — Not Started

---

## 🐛 Troubleshooting

### `docker-compose up` fails
```bash
# Rebuild images
docker-compose down --volumes
docker-compose up --build
```

### Port 8000 or 3000 already in use
```bash
# Change ports in docker-compose.yml
# Or kill the process using the port:
lsof -i :8000
kill -9 <PID>
```

### Dependency conflicts
```bash
# Reinstall dependencies
docker-compose down
docker-compose up --build
```

### Tests fail locally but pass in CI
```bash
# Run inside Docker
docker-compose exec backend pytest tests/ -v
```

---

## 📦 Deployment (Future)

### v1.0 Deployment (Coming in Feature 6)
- Local Docker: `docker build -t resume-analyzer . && docker run -p 8000:8000 resume-analyzer`
- Cloud: AWS Lambda + Vercel (optional; documented but not v1.0 priority)

### Requirements for Deployment
- ✅ All tests passing
- ✅ No secrets in code
- ✅ Environment variables externalized
- ✅ Docker image production-optimized

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes following [project conventions](plan/rules.md)
3. Write tests first (TDD)
4. Submit a pull request
5. Ensure CI passes

---

## 📋 Project Status

**Version:** 1.0 (In Planning)  
**Team:** 1–2 developers (part-time)  
**Timeline:** MVP by June 30, 2026  
**Budget:** < $20/month infra cost  

---

## 📞 Support

- **Issues?** Check [Troubleshooting](#-troubleshooting) or open a GitHub issue
- **Questions?** See [Documentation](#-documentation)
- **Contributions?** Read [Contributing](#-contributing)

---

## 📄 License

MIT License — Use freely in your projects.

---

**Last Updated:** 2026-05-15  
**Maintained by:** Team Resume_Analyzer

1. Copy the `AGENT_MD/` folder into your project root.
2. At the start of each AI session, paste:
   ```
   Here is my project spec (see AGENT_MD/spec.md). Today we are implementing
   [FEATURE NAME]. Follow the rules in AGENT_MD/plan/rules.md when writing
   plans or reports. Use TDD: write tests first, get my approval, then implement.
   ```

## How to Use

### 0. Generate your `spec.md` (recommended for new projects)

Instead of filling in the blank template manually, run the AI-guided initialiser:

```
Follow AGENT_MD/spec_init.md. My raw project idea is: [paste your brain dump here]
```

The agent will interview you, fill any gaps, and write a complete `AGENT_MD/spec.md` for you.
If you prefer to fill it in manually, open `AGENT_MD/spec.md` directly.

### 1. Customise `spec.md`

Fill in your project overview, tech stack, architectural principles, codebase inventory, and feature index.

### 2. Populate `current_state_report.md`

Do an initial audit of your codebase and fill in the source code inventory, known issues, and operational status.

### 3. Start a plan/report cycle

When you begin a new feature or fix:

1. Copy `plan/plans/PLAN-000_template.md` to `plan/plans/PLAN-NNN_slug.md`
2. Fill in all sections; set status to `Draft`
3. Change status to `In-Progress` when you start work
4. When done, copy `plan/reports/REPORT-000_template.md` to `plan/reports/REPORT-NNN_slug.md`
5. Mark the plan `Completed`
6. Update `current_state_report.md` with a summary of what changed

### 4. Reconcile periodically

When the spec and reality drift apart, create a new `reconciliation-NNN.md` (copy and increment the serial) to identify gaps and prioritise fixes.

## Key Principles

- **Plans are forward-looking** — what will be done, with task breakdowns and risks
- **Reports are backward-looking** — what was done, with evidence and lessons learned
- **Plan NNN → Report NNN** — every report matches its plan by serial number
- **Test-first workflow** — write tests before implementation
- **Tables over prose** — structured data is easier for AI agents to parse
- **Concrete over vague** — "Add retry loop in `downloader.py:fetch()`" not "improve error handling"


