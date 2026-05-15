# PLAN-003: Backend NLP Extraction — Resume Analysis Engine

**Status:** 📋 Ready for Review  
**Created:** 2026-05-15  
**Priority:** High (Core Business Logic)

---

## Objective

Build the **resume text extraction and NLP analysis engine** — the heart of the Resume Analyzer. This plan covers:
1. Resume text extraction from resumes (PDF parsing)
2. Information extraction (skills, experience, education, certifications)
3. Text normalization and entity recognition
4. Fit scoring algorithm (resume vs job description similarity)

**Scope:** Steps will be broken down iteratively (Step 1 → Step 2 → Step 3...)

---

## Current State vs Target

### Current State (After PLAN-002)
- ✅ Frontend UI architecture ready (components, Redux, routing)
- ✅ API types defined (API interfaces)
- ✅ Backend skeleton: FastAPI + health checks
- ❌ No resume text extraction logic
- ❌ No NLP skill/experience parsing
- ❌ No fit scoring algorithm
- ❌ No `/api/v1/analyze` endpoint implementation

### After PLAN-003 Complete
- ✅ PDF + text file parsing working
- ✅ Resume text extraction with 85%+ accuracy
- ✅ Skill extraction (Python, React, AWS, etc.)
- ✅ Education extraction (degrees, certifications)
- ✅ Experience parsing (years, job titles)
- ✅ Fit scoring algorithm (0-100 scale)
- ✅ `/api/v1/analyze` endpoint fully functional
- ✅ End-to-end flow working (upload → analyze → score)

---

## Architecture Overview

### NLP Stack

```
Resume Text Input
    ↓
1. PDF/Text Parsing (pdfplumber, PyPDF2)
    ↓
2. Text Normalization (spaCy, string cleaning)
    ↓
3. Entity Recognition (spaCy NER, custom patterns)
    ├─ Skills detection (skill database + ML model)
    ├─ Experience extraction (regex + NER)
    ├─ Education parsing (degree patterns)
    └─ Certifications finding (cert list matching)
    ↓
4. Structured Output (ExtractedData)
    ↓
5. Fit Scoring (job description vs resume similarity)
    ↓
6. JSON Response (API response)
```

### Backend File Structure

```
src/
├── main.py                       # FastAPI app (already exists)
├── nlp/
│   ├── __init__.py
│   ├── extractor.py              # Resume text extraction from files
│   ├── parser.py                 # NLP parsing (skills, experience, education)
│   ├── skill_matcher.py          # Skill extraction + matching
│   ├── scorer.py                 # Fit score calculation
│   ├── databases/
│   │   ├── skills.json           # Common IT skills database
│   │   ├── certifications.json   # IT certifications list
│   │   └── job_titles.json       # Common job titles
│   └── models/
│       └── [pre-trained spaCy/HF models loaded at startup]
├── api/
│   ├── __init__.py
│   ├── routes.py                 # FastAPI routes
│   └── schemas.py                # Pydantic request/response schemas
├── utils/
│   ├── __init__.py
│   ├── text_cleaner.py           # Text normalization
│   ├── logger.py                 # Logging setup
│   └── validators.py             # Input validation
```

---

## Step 1 Scope (First Iteration)

**PLAN-003 Step 1:** PDF/Text Extraction & Setup

### What Step 1 Will Do

- ✅ Check/install NLP dependencies (spaCy, transformers, pdfplumber, PyPDF2)
- ✅ Create `src/nlp/` module with basic extractor
- ✅ Build PDF parsing logic (convert PDF → plain text)
- ✅ Build text normalization (clean, remove noise, format)
- ✅ Create skill database (JSON with 150+ IT skills)
- ✅ Add logging and error handling
- ✅ Write unit tests for extraction

### Tasks in Step 1

**Step 1.1:** Create NLP module structure  
**Step 1.2:** Install spaCy model + transformers  
**Step 1.3:** Build PDF/text extractor  
**Step 1.4:** Build text normalizer  
**Step 1.5:** Create skill database  
**Step 1.6:** Write extractor unit tests  

### Deliverables After Step 1

```python
# Example usage (inside tests)
from src.nlp.extractor import ResumeExtractor

extractor = ResumeExtractor()

# Extract from PDF
resume_text = extractor.extract_from_pdf("resume.pdf")
# Output: "John Doe\n5 years software engineer...\nSkills: Python, React..."

# Extract from text
resume_text = extractor.extract_from_text("John Doe\n...")

# Normalize text
clean_text = extractor.normalize_text(resume_text)
```

**Status After Step 1:** PDF/text parsing working, ready for NLP parsing in Step 2

---

## Complete PLAN-003 Timeline (Preview)

```
Step 1: PDF/Text Extraction (3-4 days)
  └─ Deliverable: Resume text extracted + normalized

Step 2: Skill/Education/Experience Parsing (4-5 days)
  ├─ Skill extraction (Python, React, AWS, Docker, etc.)
  ├─ Experience parsing (years, job titles)
  ├─ Education extraction (BS/MS, certifications)
  └─ Deliverable: ExtractedData structure populated

Step 3: Fit Scoring Algorithm (3 days)
  ├─ Job description parsing
  ├─ Similarity matching (skill overlap)
  ├─ Experience scoring
  └─ Deliverable: 0-100 fit score algorithm

Step 4: API Integration (2-3 days)
  ├─ Implement `/api/v1/analyze` endpoint
  ├─ Connect frontend API client
  ├─ End-to-end testing
  └─ Deliverable: Full stack working end-to-end

Total Duration: ~2-3 weeks
```

---

## Questions for Review

Before I create Step 1 detailed plan, please confirm:

1. ✅ **Should we proceed with Backend NLP now?**
   - Or finish Step 2 (folder structure) first?
   - Or do Steps 1 & 2 in parallel?

2. ✅ **Skill Database Scope:**
   - Should we include 150+ common IT skills?
   - Or start with 50 core skills and expand later?

3. ✅ **Accuracy Constraints:**
   - Is 85%+ accuracy for extraction acceptable for MVP?
   - Or do we need higher?

4. ✅ **Ready to proceed with PLAN-003 Step 1 detailed plan?**

---

## High-Level Dependency Check

Libraries needed (check if already in requirements.txt):

```
# PDF Parsing
pdfplumber>=0.7.0        # PDF text extraction
PyPDF2>=3.0.0            # Alternative PDF parser

# NLP
spacy>=3.7.0             # Entity recognition, tokenization
transformers>=4.30.0     # Hugging Face models
python-Levenshtein>=0.21.0  # String similarity

# Data Processing
pandas>=1.5.0            # Data manipulation
numpy>=1.23.0            # Numerical operations

# Utils
python-dotenv>=0.19.0    # Env vars (already has)
pytest>=7.0.0            # Testing (already has)

# Existing from Step 1 (PLAN-001)
fastapi>=0.109.0         ✅
pydantic>=2.0.0          ✅ (for schemas)
```

---

## Next Actions

1. ✅ Review this high-level PLAN-003
2. ❓ Answer the 4 questions above
3. ✅ I'll create detailed PLAN-003 Step 1 (with all code templates)
4. ✅ You review Step 1
5. ✅ I implement Step 1
6. ✅ Create REPORT-003 Step 1
7. ✅ Move to Step 2, repeat

---

## References

- spaCy: https://spacy.io
- pdfplumber: https://github.com/jsvine/pdfplumber
- PyPDF2: https://github.com/py-pdf/PyPDF2
- Transformers: https://huggingface.co/transformers/

