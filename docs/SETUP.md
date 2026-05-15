# Detailed Setup Guide

Complete step-by-step guide for local development setup.

---

## Prerequisites

- **Docker** (v20.10+) — [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) — Usually included with Docker Desktop
- **Git** (v2.30+) — [Install Git](https://git-scm.com/download)
- **GitHub Account** (optional) — For pushing code

### Verify Installation

```bash
docker --version         # Docker version 20.10+
docker-compose --version # Docker Compose version 2.0+
git --version            # git version 2.30+
python3 --version        # Python 3.11+ (optional; runs in Docker)
```

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Kunal-Kamod25/Resume_Analyzer.git
cd Resume_Analyzer
```

### 2. Set Up Environment Variables

Copy the `.env.example` template and create a local `.env` file:

```bash
cp .env.example .env
```

Then open `.env` in your editor and fill in values:

```bash
# .env (local — do NOT commit this file)
DATABASE_URL=sqlite:///./app.db
API_KEY=your-actual-secret-key
DEBUG=true
SECRET_KEY=your-jwt-secret
REACT_APP_API_URL=http://localhost:8000/api
```

**Important:** `.env` is in `.gitignore` and will never be committed.

### 3. Start Docker Compose Stack

```bash
docker-compose up
```

**First run will take 5–10 minutes** as Docker builds images and downloads dependencies.

When complete, you'll see:
```
backend  | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend | Compiled successfully!
```

### 4. Verify Services

Open these URLs in your browser:

| Service | URL | Expected |
|---------|-----|----------|
| Backend API | http://localhost:8000 | "Welcome to Resume Analyzer API" |
| API Docs | http://localhost:8000/docs | Interactive Swagger UI |
| Frontend | http://localhost:3000 | React app (empty for v0.1) |

---

## Common Tasks

### Run Backend Tests

```bash
# Inside Docker
docker-compose exec backend pytest tests/ -v

# Locally (if Python 3.11 installed)
pytest tests/ -v
```

### Run Frontend Tests

```bash
# Inside Docker
docker-compose exec frontend npm test

# Or locally
cd frontend && npm test
```

### View Docker Logs

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend

# Last 50 lines
docker-compose logs --tail 50
```

### Stop Services

```bash
# Graceful stop
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop, remove containers, and volumes (clean slate)
docker-compose down -v
```

### Rebuild Services

```bash
# If you changed Python or Node dependencies
docker-compose up --build

# Rebuild specific service
docker-compose up --build backend
```

### Install New Python Dependency

```bash
# 1. Add to requirements.txt
echo "new-package==1.0.0" >> requirements.txt

# 2. Rebuild backend
docker-compose up --build backend

# 3. Inside container, verify
docker-compose exec backend pip list | grep new-package
```

### Install New Node Dependency

```bash
# 1. Install locally
cd frontend
npm install new-package

# 2. Rebuild frontend
docker-compose up --build frontend
```

### Run Linting

```bash
# Backend: flake8
docker-compose exec backend flake8 src/ tests/

# Backend: black (format)
docker-compose exec backend black src/ tests/

# Frontend: ESLint
docker-compose exec frontend npm run lint
```

### Check Code Coverage

```bash
docker-compose exec backend pytest tests/ --cov=src
```

---

## Troubleshooting

### Problem: `docker-compose: command not found`

**Solution:**
```bash
# Update to latest Docker Desktop for automatic Compose v2
# Or install Compose v2 manually:
docker compose --version  # Note: no hyphen in newer versions
docker compose up         # Use this instead of docker-compose
```

### Problem: Port 8000 or 3000 already in use

**Solution:**
```bash
# Check what's using the port
lsof -i :8000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
# backend: ports: "8001:8000"
# frontend: ports: "3001:3000"
```

### Problem: `docker-compose up` gets stuck or times out

**Solution:**
```bash
# Stop everything
docker-compose down -v

# Restart with verbose output
docker-compose up --verbose

# Check system resources
docker system df
docker system prune -a  # Remove unused images/containers
```

### Problem: `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
# Inside Docker, reinstall deps
docker-compose exec backend pip install -r requirements.txt

# Or rebuild
docker-compose down
docker-compose up --build
```

### Problem: Frontend shows blank page

**Solution:**
```bash
# Check frontend logs
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend

# Clear npm cache
docker-compose exec frontend npm cache clean --force
```

### Problem: Secrets accidentally committed

**Solution:**
```bash
# Check if .env was committed
git log --all --full-history -- .env

# Remove from history (if committed)
git filter-branch --tree-filter 'rm -f .env' -- --all
git push origin --force --all
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

Edit code in `src/`, `frontend/`, or `tests/`.

### 3. Tests Pass Locally

```bash
docker-compose exec backend pytest tests/ -v
docker-compose exec frontend npm test
```

### 4. Commit & Push

```bash
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

### 5. Open Pull Request

On GitHub, create a PR against `main`. GitHub Actions CI will run automatically.

### 6. Merge After CI Passes

Once all checks pass, merge the PR.

---

## Performance Tips

### Speed Up Docker Build

```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose up --build
```

### Reduce Image Size

```bash
# Check image sizes
docker images

# Clean up unused images
docker image prune -a
```

### Database Performance

```bash
# For large test datasets, use .db caching:
docker-compose up -d   # Run in background
# Let it run for 30 seconds to warm cache
```

---

## Production Deployment (Future)

### Build Production Image

```bash
docker build -t resume-analyzer:latest .
docker run -p 8000:8000 resume-analyzer:latest
```

### Push to Container Registry

```bash
# Docker Hub
docker tag resume-analyzer:latest YOUR_USERNAME/resume-analyzer:latest
docker push YOUR_USERNAME/resume-analyzer:latest

# GitHub Container Registry
docker tag resume-analyzer:latest ghcr.io/YOUR_USERNAME/resume-analyzer:latest
docker push ghcr.io/YOUR_USERNAME/resume-analyzer:latest
```

---

## Further Reading

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Project Specification](../spec.md)
- [Plan & Reports](../plan/)

---

**Last Updated:** 2026-05-15
