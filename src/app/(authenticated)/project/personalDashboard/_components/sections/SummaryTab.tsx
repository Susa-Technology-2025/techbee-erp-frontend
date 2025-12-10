'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LinkIcon from '@mui/icons-material/Link';
import { DashboardData } from '../../../_utils/types';
import { formatDate } from '../../../_utils/helpers';

interface SummaryTabProps {
    data: DashboardData;
    timeWindow: {
        from: string;
        to: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data, timeWindow, user }) => {
    const { myTasks, myProjects, tasksIAssigned, team, goals, myWeek, upcomingDeadlines } = data;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <AssessmentIcon sx={{ color: '#4361ee' }} />
                    Data Summary & Statistics
                </Typography>

                {/* Data Overview Cards */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <TaskIcon color="primary" />
                                <Typography variant="subtitle2" color="text.secondary">My Tasks</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{myTasks.all.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total: {myTasks.summary.total.count} • Upcoming: {myTasks.upcoming.length} • Overdue: {myTasks.overdue.length} • Completed: {myTasks.completed.length}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <FolderIcon color="secondary" />
                                <Typography variant="subtitle2" color="text.secondary">Projects</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{myProjects.recent.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Active: {myProjects.summary.totalActive} • Completed: {myProjects.summary.totalCompleted} • Pending: {myProjects.summary.totalPending}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AssignmentIcon color="info" />
                                <Typography variant="subtitle2" color="text.secondary">Assigned Tasks</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{tasksIAssigned.all.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Active: {tasksIAssigned.activeItems.length} • Overdue: {tasksIAssigned.overdue.length} • Completed: {tasksIAssigned.completed.length}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <PeopleIcon color="success" />
                                <Typography variant="subtitle2" color="text.secondary">Team</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{team.members.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Active: {team.summary.activeMembers} • Available: {team.summary.availableMembers}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <TrackChangesIcon color="warning" />
                                <Typography variant="subtitle2" color="text.secondary">Goals</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{goals.quarterly.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                On Track: {goals.summary.onTrack} • At Risk: {goals.summary.atRisk} • Completed: {goals.summary.completed}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <AccessTimeIcon color="error" />
                                <Typography variant="subtitle2" color="text.secondary">This Week</Typography>
                            </Box>
                            <Typography variant="h4" fontWeight={700}>{myWeek.timeEntries.length}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Time Entries: {myWeek.timeEntries.length} • Projects Tracked: {myWeek.hoursByProject.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Data Tables */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Detailed Data Breakdown
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data Category</TableCell>
                                <TableCell align="right">Count</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>My Tasks (All)</TableCell>
                                <TableCell align="right">{myTasks.all.length}</TableCell>
                                <TableCell>View in My Tasks tab</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>My Tasks (Upcoming)</TableCell>
                                <TableCell align="right">{myTasks.upcoming.length}</TableCell>
                                <TableCell>Due in the future</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>My Tasks (Overdue)</TableCell>
                                <TableCell align="right">{myTasks.overdue.length}</TableCell>
                                <TableCell>Past due date</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>My Tasks (Completed)</TableCell>
                                <TableCell align="right">{myTasks.completed.length}</TableCell>
                                <TableCell>Finished tasks</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Projects</TableCell>
                                <TableCell align="right">{myProjects.recent.length}</TableCell>
                                <TableCell>Active: {myProjects.summary.totalActive}, Completed: {myProjects.summary.totalCompleted}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tasks I Assigned (All)</TableCell>
                                <TableCell align="right">{tasksIAssigned.all.length}</TableCell>
                                <TableCell>View in Assigned Tasks tab</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tasks I Assigned (Active)</TableCell>
                                <TableCell align="right">{tasksIAssigned.activeItems.length}</TableCell>
                                <TableCell>Currently in progress</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Team Members</TableCell>
                                <TableCell align="right">{team.members.length}</TableCell>
                                <TableCell>Available: {team.summary.availableMembers}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Goals</TableCell>
                                <TableCell align="right">{goals.quarterly.length}</TableCell>
                                <TableCell>On Track: {goals.summary.onTrack}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Time Entries (This Week)</TableCell>
                                <TableCell align="right">{myWeek.timeEntries.length}</TableCell>
                                <TableCell>Logged work hours</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Upcoming Deadlines</TableCell>
                                <TableCell align="right">{upcomingDeadlines.length}</TableCell>
                                <TableCell>Tasks and projects with approaching deadlines</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* API Response Info */}
                <Card variant="outlined" sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinkIcon />
                            Period
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Dashboard Period: {formatDate(timeWindow.from)} to {formatDate(timeWindow.to)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            User: {user.name} ({user.email})
                        </Typography>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default SummaryTab;