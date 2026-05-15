import { FC } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useAppSelector } from '../hooks/redux';

/**
 * HistoryPage - View past analyses
 * Shows list of previous resume analyses with ability to view/delete
 */
const HistoryPage: FC = () => {
  const { history } = useAppSelector((state) => state.analysis);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analysis History
      </Typography>

      {history.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No analyses yet. Upload a resume to get started!</Typography>
        </Box>
      ) : (
        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          {/* History list will be rendered here */}
          <Typography>{history.length} analyses found</Typography>
        </Box>
      )}
    </Container>
  );
};

export default HistoryPage;
