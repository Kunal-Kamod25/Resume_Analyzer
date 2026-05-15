import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeTab: 'upload' | 'results' | 'history';
  loading: boolean;
  error: string | null;
  success: string | null;
  darkMode: boolean;
  showNotification: boolean;
  notificationMessage: string;
  notificationType: 'success' | 'error' | 'info' | 'warning';
}

const initialState: UiState = {
  activeTab: 'upload',
  loading: false,
  error: null,
  success: null,
  darkMode: false,
  showNotification: false,
  notificationMessage: '',
  notificationType: 'info',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'upload' | 'results' | 'history'>) => {
      state.activeTab = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },

    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },

    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type?: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.showNotification = true;
      state.notificationMessage = action.payload.message;
      state.notificationType = action.payload.type || 'info';
    },

    hideNotification: (state) => {
      state.showNotification = false;
      state.notificationMessage = '';
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSuccess: (state) => {
      state.success = null;
    },
  },
});

export const {
  setActiveTab,
  setLoading,
  setError,
  setSuccess,
  toggleDarkMode,
  setDarkMode,
  showNotification,
  hideNotification,
  clearError,
  clearSuccess,
} = uiSlice.actions;

export default uiSlice.reducer;
