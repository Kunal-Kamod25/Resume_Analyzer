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
