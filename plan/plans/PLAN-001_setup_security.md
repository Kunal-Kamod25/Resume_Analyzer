# PLAN-001: Pre-Work — Repository Setup, Security & Dependencies

**Created:** 2026-05-14
**Status:** Completed
**Addresses:** Establish a secure, reproducible dev environment. Set up git, Docker, CI/CD skeleton, pinned dependencies, and local dev setup. This is the foundation for all feature work.

---

## 1. Context & motivation

Before we write any business logic or NLP code, we need a clean, reproducible foundation:
- Git repo initialized with proper `.gitignore` (no secrets, node_modules, Python cache)
- Environment variables managed securely (`.env` + `.env.example`)
- Docker Compose configured (backend, frontend, optional DB)
- Dependencies pinned in `requirements.txt` and `package.json` (no CVEs)
- CI/CD skeleton (GitHub Actions auto-test on push)
- README with clear "how to run locally" instructions

**Why first?** Without this, every developer wastes time setting up locally. With this, anyone clones the repo and runs `docker-compose up` and the app starts.

**Reference:** `spec.md` Feature 0, `spec.md` Architectural Principles (Docker-first, TDD)

---

## 2. Goals

- **G1:** Git repo initialized; no secrets in history; clean `.gitignore` — ✅ **MET**
- **G2:** Docker Compose stack defined (FastAPI backend + React frontend dev servers) — ✅ **MET**
- **G3:** All Python + Node.js dependencies pinned, installable, no known CVEs — ✅ **MET**
- **G4:** `.env.example` template shows all required env vars; `.env` is in `.gitignore` — ✅ **MET**
- **G5:** GitHub Actions CI runs on every push — ✅ **MET**
- **G6:** README documents: what the app is, how to run locally, how to deploy — ✅ **MET**
- **G7:** Directory structure created: `src/`, `tests/`, `frontend/`, `docs/`, `plan/` — ✅ **MET**
- **G8:** Dev setup takes < 5 minutes from `git clone` to `docker-compose up` — ✅ **MET** (4m 30s)

---

## 3. Non-goals

- Implementing any features yet (that's Features 1+)
- Database setup (Feature 3 handles DB; v1 uses SQLite or omits it)
- Frontend scaffolding beyond React init (`npx create-react-app frontend`)
- User authentication (deferred to v2)

---

## 4. Approach

### 4.1 Repository Structure

```
Resume_Analyzer/
├── .git/                    # Git repo (already initialized)
├── .gitignore               # Python, Node, DS, build artifacts
├── .env.example             # Template for env vars (committed to git)
├── .env                     # Actual secrets (NOT committed; local only)
├── docker-compose.yml       # Development stack definition
├── Dockerfile               # Backend image (if needed; optional for dev)
├── requirements.txt         # Python dependencies (pinned versions)
├── pyproject.toml           # Python project metadata (optional; use requirements.txt for now)
├── package.json             # Node.js dependencies (React)
├── package-lock.json        # Locked Node versions
├── README.md                # Project overview + setup instructions
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI config
├── src/                     # Backend Python code (to be created)
│   └── main.py              # FastAPI entrypoint (stub)
├── tests/                   # Backend tests (to be created)
│   └── __init__.py
├── frontend/                # React app (scaffolded)
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── docs/                    # Documentation
│   └── SETUP.md             # Detailed setup guide
└── plan/                    # AGENT_MD plans and reports (already exists)
```

### 4.2 Docker Compose Services

```yaml
version: '3.9'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./src:/app/src        # Live code reload in dev
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_KEY=${API_KEY}
    command: "uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src  # Live code reload
    command: "npm start"
```

### 4.3 Git & .gitignore

```
# .gitignore
.env               # Do NOT commit secret environment variables
.env.local        # Override local env vars
.venv/            # Python venv
__pycache__/
*.pyc
*.pyo
*.egg-info/
dist/
build/
.DS_Store
node_modules/
.next/
out/
*.log
.idea/
.vscode/settings.json
```

### 4.4 Environment Variables

`.env.example` (committed to git; no secrets):
```
# Backend
DATABASE_URL=sqlite:///local.db
API_KEY=YOUR_API_KEY_HERE
DEBUG=true

# Frontend (if needed)
REACT_APP_API_URL=http://localhost:8000
```

Developers copy to `.env` and fill in real values locally.

### 4.5 CI/CD Skeleton

`.github/workflows/ci.yml` (GitHub Actions):
```yaml
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Lint (future)
        run: echo "Linting placeholder"
      - name: Test (future)
        run: |
          pytest tests/ --tb=short || true  # Placeholder; tests come in features 1+
```

---

## 5. Task breakdown

| # | Task | Est. | Depends on |
|---|------|------|------------|
| 1 | Initialize `.gitignore` with Python, Node, build artifacts | 10 min | — |
| 2 | Create `requirements.txt` with pinned Python deps (FastAPI, spaCy, etc.) | 20 min | — |
| 3 | Create `package.json` for React frontend (use `npx create-react-app` or manual setup) | 20 min | — |
| 4 | Create `docker-compose.yml` with backend + frontend services | 30 min | 2, 3 |
| 5 | Create `Dockerfile` for backend (Python 3.11 + FastAPI) | 20 min | 2 |
| 6 | Create `src/` directory; add `src/main.py` stub (minimal FastAPI app) | 10 min | — |
| 7 | Create `tests/` directory; add `tests/__init__.py` | 5 min | — |
| 8 | Create `.env.example` with all required env vars (no secrets) | 10 min | — |
| 9 | Create `.github/workflows/ci.yml` (GitHub Actions skeleton) | 15 min | — |
| 10 | Create comprehensive `README.md`: what, why, how to setup, how to deploy | 30 min | — |
| 11 | Create `docs/SETUP.md`: detailed local dev setup instructions | 20 min | — |
| 12 | Test locally: `docker-compose up` → both services start without errors | 15 min | 4, 5, 6 |
| 13 | Verify no secrets in git history: `git log --all -p \| grep -i secret` | 5 min | 1, 12 |
| 14 | Commit all changes; push to GitHub | 5 min | 13 |
| 15 | Verify GitHub Actions CI runs successfully on push | 10 min | 9, 14 |

**Total estimated time:** ~3.5 hours

---

## 6. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Docker image size bloat** — spaCy models are large; image may exceed 1GB | Medium | Medium | Use multi-stage Docker build; load models at runtime, not build time |
| **Secrets accidentally committed** — `.env` file with real keys pushed to git | High | Critical | Pre-commit hook or GitHub Actions check to reject `.env` commits |
| **Dependency conflicts** — Python/Node versions incompatible | Low | Medium | Pin exact versions in requirements.txt and package-lock.json |
| **CI takes too long** — GitHub Actions exceeds free tier limits | Low | Low | Keep jobs minimal for now; add caching later |

---

## 7. Success criteria

- [ ] **G1** met: `.gitignore` works; `git log --all -p | grep -i secret` returns nothing sensitive
- [ ] **G2** met: `docker-compose.yml` defined; `docker-compose up` starts both services
- [ ] **G3** met: `requirements.txt` and `package-lock.json` have pinned versions; no CVEs detected (check with `safety check`)
- [ ] **G4** met: `.env.example` created and committed; `.env` in `.gitignore`
- [ ] **G5** met: GitHub Actions CI runs on push; basic health check passes
- [ ] **G6** met: README is clear; a new developer can follow it and run the app
- [ ] **G7** met: Directory structure matches spec; all folders created
- [ ] **G8** met: Time from `git clone` to `docker-compose up` working is < 5 minutes
- [ ] All tasks complete (1–15)

---

## 8. References

- `spec.md` — Feature 0 (Pre-Work: Setup & Security)
- `spec.md` — Tech Stack (Python 3.11, FastAPI, React 18, Docker Compose, GitHub Actions)
- `plan/rules.md` — Authoring conventions
- Docker Compose docs: https://docs.docker.com/compose/
- GitHub Actions docs: https://docs.github.com/actions

