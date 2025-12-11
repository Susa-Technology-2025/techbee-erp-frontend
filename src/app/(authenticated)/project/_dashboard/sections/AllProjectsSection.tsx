'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha
} from '@mui/material';
import ProgressBarWithLabel from '../_components/ProgressBarWithLabel';
import ProjectMenuDialog from '../ProjectMenuDialog';
import { colors, formatCurrency, mainProjectAPI } from '../../_utils/consts';
import {
    ViewModule,
    ViewList,
    Search,
    FilterList,
    Warning,
    CheckCircle,
    Folder
} from '@mui/icons-material';
import Link from 'next/link';
import ProjectCreateInputForm from '../../projects/_components/Form';

interface AllProjectsSectionProps {
    dashboardData: any;
    viewMode: 'card' | 'list';
    setViewMode: (mode: 'card' | 'list') => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
    riskFilter: string;
    setRiskFilter: (filter: string) => void;
    refetch: () => void;
}

const AllProjectsSection: React.FC<AllProjectsSectionProps> = ({
    dashboardData,
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    riskFilter,
    setRiskFilter,
    refetch
}) => {
    // Filter projects based on search and filters
    const filteredProjects = useMemo(() => {
        if (!dashboardData?.allProjects) return [];

        return dashboardData.allProjects.filter((project: any) => {
            // Search filter
            const matchesSearch = searchTerm === '' ||
                project.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                project.approvalStatus === statusFilter;

            // Risk filter
            const matchesRisk = riskFilter === 'all' ||
                (riskFilter === 'risky' && project.riskFlag) ||
                (riskFilter === 'safe' && !project.riskFlag);

            return matchesSearch && matchesStatus && matchesRisk;
        });
    }, [dashboardData, searchTerm, statusFilter, riskFilter]);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: '1.125rem'
                }}>
                    All Projects ({filteredProjects.length})
                </Typography>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                >
                    <ToggleButton value="card" size="small" sx={{ p: 0.75 }}>
                        <ViewModule sx={{ fontSize: 16 }} />
                    </ToggleButton>
                    <ToggleButton value="list" size="small" sx={{ p: 0.75 }}>
                        <ViewList sx={{ fontSize: 16 }} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Filter and Search Bar */}
            <Box sx={{
                mb: 2.5,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'flex-end',
                p: 1.5,
                bgcolor: alpha(colors.primary, 0.03),
                borderRadius: 1.5,
                border: `1px solid ${alpha(colors.primary, 0.08)}`
            }}>
                <TextField
                    placeholder="Search projects..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        flexGrow: 1,
                        minWidth: 180,
                        maxWidth: 400,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            fontSize: '0.8125rem'
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: colors.gray, fontSize: 18 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ fontSize: '0.8125rem' }}>Risk</InputLabel>
                    <Select
                        value={riskFilter}
                        label="Risk"
                        onChange={(e) => setRiskFilter(e.target.value)}
                        sx={{ borderRadius: 1.5, fontSize: '0.8125rem' }}
                    >
                        <MenuItem value="all" sx={{ fontSize: '0.8125rem' }}>All Risk</MenuItem>
                        <MenuItem value="risky" sx={{ fontSize: '0.8125rem' }}>At Risk</MenuItem>
                        <MenuItem value="safe" sx={{ fontSize: '0.8125rem' }}>Safe</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setRiskFilter('all');
                    }}
                    startIcon={<FilterList sx={{ fontSize: 16 }} />}
                    sx={{
                        borderRadius: 1.5,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.8125rem'
                    }}
                >
                    Clear Filters
                </Button>
            </Box>

            {viewMode === 'card' ? (
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    {filteredProjects.map((project: any) => (
                        <Box key={project.id} sx={{
                            flex: '1 1 280px',
                            maxWidth: '100%',
                            minWidth: 0
                        }}>
                            <Link
                                href={`/project/${project.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Card sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${project.riskFlag
                                        ? alpha(colors.error, 0.2)
                                        : 'rgba(0, 0, 0, 0.12)'
                                        }`,
                                    transition: 'all 0.25s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 12px ${project.riskFlag
                                            ? alpha(colors.error, 0.12)
                                            : alpha(colors.primary, 0.12)
                                            }`,
                                    },
                                    height: '100%',
                                    position: 'relative'
                                }}>
                                    <CardContent sx={{ p: 2 }}>
                                        {/* Top section with icon, risk flag, and project code */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 1.5
                                        }}>
                                            <Box>
                                                <Chip
                                                    label={project.code}
                                                    size="small"
                                                    sx={{
                                                        mb: 0.75,
                                                        bgcolor: alpha(colors.primary, 0.1),
                                                        color: colors.primary,
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        height: 22
                                                    }}
                                                />
                                                <Typography variant="subtitle1" sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    mb: 0.75,
                                                    fontSize: '0.9375rem',
                                                    lineHeight: 1.3
                                                }}>
                                                    {project.title}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                                                {project.riskFlag && (
                                                    <Warning sx={{
                                                        color: colors.error,
                                                        mt: 0.25,
                                                        fontSize: 18
                                                    }} />
                                                )}
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <ProjectMenuDialog
                                                        project={project}
                                                        colors={colors}
                                                        refetch={refetch}
                                                        apiUrl={mainProjectAPI}
                                                        formatCurrency={formatCurrency}
                                                        ProjectCreateInputForm={ProjectCreateInputForm}
                                                    />
                                                </div>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" sx={{
                                            color: 'text.secondary',
                                            mb: 1.5,
                                            fontSize: '0.8125rem'
                                        }}>
                                            Customer: {project.customerName || 'N/A'}
                                        </Typography>

                                        <Box sx={{ mb: 1.5 }}>
                                            <Typography variant="caption" sx={{
                                                color: 'text.secondary',
                                                display: 'block',
                                                mb: 0.5,
                                                fontSize: '0.75rem'
                                            }}>
                                                Progress
                                            </Typography>
                                            {project.totalPercentCompletion !== null ? (
                                                <ProgressBarWithLabel
                                                    value={project.totalPercentCompletion}
                                                    color={
                                                        project.totalPercentCompletion >= 75 ? colors.success :
                                                            project.totalPercentCompletion >= 50 ? colors.warning :
                                                                colors.error
                                                    }
                                                />
                                            ) : (
                                                <Typography variant="caption" sx={{
                                                    color: 'text.disabled',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    No progress data
                                                </Typography>
                                            )}
                                        </Box>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1.5
                                        }}>
                                            <Box sx={{ flex: 1, minWidth: 100 }}>
                                                <Typography variant="caption" sx={{
                                                    color: 'text.secondary',
                                                    display: 'block',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Budget
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {formatCurrency(project.totalBudget)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 100 }}>
                                                <Typography variant="caption" sx={{
                                                    color: 'text.secondary',
                                                    display: 'block',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Status
                                                </Typography>
                                                <Chip
                                                    label={project.approvalStatus}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha(
                                                            project.approvalStatus === 'Draft' ? colors.warning :
                                                                project.approvalStatus === 'Active' ? colors.success :
                                                                    colors.info, 0.1
                                                        ),
                                                        color: project.approvalStatus === 'Draft' ? colors.warning :
                                                            project.approvalStatus === 'Active' ? colors.success :
                                                                colors.info,
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem',
                                                        height: 22
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            mt: 1.5,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.75
                                        }}>
                                            {project.projectStageName && (
                                                <Chip
                                                    label={project.projectStageName}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            )}
                                            {project.projectTypeName && (
                                                <Chip
                                                    label={project.projectTypeName}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Box>
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(colors.primary, 0.04) }}>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Project Code</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Title</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Customer</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Progress</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Budget</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Status</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Risk</Typography></TableCell>
                                <TableCell sx={{ py: 1 }}><Typography variant="subtitle2" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem'
                                }}>Action</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProjects.map((project: any) => (
                                <TableRow
                                    key={project.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: alpha(colors.primary, 0.03),
                                            cursor: 'pointer'
                                        },
                                        borderBottom: `1px solid rgba(0, 0, 0, 0.12)`
                                    }}
                                    onClick={() => window.location.href = `/project/${project.id}`}
                                >
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography variant="body2" sx={{
                                            fontWeight: 600,
                                            color: colors.primary,
                                            fontSize: '0.8125rem'
                                        }}>
                                            {project.code}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                            {project.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography variant="body2" sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.8125rem'
                                        }}>
                                            {project.customerName || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        {project.totalPercentCompletion !== null ? (
                                            <ProgressBarWithLabel
                                                value={project.totalPercentCompletion}
                                                color={
                                                    project.totalPercentCompletion >= 75 ? colors.success :
                                                        project.totalPercentCompletion >= 50 ? colors.warning :
                                                            colors.error
                                                }
                                            />
                                        ) : (
                                            <Typography variant="caption" sx={{
                                                color: 'text.disabled',
                                                fontSize: '0.75rem'
                                            }}>
                                                N/A
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Typography variant="body2" sx={{
                                            fontWeight: 600,
                                            fontSize: '0.8125rem'
                                        }}>
                                            {formatCurrency(project.totalBudget)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        <Chip
                                            label={project.approvalStatus}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(
                                                    project.approvalStatus === 'Draft' ? colors.warning :
                                                        project.approvalStatus === 'Active' ? colors.success :
                                                            colors.info, 0.1
                                                ),
                                                color: project.approvalStatus === 'Draft' ? colors.warning :
                                                    project.approvalStatus === 'Active' ? colors.success :
                                                        colors.info,
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                height: 22
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 1.25 }}>
                                        {project.riskFlag ? (
                                            <Warning sx={{
                                                color: colors.error,
                                                fontSize: 18
                                            }} />
                                        ) : (
                                            <CheckCircle sx={{
                                                color: colors.success,
                                                fontSize: 18
                                            }} />
                                        )}
                                    </TableCell>

                                    <TableCell sx={{ py: 1.25 }}>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {filteredProjects.length === 0 && (
                <Box sx={{
                    py: 6,
                    textAlign: 'center',
                    bgcolor: alpha('#000', 0.02),
                    borderRadius: 1.5
                }}>
                    <Folder sx={{
                        fontSize: 36,
                        color: 'rgba(0, 0, 0, 0.15)',
                        mb: 1.5
                    }} />
                    <Typography variant="h6" sx={{
                        color: 'text.secondary',
                        mb: 0.75,
                        fontSize: '1rem'
                    }}>
                        No Projects Found
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: 'text.disabled',
                        fontSize: '0.8125rem'
                    }}>
                        Try adjusting your filters or search term
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default AllProjectsSection;