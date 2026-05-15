import { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Tabs,
  Tab,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setActiveTab, toggleDarkMode } from './store/uiSlice';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

/**
 * Main App component with routing, theming, and navigation
 */
const AppContent: FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, darkMode } = useAppSelector((state) => state.ui);
  const location = useLocation();

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'upload' | 'results' | 'history') => {
    dispatch(setActiveTab(newValue));
  };

  // Determine current tab based on route
  useEffect(() => {
    if (location.pathname === '/history') {
      dispatch(setActiveTab('history'));
    } else {
      dispatch(setActiveTab('upload'));
    }
  }, [location.pathname, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Header */}
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="h1">
              📄 Resume Analyzer
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => dispatch(toggleDarkMode())}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Container maxWidth="lg">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Upload & Analyze" value="upload" />
          <Tab label="Results" value="results" />
          <Tab label="History" value="history" />
        </Tabs>

        {/* Routes */}
        <Box sx={{ minHeight: '70vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 4,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2">
          © 2026 Resume Analyzer • Powered by AI
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

/**
 * Main App wrapper with Router
 */
const App: FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
