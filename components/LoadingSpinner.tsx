
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="400px"
    >
      <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="body1" color="textSecondary" sx={{ animation: 'pulse 1.5s infinite' }}>
        Loading user data...
      </Typography>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </Box>
  );
};

export default LoadingSpinner;
