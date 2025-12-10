'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    Chip
} from '@mui/material';
import { HoursByProject } from '../../../_utils/types';

interface HoursByProjectCardProps {
    projectHours: HoursByProject;
}

const HoursByProjectCard: React.FC<HoursByProjectCardProps> = ({ projectHours }) => {
    const completionPercent = projectHours.plannedHours > 0
        ? (projectHours.actualHours / projectHours.plannedHours) * 100
        : 0;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography fontWeight={600}>
                            {projectHours.projectTitle}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            {projectHours.projectCode}
                        </Typography>
                    </Box>
                    <Chip
                        label={`${projectHours.actualHours}/${projectHours.plannedHours} hrs`}
                        color={projectHours.actualHours >= projectHours.plannedHours ? 'success' : 'warning'}
                    />
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={completionPercent}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="#64748b">
                        Remaining: {projectHours.remainingHours} hrs
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                        {Math.round(completionPercent)}% Complete
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default HoursByProjectCard;