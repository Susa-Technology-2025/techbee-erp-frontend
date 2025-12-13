'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TaskIcon from '@mui/icons-material/Task';
import { Task } from '../../../_utils/types';
import TaskCardGrid from '../cards/TaskCardGrid';
import TaskMenuDialog from '../../../_dashboard/TaskMenuDialog';
import { getPriorityColor, getStatusColor, formatDate } from '../../../_utils/helpers';
import { colors } from '../../../_utils/consts';
import WbsItemCreateInput from '../../../wbsItems/_components/Form';
import { NewTaskCreateButton } from '../buttons/NewTaskcreateButton';

interface TasksTabProps {
    myTasks: {
        all: Task[];
        upcoming: Task[];
        overdue: Task[];
        completed: Task[];
        summary: any;
    };
    taskViewType: 'all' | 'upcoming' | 'overdue' | 'completed';
    viewMode: 'list' | 'grid';
    searchQuery: string;
    filteredTasks: Task[];
    sortedTasks: Task[];
    onTaskViewTypeChange: (type: 'all' | 'upcoming' | 'overdue' | 'completed') => void;
    onViewModeChange: () => void;
    onSearchChange: (query: string) => void;
    onClearFilters: () => void;
    onTaskClick: (task: Task) => void;
    refetch: () => void;
}

const TasksTab: React.FC<TasksTabProps> = ({
    myTasks,
    taskViewType,
    viewMode,
    searchQuery,
    filteredTasks,
    sortedTasks,
    onTaskViewTypeChange,
    onViewModeChange,
    onSearchChange,
    onClearFilters,
    onTaskClick,
    refetch
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                {/* Task Filter Buttons Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant={taskViewType === 'all' ? 'contained' : 'outlined'}
                            onClick={() => onTaskViewTypeChange('all')}
                            size="small"
                            sx={{
                                bgcolor: taskViewType === 'all' ? '#4361ee' : 'transparent',
                                color: taskViewType === 'all' ? 'white' : '#4361ee',
                                borderColor: '#4361ee',
                                '&:hover': {
                                    bgcolor: taskViewType === 'all' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                }
                            }}
                        >
                            All ({myTasks.all.length})
                        </Button>
                        <Button
                            variant={taskViewType === 'upcoming' ? 'contained' : 'outlined'}
                            onClick={() => onTaskViewTypeChange('upcoming')}
                            size="small"
                            sx={{
                                bgcolor: taskViewType === 'upcoming' ? '#4361ee' : 'transparent',
                                color: taskViewType === 'upcoming' ? 'white' : '#4361ee',
                                borderColor: '#4361ee',
                                '&:hover': {
                                    bgcolor: taskViewType === 'upcoming' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                }
                            }}
                        >
                            Upcoming ({myTasks.upcoming.length})
                        </Button>
                        <Button
                            variant={taskViewType === 'overdue' ? 'contained' : 'outlined'}
                            onClick={() => onTaskViewTypeChange('overdue')}
                            size="small"
                            sx={{
                                bgcolor: taskViewType === 'overdue' ? '#dc3545' : 'transparent',
                                color: taskViewType === 'overdue' ? 'white' : '#dc3545',
                                borderColor: taskViewType === 'overdue' ? '#dc3545' : 'rgba(220, 53, 69, 0.5)',
                                '&:hover': {
                                    bgcolor: taskViewType === 'overdue' ? '#bd2130' : 'rgba(220, 53, 69, 0.04)'
                                }
                            }}
                        >
                            Overdue ({myTasks.overdue.length})
                        </Button>
                        <Button
                            variant={taskViewType === 'completed' ? 'contained' : 'outlined'}
                            onClick={() => onTaskViewTypeChange('completed')}
                            size="small"
                            sx={{
                                bgcolor: taskViewType === 'completed' ? '#10b981' : 'transparent',
                                color: taskViewType === 'completed' ? 'white' : '#10b981',
                                borderColor: taskViewType === 'completed' ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                                '&:hover': {
                                    bgcolor: taskViewType === 'completed' ? '#0da271' : 'rgba(16, 185, 129, 0.04)'
                                }
                            }}
                        >
                            Completed ({myTasks.completed.length})
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton onClick={onViewModeChange}>
                            {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {/* Add summary chips for current view */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<ScheduleIcon />}
                        label={`${filteredTasks.length} tasks`}
                        variant="outlined"
                        size="small"
                    />
                    {taskViewType === 'all' && (
                        <>
                            <Chip
                                icon={<ErrorIcon />}
                                label={`${myTasks.overdue.length} overdue`}
                                variant="outlined"
                                size="small"
                                color="error"
                            />
                            <Chip
                                icon={<CheckIcon />}
                                label={`${myTasks.completed.length} completed`}
                                variant="outlined"
                                size="small"
                                color="success"
                            />
                            <Chip
                                icon={<HourglassEmptyIcon />}
                                label={`${myTasks.upcoming.length} upcoming`}
                                variant="outlined"
                                size="small"
                                color="info"
                            />
                        </>
                    )}
                </Box>

                {/* Tasks Display */}
                {filteredTasks.length > 0 ? (
                    viewMode === 'list' ? (
                        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                            {sortedTasks.map((task) => (
                                <ListItem
                                    key={task.wbsItemId}
                                    sx={{
                                        borderBottom: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                    onClick={() => onTaskClick(task)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{
                                            bgcolor: taskViewType === 'overdue' ? '#fee2e2' :
                                                taskViewType === 'completed' ? '#d1fae5' : '#e0e7ff'
                                        }}>
                                            <TaskIcon sx={{
                                                color: taskViewType === 'overdue' ? '#dc3545' :
                                                    taskViewType === 'completed' ? '#10b981' : '#4361ee'
                                            }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                <Typography fontWeight={600}>
                                                    {task.title}
                                                </Typography>
                                                {taskViewType === 'overdue' && (
                                                    <ErrorIcon fontSize="small" color="error" />
                                                )}
                                                {taskViewType === 'completed' && (
                                                    <CheckIcon fontSize="small" color="success" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="#64748b">
                                                    {task.projectTitle} • {task.projectType} • Due: {formatDate(task.plannedEndDate)}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={task.percentCompletion || 0}
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        width: "200px",
                                                        mt: 1,
                                                        bgcolor: taskViewType === 'completed' ? '#d1fae5' : '#e2e8f0'
                                                    }}
                                                />
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: getPriorityColor(task.priority)
                                                }} />
                                                <Typography variant="caption" color="#64748b">
                                                    {task.priority?.toUpperCase() || 'No priority'}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={task.taskStage}
                                                size="small"
                                                color={getStatusColor(task.taskStage)}
                                            />
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

                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 3,
                            }}
                        >
                            {sortedTasks.map((task) => (
                                <TaskCardGrid
                                    key={task.wbsItemId}
                                    task={task}
                                    isOverdue={myTasks.overdue.some(t => t.wbsItemId === task.wbsItemId)}
                                    isCompleted={myTasks.completed.some(t => t.wbsItemId === task.wbsItemId)}
                                    refetch={refetch}
                                />
                            ))}
                        </Box>
                    )
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            {taskViewType === 'upcoming' && 'No upcoming tasks found.'}
                            {taskViewType === 'overdue' && 'No overdue tasks found.'}
                            {taskViewType === 'completed' && 'No completed tasks found.'}
                            {taskViewType === 'all' && 'No tasks found.'}
                        </Typography>
                        {searchQuery && (
                            <Button onClick={onClearFilters} sx={{ mt: 2 }}>
                                Clear all filters
                            </Button>
                        )}
                        <NewTaskCreateButton />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TasksTab;