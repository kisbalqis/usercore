
import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';
// Fix: Import Grid from @mui/material/Grid2 as it is not exported directly from @mui/material in this version
import Grid from '@mui/material/Grid2';

const UserSkeletonCard = () => (
  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
    <Skeleton variant="rectangular" height={100} animation="wave" />
    <CardContent sx={{ pt: 5 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
      </Box>
    </CardContent>
    <Box p={2}>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
    </Box>
  </Card>
);

const LoadingSkeleton: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
          <UserSkeletonCard />
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;
