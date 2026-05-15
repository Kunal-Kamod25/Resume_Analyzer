import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ExtractedData, AnalyzeResumeResponse, FitDetails } from '../types/api';

interface Analysis {
  id: string;
  resumeText: string;
  jobDescription?: string;
  extractedData?: ExtractedData;
  fitScore?: number;
  fitDetails?: FitDetails;
  timestamp: string;
  filename?: string;
}

interface AnalysisState {
  currentAnalysis: Analysis | null;
  history: Analysis[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  currentAnalysis: null,
  history: [],
  loading: false,
  error: null,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setResumeText: (state, action: PayloadAction<{ text: string; filename?: string }>) => {
      if (!state.currentAnalysis) {
        state.currentAnalysis = {
          id: `analysis-${Date.now()}`,
          resumeText: action.payload.text,
          filename: action.payload.filename,
          timestamp: new Date().toISOString(),
        };
      } else {
        state.currentAnalysis.resumeText = action.payload.text;
        state.currentAnalysis.filename = action.payload.filename;
      }
    },

    setJobDescription: (state, action: PayloadAction<string>) => {
      if (state.currentAnalysis) {
        state.currentAnalysis.jobDescription = action.payload;
      }
    },

    setAnalysis: (state, action: PayloadAction<AnalyzeResumeResponse>) => {
      if (state.currentAnalysis && action.payload.analysis_id) {
        state.currentAnalysis.id = action.payload.analysis_id;
        state.currentAnalysis.extractedData = action.payload.extracted_data;
        state.currentAnalysis.fitScore = action.payload.fit_score;
        state.currentAnalysis.fitDetails = action.payload.fit_details;
        state.currentAnalysis.timestamp = action.payload.generated_at || new Date().toISOString();

        // Add to history
        const existingIndex = state.history.findIndex((a) => a.id === state.currentAnalysis?.id);
        if (existingIndex >= 0) {
          state.history[existingIndex] = state.currentAnalysis;
        } else {
          state.history.push({ ...state.currentAnalysis });
        }
      }
    },

    clearAnalysis: (state) => {
      state.currentAnalysis = null;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    loadFromHistory: (state, action: PayloadAction<string>) => {
      const analysis = state.history.find((a) => a.id === action.payload);
      if (analysis) {
        state.currentAnalysis = { ...analysis };
      }
    },

    deleteFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((a) => a.id !== action.payload);
    },
  },
});

export const {
  setResumeText,
  setJobDescription,
  setAnalysis,
  clearAnalysis,
  setLoading,
  setError,
  loadFromHistory,
  deleteFromHistory,
} = analysisSlice.actions;

export default analysisSlice.reducer;
