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
