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
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BoltIcon from '@mui/icons-material/Bolt';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { TaskIAssigned } from '../../../_utils/types';
import TaskCardGrid from '../cards/TaskCardGrid';
import { NewTaskCreateButton } from '../buttons/NewTaskcreateButton';

interface AssignedTasksTabProps {
    tasksIAssigned: {
        all: TaskIAssigned[];
        upcoming: TaskIAssigned[];
        overdue: TaskIAssigned[];
        completed: TaskIAssigned[];
        activeItems: TaskIAssigned[];
        summary: any;
    };
    assignedTaskViewType: 'all' | 'upcoming' | 'overdue' | 'completed' | 'active';
    filteredAssignedTasks: TaskIAssigned[];
    searchQuery: string;
    onAssignedTaskViewTypeChange: (type: 'all' | 'upcoming' | 'overdue' | 'completed' | 'active') => void;
    onSearchChange: (query: string) => void;
    onTaskClick: (task: TaskIAssigned) => void;
    refetch: () => void;
}

const AssignedTasksTab: React.FC<AssignedTasksTabProps> = ({
    tasksIAssigned,
    assignedTaskViewType,
    filteredAssignedTasks,
    searchQuery,
    onAssignedTaskViewTypeChange,
    onSearchChange,
    onTaskClick,
    refetch
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                {/* Assigned Task Filter Buttons Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant={assignedTaskViewType === 'all' ? 'contained' : 'outlined'}
                            onClick={() => onAssignedTaskViewTypeChange('all')}
                            size="small"
                            sx={{
                                bgcolor: assignedTaskViewType === 'all' ? '#4361ee' : 'transparent',
                                color: assignedTaskViewType === 'all' ? 'white' : '#4361ee',
                                borderColor: '#4361ee',
                                '&:hover': {
                                    bgcolor: assignedTaskViewType === 'all' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                }
                            }}
                        >
                            All ({tasksIAssigned.all.length})
                        </Button>
                        <Button
                            variant={assignedTaskViewType === 'upcoming' ? 'contained' : 'outlined'}
                            onClick={() => onAssignedTaskViewTypeChange('upcoming')}
                            size="small"
                            sx={{
                                bgcolor: assignedTaskViewType === 'upcoming' ? '#4361ee' : 'transparent',
                                color: assignedTaskViewType === 'upcoming' ? 'white' : '#4361ee',
                                borderColor: '#4361ee',
                                '&:hover': {
                                    bgcolor: assignedTaskViewType === 'upcoming' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                }
                            }}
                        >
                            Upcoming ({tasksIAssigned.upcoming.length})
                        </Button>
                        <Button
                            variant={assignedTaskViewType === 'overdue' ? 'contained' : 'outlined'}
                            onClick={() => onAssignedTaskViewTypeChange('overdue')}
                            size="small"
                            sx={{
                                bgcolor: assignedTaskViewType === 'overdue' ? '#dc3545' : 'transparent',
                                color: assignedTaskViewType === 'overdue' ? 'white' : '#dc3545',
                                borderColor: assignedTaskViewType === 'overdue' ? '#dc3545' : 'rgba(220, 53, 69, 0.5)',
                                '&:hover': {
                                    bgcolor: assignedTaskViewType === 'overdue' ? '#bd2130' : 'rgba(220, 53, 69, 0.04)'
                                }
                            }}
                        >
                            Overdue ({tasksIAssigned.overdue.length})
                        </Button>
                        <Button
                            variant={assignedTaskViewType === 'completed' ? 'contained' : 'outlined'}
                            onClick={() => onAssignedTaskViewTypeChange('completed')}
                            size="small"
                            sx={{
                                bgcolor: assignedTaskViewType === 'completed' ? '#10b981' : 'transparent',
                                color: assignedTaskViewType === 'completed' ? 'white' : '#10b981',
                                borderColor: assignedTaskViewType === 'completed' ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                                '&:hover': {
                                    bgcolor: assignedTaskViewType === 'completed' ? '#0da271' : 'rgba(16, 185, 129, 0.04)'
                                }
                            }}
                        >
                            Completed ({tasksIAssigned.completed.length})
                        </Button>
                        <Button
                            variant={assignedTaskViewType === 'active' ? 'contained' : 'outlined'}
                            onClick={() => onAssignedTaskViewTypeChange('active')}
                            size="small"
                            sx={{
                                bgcolor: assignedTaskViewType === 'active' ? '#f59e0b' : 'transparent',
                                color: assignedTaskViewType === 'active' ? 'white' : '#f59e0b',
                                borderColor: assignedTaskViewType === 'active' ? '#f59e0b' : 'rgba(245, 158, 11, 0.5)',
                                '&:hover': {
                                    bgcolor: assignedTaskViewType === 'active' ? '#d97706' : 'rgba(245, 158, 11, 0.04)'
                                }
                            }}
                        >
                            Active ({tasksIAssigned.activeItems.length})
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Search assigned tasks..."
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
                    </Box>
                </Box>

                {/* Assigned Tasks Summary Stats */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<AssignmentIcon />}
                        label={`${filteredAssignedTasks.length} tasks`}
                        variant="outlined"
                        size="small"
                    />
                    <Chip
                        icon={<BoltIcon />}
                        label={`${tasksIAssigned.summary.active} active`}
                        variant="outlined"
                        size="small"
                        color="success"
                    />
                    <Chip
                        icon={<ErrorIcon />}
                        label={`${tasksIAssigned.summary.overdue} overdue`}
                        variant="outlined"
                        size="small"
                        color="error"
                    />
                    <Chip
                        icon={<CheckIcon />}
                        label={`${tasksIAssigned.summary.completed} completed`}
                        variant="outlined"
                        size="small"
                        color="info"
                    />
                    <Chip
                        icon={<HourglassEmptyIcon />}
                        label={`${tasksIAssigned.summary.pending} pending`}
                        variant="outlined"
                        size="small"
                        color="warning"
                    />
                </Box>

                {/* Assigned Tasks Display */}
                {filteredAssignedTasks.length > 0 ? (
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
                        {filteredAssignedTasks.map((task) => (
                            <TaskCardGrid
                                key={task.wbsItemId}
                                task={task}
                                isAssigned={true}
                                isOverdue={tasksIAssigned.overdue.some(t => t.wbsItemId === task.wbsItemId)}
                                isCompleted={tasksIAssigned.completed.some(t => t.wbsItemId === task.wbsItemId)}
                                refetch={refetch}
                            // onTaskClick={onTaskClick}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            {assignedTaskViewType === 'upcoming' && 'No upcoming assigned tasks found.'}
                            {assignedTaskViewType === 'overdue' && 'No overdue assigned tasks found.'}
                            {assignedTaskViewType === 'completed' && 'No completed assigned tasks found.'}
                            {assignedTaskViewType === 'active' && 'No active assigned tasks found.'}
                            {assignedTaskViewType === 'all' && 'No assigned tasks found.'}
                        </Typography>
                        {searchQuery && (
                            <Button onClick={() => onSearchChange('')} sx={{ mt: 2 }}>
                                Clear search
                            </Button>
                        )}

                        <NewTaskCreateButton />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AssignedTasksTab;