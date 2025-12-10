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
    LinearProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import FolderIcon from '@mui/icons-material/Folder';
import BoltIcon from '@mui/icons-material/Bolt';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { Project } from '../../../_utils/types';
import ProjectCardGrid from '../cards/ProjectCardGrid';
import { getStatusColor, formatDate } from '../../../_utils/helpers';

interface ProjectsTabProps {
    myProjects: {
        recent: Project[];
        summary: any;
    };
    filteredProjects: Project[];
    sortedProjects: Project[];
    viewMode: 'list' | 'grid';
    searchQuery: string;
    sortBy: 'date' | 'progress' | 'name';
    onViewModeChange: () => void;
    onSearchChange: (query: string) => void;
    onSortChange: (sort: 'date' | 'progress' | 'name') => void;
    onClearFilters: () => void;
    onProjectClick: (project: Project) => void;
    refetch: () => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
    myProjects,
    filteredProjects,
    sortedProjects,
    viewMode,
    searchQuery,
    sortBy,
    onViewModeChange,
    onSearchChange,
    onSortChange,
    onClearFilters,
    onProjectClick,
    refetch
}) => {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        My Projects ({filteredProjects.length})
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <TextField
                            size="small"
                            placeholder="Search projects..."
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
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => onSortChange(e.target.value as any)}
                            >
                                <MenuItem value="date">Recent</MenuItem>
                                <MenuItem value="progress">Progress</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                            </Select>
                        </FormControl>
                        <IconButton onClick={onViewModeChange}>
                            {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
                        </IconButton>
                    </Box>
                </Box>

                {/* Project Summary Stats */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<FolderIcon />}
                        label={`${myProjects.summary.totalProjects} total`}
                        variant="outlined"
                        size="small"
                    />
                    <Chip
                        icon={<BoltIcon />}
                        label={`${myProjects.summary.totalActive} active`}
                        variant="outlined"
                        size="small"
                        color="success"
                    />
                    <Chip
                        icon={<HourglassEmptyIcon />}
                        label={`${myProjects.summary.totalPending} pending`}
                        variant="outlined"
                        size="small"
                        color="warning"
                    />
                    <Chip
                        icon={<CheckIcon />}
                        label={`${myProjects.summary.totalCompleted} completed`}
                        variant="outlined"
                        size="small"
                        color="info"
                    />
                </Box>

                {filteredProjects.length > 0 ? (
                    viewMode === 'list' ? (
                        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                            {sortedProjects.map((project) => (
                                <ListItem
                                    key={project.projectId}
                                    sx={{
                                        borderBottom: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                    }}
                                    onClick={() => onProjectClick(project)}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                            <FolderIcon sx={{ color: '#4361ee' }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                <Typography fontWeight={600}>
                                                    {project.title}
                                                </Typography>
                                                {project.riskFlag && (
                                                    <ErrorIcon fontSize="small" color="error" />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="#64748b">
                                                    {project.projectType} • {project.totalContributors} contributors • {project.totalPercentCompletion}% complete
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={project.totalPercentCompletion}
                                                    sx={{ height: 4, borderRadius: 2, mt: 1, width: "200px" }}
                                                />
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={project.projectStage}
                                                size="small"
                                                color={getStatusColor(project.projectStage)}
                                            />
                                            <Typography variant="caption" color="#64748b">
                                                {formatDate(project.plannedStartDate)}
                                            </Typography>
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
                            {sortedProjects.map((project) => (
                                <ProjectCardGrid
                                    key={project.projectId}
                                    project={project}
                                    refetch={refetch}
                                    onProjectClick={onProjectClick}
                                />
                            ))}
                        </Box>
                    )
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No projects found matching your filters.
                        </Typography>
                        <Button onClick={onClearFilters} sx={{ mt: 2 }}>
                            Clear all filters
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ProjectsTab;