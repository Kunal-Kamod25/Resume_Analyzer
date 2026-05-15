import { FC } from 'react';
import { Container, Box } from '@mui/material';
import { useAppSelector } from '../hooks/redux';

/**
 * HomePage - Main upload and analysis page
 * Renders upload section, job description, and results
 */
const HomePage: FC = () => {
  const { activeTab } = useAppSelector((state) => state.ui);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* Placeholder for upload section */}
        {activeTab === 'upload' && (
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            Upload Section Component will be here
          </Box>
        )}
        {/* Placeholder for results section */}
        {activeTab === 'results' && (
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            Results Panel Component will be here
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
