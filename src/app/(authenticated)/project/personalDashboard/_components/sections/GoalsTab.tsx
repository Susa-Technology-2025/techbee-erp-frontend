'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { Goal } from '../../../_utils/types';
import GoalCard from '../cards/GoalCard';

interface GoalsTabProps {
    goals: {
        quarterly: Goal[];
        summary: {
            total: number;
            onTrack: number;
            atRisk: number;
            completed: number;
        };
    };
}

const GoalsTab: React.FC<GoalsTabProps> = ({ goals }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <TrackChangesIcon sx={{ color: '#4361ee' }} />
                    Quarterly Goals & Progress
                </Typography>

                {/* Goals Summary Stats */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                    {goals.summary.total}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Total Goals
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                    {goals.summary.onTrack}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    On Track
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                    {goals.summary.atRisk}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    At Risk
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                    {goals.summary.completed}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Completed
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {goals.quarterly.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                        {goals.quarterly.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <TrackChangesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No goals set for this quarter
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default GoalsTab;