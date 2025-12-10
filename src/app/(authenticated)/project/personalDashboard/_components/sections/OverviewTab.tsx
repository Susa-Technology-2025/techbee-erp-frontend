'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { DashboardData } from '../../../_utils/types';
import GoalCard from '../cards/GoalCard';
import UpcomingDeadlineCard from '../cards/UpcomingDeadlineCard';
import ProjectMenuDialog from '../../../_dashboard/ProjectMenuDialog';
import { getStatusColor } from '../../../_utils/helpers';
import { colors, mainProjectAPI, formatCurrency } from '../../../_utils/consts';
import ProjectCreateInputForm from '../../../projects/_components/Form';

interface OverviewTabProps {
    data: DashboardData;
    onViewAllProjects: () => void;
    onViewAllTasks: () => void;
    refetch: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    data,
    onViewAllProjects,
    onViewAllTasks,
    refetch
}) => {
    const { myTasks, myProjects, tasksIAssigned, team, goals, upcomingDeadlines } = data;

    return (
        <>
            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #4361ee' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                    {myTasks.summary.total.count}
                                </Typography>
                                <Typography color="#64748b" variant="body2" gutterBottom>
                                    Total Tasks
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Upcoming</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {myTasks.summary.upcoming.count}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(myTasks.summary.upcoming.count / myTasks.summary.total.count) * 100}
                                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Completed</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {myTasks.summary.completed.count}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(myTasks.summary.completed.count / myTasks.summary.total.count) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ color: '#e0e7ff', fontSize: 40 }}>
                                <TaskIcon fontSize="inherit" />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #10b981' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                    {myProjects.summary.totalProjects}
                                </Typography>
                                <Typography color="#64748b" variant="body2" gutterBottom>
                                    Total Projects
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Active</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {myProjects.summary.totalActive}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(myProjects.summary.totalActive / myProjects.summary.totalProjects) * 100}
                                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Completed</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {myProjects.summary.totalCompleted}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(myProjects.summary.totalCompleted / myProjects.summary.totalProjects) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ color: '#d1fae5', fontSize: 40 }}>
                                <FolderIcon fontSize="inherit" />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #f59e0b' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                    {tasksIAssigned.summary.total}
                                </Typography>
                                <Typography color="#64748b" variant="body2" gutterBottom>
                                    Tasks Assigned
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Active</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {tasksIAssigned.summary.active}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(tasksIAssigned.summary.active / tasksIAssigned.summary.total) * 100}
                                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Overdue</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {tasksIAssigned.summary.overdue}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(tasksIAssigned.summary.overdue / tasksIAssigned.summary.total) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ color: '#fef3c7', fontSize: 40 }}>
                                <AssignmentIcon fontSize="inherit" />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #8b5cf6' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                    {team.summary.totalMembers}
                                </Typography>
                                <Typography color="#64748b" variant="body2" gutterBottom>
                                    Team Members
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Active</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {team.summary.activeMembers}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(team.summary.activeMembers / team.summary.totalMembers) * 100}
                                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption">Available</Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                            {team.summary.availableMembers}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(team.summary.availableMembers / team.summary.totalMembers) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ color: '#ede9fe', fontSize: 40 }}>
                                <PeopleIcon fontSize="inherit" />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Goals Section */}
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrackChangesIcon sx={{ color: '#4361ee' }} />
                Quarterly Goals Progress ({goals.summary.total})
            </Typography>
            {goals.quarterly.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                    {goals.quarterly.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </Box>
            ) : (
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <TrackChangesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No goals set for this quarter
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <HistoryIcon sx={{ color: '#4361ee' }} />
                                Recent Projects ({myProjects.recent.length})
                            </Typography>
                            {myProjects.recent.length > 0 ? (
                                <>
                                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                        {myProjects.recent.slice(0, 4).map((project) => (
                                            <Box key={project.projectId} sx={{ position: 'relative' }}>
                                                <ListItem
                                                    onClick={() => window.open(`/project/${project.projectId}`, '_blank')}
                                                    sx={{
                                                        borderBottom: '1px solid #e2e8f0',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                        '&:hover': {
                                                            bgcolor: '#f1f5f9',
                                                            '& .project-menu': {
                                                                opacity: 1
                                                            }
                                                        },
                                                        py: 1.5
                                                    }}
                                                    secondaryAction={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={project.projectStage}
                                                                size="small"
                                                                color={getStatusColor(project.projectStage)}
                                                                sx={{ height: 24 }}
                                                            />
                                                            <Box
                                                                className="project-menu"
                                                                sx={{
                                                                    // opacity: 0,
                                                                    transition: 'opacity 0.2s',

                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <ProjectMenuDialog
                                                                    project={project}
                                                                    colors={colors}
                                                                    refetch={refetch}
                                                                    apiUrl={mainProjectAPI}
                                                                    formatCurrency={formatCurrency}
                                                                    ProjectCreateInputForm={ProjectCreateInputForm}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{
                                                            bgcolor: '#e0e7ff',
                                                            width: 40,
                                                            height: 40
                                                        }}>
                                                            <FolderIcon sx={{ color: '#4361ee' }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography fontWeight={600} noWrap>
                                                                {project.title}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                <Typography variant="caption" color="#64748b">
                                                                    {project.projectType}
                                                                </Typography>
                                                                {project.totalPercentCompletion !== null && (
                                                                    <>
                                                                        <Typography variant="caption" color="#64748b">•</Typography>
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 0.5
                                                                        }}>
                                                                            <Box sx={{
                                                                                width: 40,
                                                                                height: 4,
                                                                                bgcolor: '#e2e8f0',
                                                                                borderRadius: 2,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box sx={{
                                                                                    width: `${project.totalPercentCompletion}%`,
                                                                                    height: '100%',
                                                                                    bgcolor: project.totalPercentCompletion >= 75 ? '#10B981' :
                                                                                        project.totalPercentCompletion >= 50 ? '#F59E0B' : '#EF4444'
                                                                                }} />
                                                                            </Box>
                                                                            <Typography variant="caption" color="#64748b">
                                                                                {project.totalPercentCompletion}%
                                                                            </Typography>
                                                                        </Box>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        }
                                                        sx={{
                                                            '& .MuiListItemText-primary': {
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            </Box>
                                        ))}
                                    </List>
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Button
                                            onClick={onViewAllProjects}
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            View All Projects ({myProjects.recent.length})
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No recent projects
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <ScheduleIcon sx={{ color: '#4361ee' }} />
                                Upcoming Deadlines ({upcomingDeadlines.length})
                            </Typography>
                            {upcomingDeadlines.length > 0 ? (
                                <>
                                    {upcomingDeadlines.slice(0, 4).map((deadline, index) => (
                                        <UpcomingDeadlineCard key={index} deadline={deadline} refetch={refetch} />
                                    ))}
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Button onClick={onViewAllTasks}>
                                            View All Tasks
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No upcoming deadlines
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    );
};

export default OverviewTab;