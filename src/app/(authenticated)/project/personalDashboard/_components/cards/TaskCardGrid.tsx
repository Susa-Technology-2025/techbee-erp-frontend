'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Button,
    Avatar,
    LinearProgress,
    Chip,
    alpha
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link';
import TaskMenuDialog from '../../../_dashboard/TaskMenuDialog';
import { Task, TaskIAssigned } from '../../../_utils/types';
import { getPriorityColor, getStatusColor, formatDate } from '../../../_utils/helpers';
import { colors } from '../../../_utils/consts';
import WbsItemCreateInput from '../../../wbsItems/_components/Form';

interface TaskCardGridProps {
    task: Task | TaskIAssigned;
    isAssigned?: boolean;
    isOverdue?: boolean;
    isCompleted?: boolean;
    refetch?: () => void;
}

const TaskCardGrid: React.FC<TaskCardGridProps> = ({
    task,
    isAssigned = false,
    isOverdue = false,
    isCompleted = false,
    refetch
}) => {
    const assignedTask = task as TaskIAssigned;

    return (
        <Link href={`/project/${task.projectId}`} passHref>
            <Box sx={{ position: 'relative', height: '100%' }}>
                <Card sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                    },
                    borderLeft: isOverdue ? '4px solid #dc3545' :
                        isCompleted ? '4px solid #10b981' : '4px solid transparent'
                }}>
                    {/* Overdue/Completed Badge and Menu Button */}
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 2
                    }}>
                        {isOverdue && (
                            <Box sx={{
                                bgcolor: '#fee2e2',
                                color: '#dc3545',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <Warning fontSize="small" />
                                Overdue
                            </Box>
                        )}
                        {isCompleted && (
                            <Box sx={{
                                bgcolor: '#d1fae5',
                                color: '#10b981',
                                borderRadius: 1,
                                px: 1,
                                py: 0.5,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}>
                                <CheckCircle fontSize="small" />
                                Completed
                            </Box>
                        )}

                        {/* Menu Button - positioned at top-right */}
                        <Box onClick={(e) => e.stopPropagation()}>
                            <TaskMenuDialog
                                task={task}
                                colors={colors}
                                refetch={refetch}
                                apiUrl={""}
                                TaskCreateInputForm={WbsItemCreateInput}
                            />
                        </Box>
                    </Box>

                    {/* Card Header */}
                    <CardHeader
                        onClick={() => window.open(`/project/${task.projectId}`, '_blank')}
                        sx={{ cursor: 'pointer' }}
                        avatar={
                            <Avatar sx={{
                                bgcolor: isOverdue ? '#fee2e2' :
                                    isCompleted ? '#d1fae5' : '#e0e7ff'
                            }}>
                                <TaskIcon sx={{
                                    color: isOverdue ? '#dc3545' :
                                        isCompleted ? '#10b981' : '#4361ee'
                                }} />
                            </Avatar>
                        }
                        title={
                            <Typography variant="h6" fontWeight={600}>
                                {task.title}
                            </Typography>
                        }
                        subheader={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                <Chip label={task.projectType} size="small" />
                                {task.priority && (
                                    <Chip
                                        label={task.priority}
                                        size="small"
                                        sx={{
                                            bgcolor: getPriorityColor(task.priority),
                                            color: 'white'
                                        }}
                                    />
                                )}
                                {isAssigned && (
                                    <Chip
                                        icon={<AssignmentIcon />}
                                        label="Assigned"
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        }
                    />

                    {/* Card Content */}
                    <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Project: {task.projectTitle || task.projectCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {task.description || 'No description available'}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption">Progress</Typography>
                                <Typography variant="caption" fontWeight={600}>
                                    {task.percentCompletion !== null ? `${task.percentCompletion}%` : 'Not set'}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={task.percentCompletion || 0}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: alpha('#6366F1', 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: isOverdue ? '#dc3545' :
                                            isCompleted ? '#10b981' : '#6366F1'
                                    }
                                }}
                            />
                        </Box>

                        {/* Assigned To */}
                        {isAssigned && assignedTask.assignments && assignedTask.assignments.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Assigned to: {assignedTask.assignments.map(a => a.role).join(', ')}
                                </Typography>
                            </Box>
                        )}

                        {/* Due Date and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon fontSize="small" />
                                <Typography variant="caption">
                                    Due: {formatDate(task.plannedEndDate)}
                                </Typography>
                            </Box>
                            <Chip
                                label={task.taskStage}
                                size="small"
                                color={getStatusColor(task.taskStage)}
                            />
                        </Box>

                        {/* Duration */}
                        {task.durationDays !== null && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Duration: {task.durationDays} days
                            </Typography>
                        )}

                        {/* Approval Status */}
                        {task.approvalStatus && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Status: {task.approvalStatus}
                            </Typography>
                        )}
                    </CardContent>

                    {/* Card Actions */}
                    <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                // handleTaskClick(task); // Will be passed from parent
                            }}
                            sx={{ borderRadius: 1 }}
                        >
                            View Details
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Link>
    );
};

export default TaskCardGrid;