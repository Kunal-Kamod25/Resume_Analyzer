/**
 * TypeScript interfaces for Resume Analyzer API
 * Defines request/response types for all backend endpoints
 */

// ============= Skill Data =============
export interface Skill {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'expert';
  category?: string;
}

// ============= Education Data =============
export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

// ============= Experience Data =============
export interface Experience {
  title: string;
  company: string;
  start_year: number;
  end_year?: number;
  current: boolean;
}

// ============= Certification =============
export interface Certification {
  name: string;
  issuer: string;
  year: number;
}

// ============= Upload Request/Response =============
export interface UploadResumeRequest {
  file?: File;
  raw_text?: string;
}

export interface UploadResumeResponse {
  status: 'success' | 'error';
  resume_text?: string;
  file_type?: 'pdf' | 'txt' | 'text';
  message?: string;
}

// ============= Fit Score Details =============
export interface FitDetails {
  matching_skills: string[];
  missing_skills: string[];
  experience_match: string;
  score_breakdown?: {
    skills_weight: number;
    experience_weight: number;
    education_weight: number;
  };
}

// ============= Analysis Request/Response =============
export interface AnalyzeResumeRequest {
  resume_text: string;
  job_description?: string;
}

export interface ExtractedData {
  skills: Skill[];
  years_of_experience: number;
  education: Education[];
  certifications: Certification[];
  experiences: Experience[];
  summary?: string;
}

export interface AnalyzeResumeResponse {
  status: 'success' | 'error';
  analysis_id?: string;
  extracted_data?: ExtractedData;
  fit_score?: number;
  fit_details?: FitDetails;
  generated_at?: string;
  message?: string;
}

// ============= Analysis History =============
export interface AnalysisHistoryEntry {
  analysis_id: string;
  timestamp: string;
  resume_filename: string;
  fit_score?: number;
  job_title?: string;
}

export interface GetHistoryResponse {
  status: 'success' | 'error';
  history?: AnalysisHistoryEntry[];
  message?: string;
}

// ============= API Error =============
export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
}
