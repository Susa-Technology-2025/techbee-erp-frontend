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
    Money
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart, Line, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, AreaChart, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link';

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

const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return 'N/A';
    if (amount >= 1000000) {
        return `ETB ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `ETB ${(amount / 1000).toFixed(1)}K`;
    }
    return `ETB ${amount.toFixed(0)}`;
};

const formatNumber = (num: number | null): string => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
};

const ProgressBarWithLabel = ({ value, color }: { value: number; color: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={Math.min(value, 100)}
                sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(color, 0.2),
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                        borderRadius: 4,
                    },
                }}
            />
        </Box>
        <Typography variant="body2" sx={{ color, fontWeight: 600, minWidth: 40 }}>
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
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
        }
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="body2" sx={{ color: alpha('#000', 0.6), fontWeight: 500, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: color, fontWeight: 700 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: alpha('#000', 0.5) }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(color, 0.1),
                }}>
                    <Icon sx={{ color, fontSize: 24 }} />
                </Box>
            </Box>
            {trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    {trend >= 0 ? (
                        <TrendingUp sx={{ fontSize: 16, color: '#10B981' }} />
                    ) : (
                        <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
                    )}
                    <Typography variant="caption" sx={{
                        color: trend >= 0 ? '#10B981' : '#EF4444',
                        fontWeight: 600
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
            borderRadius: 3,
            border: `1px solid ${alpha(color, 0.2)}`,
            overflow: 'hidden'
        }}>
            <Box sx={{
                p: 2,
                bgcolor: alpha(color, 0.05),
                borderBottom: expanded ? `1px solid ${alpha(color, 0.1)}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Icon sx={{ color }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color }}>
                        {title}
                    </Typography>
                </Box>
                {collapsible && (
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ color }}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                )}
            </Box>
            <Collapse in={expanded}>
                <CardContent sx={{ p: 3 }}>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    );
};

const NoDataMessage = ({ message = "No data available" }: { message?: string }) => (
    <Box sx={{
        py: 4,
        textAlign: 'center',
        bgcolor: alpha('#000', 0.02),
        borderRadius: 2
    }}>
        <Description sx={{ fontSize: 48, color: alpha('#000', 0.2), mb: 2 }} />
        <Typography variant="body1" sx={{ color: alpha('#000', 0.5) }}>
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

    const buildApiUrl = () => {
        const baseUrl = 'https://project.api.techbee.et/api/projects/analytics/overview';
        const params = new URLSearchParams({
            from: formatDate(fromDate),
            to: formatDate(toDate)
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading, isError, error, refetch } = useDataQuery({
        apiEndPoint: apiUrl,
        enabled: true,
        noFilter: true,
        fetchWithoutRefresh: true,
    });

    const dashboardData = data as DashboardData;

    const handleApply = () => {
        refetch();
        setShowPicker(false);
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

    // Color palette
    const colors = {
        primary: '#6366F1',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        purple: '#8B5CF6',
        pink: '#EC4899',
        teal: '#14B8A6',
        indigo: '#4F46E5',
        orange: '#F97316',
        gray: '#6B7280'
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
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
        <Box sx={{ p: 3 }}>
            {/* Header with Date Picker */}
            <Box sx={{
                mb: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.5 }}>
                        Project Analytics Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {formatDateTime(dashboardData.window.from)} - {formatDateTime(dashboardData.window.to)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    {!showPicker ? (
                        <Box
                            sx={{
                                bgcolor: alpha(colors.primary, 0.1),
                                px: 2,
                                py: 1,
                                borderRadius: 5,
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(colors.primary, 0.15),
                                    borderColor: alpha(colors.primary, 0.3),
                                }
                            }}
                            onClick={() => setShowPicker(true)}
                        >
                            <CalendarToday sx={{ fontSize: 16, color: colors.primary }} />
                            <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 500 }}>
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
                                            width: 150,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
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
                                            width: 150,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
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
                                    borderRadius: 2,
                                    bgcolor: colors.primary,
                                    '&:hover': { bgcolor: '#4F46E5' }
                                }}
                            >
                                Apply
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowPicker(false)}
                                sx={{ borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Summary Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                        Summary Overview
                    </Typography>
                </Box>
                <Collapse in={expandedSections.summary}>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3
                    }}>
                        <Box sx={{ flex: '1 1 300px' }}>
                            <SummaryCard
                                title="Total Projects"
                                value={dashboardData.summary.totalProjects}
                                icon={Folder}
                                color={colors.primary}
                                subtitle={`${dashboardData.summary.activeProjects} active, ${dashboardData.summary.closedProjects} closed`}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 300px' }}>
                            <SummaryCard
                                title="Planned Budget"
                                value={formatCurrency(dashboardData.summary.totalPlannedBudget)}
                                icon={Money}
                                color={colors.success}
                                subtitle={`Actual: ${formatCurrency(dashboardData.summary.totalActualCost)}`}
                            />
                        </Box>
                        <Box sx={{ flex: '1 1 300px' }}>
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
                        <Box sx={{ flex: '1 1 300px' }}>
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
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.gray }}>
                            Approval Status
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {Object.entries(dashboardData.summary.byApprovalStatus).map(([status, count], index) => (
                                <Chip
                                    key={status}
                                    label={`${status}: ${count}`}
                                    sx={{
                                        bgcolor: alpha(colors.purple, 0.1),
                                        color: colors.purple,
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            {/* Projects Analytics Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.indigo }}>
                        Projects Analytics
                    </Typography>
                </Box>
                <Collapse in={expandedSections.projects}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Projects by Stage */}
                        <Box sx={{ flex: '1 1 400px' }}>
                            <DataCard title="Projects by Stage" icon={Category} color={colors.indigo}>
                                {dashboardData.pipelineByStage.length > 0 ? (
                                    <>
                                        <Box sx={{ height: 250, mb: 2 }}>
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
                                                        outerRadius={70}
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
                                        <Stack spacing={1}>
                                            {dashboardData.pipelineByStage.map((stage, index) => (
                                                <Box key={index} sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: alpha(colors.indigo, 0.05)
                                                }}>
                                                    <Typography variant="body2">
                                                        {stage.stageName || 'Unassigned'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Chip
                                                            label={`${stage.count} projects`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Typography variant="body2" sx={{ color: colors.gray }}>
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
                        <Box sx={{ flex: '1 1 400px' }}>
                            <DataCard title="Projects by Type" icon={Assignment} color={colors.purple}>
                                {dashboardData.projectsByType.length > 0 ? (
                                    <Stack spacing={2}>
                                        {dashboardData.projectsByType.map((type, index) => (
                                            <Paper key={type.projectTypeId} sx={{ p: 2, borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {type.projectTypeName}
                                                    </Typography>
                                                    <Chip
                                                        label={`${type.count} projects`}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </Box>
                                                <Typography variant="caption" sx={{ color: colors.gray, display: 'block', mb: 1 }}>
                                                    {type.projectTypeCode}
                                                </Typography>
                                                <Typography variant="body2">
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 3 }}>
                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Billing Methods" icon={Receipt} color={colors.teal}>
                                {dashboardData.projectsByBillingMethod.length > 0 ? (
                                    <Stack spacing={1}>
                                        {dashboardData.projectsByBillingMethod.map((method, index) => (
                                            <Box key={index} sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.5,
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(colors.teal, 0.2)}`,
                                                bgcolor: alpha(colors.teal, 0.05)
                                            }}>
                                                <Typography variant="body2">
                                                    {method.billingMethodName || 'Not Specified'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={`${method.projectCount} projects`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.teal }}>
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

                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Manager Workload" icon={Group} color={colors.orange}>
                                {dashboardData.managerWorkload.length > 0 ? (
                                    <Stack spacing={2}>
                                        {dashboardData.managerWorkload.map((manager, index) => (
                                            <Box key={manager.projectManagerEmployeeId} sx={{ p: 2, borderRadius: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Manager {manager.projectManagerEmployeeId.slice(0, 8)}...
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body2">
                                                        Projects: {manager.projectCount}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.orange }}>
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

                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Projects by Customer" icon={Business} color={colors.pink}>
                                {dashboardData.projectsByCustomer.length > 0 ? (
                                    <Stack spacing={1}>
                                        {dashboardData.projectsByCustomer.map((customer, index) => (
                                            <Paper key={index} sx={{ p: 1.5, borderRadius: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {customer.customerName}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Chip
                                                        label={`${customer.projectCount} projects`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.pink }}>
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
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.error }}>
                        Risk & Deadlines
                    </Typography>
                </Box>
                <Collapse in={expandedSections.risks}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Risk Overview */}
                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Risk Overview" icon={Warning} color={colors.error} defaultExpanded={true}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.error, 0.05),
                                        border: `1px solid ${alpha(colors.error, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h3" sx={{ color: colors.error, fontWeight: 700 }}>
                                            {dashboardData.riskAndDeadlines.atRiskCount}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.error }}>
                                            At Risk
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.warning, 0.05),
                                        border: `1px solid ${alpha(colors.warning, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h3" sx={{ color: colors.warning, fontWeight: 700 }}>
                                            {dashboardData.riskAndDeadlines.overdueCount}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.warning }}>
                                            Overdue
                                        </Typography>
                                    </Paper>
                                </Box>

                                {/* At Risk Projects */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
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
                                                    p: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.error, 0.05),
                                                        borderColor: colors.error
                                                    }
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.error }}>
                                                                {project.code}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: colors.gray }}>
                                                                {project.title}
                                                            </Typography>
                                                        </Box>
                                                        <Warning sx={{ color: colors.error }} />
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: colors.gray, display: 'block' }}>
                                                        Due: {formatDateTime(project.plannedEndDate)}
                                                    </Typography>
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
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
                                                    p: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.warning, 0.05),
                                                        borderColor: colors.warning
                                                    }
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.warning }}>
                                                                {project.code}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: colors.gray }}>
                                                                {project.title}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Chip
                                                                label={`${project.daysOverdue} days`}
                                                                size="small"
                                                                sx={{ bgcolor: alpha(colors.warning, 0.1), color: colors.warning }}
                                                            />
                                                            {project.riskFlag && <Warning sx={{ color: colors.error, fontSize: 16 }} />}
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: colors.gray, display: 'block' }}>
                                                        Due: {formatDateTime(project.plannedEndDate)}
                                                    </Typography>
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
                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Top Projects" icon={TrendingUp} color={colors.success} defaultExpanded={true}>
                                {dashboardData.topProjects.length > 0 ? (
                                    <Stack spacing={2}>
                                        {dashboardData.topProjects.map((project, index) => (
                                            <Link
                                                key={project.id}
                                                href={`/project/${project.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Paper sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.success, 0.05),
                                                        borderColor: colors.success
                                                    }
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.success }}>
                                                                {project.code}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: colors.gray }}>
                                                                {project.title}
                                                            </Typography>
                                                        </Box>
                                                        {project.riskFlag && <Warning sx={{ color: colors.error }} />}
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                        <Chip
                                                            label={project.approvalStatus}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
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

                            <Box sx={{ mt: 3 }}>
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
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            bgcolor: alpha(colors.warning, 0.05),
                                                            borderColor: colors.warning
                                                        }
                                                    }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: colors.warning }}>
                                                            {project.code}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Chip
                                                                label={`${project.daysOverdue} days overdue`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(colors.warning, 0.1),
                                                                    color: colors.warning
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: colors.gray }}>
                                                                {formatCurrency(project.totalBudget)}
                                                            </Typography>
                                                        </Box>
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
                        <Box sx={{ flex: '1 1 300px' }}>
                            <DataCard title="Timesheets" icon={AccessTime} color={colors.info} defaultExpanded={true}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.info, 0.05),
                                        border: `1px solid ${alpha(colors.info, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.info, fontWeight: 700 }}>
                                            {dashboardData.timesheets.totalTrackedHours}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.info }}>
                                            Tracked Hours
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        bgcolor: alpha(colors.success, 0.05),
                                        border: `1px solid ${alpha(colors.success, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.success, fontWeight: 700 }}>
                                            {dashboardData.timesheets.totalBillableHours}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.success }}>
                                            Billable Hours
                                        </Typography>
                                    </Paper>
                                </Box>
                                <Typography variant="body2" sx={{ color: colors.gray }}>
                                    Projects with time entries: {dashboardData.timesheets.projectsWithTimeEntries}
                                </Typography>

                                {dashboardData.timesheets.byProject.length > 0 ? (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            By Project
                                        </Typography>
                                        <Stack spacing={1}>
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
                                                        bgcolor: alpha(colors.info, 0.05),
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            bgcolor: alpha(colors.info, 0.1)
                                                        }
                                                    }}>
                                                        <Typography variant="body2">
                                                            Project {index + 1}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.info }}>
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
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.teal }}>
                        Tasks & Milestones
                    </Typography>
                </Box>
                <Collapse in={expandedSections.tasks}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Task Summary */}
                        <Box sx={{ flex: '1 1 400px' }}>
                            <DataCard title="Task Summary" icon={Task} color={colors.teal} defaultExpanded={true}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        bgcolor: alpha(colors.teal, 0.05),
                                        border: `1px solid ${alpha(colors.teal, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.teal, fontWeight: 700 }}>
                                            {dashboardData.tasksAndMilestones.taskSummary.totalTasks}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.teal }}>
                                            Total Tasks
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        bgcolor: alpha(colors.success, 0.05),
                                        border: `1px solid ${alpha(colors.success, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.success, fontWeight: 700 }}>
                                            {dashboardData.tasksAndMilestones.taskSummary.completedTasks}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.success }}>
                                            Completed
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        bgcolor: alpha(colors.error, 0.05),
                                        border: `1px solid ${alpha(colors.error, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.error, fontWeight: 700 }}>
                                            {dashboardData.tasksAndMilestones.taskSummary.overdueTasks}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.error }}>
                                            Overdue
                                        </Typography>
                                    </Paper>
                                </Box>

                                {/* Task Filter Chips */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Chip
                                        icon={<AccessTimeIcon />}
                                        label={`All: ${dashboardData.tasksAndMilestones.taskSummary.totalTasks}`}
                                        variant={taskFilter === 'all' ? 'filled' : 'outlined'}
                                        color={taskFilter === 'all' ? 'primary' : 'default'}
                                        onClick={() => setTaskFilter('all')}
                                        clickable
                                        sx={{
                                            borderColor: colors.primary,
                                            color: taskFilter === 'all' ? 'white' : colors.primary,
                                            bgcolor: taskFilter === 'all' ? colors.primary : 'transparent'
                                        }}
                                    />
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label={`Completed: ${dashboardData.tasksAndMilestones.taskSummary.completedTasks}`}
                                        variant={taskFilter === 'completed' ? 'filled' : 'outlined'}
                                        color={taskFilter === 'completed' ? 'success' : 'default'}
                                        onClick={() => setTaskFilter('completed')}
                                        clickable
                                        sx={{
                                            borderColor: colors.success,
                                            color: taskFilter === 'completed' ? 'white' : colors.success,
                                            bgcolor: taskFilter === 'completed' ? colors.success : 'transparent'
                                        }}
                                    />
                                    <Chip
                                        icon={<ErrorIcon />}
                                        label={`Overdue: ${dashboardData.tasksAndMilestones.taskSummary.overdueTasks}`}
                                        variant={taskFilter === 'overdue' ? 'filled' : 'outlined'}
                                        color={taskFilter === 'overdue' ? 'error' : 'default'}
                                        onClick={() => setTaskFilter('overdue')}
                                        clickable
                                        sx={{
                                            borderColor: colors.error,
                                            color: taskFilter === 'overdue' ? 'white' : colors.error,
                                            bgcolor: taskFilter === 'overdue' ? colors.error : 'transparent'
                                        }}
                                    />
                                </Box>

                                {/* Filtered Tasks */}
                                {filteredTasks.length > 0 ? (
                                    <Stack spacing={2}>
                                        {filteredTasks.map((task, index) => (
                                            <Link
                                                key={task.id}
                                                href={`/project/${task.projectId}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Paper sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.teal, 0.05),
                                                        borderColor: colors.teal
                                                    }
                                                }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {task.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.gray, display: 'block', mb: 1 }}>
                                                        Project: {task.projectTitle}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ color: colors.gray }}>
                                                            {task.code}
                                                        </Typography>
                                                        <Chip
                                                            label={`Due: ${formatDateTime(task.plannedEndDate)}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Paper>
                                            </Link>
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoDataMessage message={`No ${taskFilter} tasks found`} />
                                )}

                                {/* Due Date Chips */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                                    <Chip
                                        icon={<Schedule />}
                                        label={`Due in 7 days: ${dashboardData.tasksAndMilestones.taskSummary.tasksDueIn7Days}`}
                                        variant="outlined"
                                        sx={{ borderColor: colors.warning, color: colors.warning }}
                                    />
                                    <Chip
                                        icon={<Schedule />}
                                        label={`Due in 30 days: ${dashboardData.tasksAndMilestones.taskSummary.tasksDueIn30Days}`}
                                        variant="outlined"
                                        sx={{ borderColor: colors.info, color: colors.info }}
                                    />
                                </Box>
                            </DataCard>
                        </Box>

                        {/* Milestone Summary */}
                        <Box sx={{ flex: '1 1 400px' }}>
                            <DataCard title="Milestone Summary" icon={CheckCircle} color={colors.purple} defaultExpanded={true}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        bgcolor: alpha(colors.purple, 0.05),
                                        border: `1px solid ${alpha(colors.purple, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.purple, fontWeight: 700 }}>
                                            {dashboardData.tasksAndMilestones.milestoneSummary.totalMilestones}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.purple }}>
                                            Total Milestones
                                        </Typography>
                                    </Paper>
                                    <Paper sx={{
                                        flex: 1,
                                        p: 2,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        bgcolor: alpha(colors.success, 0.05),
                                        border: `1px solid ${alpha(colors.success, 0.2)}`,
                                        borderRadius: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: colors.success, fontWeight: 700 }}>
                                            {dashboardData.tasksAndMilestones.milestoneSummary.completedMilestones}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.success }}>
                                            Completed
                                        </Typography>
                                    </Paper>
                                </Box>

                                {/* Milestone Filter Chips */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                    <Chip
                                        label={`All: ${dashboardData.tasksAndMilestones.milestoneSummary.totalMilestones}`}
                                        variant={milestoneFilter === 'all' ? 'filled' : 'outlined'}
                                        color={milestoneFilter === 'all' ? 'primary' : 'default'}
                                        onClick={() => setMilestoneFilter('all')}
                                        clickable
                                        sx={{
                                            borderColor: colors.purple,
                                            color: milestoneFilter === 'all' ? 'white' : colors.purple,
                                            bgcolor: milestoneFilter === 'all' ? colors.purple : 'transparent'
                                        }}
                                    />
                                    <Chip
                                        label={`Completed: ${dashboardData.tasksAndMilestones.milestoneSummary.completedMilestones}`}
                                        variant={milestoneFilter === 'completed' ? 'filled' : 'outlined'}
                                        color={milestoneFilter === 'completed' ? 'success' : 'default'}
                                        onClick={() => setMilestoneFilter('completed')}
                                        clickable
                                        sx={{
                                            borderColor: colors.success,
                                            color: milestoneFilter === 'completed' ? 'white' : colors.success,
                                            bgcolor: milestoneFilter === 'completed' ? colors.success : 'transparent'
                                        }}
                                    />
                                    <Chip
                                        label={`Overdue: ${dashboardData.tasksAndMilestones.milestoneSummary.overdueMilestones}`}
                                        variant={milestoneFilter === 'overdue' ? 'filled' : 'outlined'}
                                        color={milestoneFilter === 'overdue' ? 'error' : 'default'}
                                        onClick={() => setMilestoneFilter('overdue')}
                                        clickable
                                        sx={{
                                            borderColor: colors.error,
                                            color: milestoneFilter === 'overdue' ? 'white' : colors.error,
                                            bgcolor: milestoneFilter === 'overdue' ? colors.error : 'transparent'
                                        }}
                                    />
                                </Box>

                                {/* Filtered Milestones */}
                                {filteredMilestones.length > 0 ? (
                                    <Stack spacing={2}>
                                        {filteredMilestones.map((milestone, index) => (
                                            <Link
                                                key={milestone.id}
                                                href={`/project/${milestone.projectId}/milestone/${milestone.id}`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Paper sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        bgcolor: alpha(colors.purple, 0.05),
                                                        borderColor: colors.purple
                                                    }
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                                    <Chip
                                        label={`Due in 7 days: ${dashboardData.tasksAndMilestones.milestoneSummary.milestonesDueIn7Days}`}
                                        variant="outlined"
                                        sx={{ borderColor: colors.warning, color: colors.warning }}
                                    />
                                    <Chip
                                        label={`Due in 30 days: ${dashboardData.tasksAndMilestones.milestoneSummary.milestonesDueIn30Days}`}
                                        variant="outlined"
                                        sx={{ borderColor: colors.info, color: colors.info }}
                                    />
                                </Box>
                            </DataCard>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            {/* Monthly Trends Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                        Analytics & Trends
                    </Typography>
                </Box>
                <Collapse in={expandedSections.analytics}>
                    <DataCard title="Monthly Trends" icon={TrendingFlat} color={colors.primary} defaultExpanded={true}>
                        {dashboardData.monthlyTrends.length > 0 ? (
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                                        <XAxis
                                            dataKey="month"
                                            tickFormatter={(value) => format(parseISO(value + '-01'), 'MMM yy')}
                                        />
                                        <YAxis />
                                        <RechartsTooltip
                                            formatter={(value: any) => [value, '']}
                                            labelFormatter={(label) => format(parseISO(label + '-01'), 'MMM yyyy')}
                                        />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="newProjectsCount"
                                            name="New Projects"
                                            stroke={colors.primary}
                                            fill={alpha(colors.primary, 0.3)}
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="totalBudget"
                                            name="Total Budget"
                                            stroke={colors.success}
                                            fill={alpha(colors.success, 0.3)}
                                            strokeWidth={2}
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
                    mb: 2
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        All Projects ({filteredProjects.length})
                    </Typography>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => newMode && setViewMode(newMode)}
                        size="small"
                    >
                        <ToggleButton value="card">
                            <ViewModule sx={{ fontSize: 18 }} />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewList sx={{ fontSize: 18 }} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Filter and Search Bar */}
                <Box sx={{
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    p: 2,
                    bgcolor: alpha(colors.primary, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${alpha(colors.primary, 0.1)}`
                }}>
                    <TextField
                        placeholder="Search projects..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            minWidth: 200,
                            maxWidth: 500,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: colors.gray }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl> */}

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Risk</InputLabel>
                        <Select
                            value={riskFilter}
                            label="Risk"
                            onChange={(e) => setRiskFilter(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="all">All Risk</MenuItem>
                            <MenuItem value="risky">At Risk</MenuItem>
                            <MenuItem value="safe">Safe</MenuItem>
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
                        startIcon={<FilterList />}
                        sx={{ borderRadius: 2 }}
                    >
                        Clear Filters
                    </Button>
                </Box>

                {viewMode === 'card' ? (
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3
                    }}>
                        {filteredProjects.map((project) => (
                            <Box key={project.id} sx={{ flex: '1 1 350px', maxWidth: '100%' }}>
                                <Link
                                    href={`/project/${project.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Card sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${project.riskFlag
                                            ? alpha(colors.error, 0.3)
                                            : alpha(theme.palette.divider, 0.5)
                                            }`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 24px ${project.riskFlag
                                                ? alpha(colors.error, 0.15)
                                                : alpha(colors.primary, 0.15)
                                                }`,
                                        },
                                        height: '100%'
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Chip
                                                        label={project.code}
                                                        size="small"
                                                        sx={{
                                                            mb: 1,
                                                            bgcolor: alpha(colors.primary, 0.1),
                                                            color: colors.primary,
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                                                        {project.title}
                                                    </Typography>
                                                </Box>
                                                {project.riskFlag && (
                                                    <Warning sx={{ color: colors.error }} />
                                                )}
                                            </Box>

                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                Customer: {project.customerName || 'N/A'}
                                            </Typography>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 0.5 }}>
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
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                                        No progress data
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                <Box sx={{ flex: 1, minWidth: 120 }}>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                                                        Budget
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        {formatCurrency(project.totalBudget)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 120 }}>
                                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
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
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {project.projectStageName && (
                                                    <Chip
                                                        label={project.projectStageName}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                                {project.projectTypeName && (
                                                    <Chip
                                                        label={project.projectTypeName}
                                                        size="small"
                                                        variant="outlined"
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
                    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: alpha(colors.primary, 0.05) }}>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Project Code</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Title</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Customer</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Progress</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Budget</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Status</Typography></TableCell>
                                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Risk</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProjects.map((project) => (
                                    <TableRow
                                        key={project.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                cursor: 'pointer'
                                            },
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                                        }}
                                        onClick={() => window.location.href = `/project/${project.id}`}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                                                {project.code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {project.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                {project.customerName || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
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
                                                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                                    N/A
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(project.totalBudget)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
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
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {project.riskFlag ? (
                                                <Warning sx={{ color: colors.error }} />
                                            ) : (
                                                <CheckCircle sx={{ color: colors.success }} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {filteredProjects.length === 0 && (
                    <Box sx={{
                        py: 8,
                        textAlign: 'center',
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        borderRadius: 2
                    }}>
                        <Folder sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                            No Projects Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                            Try adjusting your filters or search term
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}