'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip
} from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import { getPriorityColor } from '../../../_utils/helpers';
import TaskMenuDialog from '../../../_dashboard/TaskMenuDialog';
import ProjectMenuDialog from '../../../_dashboard/ProjectMenuDialog';
import { colors } from '../../../_utils/consts';
import WbsItemCreateInput from '../../../wbsItems/_components/Form';
import ProjectCreateInputForm from '../../../projects/_components/Form';

interface UpcomingDeadlineCardProps {
    deadline: any;
    refetch?: () => void;
}

const UpcomingDeadlineCard: React.FC<UpcomingDeadlineCardProps> = ({ deadline, refetch }) => {
    const isTask = deadline.type === 'wbsItem';
    const deadlineDate = new Date(deadline.deadline);
    const today = new Date();
    const daysDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Determine urgency color
    const getUrgencyColor = () => {
        if (daysDiff < 0) return '#dc3545'; // Overdue
        if (daysDiff <= 1) return '#ef4444'; // Due tomorrow/today
        if (daysDiff <= 3) return '#f59e0b'; // Due in 3 days
        if (daysDiff <= 7) return '#3b82f6'; // Due in a week
        return '#10b981'; // More than a week
    };

    const urgencyColor = getUrgencyColor();

    // Format the due text
    const dueText = daysDiff < 0 ? `${Math.abs(daysDiff)}d overdue` :
        daysDiff === 0 ? 'Due today' :
            daysDiff === 1 ? 'Due tomorrow' :
                `${daysDiff}d`;

    return (
        <Card sx={{
            mb: 2,
            position: 'relative',
            borderLeft: `4px solid ${urgencyColor}`,
            transition: 'all 0.2s ease',
            overflow: 'visible'
        }}>
            <CardContent sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                position: 'relative',
                pr: 8 // Leave space for menu button
            }}>
                {/* Avatar */}
                <Avatar sx={{
                    bgcolor: `${urgencyColor}15`,
                    width: 44,
                    height: 44,
                    mt: 0.5
                }}>
                    {isTask ?
                        <TaskIcon sx={{ color: urgencyColor, fontSize: 20 }} /> :
                        <FolderIcon sx={{ color: urgencyColor, fontSize: 20 }} />
                    }
                </Avatar>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* First row: Title + Due date */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 0.5
                    }}>
                        <Typography
                            fontWeight={600}
                            variant="body2"
                            sx={{
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                pr: 1
                            }}
                        >
                            {deadline.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Due date badge */}
                            <Box sx={{
                                bgcolor: `${urgencyColor}15`,
                                color: urgencyColor,
                                borderRadius: 1,
                                px: 1,
                                py: 0.25,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                            }}>
                                {dueText}
                            </Box>

                            {/* Menu button */}
                            <Box
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                {isTask ? (
                                    <TaskMenuDialog
                                        task={deadline}
                                        colors={colors}
                                        refetch={refetch}
                                        apiUrl={""}
                                        TaskCreateInputForm={WbsItemCreateInput}
                                    />
                                ) : (
                                    <ProjectMenuDialog
                                        project={deadline}
                                        colors={colors}
                                        refetch={refetch}
                                        apiUrl={""}
                                        formatCurrency={() => ''}
                                        ProjectCreateInputForm={ProjectCreateInputForm}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="caption"
                        color="#64748b"
                        sx={{
                            display: 'block',
                            mb: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {deadline.description || deadline.projectTitle}
                    </Typography>

                    {/* Second row: Chips + Progress */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1
                    }}>
                        {/* Chips */}
                        <Box sx={{
                            display: 'flex',
                            gap: 0.75,
                            flexWrap: 'wrap'
                        }}>
                            {deadline.priority && (
                                <Chip
                                    label={deadline.priority}
                                    size="small"
                                    sx={{
                                        bgcolor: getPriorityColor(deadline.priority),
                                        color: 'white',
                                        height: 20,
                                        fontSize: '0.7rem'
                                    }}
                                />
                            )}
                            <Chip
                                label={deadline.taskStage || (isTask ? 'Task' : 'Project')}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem'
                                }}
                            />
                            <Chip
                                label={deadline.projectType}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem'
                                }}
                            />
                        </Box>

                        {/* Progress */}
                        {deadline.percentCompletion !== null && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                flexShrink: 0
                            }}>
                                <Box sx={{
                                    width: 40,
                                    height: 4,
                                    bgcolor: '#e2e8f0',
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{
                                        width: `${deadline.percentCompletion}%`,
                                        height: '100%',
                                        bgcolor: urgencyColor
                                    }} />
                                </Box>
                                <Typography
                                    variant="caption"
                                    color={urgencyColor}
                                    fontWeight={600}
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    {deadline.percentCompletion}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UpcomingDeadlineCard;