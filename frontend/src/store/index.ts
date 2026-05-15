import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './analysisSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
