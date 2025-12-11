'use client';

import React from 'react';
import {
    Box,
    Typography,
    alpha
} from '@mui/material';
import { Description } from '@mui/icons-material';

interface NoDataMessageProps {
    message?: string;
}

const NoDataMessage: React.FC<NoDataMessageProps> = ({ message = "No data available" }) => (
    <Box sx={{
        py: 3,
        textAlign: 'center',
        bgcolor: alpha('#000', 0.02),
        borderRadius: 1.5
    }}>
        <Description sx={{ fontSize: 36, color: alpha('#000', 0.15), mb: 1 }} />
        <Typography variant="body2" sx={{
            color: alpha('#000', 0.4),
            fontSize: '0.8125rem'
        }}>
            {message}
        </Typography>
    </Box>
);

export default NoDataMessage;