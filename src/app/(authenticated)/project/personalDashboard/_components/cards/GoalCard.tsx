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
import { Goal } from '../../../_utils/types';
import { getPriorityColor, getStatusColor, formatDate } from '../../../_utils/helpers';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
    return (
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>{goal.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip label={goal.category} size="small" />
                            {goal.priority && (
                                <Chip
                                    label={goal.priority}
                                    size="small"
                                    sx={{
                                        bgcolor: getPriorityColor(goal.priority),
                                        color: 'white'
                                    }}
                                />
                            )}
                            <Chip
                                label={goal.approvalStatus}
                                size="small"
                                color={getStatusColor(goal.approvalStatus)}
                            />
                        </Box>
                    </Box>
                    <Typography variant="h4" fontWeight={700} color="#4361ee">
                        {goal.percentCompletion}%
                    </Typography>
                </Box>
                <Typography variant="body2" color="#64748b" paragraph>
                    {goal.description || 'No description available'}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={goal.percentCompletion}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="caption" color="#64748b" display="block">
                            Owner: {goal.responsibleOwner}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            Team: {goal.assignedTeamOrDept}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="#64748b">
                        Due: {formatDate(goal.plannedEndDate)}
                    </Typography>
                </Box>
                {goal.billable !== null && (
                    <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 1 }}>
                        {goal.billable ? 'Billable' : 'Non-billable'}
                        {goal.billingAmount !== null && ` • $${goal.billingAmount}`}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default GoalCard;