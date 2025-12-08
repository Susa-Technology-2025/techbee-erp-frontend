import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface TabEmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const TabEmptyState: React.FC<TabEmptyStateProps> = ({ title, description, icon }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 180,
      py: 4,
      color: 'text.secondary',
      textAlign: 'center',
      gap: 2,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      p: 2,
    }}
  >
    <Box sx={{ fontSize: 56, color: 'primary.light', mb: 1 }}>
      {icon || <InfoOutlinedIcon fontSize="inherit" />}
    </Box>
    <Typography variant="h6" fontWeight={700} color="text.primary">
      {title}
    </Typography>
    {description && (
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 340 }}>
        {description}
      </Typography>
    )}
  </Box>
);

export default TabEmptyState; 