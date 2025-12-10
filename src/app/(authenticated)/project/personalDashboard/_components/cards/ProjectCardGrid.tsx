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
    Chip
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ErrorIcon from '@mui/icons-material/Error';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';
import ProjectMenuDialog from '../../../_dashboard/ProjectMenuDialog';
import { Project } from '../../../_utils/types';
import { getStatusColor, formatDate } from '../../../_utils/helpers';
import { colors, formatCurrency } from '../../../_utils/consts';
import ProjectCreateInputForm from '../../../projects/_components/Form';

interface ProjectCardGridProps {
    project: Project;
    refetch?: () => void;
    onProjectClick?: (project: Project) => void;
}

const ProjectCardGrid: React.FC<ProjectCardGridProps> = ({
    project,
    refetch,
    onProjectClick
}) => {
    return (
        <Link href={`/project/${project.projectId}`} passHref>
            <Card sx={{
                cursor: "pointer",
                height: '100%',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
            }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                            <FolderIcon sx={{ color: '#4361ee' }} />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h6" fontWeight={600}>
                            {project.title}
                        </Typography>
                    }
                    subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip label={project.projectType} size="small" />
                            <Chip
                                label={project.projectStage}
                                size="small"
                                color={getStatusColor(project.projectStage)}
                            />
                            {project.riskFlag && (
                                <Chip
                                    icon={<ErrorIcon />}
                                    label="Risk"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                />
                            )}
                            {project.approvalStatus && (
                                <Chip
                                    label={project.approvalStatus}
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    }
                    action={
                        <div onClick={(e) => e.stopPropagation()}>
                            <ProjectMenuDialog
                                project={project}
                                colors={colors}
                                refetch={refetch}
                                apiUrl={""}
                                formatCurrency={formatCurrency}
                                ProjectCreateInputForm={ProjectCreateInputForm}
                            />
                        </div>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {project.description || 'No description available'}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">Progress</Typography>
                            <Typography variant="caption" fontWeight={600}>
                                {project.totalPercentCompletion}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={project.totalPercentCompletion}
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <GroupIcon fontSize="small" />
                            <Typography variant="caption">
                                {project.totalContributors} contributors
                            </Typography>
                        </Box>
                        <Typography variant="caption">
                            Due: {formatDate(project.plannedEndDate)}
                        </Typography>
                    </Box>

                    {project.customerName && (
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <PersonIcon fontSize="small" />
                            <Typography variant="caption" color="text.secondary">
                                Client: {project.customerName}
                            </Typography>
                        </Box>
                    )}

                    {project.billingMethod && (
                        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AttachMoneyIcon fontSize="small" />
                            <Typography variant="caption" color="text.secondary">
                                Billing: {project.billingMethod}
                            </Typography>
                        </Box>
                    )}

                    {project.actualEndDate && (
                        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CheckIcon fontSize="small" />
                            <Typography variant="caption" color="text.secondary">
                                Completed: {formatDate(project.actualEndDate)}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Button size="small" onClick={() => onProjectClick?.(project)}>
                        View Details
                    </Button>
                </CardActions>
            </Card>
        </Link>
    );
};

export default ProjectCardGrid;