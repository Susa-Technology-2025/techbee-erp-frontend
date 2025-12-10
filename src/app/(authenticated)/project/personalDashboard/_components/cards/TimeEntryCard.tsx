'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import { TimeEntry } from '../../../_utils/types';
import { getStatusColor, formatDate, formatTime } from '../../../_utils/helpers';

interface TimeEntryCardProps {
    entry: TimeEntry;
}

const TimeEntryCard: React.FC<TimeEntryCardProps> = ({ entry }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography fontWeight={600} variant="body1">
                        {entry.wbsItemTitle}
                    </Typography>
                    <Chip
                        label={`${entry.durationHours}h`}
                        size="small"
                        color="primary"
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {entry.projectTitle} ({entry.projectCode})
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(entry.workDate)} • {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                    </Typography>
                    <Chip
                        label={entry.billable ? 'Billable' : 'Non-billable'}
                        size="small"
                        color={entry.billable ? 'success' : 'default'}
                    />
                </Box>
                {entry.notes && (
                    <Typography variant="caption" color="text.secondary">
                        Notes: {entry.notes}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                        label={entry.type}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={entry.approvalStatus}
                        size="small"
                        color={getStatusColor(entry.approvalStatus)}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TimeEntryCard;