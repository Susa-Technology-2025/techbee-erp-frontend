'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CTA = () => {
  return (
    <Box
      sx={{
        mt: 8,
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 16px 32px rgba(33, 150, 243, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, position: 'relative' }}>
        Ready to Transform Your Business?
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', position: 'relative' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 4,
            fontWeight: 600,
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
            },
          }}
        >
          Start Free Trial
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 4,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Request Demo
        </Button>
      </Box>
    </Box>
  );
};

export default CTA;
