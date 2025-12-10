'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import { HoursByProject, TimeEntry } from '../../../_utils/types';
import HoursByProjectCard from '../cards/HoursByProjectCard';
import TimeEntryCard from '../cards/TimeEntryCard';
import { formatDate } from '../../../_utils/helpers';

interface WeekTabProps {
    myWeek: {
        weekRange: {
            start: string;
            end: string;
        };
        hoursByProject: HoursByProject[];
        timeEntries: TimeEntry[];
        tasksDueThisWeek: number;
        tasksCompletedThisWeek: number;
        overdueTasks: number;
    };
}

const WeekTab: React.FC<WeekTabProps> = ({ myWeek }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <CalendarTodayIcon sx={{ color: '#4361ee' }} />
                    My Week Overview
                    <Typography variant="caption" color="#64748b" sx={{ ml: 1 }}>
                        {formatDate(myWeek.weekRange.start)} - {formatDate(myWeek.weekRange.end)}
                    </Typography>
                </Typography>

                {/* Week Summary Stats */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                    {myWeek.tasksDueThisWeek}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Tasks Due This Week
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                    {myWeek.tasksCompletedThisWeek}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Tasks Completed
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                    {myWeek.overdueTasks}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Overdue Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                    {myWeek.timeEntries.length}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Time Entries
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#ec4899">
                                    {myWeek.hoursByProject.length}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Projects Tracked
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Hours by Project */}
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccessTimeIcon />
                    Hours by Project ({myWeek.hoursByProject.length})
                </Typography>
                {myWeek.hoursByProject.length > 0 ? (
                    <Box sx={{ mb: 4 }}>
                        {myWeek.hoursByProject.map((projectHours, index) => (
                            <HoursByProjectCard key={index} projectHours={projectHours} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ mb: 4, textAlign: 'center', py: 4 }}>
                        <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No hours logged for projects this week
                        </Typography>
                    </Box>
                )}

                {/* Time Entries */}
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <WorkIcon />
                    Recent Time Entries ({myWeek.timeEntries.length})
                </Typography>
                {myWeek.timeEntries.length > 0 ? (
                    <Box>
                        {myWeek.timeEntries.map((entry) => (
                            <TimeEntryCard key={entry.timeEntryId} entry={entry} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No time entries for this week
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default WeekTab;