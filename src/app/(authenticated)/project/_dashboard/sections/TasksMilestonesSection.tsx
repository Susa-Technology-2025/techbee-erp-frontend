'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Collapse,
    Paper,
    Stack,
    Chip,
    alpha
} from '@mui/material';
import DataCard from '../_components/DataCard';
import NoDataMessage from '../_components/NoDataMessage';
import TaskMenuDialog from '../TaskMenuDialog';
import { colors, formatDateTime, mainTaskAPI } from '../../_utils/consts';
import {
    Task,
    CheckCircle,
    AccessTime as AccessTimeIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Schedule
} from '@mui/icons-material';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import WbsItemCreateInput from '../../wbsItems/_components/Form';

interface TasksMilestonesSectionProps {
    dashboardData: any;
    expanded: boolean;
    taskFilter: 'all' | 'completed' | 'overdue';
    setTaskFilter: (filter: 'all' | 'completed' | 'overdue') => void;
    milestoneFilter: 'all' | 'completed' | 'overdue';
    setMilestoneFilter: (filter: 'all' | 'completed' | 'overdue') => void;
    refetch: () => void;
    apiUrl: string;
}

const TasksMilestonesSection: React.FC<TasksMilestonesSectionProps> = ({
    dashboardData,
    expanded,
    taskFilter,
    setTaskFilter,
    milestoneFilter,
    setMilestoneFilter,
    refetch,
    apiUrl
}) => {
    const formatDateTime = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return format(parseISO(dateString), 'MMM dd, yyyy');
    };

    // Filter tasks based on selected filter
    const filteredTasks = useMemo(() => {
        if (!dashboardData?.tasksAndMilestones) return [];

        switch (taskFilter) {
            case 'completed':
                return dashboardData.tasksAndMilestones.upcomingTasks30Days?.filter((task: any) =>
                    task.completionStatus === 'Completed'
                ) || [];
            case 'overdue':
                return dashboardData.tasksAndMilestones.overdueTasks || [];
            case 'all':
            default:
                return [
                    ...(dashboardData.tasksAndMilestones.overdueTasks || []),
                    ...(dashboardData.tasksAndMilestones.upcomingTasks30Days || [])
                ];
        }
    }, [dashboardData, taskFilter]);

    // Filter milestones based on selected filter
    const filteredMilestones = useMemo(() => {
        if (!dashboardData?.tasksAndMilestones) return [];

        const allMilestones = [
            ...(dashboardData.tasksAndMilestones.overdueMilestones || []),
            ...(dashboardData.tasksAndMilestones.upcomingMilestones30Days || [])
        ];

        switch (milestoneFilter) {
            case 'completed':
                return allMilestones.filter((milestone: any) =>
                    milestone.completionStatus === 'Completed'
                );
            case 'overdue':
                return dashboardData.tasksAndMilestones.overdueMilestones || [];
            case 'all':
            default:
                return allMilestones;
        }
    }, [dashboardData, milestoneFilter]);

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: colors.teal,
                    fontSize: '1.125rem'
                }}>
                    Tasks & Milestones
                </Typography>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                    {/* Task Summary */}
                    <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                        <DataCard title="Task Summary" icon={Task} color={colors.teal} defaultExpanded={true}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    minWidth: 100,
                                    bgcolor: alpha(colors.teal, 0.04),
                                    border: `1px solid ${alpha(colors.teal, 0.15)}`,
                                    borderRadius: 1.5
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.teal,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.tasksAndMilestones.taskSummary.totalTasks}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.teal,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Total Tasks
                                    </Typography>
                                </Paper>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    minWidth: 100,
                                    bgcolor: alpha(colors.success, 0.04),
                                    border: `1px solid ${alpha(colors.success, 0.15)}`,
                                    borderRadius: 1.5
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.success,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.tasksAndMilestones.taskSummary.completedTasks}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.success,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Completed
                                    </Typography>
                                </Paper>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    minWidth: 100,
                                    bgcolor: alpha(colors.error, 0.04),
                                    border: `1px solid ${alpha(colors.error, 0.15)}`,
                                    borderRadius: 1.5
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.error,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.tasksAndMilestones.taskSummary.overdueTasks}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.error,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Overdue
                                    </Typography>
                                </Paper>
                            </Box>

                            {/* Task Filter Chips */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                <Chip
                                    icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                    label={`All: ${dashboardData.tasksAndMilestones.taskSummary.totalTasks}`}
                                    variant={taskFilter === 'all' ? 'filled' : 'outlined'}
                                    color={taskFilter === 'all' ? 'primary' : 'default'}
                                    onClick={() => setTaskFilter('all')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.primary,
                                        color: taskFilter === 'all' ? 'white' : colors.primary,
                                        bgcolor: taskFilter === 'all' ? colors.primary : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                    label={`Completed: ${dashboardData.tasksAndMilestones.taskSummary.completedTasks}`}
                                    variant={taskFilter === 'completed' ? 'filled' : 'outlined'}
                                    color={taskFilter === 'completed' ? 'success' : 'default'}
                                    onClick={() => setTaskFilter('completed')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.success,
                                        color: taskFilter === 'completed' ? 'white' : colors.success,
                                        bgcolor: taskFilter === 'completed' ? colors.success : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    icon={<ErrorIcon sx={{ fontSize: 14 }} />}
                                    label={`Overdue: ${dashboardData.tasksAndMilestones.taskSummary.overdueTasks}`}
                                    variant={taskFilter === 'overdue' ? 'filled' : 'outlined'}
                                    color={taskFilter === 'overdue' ? 'error' : 'default'}
                                    onClick={() => setTaskFilter('overdue')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.error,
                                        color: taskFilter === 'overdue' ? 'white' : colors.error,
                                        bgcolor: taskFilter === 'overdue' ? colors.error : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                            </Box>

                            {/* Filtered Tasks */}
                            {filteredTasks.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {filteredTasks.map((task: any) => (
                                        <Box key={task.id} sx={{ position: 'relative' }}>
                                            <Link
                                                href={`/project/${task.projectId}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Paper sx={{
                                                    p: 1.5,
                                                    borderRadius: 1.5,
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    border: `1px solid ${alpha(colors.teal, 0.15)}`,
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.teal, 0.04),
                                                        borderColor: colors.teal
                                                    }
                                                }}>
                                                    {/* Top section with menu button */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        mb: 1
                                                    }}>
                                                        <Box sx={{ flex: 1, pr: 1 }}>
                                                            <Typography variant="subtitle2" sx={{
                                                                fontWeight: 600,
                                                                mb: 0.5,
                                                                fontSize: '0.8125rem'
                                                            }}>
                                                                {task.title}
                                                            </Typography>
                                                        </Box>

                                                        {/* Menu button positioned at top-right */}
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                zIndex: 1
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <TaskMenuDialog
                                                                task={task}
                                                                colors={colors}
                                                                refetch={refetch}
                                                                TaskCreateInputForm={WbsItemCreateInput}
                                                                apiUrl={mainTaskAPI}
                                                            />
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="caption" sx={{
                                                        color: colors.gray,
                                                        display: 'block',
                                                        mb: 0.75,
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Project: {task.projectTitle}
                                                    </Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Typography variant="caption" sx={{
                                                            color: colors.gray,
                                                            fontSize: '0.75rem'
                                                        }}>
                                                            {task.code}
                                                        </Typography>
                                                        <Chip
                                                            label={`Due: ${formatDateTime(task.plannedEndDate)}`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            </Link>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage message={`No ${taskFilter} tasks found`} />
                            )}

                            {/* Due Date Chips */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Chip
                                    icon={<Schedule sx={{ fontSize: 14 }} />}
                                    label={`Due in 7 days: ${dashboardData.tasksAndMilestones.taskSummary.tasksDueIn7Days}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: colors.warning,
                                        color: colors.warning,
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    icon={<Schedule sx={{ fontSize: 14 }} />}
                                    label={`Due in 30 days: ${dashboardData.tasksAndMilestones.taskSummary.tasksDueIn30Days}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: colors.info,
                                        color: colors.info,
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                            </Box>
                        </DataCard>
                    </Box>

                    {/* Milestone Summary */}
                    <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                        <DataCard title="Milestone Summary" icon={CheckCircle} color={colors.purple} defaultExpanded={true}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    minWidth: 100,
                                    bgcolor: alpha(colors.purple, 0.04),
                                    border: `1px solid ${alpha(colors.purple, 0.15)}`,
                                    borderRadius: 1.5
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.purple,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.tasksAndMilestones.milestoneSummary.totalMilestones}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.purple,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Total Milestones
                                    </Typography>
                                </Paper>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    minWidth: 100,
                                    bgcolor: alpha(colors.success, 0.04),
                                    border: `1px solid ${alpha(colors.success, 0.15)}`,
                                    borderRadius: 1.5
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.success,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.tasksAndMilestones.milestoneSummary.completedMilestones}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.success,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Completed
                                    </Typography>
                                </Paper>
                            </Box>

                            {/* Milestone Filter Chips */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                <Chip
                                    label={`All: ${dashboardData.tasksAndMilestones.milestoneSummary.totalMilestones}`}
                                    variant={milestoneFilter === 'all' ? 'filled' : 'outlined'}
                                    color={milestoneFilter === 'all' ? 'primary' : 'default'}
                                    onClick={() => setMilestoneFilter('all')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.purple,
                                        color: milestoneFilter === 'all' ? 'white' : colors.purple,
                                        bgcolor: milestoneFilter === 'all' ? colors.purple : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    label={`Completed: ${dashboardData.tasksAndMilestones.milestoneSummary.completedMilestones}`}
                                    variant={milestoneFilter === 'completed' ? 'filled' : 'outlined'}
                                    color={milestoneFilter === 'completed' ? 'success' : 'default'}
                                    onClick={() => setMilestoneFilter('completed')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.success,
                                        color: milestoneFilter === 'completed' ? 'white' : colors.success,
                                        bgcolor: milestoneFilter === 'completed' ? colors.success : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    label={`Overdue: ${dashboardData.tasksAndMilestones.milestoneSummary.overdueMilestones}`}
                                    variant={milestoneFilter === 'overdue' ? 'filled' : 'outlined'}
                                    color={milestoneFilter === 'overdue' ? 'error' : 'default'}
                                    onClick={() => setMilestoneFilter('overdue')}
                                    clickable
                                    size="small"
                                    sx={{
                                        borderColor: colors.error,
                                        color: milestoneFilter === 'overdue' ? 'white' : colors.error,
                                        bgcolor: milestoneFilter === 'overdue' ? colors.error : 'transparent',
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                            </Box>

                            {/* Filtered Milestones */}
                            {filteredMilestones.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {filteredMilestones.map((milestone: any, index: number) => (
                                        <Link
                                            key={milestone.id}
                                            href={`/project/${milestone.projectId}/milestone/${milestone.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Paper sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                cursor: 'pointer',
                                                border: `1px solid ${alpha(colors.purple, 0.15)}`,
                                                '&:hover': {
                                                    bgcolor: alpha(colors.purple, 0.04),
                                                    borderColor: colors.purple
                                                }
                                            }}>
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {milestone.title || `Milestone ${index + 1}`}
                                                </Typography>
                                            </Paper>
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage message={`No ${milestoneFilter} milestones found`} />
                            )}

                            {/* Due Date Chips */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                <Chip
                                    label={`Due in 7 days: ${dashboardData.tasksAndMilestones.milestoneSummary.milestonesDueIn7Days}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: colors.warning,
                                        color: colors.warning,
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                                <Chip
                                    label={`Due in 30 days: ${dashboardData.tasksAndMilestones.milestoneSummary.milestonesDueIn30Days}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: colors.info,
                                        color: colors.info,
                                        fontSize: '0.75rem',
                                        height: 24
                                    }}
                                />
                            </Box>
                        </DataCard>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default TasksMilestonesSection;