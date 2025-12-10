'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    alpha,
    Button,
    Chip,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Paper,
    Divider,
    Tooltip,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    Link as MuiLink
} from '@mui/material';
import {
    CalendarToday,
    ViewModule,
    ViewList,
    TrendingUp,
    TrendingDown,
    Warning,
    CheckCircle,
    AccessTime,
    MonetizationOn,
    Folder,
    People,
    Timeline,
    BarChart,
    PieChart,
    Security as RiskManagementIcon,
    Task,
    ExpandMore,
    ExpandLess,
    Business,
    Assignment,
    Group,
    Schedule,
    Description,
    AttachMoney,
    Category,
    Receipt,
    TrendingFlat,
    Search,
    FilterList,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    AccessTime as AccessTimeIcon,
    Money,
    MoreVert,
    Edit,
    Delete,
    Close
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, Line, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, AreaChart, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useDataMutation, useDataQuery } from '@/lib/tanstack/useDataQuery';
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProjectCreateInputForm from '../projects/_components/Form';
import ProjectMenuDialog from './ProjectMenuDialog';
import { colors, formatCurrency, mainProjectAPI } from '../_utils/consts';
import TaskMenuDialog from './TaskMenuDialog';
import WbsItemCreateInput from '../wbsItems/_components/Form';

// Types
interface DashboardData {
    window: {
        from: string;
        to: string;
    };
    summary: {
        totalProjects: number;
        byApprovalStatus: Record<string, number>;
        totalPlannedBudget: number;
        totalActualCost: number;
        averageProgressPercent: number;
        activeProjects: number;
        closedProjects: number;
        cancelledProjects: number;
        budgetUtilizationPercent: number;
    };
    pipelineByStage: Array<{
        stageId: string | null;
        stageName: string | null;
        count: number;
        totalBudget: number;
        averageProgressPercent: number;
    }>;
    projectsByType: Array<{
        projectTypeId: string;
        projectTypeCode: string;
        projectTypeName: string;
        count: number;
        totalBudget: number;
    }>;
    projectsByBillingMethod: Array<{
        billingMethodId: string | null;
        billingMethodName: string | null;
        projectCount: number;
        totalBudget: number;
    }>;
    managerWorkload: Array<{
        projectManagerEmployeeId: string;
        projectCount: number;
        totalBudget: number;
        averageProgressPercent: number;
    }>;
    riskAndDeadlines: {
        atRiskCount: number;
        overdueCount: number;
        dueIn7DaysCount: number;
        dueIn30DaysCount: number;
        atRiskProjects: Array<any>;
        overdueProjects: Array<any>;
        dueIn7DaysProjects: Array<any>;
        dueIn30DaysProjects: Array<any>;
    };
    timesheets: {
        totalTrackedHours: number;
        totalBillableHours: number;
        projectsWithTimeEntries: number;
        byProject: Array<any>;
    };
    topProjects: Array<any>;
    topRiskProjects: Array<any>;
    projectsByCustomer: Array<{
        customerName: string;
        projectCount: number;
        totalBudget: number;
    }>;
    allProjects: Array<any>;
    tasksAndMilestones: {
        taskSummary: {
            totalTasks: number;
            completedTasks: number;
            overdueTasks: number;
            tasksDueIn7Days: number;
            tasksDueIn30Days: number;
        };
        milestoneSummary: {
            totalMilestones: number;
            completedMilestones: number;
            overdueMilestones: number;
            milestonesDueIn7Days: number;
            milestonesDueIn30Days: number;
        };
        overdueTasks: Array<any>;
        upcomingTasks7Days: Array<any>;
        upcomingTasks30Days: Array<any>;
        overdueMilestones: Array<any>;
        upcomingMilestones7Days: Array<any>;
        upcomingMilestones30Days: Array<any>;
    };
    monthlyTrends: Array<{
        month: string;
        newProjectsCount: number;
        totalBudget: number;
        totalTrackedHours: number;
    }>;
}

const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
};

const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'MMM dd, yyyy');
};

const formatNumber = (num: number | null): string => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
};

const ProgressBarWithLabel = ({ value, color }: { value: number; color: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={Math.min(value, 100)}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(color, 0.15),
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 3,
                    },
                }}
            />
        </Box>
        <Typography variant="body2" sx={{
            color: color,
            fontWeight: 600,
            minWidth: 35,
            fontSize: '0.75rem'
        }}>
            {value}%
        </Typography>
    </Box>
);

const SummaryCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    trend?: number;
}) => (
    <Card sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `0 6px 16px ${alpha(color, 0.12)}`,
        }
    }}>
        <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                <Box>
                    <Typography variant="body2" sx={{
                        color: alpha('#000', 0.6),
                        fontWeight: 500,
                        mb: 0.25,
                        fontSize: '0.8125rem'
                    }}>
                        {title}
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: color,
                        fontWeight: 700,
                        fontSize: '1.5rem'
                    }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{
                            color: alpha('#000', 0.5),
                            fontSize: '0.75rem'
                        }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(color, 0.1),
                }}>
                    <Icon sx={{ color, fontSize: 20 }} />
                </Box>
            </Box>
            {trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, mt: 0.75 }}>
                    {trend >= 0 ? (
                        <TrendingUp sx={{ fontSize: 14, color: '#10B981' }} />
                    ) : (
                        <TrendingDown sx={{ fontSize: 14, color: '#EF4444' }} />
                    )}
                    <Typography variant="caption" sx={{
                        color: trend >= 0 ? '#10B981' : '#EF4444',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                    }}>
                        {trend >= 0 ? '+' : ''}{trend}%
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

const DataCard = ({
    title,
    icon: Icon,
    color,
    children,
    collapsible = false,
    defaultExpanded = true
}: {
    title: string;
    icon: React.ElementType;
    color: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultExpanded?: boolean;
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Card sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(color, 0.15)}`,
            overflow: 'hidden'
        }}>
            <Box sx={{
                p: 1.5,
                bgcolor: alpha(color, 0.04),
                borderBottom: expanded ? `1px solid ${alpha(color, 0.08)}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon sx={{ color, fontSize: 18 }} />
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 600,
                        color,
                        fontSize: '0.9375rem'
                    }}>
                        {title}
                    </Typography>
                </Box>
                {collapsible && (
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ color, p: 0.25 }}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                )}
            </Box>
            <Collapse in={expanded}>
                <CardContent sx={{ p: 2 }}>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    );
};

const NoDataMessage = ({ message = "No data available" }: { message?: string }) => (
    <Box sx={{
        py: 3,
        textAlign: 'center',
        bgcolor: alpha('#000', 0.02),
        borderRadius: 1.5
    }}>
        <Description sx={{ fontSize: 36, color: alpha('#000', 0.15), mb: 1 }} />
        <Typography variant="body2" sx={{
            color: alpha('#000', 0.4),
            fontSize: '0.8125rem'
        }}>
            {message}
        </Typography>
    </Box>
);

export default function ProjectAnalyticsDashboard() {
    const theme = useTheme();
    const [showPicker, setShowPicker] = useState(false);
    const [fromDate, setFromDate] = useState<Dayjs>(
        dayjs().subtract(3, "month")
    );
    const [toDate, setToDate] = useState<Dayjs>(dayjs());
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        summary: true,
        projects: true,
        tasks: true,
        risks: true,
        analytics: true
    });

    // State for task filtering
    const [taskFilter, setTaskFilter] = useState<'all' | 'completed' | 'overdue'>('all');
    const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'completed' | 'overdue'>('all');

    // State for project list filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [riskFilter, setRiskFilter] = useState('all');

    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentMenuProject, setCurrentMenuProject] = useState<any>(null);

    const buildApiUrl = () => {
        const baseUrl = `${mainProjectAPI}/analytics/overview`;
        const params = new URLSearchParams({
            from: formatDate(fromDate),
            to: formatDate(toDate)
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading, isFetching, isError, error, refetch } = useDataQuery({
        apiEndPoint: apiUrl,
        enabled: true,
        noFilter: true,
        fetchWithoutRefresh: true,
    });

    const deleteMutation = useDataMutation({
        apiEndPoint: `${mainProjectAPI}/:id`,
        method: 'DELETE',
        invalidateQueryKey: ["dashboardData", apiUrl],
        onSuccess: (data) => {
            toast.success('Project deleted successfully');
            handleDeleteDialogClose();
            refetch();
        },
        onError: (error) => {
            toast.error(`Failed to delete project: ${error.message || 'Unknown error'}`);
        }
    });

    const dashboardData = data as DashboardData;

    const handleApply = () => {
        refetch();
        setShowPicker(false);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
        setSelectedProject(null);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
        setSelectedProject(null);
    };

    const handleConfirmDelete = () => {
        if (selectedProject?.id) {
            deleteMutation.mutate({
                __pathParams: { id: selectedProject.id }
            });
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Filter tasks based on selected filter
    const filteredTasks = useMemo(() => {
        if (!dashboardData?.tasksAndMilestones) return [];

        switch (taskFilter) {
            case 'completed':
                return dashboardData.tasksAndMilestones.upcomingTasks30Days?.filter(task =>
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
                return allMilestones.filter(milestone =>
                    milestone.completionStatus === 'Completed'
                );
            case 'overdue':
                return dashboardData.tasksAndMilestones.overdueMilestones || [];
            case 'all':
            default:
                return allMilestones;
        }
    }, [dashboardData, milestoneFilter]);

    // Filter projects based on search and filters
    const filteredProjects = useMemo(() => {
        if (!dashboardData?.allProjects) return [];

        return dashboardData.allProjects.filter(project => {
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

    if (isLoading || isFetching) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px'
            }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading dashboard data: {error?.message || 'Unknown error'}
            </Alert>
        );
    }

    if (!dashboardData) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                No data available for the selected date range.
            </Alert>
        );
    }

    const budget = dashboardData?.summary?.budgetUtilizationPercent;

    return (
        <Box sx={{ p: 2 }}>
            {/* Header with Date Picker */}
            <Box sx={{
                mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1.5
            }}>
                <Box>
                    <Typography variant="h5" sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 0.25,
                        fontSize: '1.5rem'
                    }}>
                        Project Analytics Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.8125rem'
                    }}>
                        {formatDateTime(dashboardData.window.from)} - {formatDateTime(dashboardData.window.to)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {!showPicker ? (
                        <Box
                            sx={{
                                bgcolor: alpha(colors.primary, 0.08),
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 3,
                                fontSize: 13,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                border: `1px solid ${alpha(colors.primary, 0.15)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(colors.primary, 0.12),
                                    borderColor: alpha(colors.primary, 0.25),
                                }
                            }}
                            onClick={() => setShowPicker(true)}
                        >
                            <CalendarToday sx={{ fontSize: 14, color: colors.primary }} />
                            <Typography variant="body2" sx={{
                                color: colors.primary,
                                fontWeight: 500,
                                fontSize: '0.8125rem'
                            }}>
                                {formatDate(fromDate)} - {formatDate(toDate)}
                            </Typography>
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <DatePicker
                                label="From Date"
                                value={fromDate}
                                onChange={(newValue) => newValue && setFromDate(newValue)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: {
                                            width: 135,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                            }
                                        }
                                    }
                                }}
                            />
                            <DatePicker
                                label="To Date"
                                value={toDate}
                                onChange={(newValue) => newValue && setToDate(newValue)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        sx: {
                                            width: 135,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                            }
                                        }
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleApply}
                                sx={{
                                    borderRadius: 1.5,
                                    bgcolor: colors.primary,
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: '0.8125rem',
                                    '&:hover': { bgcolor: '#4F46E5' }
                                }}
                            >
                                Apply
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowPicker(false)}
                                sx={{
                                    borderRadius: 1.5,
                                    px: 1.5,
                                    py: 0.5,
                                    fontSize: '0.8125rem'
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Summary Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        color: colors.primary,
                        fontSize: '1.125rem'
                    }}>
                        Summary Overview
                    </Typography>
                </Box>
                <Collapse in={expandedSections.summary}>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                            <SummaryCard
                                title="Total Projects"
                                value={dashboardData.summary.totalProjects}
                                icon={Folder}
                                color={colors.primary}
                                subtitle={`${dashboardData.summary.activeProjects} active, ${dashboardData.summary.closedProjects} closed`}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                            <SummaryCard
                                title="Planned Budget"
                                value={formatCurrency(dashboardData.summary.totalPlannedBudget)}
                                icon={Money}
                                color={colors.success}
                                subtitle={`Actual: ${formatCurrency(dashboardData.summary.totalActualCost)}`}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                            <SummaryCard
                                title="Average Progress"
                                value={
                                    dashboardData?.summary?.averageProgressPercent != null
                                        ? `${dashboardData.summary.averageProgressPercent}%`
                                        : "No Data"
                                }
                                icon={Timeline}
                                color={colors.warning}
                                subtitle="Across all projects"
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                            <SummaryCard
                                title="Budget Utilization"
                                value={
                                    typeof budget === "number" && !isNaN(budget)
                                        ? `${Math.min(budget, 100)}%`
                                        : "No Data"
                                }
                                icon={BarChart}
                                color={
                                    typeof budget === "number" && budget > 100
                                        ? colors.error
                                        : colors.success
                                }
                                subtitle="Actual vs Planned"
                            />
                        </Box>
                    </Box>

                    {/* Approval Status Breakdown */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{
                            fontWeight: 600,
                            mb: 1.5,
                            color: colors.gray,
                            fontSize: '0.875rem'
                        }}>
                            Approval Status
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Object.entries(dashboardData.summary.byApprovalStatus).map(([status, count], index) => (
                                <Chip
                                    key={status}
                                    label={`${status}: ${count}`}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(colors.purple, 0.08),
                                        color: colors.purple,
                                        fontWeight: 500,
                                        height: 24,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            {/* Projects Analytics Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        color: colors.indigo,
                        fontSize: '1.125rem'
                    }}>
                        Projects Analytics
                    </Typography>
                </Box>
                <Collapse in={expandedSections.projects}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                        {/* Projects by Stage */}
                        <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                            <DataCard title="Projects by Stage" icon={Category} color={colors.indigo}>
                                {dashboardData.pipelineByStage.length > 0 ? (
                                    <>
                                        <Box sx={{ height: 200, mb: 1.5 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RePieChart>
                                                    <Pie
                                                        data={dashboardData.pipelineByStage}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ stageName, count }) =>
                                                            `${stageName || 'Unassigned'}: ${count}`
                                                        }
                                                        outerRadius={60}
                                                        fill="#8884d8"
                                                        dataKey="count"
                                                    >
                                                        {dashboardData.pipelineByStage.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={[
                                                                    colors.indigo,
                                                                    colors.primary,
                                                                    colors.success,
                                                                    colors.warning,
                                                                    colors.error,
                                                                    colors.purple
                                                                ][index % 6]}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </RePieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                        <Stack spacing={0.75}>
                                            {dashboardData.pipelineByStage.map((stage, index) => (
                                                <Box key={index} sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: alpha(colors.indigo, 0.04)
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                        {stage.stageName || 'Unassigned'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={`${stage.count} projects`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem', height: 20 }}
                                                        />
                                                        <Typography variant="body2" sx={{
                                                            color: colors.gray,
                                                            fontSize: '0.8125rem'
                                                        }}>
                                                            {formatCurrency(stage.totalBudget)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </DataCard>
                        </Box>

                        {/* Projects by Type */}
                        <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                            <DataCard title="Projects by Type" icon={Assignment} color={colors.purple}>
                                {dashboardData.projectsByType.length > 0 ? (
                                    <Stack spacing={1.5}>
                                        {dashboardData.projectsByType.map((type, index) => (
                                            <Paper key={type.projectTypeId} sx={{
                                                p: 1.5,
                                                borderRadius: 1.5,
                                                border: `1px solid ${alpha(colors.purple, 0.1)}`
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 0.75
                                                }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {type.projectTypeName}
                                                    </Typography>
                                                    <Chip
                                                        label={`${type.count} projects`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontSize: '0.7rem', height: 22 }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" sx={{
                                                    color: colors.gray,
                                                    display: 'block',
                                                    mb: 0.75,
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {type.projectTypeCode}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                    Total Budget: {formatCurrency(type.totalBudget)}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </DataCard>
                        </Box>
                    </Box>

                    {/* Billing Methods and Manager Workload */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2.5 }}>
                        <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                            <DataCard title="Billing Methods" icon={Receipt} color={colors.teal}>
                                {dashboardData.projectsByBillingMethod.length > 0 ? (
                                    <Stack spacing={0.75}>
                                        {dashboardData.projectsByBillingMethod.map((method, index) => (
                                            <Box key={index} sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1.5,
                                                border: `1px solid ${alpha(colors.teal, 0.15)}`,
                                                bgcolor: alpha(colors.teal, 0.04)
                                            }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                    {method.billingMethodName || 'Not Specified'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <Chip
                                                        label={`${method.projectCount} projects`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                                    />
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: colors.teal,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(method.totalBudget)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </DataCard>
                        </Box>

                        <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                            <DataCard title="Manager Workload" icon={Group} color={colors.orange}>
                                {dashboardData.managerWorkload.length > 0 ? (
                                    <Stack spacing={1.5}>
                                        {dashboardData.managerWorkload.map((manager, index) => (
                                            <Box key={manager.projectManagerEmployeeId} sx={{ p: 1.5, borderRadius: 1.5 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 0.75,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    Manager {manager.projectManagerEmployeeId.slice(0, 8)}...
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 0.75
                                                }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                        Projects: {manager.projectCount}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: colors.orange,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(manager.totalBudget)}
                                                    </Typography>
                                                </Box>
                                                <ProgressBarWithLabel
                                                    value={manager.averageProgressPercent}
                                                    color={colors.orange}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </DataCard>
                        </Box>

                        <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                            <DataCard title="Projects by Customer" icon={Business} color={colors.pink}>
                                {dashboardData.projectsByCustomer.length > 0 ? (
                                    <Stack spacing={0.75}>
                                        {dashboardData.projectsByCustomer.map((customer, index) => (
                                            <Paper key={index} sx={{
                                                p: 1.25,
                                                borderRadius: 1.5,
                                                border: `1px solid ${alpha(colors.pink, 0.1)}`
                                            }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {customer.customerName}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Chip
                                                        label={`${customer.projectCount} projects`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                                    />
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: colors.pink,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(customer.totalBudget)}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage />
                                )}
                            </DataCard>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            {/* Risk & Deadlines Section */}
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
                <Collapse in={expandedSections.risks}>
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
                                        {dashboardData.riskAndDeadlines.atRiskProjects.map((project, index) => (
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
                                                                formatCurrency={formatCurrency}
                                                                ProjectCreateInputForm={ProjectCreateInputForm}
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
                                        {dashboardData.riskAndDeadlines.overdueProjects.map((project, index) => (
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
                                                                apiUrl={"https://project.api.techbee.et/api/projects"}
                                                                formatCurrency={formatCurrency}
                                                                ProjectCreateInputForm={ProjectCreateInputForm}
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
                                        {dashboardData.topProjects.map((project, index) => (
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
                                                                    <Tooltip title="High Risk">
                                                                        <Warning sx={{ color: colors.error, fontSize: 14 }} />
                                                                    </Tooltip>
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
                                                                apiUrl={"https://project.api.techbee.et/api/projects"}
                                                                formatCurrency={formatCurrency}
                                                                ProjectCreateInputForm={ProjectCreateInputForm}
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
                                                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`
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
                                            {dashboardData.topRiskProjects.map((project, index) => (
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
                                                                    apiUrl={"https://project.api.techbee.et/api/projects"}
                                                                    formatCurrency={formatCurrency}
                                                                    ProjectCreateInputForm={ProjectCreateInputForm}
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
                                            {dashboardData.timesheets.byProject.slice(0, 5).map((project, index) => (
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

            {/* Tasks & Milestones Section */}
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
                <Collapse in={expandedSections.tasks}>
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
                                        {filteredTasks.map((task) => (
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
                                                                    apiUrl={apiUrl}
                                                                    TaskCreateInputForm={WbsItemCreateInput}
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
                                        {filteredMilestones.map((milestone, index) => (
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

            {/* Monthly Trends Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        color: colors.primary,
                        fontSize: '1.125rem'
                    }}>
                        Analytics & Trends
                    </Typography>
                </Box>
                <Collapse in={expandedSections.analytics}>
                    <DataCard title="Monthly Trends" icon={TrendingFlat} color={colors.primary} defaultExpanded={true}>
                        {dashboardData.monthlyTrends.length > 0 ? (
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.monthlyTrends}>
                                        <CartesianGrid strokeDasharray="2 2" stroke={alpha('#000', 0.08)} />
                                        <XAxis
                                            dataKey="month"
                                            tickFormatter={(value) => format(parseISO(value + '-01'), 'MMM yy')}
                                            fontSize={11}
                                        />
                                        <YAxis fontSize={11} />
                                        <RechartsTooltip
                                            formatter={(value: any) => [value, '']}
                                            labelFormatter={(label) => format(parseISO(label + '-01'), 'MMM yyyy')}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="newProjectsCount"
                                            name="New Projects"
                                            stroke={colors.primary}
                                            fill={alpha(colors.primary, 0.25)}
                                            strokeWidth={1.5}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="totalBudget"
                                            name="Total Budget"
                                            stroke={colors.success}
                                            fill={alpha(colors.success, 0.25)}
                                            strokeWidth={1.5}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        ) : (
                            <NoDataMessage message="No monthly trends data available" />
                        )}
                    </DataCard>
                </Collapse>
            </Box>

            {/* All Projects Section with Filters */}
            <Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5
                }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
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
                        {filteredProjects.map((project) => (
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
                                            : alpha(theme.palette.divider, 0.4)
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
                                                        color: theme.palette.text.primary,
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
                                                            apiUrl={"https://project.api.techbee.et/api/projects"}
                                                            formatCurrency={formatCurrency}
                                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                                        />
                                                    </div>
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" sx={{
                                                color: theme.palette.text.secondary,
                                                mb: 1.5,
                                                fontSize: '0.8125rem'
                                            }}>
                                                Customer: {project.customerName || 'N/A'}
                                            </Typography>

                                            <Box sx={{ mb: 1.5 }}>
                                                <Typography variant="caption" sx={{
                                                    color: theme.palette.text.secondary,
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
                                                        color: theme.palette.text.disabled,
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
                                                        color: theme.palette.text.secondary,
                                                        display: 'block',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        Budget
                                                    </Typography>
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.text.primary,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(project.totalBudget)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 100 }}>
                                                    <Typography variant="caption" sx={{
                                                        color: theme.palette.text.secondary,
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
                                {filteredProjects.map((project) => (
                                    <TableRow
                                        key={project.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                cursor: 'pointer'
                                            },
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`
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
                                                color: theme.palette.text.secondary,
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
                                                    color: theme.palette.text.disabled,
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
                                                    formatCurrency={formatCurrency}
                                                    ProjectCreateInputForm={ProjectCreateInputForm}
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
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 1.5
                    }}>
                        <Folder sx={{
                            fontSize: 36,
                            color: theme.palette.text.disabled,
                            mb: 1.5
                        }} />
                        <Typography variant="h6" sx={{
                            color: theme.palette.text.secondary,
                            mb: 0.75,
                            fontSize: '1rem'
                        }}>
                            No Projects Found
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: theme.palette.text.disabled,
                            fontSize: '0.8125rem'
                        }}>
                            Try adjusting your filters or search term
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}