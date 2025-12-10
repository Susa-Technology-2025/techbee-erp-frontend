'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Drawer,
    LinearProgress,
    Chip,
    Alert,
    AlertTitle,
    Avatar,
    Tooltip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import { Project, Task, TaskIAssigned, Goal } from '../../../_utils/types';
import { getPriorityColor, getStatusColor, formatDate } from '../../../_utils/helpers';

interface DetailDrawerProps {
    open: boolean;
    selectedItem: Project | Task | TaskIAssigned | Goal | null;
    onClose: () => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({
    open,
    selectedItem,
    onClose
}) => {
    if (!selectedItem) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
        >
            <Box sx={{ p: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onClose}
                    sx={{ mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} color="#4361ee">
                                {'title' in selectedItem ? selectedItem.title : 'name' in selectedItem ? selectedItem.name : ''}
                            </Typography>
                            {'status' in selectedItem ? (
                                <Chip
                                    label={selectedItem.status.charAt(0)?.toUpperCase() + selectedItem.status?.slice(1)}
                                    color={getStatusColor(selectedItem.status)}
                                />
                            ) : 'taskStage' in selectedItem ? (
                                <Chip
                                    label={selectedItem.taskStage}
                                    color={getStatusColor(selectedItem.taskStage)}
                                />
                            ) : 'projectStage' in selectedItem ? (
                                <Chip
                                    label={selectedItem.projectStage}
                                    color={getStatusColor(selectedItem.projectStage)}
                                />
                            ) : null}
                        </Box>

                        {'description' in selectedItem && (
                            <Typography paragraph color="#64748b" sx={{ mb: 3 }}>
                                {selectedItem.description || 'No description available'}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                            {'percentCompletion' in selectedItem ? (
                                <>
                                    <Box sx={{ flex: '1 1 150px' }}>
                                        <Typography variant="caption" color="#64748b">Progress</Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {selectedItem.percentCompletion !== null ? `${selectedItem.percentCompletion}%` : 'Not set'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={selectedItem.percentCompletion || 0}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                </>
                            ) : 'totalPercentCompletion' in selectedItem ? (
                                <>
                                    <Box sx={{ flex: '1 1 150px' }}>
                                        <Typography variant="caption" color="#64748b">Progress</Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {selectedItem.totalPercentCompletion}%
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={selectedItem.totalPercentCompletion}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>
                                </>
                            ) : null}

                            {'plannedEndDate' in selectedItem && (
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="caption" color="#64748b">Due Date</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {formatDate(selectedItem.plannedEndDate)}
                                    </Typography>
                                </Box>
                            )}

                            {'priority' in selectedItem && selectedItem.priority && (
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="caption" color="#64748b">Priority</Typography>
                                    <Typography variant="body2" fontWeight={600} color={getPriorityColor(selectedItem.priority)}>
                                        {selectedItem.priority?.toUpperCase()}
                                    </Typography>
                                </Box>
                            )}

                            {'totalContributors' in selectedItem && (
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="caption" color="#64748b">Contributors</Typography>
                                    <Typography variant="h6" fontWeight={700}>
                                        {selectedItem.totalContributors}
                                    </Typography>
                                </Box>
                            )}

                            {'projectTitle' in selectedItem && (
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="caption" color="#64748b">Project</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedItem.projectTitle}
                                    </Typography>
                                </Box>
                            )}

                            {'customerName' in selectedItem && selectedItem.customerName && (
                                <Box sx={{ flex: '1 1 100%' }}>
                                    <Typography variant="caption" color="#64748b">Client</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {selectedItem.customerName}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {'projectId' in selectedItem && 'contributors' in selectedItem && selectedItem.contributors && (
                            <>
                                <Typography variant="h6" gutterBottom>Contributors</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                                    {selectedItem.contributors.map((contributor: any, index: number) => (
                                        <Tooltip key={index} title={`${contributor.role} (${contributor.allocationPercent}%)`}>
                                            <Avatar sx={{ bgcolor: '#4361ee' }}>
                                                {contributor.name?.[0]?.toUpperCase() || contributor.role?.[0]?.toUpperCase() || 'U'}
                                            </Avatar>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </>
                        )}

                        {'assignments' in selectedItem && selectedItem.assignments && (
                            <>
                                <Typography variant="h6" gutterBottom>Assignments</Typography>
                                <List>
                                    {selectedItem.assignments.map((assignment: any, index: number) => (
                                        <ListItem key={index}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                    <PersonIcon sx={{ color: '#4361ee' }} />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={assignment.role}
                                                secondary={`${assignment.allocationPercent}% allocation • Started: ${formatDate(assignment.startDate)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}

                        {'riskOrIssues' in selectedItem && selectedItem.riskOrIssues && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <AlertTitle>Risk/Issue</AlertTitle>
                                {selectedItem.riskOrIssues}
                            </Alert>
                        )}

                        {'riskFlag' in selectedItem && selectedItem.riskFlag && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                <AlertTitle>Risk Flagged</AlertTitle>
                                This item has been flagged for risk assessment.
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Drawer>
    );
};

export default DetailDrawer;