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
