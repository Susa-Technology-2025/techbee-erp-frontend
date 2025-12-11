'use client';

import React from 'react';
import {
    Box,
    LinearProgress,
    Typography,
    alpha
} from '@mui/material';

interface ProgressBarWithLabelProps {
    value: number;
    color: string;
}

const ProgressBarWithLabel: React.FC<ProgressBarWithLabelProps> = ({ value, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={Math.min(value, 100)}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(color, 0.15),
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 3,
                    },
                }}
            />
        </Box>
        <Typography variant="body2" sx={{
            color: color,
            fontWeight: 600,
            minWidth: 35,
            fontSize: '0.75rem'
        }}>
            {value}%
        </Typography>
    </Box>
);

export default ProgressBarWithLabel;