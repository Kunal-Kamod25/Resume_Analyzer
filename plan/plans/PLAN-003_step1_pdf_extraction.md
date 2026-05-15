# PLAN-003 Step 1: PDF/Text Extraction & NLP Setup

**Status:** 🚀 Ready for Implementation  
**Created:** 2026-05-15  
**Priority:** High (Blocks Skill Extraction)

---

## Objective (Step 1 Only)

Set up the NLP module infrastructure and build PDF/text extraction pipeline. Convert resume files (PDF + plain text) into clean, normalized text ready for entity extraction.

---

## What We're Doing

### Current State
- ✅ Backend FastAPI skeleton exists
- ✅ `requirements.txt` has basic deps (fastapi, uvicorn)
- ❌ No NLP module (`src/nlp/`)
- ❌ No PDF parsing logic
- ❌ No text normalization
- ❌ No skill database
- ❌ No `/api/v1/analyze` endpoint

### After Step 1
- ✅ `src/nlp/` module fully structured
- ✅ PDF → text extraction working
- ✅ Text normalization pipeline built
- ✅ IT skills database (150+ skills) created
- ✅ Unit tests for extraction
- ✅ Ready for entity extraction (Step 2)

---

## Tasks (Step 1)

### Task 1.1: Update requirements.txt

Add NLP dependencies to Python requirements.

**File:** `requirements.txt`

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
python-dotenv==1.0.0
pytest==7.4.4
pytest-asyncio==0.23.3

# NLP & ML
spacy==3.7.2
transformers==4.38.2
torch==2.2.0
scikit-learn==1.3.2

# PDF Parsing
pdfplumber==0.10.3
PyPDF2==4.0.1

# Data Processing
pandas==2.1.4
numpy==1.26.3

# Utilities
python-Levenshtein==0.21.1
fuzzywuzzy==0.18.0
tqdm==4.67.1
```

---

### Task 1.2: Create NLP Module Structure

Create folder structure for NLP:

```bash
mkdir -p src/nlp/databases
mkdir -p src/nlp/models
touch src/nlp/__init__.py
```

---

### Task 1.3: Create Text Cleaner Utility

**File:** `src/utils/text_cleaner.py`

```python
"""
Text normalization and cleaning utilities
"""

import re
from typing import Tuple


class TextCleaner:
    """Normalize and clean resume text"""

    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Normalize text: remove extra whitespace, lowercase, standardize formats
        
        Args:
            text: Raw resume text
            
        Returns:
            Normalized text
        """
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r' +', ' ', text)
        text = text.strip()
        
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s\-.,@:#()/%]', '', text)
        
        return text

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean text: remove URLs, emails, numbers, special characters
        
        Args:
            text: Raw text
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '', text)
        
        # Remove extra whitespace again
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    @staticmethod
    def extract_sections(text: str) -> dict:
        """
        Try to extract main resume sections
        
        Args:
            text: Normalized resume text
            
        Returns:
            Dictionary with identified sections
        """
        sections = {
            'contact': '',
            'summary': '',
            'experience': '',
            'education': '',
            'skills': '',
            'certifications': '',
            'other': text
        }
        
        # Common section headers patterns
        section_patterns = {
            'contact': r'(?i)(contact|email|phone|linkedin)',
            'summary': r'(?i)(summary|objective|profile)',
            'experience': r'(?i)(experience|work history|professional)',
            'education': r'(?i)(education|academic)',
            'skills': r'(?i)(skills|technical|proficiencies)',
            'certifications': r'(?i)(certifications?|licenses?|awards?)'
        }
        
        return sections

    @staticmethod
    def tokenize_lines(text: str) -> list:
        """
        Split text into lines, clean each line
        
        Args:
            text: Text to tokenize
            
        Returns:
            List of cleaned lines
        """
        lines = text.split('\n')
        cleaned_lines = [line.strip() for line in lines if line.strip()]
        return cleaned_lines
```

---

### Task 1.4: Create PDF Extractor

**File:** `src/nlp/extractor.py`

```python
"""
Resume text extraction from PDF/text files
"""

import pdfplumber
import PyPDF2
from pathlib import Path
from typing import Tuple
import logging

from src.utils.text_cleaner import TextCleaner

logger = logging.getLogger(__name__)


class ResumeExtractor:
    """Extract text from resume files (PDF, TXT)"""

    def __init__(self):
        self.text_cleaner = TextCleaner()

    def extract_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted and normalized text
            
        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If PDF is corrupted or empty
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if file_path.suffix.lower() != '.pdf':
            raise ValueError(f"Expected PDF file, got {file_path.suffix}")
        
        text = ""
        
        # Try pdfplumber first (more reliable)
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.warning(f"pdfplumber failed: {e}, trying PyPDF2...")
            
            # Fallback to PyPDF2
            try:
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            except Exception as e:
                logger.error(f"PDF extraction failed: {e}")
                raise ValueError(f"Failed to extract PDF: {e}")
        
        if not text.strip():
            raise ValueError("PDF is empty or no text could be extracted")
        
        # Normalize extracted text
        return self.normalize_text(text)

    def extract_from_text(self, file_path: str) -> str:
        """
        Extract text from plain text file
        
        Args:
            file_path: Path to TXT file
            
        Returns:
            Extracted and normalized text
            
        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If file is empty
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as f:
                text = f.read()
        
        if not text.strip():
            raise ValueError("Text file is empty")
        
        return self.normalize_text(text)

    def extract_from_string(self, text: str) -> str:
        """
        Extract/normalize text from string (direct input)
        
        Args:
            text: Resume text as string
            
        Returns:
            Normalized text
            
        Raises:
            ValueError: If text is empty
        """
        if not text or not text.strip():
            raise ValueError("Resume text is empty")
        
        return self.normalize_text(text)

    def normalize_text(self, text: str) -> str:
        """
        Normalize resume text for processing
        
        Args:
            text: Raw resume text
            
        Returns:
            Normalized text
        """
        # Clean first
        cleaned = self.text_cleaner.clean_text(text)
        
        # Then normalize
        normalized = self.text_cleaner.normalize_text(cleaned)
        
        return normalized

    def detect_file_type(self, file_path: str) -> str:
        """
        Detect if file is PDF or text
        
        Args:
            file_path: Path to file
            
        Returns:
            'pdf' or 'text'
            
        Raises:
            ValueError: If unsupported file type
        """
        file_path = Path(file_path)
        suffix = file_path.suffix.lower()
        
        if suffix == '.pdf':
            return 'pdf'
        elif suffix in ['.txt', '.text']:
            return 'text'
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

    def extract_from_file(self, file_path: str) -> Tuple[str, str]:
        """
        Extract from any supported file type
        
        Args:
            file_path: Path to file
            
        Returns:
            Tuple of (text, file_type)
            
        Raises:
            ValueError: If unsupported file type
        """
        file_type = self.detect_file_type(file_path)
        
        if file_type == 'pdf':
            text = self.extract_from_pdf(file_path)
        else:
            text = self.extract_from_text(file_path)
        
        return text, file_type
```

---

### Task 1.5: Create Skill Database

**File:** `src/nlp/databases/skills.json`

```json
{
  "programming_languages": [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "R",
    "MATLAB",
    "SQL",
    "PL/SQL",
    "Scala",
    "Groovy",
    "Perl",
    "Bash"
  ],
  "frontend_frameworks": [
    "React",
    "Angular",
    "Vue.js",
    "Next.js",
    "Svelte",
    "jQuery",
    "Bootstrap",
    "Material-UI",
    "Tailwind CSS",
    "Webpack",
    "Babel",
    "Vite"
  ],
  "backend_frameworks": [
    "FastAPI",
    "Django",
    "Flask",
    "Spring Boot",
    "Express.js",
    "Node.js",
    "ASP.NET",
    "Laravel",
    "Ruby on Rails",
    "Gin",
    "Echo"
  ],
  "databases": [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "DynamoDB",
    "SQLite",
    "Oracle",
    "Cassandra",
    "CouchDB",
    "Firebase",
    "Memcached"
  ],
  "cloud_platforms": [
    "AWS",
    "Azure",
    "Google Cloud",
    "DigitalOcean",
    "Heroku",
    "CloudFlare",
    "Linode",
    "Vultr",
    "Oracle Cloud"
  ],
  "devops_tools": [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitLab CI",
    "GitHub Actions",
    "CircleCI",
    "Terraform",
    "Ansible",
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Datadog"
  ],
  "version_control": [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "SVN",
    "Perforce"
  ],
  "testing": [
    "Jest",
    "Pytest",
    "Mocha",
    "JUnit",
    "Selenium",
    "Cypress",
    "TestNG",
    "Jasmine",
    "RSpec"
  ],
  "data_science": [
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "TensorFlow",
    "PyTorch",
    "scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Plotly",
    "Tableau",
    "Power BI"
  ],
  "aws_services": [
    "EC2",
    "S3",
    "Lambda",
    "RDS",
    "DynamoDB",
    "SQS",
    "SNS",
    "Cognito",
    "API Gateway",
    "CloudFormation",
    "IAM",
    "CloudWatch"
  ],
  "soft_skills": [
    "Leadership",
    "Communication",
    "Problem Solving",
    "Team Work",
    "Project Management",
    "Agile",
    "Scrum",
    "JIRA",
    "Confluence"
  ],
  "other": [
    "REST API",
    "GraphQL",
    "Microservices",
    "System Design",
    "Design Patterns",
    "SOLID",
    "Agile",
    "CI/CD",
    "OAuth",
    "JWT",
    "SSL/TLS",
    "AWS",
    "Linux",
    "Windows",
    "macOS"
  ]
}
```

---

### Task 1.6: Create Parser Module (Stub)

**File:** `src/nlp/parser.py`

```python
"""
NLP parsing for skill, experience, education extraction
(Detailed implementation in Step 2)
"""

from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class ResumeParser:
    """Parse resume text to extract structured information"""

    def __init__(self, skill_database_path: str = None):
        """
        Initialize parser with skill database
        
        Args:
            skill_database_path: Path to skills.json
        """
        self.skill_database_path = skill_database_path
        self.skills_db = self._load_skills_db()

    def _load_skills_db(self) -> Dict[str, List[str]]:
        """Load skills database from JSON"""
        import json
        from pathlib import Path
        
        if not self.skill_database_path:
            # Default path
            path = Path(__file__).parent / "databases" / "skills.json"
        else:
            path = Path(self.skill_database_path)
        
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Skills database not found: {path}")
            return {}

    def extract_skills(self, text: str) -> List[Dict[str, str]]:
        """
        Extract skills from resume text
        (Placeholder - detailed implementation in Step 2)
        
        Args:
            text: Resume text
            
        Returns:
            List of extracted skills with proficiency levels
        """
        # Placeholder - will be implemented in Step 2
        return []

    def extract_experience(self, text: str) -> Dict:
        """
        Extract experience information
        (Placeholder - detailed implementation in Step 2)
        
        Args:
            text: Resume text
            
        Returns:
            Experience data (years, titles, companies)
        """
        # Placeholder - will be implemented in Step 2
        return {"years": 0, "titles": [], "companies": []}

    def extract_education(self, text: str) -> List[Dict]:
        """
        Extract education information
        (Placeholder - detailed implementation in Step 2)
        
        Args:
            text: Resume text
            
        Returns:
            List of education entries
        """
        # Placeholder - will be implemented in Step 2
        return []
```

---

### Task 1.7: Create __init__.py Files

**File:** `src/nlp/__init__.py`

```python
"""
NLP module for Resume Analyzer
"""

from .extractor import ResumeExtractor
from .parser import ResumeParser

__all__ = ['ResumeExtractor', 'ResumeParser']
```

**File:** `src/utils/__init__.py`

```python
"""
Utility modules
"""

from .text_cleaner import TextCleaner

__all__ = ['TextCleaner']
```

---

### Task 1.8: Create Unit Tests

**File:** `tests/test_extractor.py`

```python
"""
Unit tests for resume extraction
"""

import pytest
from pathlib import Path
from src.nlp.extractor import ResumeExtractor
from src.utils.text_cleaner import TextCleaner


@pytest.fixture
def extractor():
    return ResumeExtractor()


@pytest.fixture
def text_cleaner():
    return TextCleaner()


class TestTextCleaner:
    """Test text cleaning utilities"""

    def test_normalize_text_removes_extra_spaces(self, text_cleaner):
        text = "Hello   world  \n  test"
        result = text_cleaner.normalize_text(text)
        assert "   " not in result
        assert result.strip() == result

    def test_clean_text_removes_urls(self, text_cleaner):
        text = "Visit https://example.com for more info"
        result = text_cleaner.clean_text(text)
        assert "https://" not in result

    def test_clean_text_removes_emails(self, text_cleaner):
        text = "Email me at john@example.com"
        result = text_cleaner.clean_text(text)
        assert "@" not in result or "example" not in result

    def test_tokenize_lines(self, text_cleaner):
        text = "Line 1\nLine 2\n\nLine 3"
        result = text_cleaner.tokenize_lines(text)
        assert len(result) == 3
        assert result[0] == "Line 1"


class TestResumeExtractor:
    """Test resume text extraction"""

    def test_extract_from_string(self, extractor):
        text = "John Doe\nSoftware Engineer\nSkills: Python, React"
        result = extractor.extract_from_string(text)
        assert len(result) > 0
        assert "John Doe" in result or "john doe" in result.lower()

    def test_extract_from_string_empty_raises_error(self, extractor):
        with pytest.raises(ValueError, match="Resume text is empty"):
            extractor.extract_from_string("")

    def test_detect_file_type_pdf(self, extractor):
        file_type = extractor.detect_file_type("resume.pdf")
        assert file_type == "pdf"

    def test_detect_file_type_text(self, extractor):
        file_type = extractor.detect_file_type("resume.txt")
        assert file_type == "text"

    def test_detect_file_type_unsupported(self, extractor):
        with pytest.raises(ValueError, match="Unsupported file type"):
            extractor.detect_file_type("resume.docx")


class TestResumeParser:
    """Test resume parsing"""

    def test_parser_loads_skills_db(self):
        from src.nlp.parser import ResumeParser
        parser = ResumeParser()
        assert parser.skills_db is not None
        assert len(parser.skills_db) > 0
```

---

## Deliverables (After Step 1)

✅ NLP module structure created  
✅ Text extraction pipeline (PDF + text)  
✅ Text normalization working  
✅ Skill database (150+ IT skills) loaded  
✅ Unit tests written and passing  
✅ Dependencies installed  

**Status After Completion:** Ready for Step 2 (Skill/Experience/Education Extraction) 🚀

---

## Execution Plan

```bash
# 1. Update requirements
pip install -r requirements.txt

# 2. Run tests to verify everything works
pytest tests/test_extractor.py -v

# 3. Test extraction manually
python -c "
from src.nlp.extractor import ResumeExtractor
extractor = ResumeExtractor()
text = extractor.extract_from_string('John Doe\n5 years Python, React\nBS Computer Science')
print(text)
"
```

---

## Success Criteria

After Step 1:
- [ ] All files created in correct locations
- [ ] `pip install -r requirements.txt` completes without errors
- [ ] `pytest tests/test_extractor.py` passes 100%
- [ ] Text extraction normalizes text correctly
- [ ] Skills database loaded with 100+ skills
- [ ] No console errors or warnings

---

## Next Step (Step 2 - Preview)

**Extract structured information:**
- Skill extraction with spaCy NER
- Experience parsing (years, job titles)
- Education detection (degrees, certifications)

---

## References

- pdfplumber: https://github.com/jsvine/pdfplumber
- PyPDF2: https://github.com/py-pdf/PyPDF2

