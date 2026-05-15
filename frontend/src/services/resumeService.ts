import axios, { AxiosInstance } from 'axios';
import type {
  UploadResumeRequest,
  UploadResumeResponse,
  AnalyzeResumeRequest,
  AnalyzeResumeResponse,
  GetHistoryResponse,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class ResumeAnalyzerService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 500) {
          console.error('Server error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Upload a resume file (PDF or TXT)
   * @param file - File object or raw text
   * @param filename - Optional filename for display
   * @returns Promise with extracted resume text
   */
  async uploadResume(file: File | string, filename?: string): Promise<UploadResumeResponse> {
    try {
      const formData = new FormData();

      if (typeof file === 'string') {
        // If raw text, send as JSON
        return this.api.post<UploadResumeResponse>('/upload', {
          raw_text: file,
        }).then((res) => res.data);
      } else {
        // If file object, send as multipart/form-data
        formData.append('file', file, filename || file.name);
        const response = await axios.post<UploadResumeResponse>(
          `${API_BASE_URL}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      }
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to upload resume',
      };
    }
  }

  /**
   * Analyze resume against job description
   * @param resumeText - Extracted resume text
   * @param jobDescription - Optional job description for fit scoring
   * @returns Promise with analysis results (skills, experience, education, fit score)
   */
  async analyzeResume(
    resumeText: string,
    jobDescription?: string
  ): Promise<AnalyzeResumeResponse> {
    try {
      const payload: AnalyzeResumeRequest = {
        resume_text: resumeText,
        job_description: jobDescription,
      };

      const response = await this.api.post<AnalyzeResumeResponse>('/analyze', payload);
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to analyze resume',
      };
    }
  }

  /**
   * Get analysis history
   * @returns Promise with list of past analyses
   */
  async getHistory(): Promise<GetHistoryResponse> {
    try {
      const response = await this.api.get<GetHistoryResponse>('/history');
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to fetch history',
      };
    }
  }

  /**
   * Get specific analysis by ID
   * @param analysisId - Analysis ID
   * @returns Promise with analysis details
   */
  async getAnalysis(analysisId: string): Promise<AnalyzeResumeResponse> {
    try {
      const response = await this.api.get<AnalyzeResumeResponse>(`/history/${analysisId}`);
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to fetch analysis',
      };
    }
  }

  /**
   * Delete analysis from history
   * @param analysisId - Analysis ID to delete
   */
  async deleteAnalysis(analysisId: string): Promise<{ status: string; message?: string }> {
    try {
      const response = await this.api.delete(`/history/${analysisId}`);
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.response?.data?.message || error?.message || 'Failed to delete analysis',
      };
    }
  }

  /**
   * Generate PDF report
   * @param analysisData - Analysis data to generate report from
   * @returns Promise with PDF blob or URL
   */
  async generateReport(analysisData: any): Promise<Blob> {
    try {
      const response = await this.api.post('/report', analysisData, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to generate report');
    }
  }
}

// Export singleton instance
export const resumeService = new ResumeAnalyzerService();
