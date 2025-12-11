'use client';

import React from 'react';
import {
    Box,
    Typography,
    Collapse,
    Paper,
    Stack,
    alpha,
    Chip
} from '@mui/material';
import DataCard from '../_components/DataCard';
import NoDataMessage from '../_components/NoDataMessage';
import ProgressBarWithLabel from '../_components/ProgressBarWithLabel';
import ProjectMenuDialog from '../ProjectMenuDialog';
import { colors, formatCurrency, formatDateTime, mainProjectAPI } from '../../_utils/consts';
import {
    Warning,
    TrendingUp,
    AccessTime,
    Security as RiskManagementIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ProjectCreateInputForm from '../../projects/_components/Form';

interface RiskDeadlinesSectionProps {
    dashboardData: any;
    expanded: boolean;
    refetch: () => void;
}

const RiskDeadlinesSection: React.FC<RiskDeadlinesSectionProps> = ({
    dashboardData,
    expanded,
    refetch
}) => {
    const formatDateTime = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return format(parseISO(dateString), 'MMM dd, yyyy');
    };

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
                    color: colors.error,
                    fontSize: '1.125rem'
                }}>
                    Risk & Deadlines
                </Typography>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                    {/* Risk Overview */}
                    <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
                        <DataCard title="Risk Overview" icon={Warning} color={colors.error} defaultExpanded={true}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    bgcolor: alpha(colors.error, 0.04),
                                    border: `1px solid ${alpha(colors.error, 0.15)}`,
                                    borderRadius: 1.5,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.error,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.riskAndDeadlines.atRiskCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.error,
                                        fontSize: '0.8125rem'
                                    }}>
                                        At Risk
                                    </Typography>
                                </Paper>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    bgcolor: alpha(colors.warning, 0.04),
                                    border: `1px solid ${alpha(colors.warning, 0.15)}`,
                                    borderRadius: 1.5,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.warning,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.riskAndDeadlines.overdueCount}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.warning,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Overdue
                                    </Typography>
                                </Paper>
                            </Box>

                            {/* At Risk Projects */}
                            <Typography variant="subtitle2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                fontSize: '0.875rem'
                            }}>
                                At Risk Projects
                            </Typography>
                            {dashboardData.riskAndDeadlines.atRiskProjects.length > 0 ? (
                                <Stack spacing={1}>
                                    {dashboardData.riskAndDeadlines.atRiskProjects.map((project: any, index: number) => (
                                        <Link
                                            key={project.id}
                                            href={`/project/${project.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Paper sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                cursor: 'pointer',
                                                border: `1px solid ${alpha(colors.error, 0.2)}`,
                                                '&:hover': {
                                                    bgcolor: alpha(colors.error, 0.04),
                                                    borderColor: colors.error
                                                }
                                            }}>
                                                {/* Top row with code, warning icon, and menu */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    mb: 1
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                        <Warning sx={{ color: colors.error, fontSize: 16 }} />
                                                        <Typography variant="subtitle2" sx={{
                                                            fontWeight: 600,
                                                            color: colors.error,
                                                            fontSize: '0.8125rem'
                                                        }}>
                                                            {project.code}
                                                        </Typography>
                                                    </Box>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <ProjectMenuDialog
                                                            project={project}
                                                            colors={colors}
                                                            refetch={refetch}
                                                            apiUrl={mainProjectAPI}
                                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                                            formatCurrency={formatCurrency}
                                                        />
                                                    </div>
                                                </Box>

                                                {/* Project title */}
                                                <Typography variant="body2" sx={{
                                                    color: colors.gray,
                                                    mb: 0.75,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {project.title}
                                                </Typography>

                                                {/* Due date */}
                                                <Typography variant="caption" sx={{
                                                    color: colors.gray,
                                                    display: 'block',
                                                    mb: 0.75,
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Due: {formatDateTime(project.plannedEndDate)}
                                                </Typography>

                                                {/* Progress bar */}
                                                {project.totalPercentCompletion !== null && (
                                                    <ProgressBarWithLabel value={project.totalPercentCompletion} color={colors.error} />
                                                )}
                                            </Paper>
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage message="No projects at risk" />
                            )}

                            {/* Overdue Projects */}
                            <Typography variant="subtitle2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                mt: 2.5,
                                fontSize: '0.875rem'
                            }}>
                                Overdue Projects
                            </Typography>
                            {dashboardData.riskAndDeadlines.overdueProjects.length > 0 ? (
                                <Stack spacing={1}>
                                    {dashboardData.riskAndDeadlines.overdueProjects.map((project: any, index: number) => (
                                        <Link
                                            key={project.id}
                                            href={`/project/${project.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Paper sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                border: `1px solid ${alpha(colors.warning, 0.2)}`,
                                                '&:hover': {
                                                    bgcolor: alpha(colors.warning, 0.04),
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: 3,
                                                        bgcolor: colors.warning
                                                    }
                                                }
                                            }}>
                                                {/* Top section */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    mb: 0.75
                                                }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.75,
                                                            mb: 0.25
                                                        }}>
                                                            {project.riskFlag && (
                                                                <Warning sx={{ color: colors.error, fontSize: 14 }} />
                                                            )}
                                                            <Typography variant="subtitle2" sx={{
                                                                fontWeight: 600,
                                                                color: colors.warning,
                                                                fontSize: '0.8125rem'
                                                            }}>
                                                                {project.code}
                                                            </Typography>
                                                            <Chip
                                                                label={`${project.daysOverdue} days`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(colors.warning, 0.1),
                                                                    color: colors.warning,
                                                                    height: 18,
                                                                    fontSize: '0.65rem'
                                                                }}
                                                            />
                                                        </Box>

                                                        <Typography variant="body2" sx={{
                                                            color: colors.gray,
                                                            mb: 0.75,
                                                            fontSize: '0.8125rem'
                                                        }}>
                                                            {project.title}
                                                        </Typography>
                                                    </Box>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <ProjectMenuDialog
                                                            project={project}
                                                            colors={colors}
                                                            refetch={refetch}
                                                            apiUrl={mainProjectAPI}
                                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                                            formatCurrency={formatCurrency}
                                                        />
                                                    </div>
                                                </Box>

                                                {/* Bottom section */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Typography variant="caption" sx={{
                                                        color: colors.gray,
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Due: {formatDateTime(project.plannedEndDate)}
                                                    </Typography>

                                                    {/* Progress indicator */}
                                                    {project.totalPercentCompletion !== null && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                            <Box sx={{
                                                                width: 50,
                                                                height: 5,
                                                                bgcolor: alpha(colors.warning, 0.15),
                                                                borderRadius: 2.5,
                                                                overflow: 'hidden'
                                                            }}>
                                                                <Box sx={{
                                                                    width: `${project.totalPercentCompletion}%`,
                                                                    height: '100%',
                                                                    bgcolor: colors.warning
                                                                }} />
                                                            </Box>
                                                            <Typography variant="caption" sx={{
                                                                fontWeight: 600,
                                                                color: colors.warning,
                                                                fontSize: '0.75rem'
                                                            }}>
                                                                {project.totalPercentCompletion}%
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage message="No overdue projects" />
                            )}
                        </DataCard>
                    </Box>

                    {/* Top Projects & Top Risk Projects */}
                    <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
                        <DataCard title="Top Projects" icon={TrendingUp} color={colors.success} defaultExpanded={true}>
                            {dashboardData.topProjects.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {dashboardData.topProjects.map((project: any, index: number) => (
                                        <Link
                                            key={project.id}
                                            href={`/project/${project.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Paper sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: `1px solid ${alpha(colors.success, 0.15)}`,
                                                '&:hover': {
                                                    bgcolor: alpha(colors.success, 0.04),
                                                    borderColor: colors.success,
                                                    transform: 'translateY(-1px)'
                                                }
                                            }}>
                                                {/* Header with menu */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    mb: 1
                                                }}>
                                                    <Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.75,
                                                            mb: 0.25
                                                        }}>
                                                            <Typography variant="subtitle2" sx={{
                                                                fontWeight: 600,
                                                                color: colors.success,
                                                                fontSize: '0.8125rem'
                                                            }}>
                                                                {project.code}
                                                            </Typography>
                                                            {project.riskFlag && (
                                                                <Warning sx={{ color: colors.error, fontSize: 14 }} />
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" sx={{
                                                            color: colors.gray,
                                                            fontSize: '0.8125rem',
                                                            lineHeight: 1.3
                                                        }}>
                                                            {project.title}
                                                        </Typography>
                                                    </Box>
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <ProjectMenuDialog
                                                            project={project}
                                                            colors={colors}
                                                            refetch={refetch}
                                                            apiUrl={mainProjectAPI}
                                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                                            formatCurrency={formatCurrency}
                                                        />
                                                    </div>
                                                </Box>

                                                {/* Footer with details */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 1.5,
                                                    pt: 1,
                                                    borderTop: `1px solid ${alpha('#000', 0.15)}`
                                                }}>
                                                    <Chip
                                                        label={project.approvalStatus}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(colors.success, 0.1),
                                                            color: colors.success,
                                                            fontWeight: 500,
                                                            fontSize: '0.7rem',
                                                            height: 22
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(project.totalBudget)}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Link>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage message="No top projects" />
                            )}
                        </DataCard>

                        <Box sx={{ mt: 2.5 }}>
                            <DataCard title="Top Risk Projects" icon={RiskManagementIcon} color={colors.warning} defaultExpanded={true}>
                                {dashboardData.topRiskProjects.length > 0 ? (
                                    <Stack spacing={1}>
                                        {dashboardData.topRiskProjects.map((project: any, index: number) => (
                                            <Link
                                                key={project.id}
                                                href={`/project/${project.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Paper sx={{
                                                    p: 1.25,
                                                    borderRadius: 1.5,
                                                    cursor: 'pointer',
                                                    bgcolor: alpha(colors.warning, 0.03),
                                                    border: `1px solid ${alpha(colors.warning, 0.15)}`,
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.warning, 0.07),
                                                        borderColor: colors.warning,
                                                        boxShadow: `0 1px 4px ${alpha(colors.warning, 0.12)}`
                                                    }
                                                }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        {/* Left side: Warning icon and project info */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.75,
                                                            flex: 1
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: '50%',
                                                                bgcolor: alpha(colors.warning, 0.1),
                                                                flexShrink: 0
                                                            }}>
                                                                <Warning sx={{ color: colors.warning, fontSize: 16 }} />
                                                            </Box>

                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography variant="body2" sx={{
                                                                    fontWeight: 600,
                                                                    color: colors.warning,
                                                                    fontSize: '0.8125rem',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {project.code}
                                                                </Typography>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.75,
                                                                    mt: 0.25
                                                                }}>
                                                                    <Chip
                                                                        label={`${project.daysOverdue}d`}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: alpha(colors.warning, 0.15),
                                                                            color: colors.warning,
                                                                            height: 16,
                                                                            fontSize: '0.65rem',
                                                                            fontWeight: 700
                                                                        }}
                                                                    />
                                                                    <Typography variant="caption" sx={{
                                                                        color: colors.gray,
                                                                        fontSize: '0.75rem'
                                                                    }}>
                                                                        {formatCurrency(project.totalBudget)}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        {/* Right side: Menu button */}
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <ProjectMenuDialog
                                                            project={project}
                                                            colors={colors}
                                                            refetch={refetch}
                                                            apiUrl={mainProjectAPI}
                                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                                            formatCurrency={formatCurrency}
                                                        />
                                                        </div>
                                                    </Box>

                                                    {/* Project title if available */}
                                                    {project.title && (
                                                        <Typography variant="caption" sx={{
                                                            color: colors.gray,
                                                            display: 'block',
                                                            mt: 0.75,
                                                            fontSize: '0.75rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {project.title}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Link>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage message="No top risk projects" />
                                )}
                            </DataCard>
                        </Box>
                    </Box>

                    {/* Timesheets */}
                    <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
                        <DataCard title="Timesheets" icon={AccessTime} color={colors.info} defaultExpanded={true}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    bgcolor: alpha(colors.info, 0.04),
                                    border: `1px solid ${alpha(colors.info, 0.15)}`,
                                    borderRadius: 1.5,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.info,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.timesheets.totalTrackedHours}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.info,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Tracked Hours
                                    </Typography>
                                </Paper>
                                <Paper sx={{
                                    flex: 1,
                                    p: 1.5,
                                    textAlign: 'center',
                                    bgcolor: alpha(colors.success, 0.04),
                                    border: `1px solid ${alpha(colors.success, 0.15)}`,
                                    borderRadius: 1.5,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" sx={{
                                        color: colors.success,
                                        fontWeight: 700,
                                        fontSize: '1.75rem'
                                    }}>
                                        {dashboardData.timesheets.totalBillableHours}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: colors.success,
                                        fontSize: '0.8125rem'
                                    }}>
                                        Billable Hours
                                    </Typography>
                                </Paper>
                            </Box>
                            <Typography variant="body2" sx={{
                                color: colors.gray,
                                fontSize: '0.8125rem',
                                mb: 1.5
                            }}>
                                Projects with time entries: {dashboardData.timesheets.projectsWithTimeEntries}
                            </Typography>

                            {dashboardData.timesheets.byProject.length > 0 ? (
                                <Box sx={{ mt: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        fontSize: '0.875rem'
                                    }}>
                                        By Project
                                    </Typography>
                                    <Stack spacing={0.75}>
                                        {dashboardData.timesheets.byProject.slice(0, 5).map((project: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={`/project/${project.projectId}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: alpha(colors.info, 0.04),
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.info, 0.08)
                                                    }
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                        Project {index + 1}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: colors.info,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {project.hours || 0} hrs
                                                    </Typography>
                                                </Box>
                                            </Link>
                                        ))}
                                    </Stack>
                                </Box>
                            ) : (
                                <NoDataMessage message="No timesheet data by project" />
                            )}
                        </DataCard>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default RiskDeadlinesSection;