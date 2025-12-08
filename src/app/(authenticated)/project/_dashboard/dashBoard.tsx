'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Stack,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    useTheme,
    alpha,
    IconButton,
    Chip,
    AvatarGroup,
    Avatar,
    LinearProgress,
    Button,
} from '@mui/material';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import { DashboardData } from './dashboardData';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';
import {
    TrendingUp,
    TrendingDown,
    CalendarToday,
    Refresh,
    ArrowForward,
    CheckCircle,
    Warning,
    Error,
    Schedule,
    People,
    Business,
    Timeline,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Enhanced color palette
const COLORS = {
    primary: '#3f51b5',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    purple: '#9c27b0',
    pink: '#e91e63',
    teal: '#009688',
    gray: '#757575',
    lightGray: '#f5f5f5',
};

const generateColors = (count: number): string[] => {
    return [
        '#3f51b5', '#4caf50', '#ff9800', '#f44336', '#2196f3',
        '#9c27b0', '#e91e63', '#009688', '#795548', '#607d8b'
    ].slice(0, count);
};

// Enhanced DataDisplay Component
interface DataDisplayProps {
    title: string;
    value: any;
    unit?: string;
    color?: string;
    icon?: React.ReactNode;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
    title,
    value,
    unit = '',
    color = COLORS.primary,
    icon
}) => {
    const formatValue = (val: any) => {
        if (typeof val === 'number') {
            return val.toLocaleString();
        }
        if (val === null || val === undefined) {
            return '0';
        }
        return val;
    };

    const getIcon = () => {
        if (icon) return icon;

        switch (title.toLowerCase()) {
            case 'total projects':
                return <People sx={{ color }} />;
            case 'planned budget':
            case 'actual cost':
                return <TrendingUp sx={{ color }} />;
            case 'average progress':
                return <Timeline sx={{ color }} />;
            case 'projects at risk':
            case 'overdue projects':
                return <Error sx={{ color }} />;
            case 'due in 7 days':
            case 'due in 30 days':
                return <Schedule sx={{ color }} />;
            default:
                return <CheckCircle sx={{ color }} />;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha(color, 0.2),
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: alpha(color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {getIcon()}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: COLORS.gray,
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                                letterSpacing: '0.5px',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    fontSize: '1.75rem'
                                }}
                            >
                                {formatValue(value)}
                            </Typography>

                            {unit && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: COLORS.gray,
                                        fontWeight: 500
                                    }}
                                >
                                    {unit}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Enhanced Chart Component with better sizing
interface DynamicChartProps {
    data: any[];
    dataKey: string;
    xAxisKey: string;
    chartType: 'bar' | 'line' | 'area' | 'pie' | 'radar';
    title?: string;
    height?: number;
    compact?: boolean;
}

const DynamicChart: React.FC<DynamicChartProps> = ({
    data,
    dataKey,
    xAxisKey,
    chartType,
    title,
    height = 300,
    compact = false
}) => {
    if (!data || data.length === 0) {
        return (
            <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                    {title && (
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    )}
                    <Box sx={{
                        width: '100%',
                        height: height - 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const colors = generateColors(data.length);

    const renderChart = () => {
        const theme = useTheme()
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        {!compact && <Legend />}
                        <Bar
                            dataKey={dataKey}
                            fill={colors[0]}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );

            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.backgroundSection.contrastText, 0.1)} />
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        {!compact && <Legend />}
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={colors[0]}
                            strokeWidth={2}
                            dot={{ fill: colors[0], strokeWidth: 2, r: 3 }}
                        />
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#000', 0.1)} />
                        <XAxis
                            dataKey={xAxisKey}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        {!compact && <Legend />}
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={0.1}
                        />
                    </AreaChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry[xAxisKey]?.slice(0, 10)}...`}
                            outerRadius={compact ? 60 : 80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        {!compact && <Legend />}
                    </PieChart>
                );

            case 'radar':
                return (
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        width={450}
                        height={450}
                        outerRadius="90%"
                        data={data}
                    >
                        <PolarGrid gridType="circle" stroke={alpha(theme.palette.backgroundSection.contrastText, 0.2)} />

                        <PolarAngleAxis
                            dataKey={xAxisKey}
                            tick={{ fill: theme.palette.backgroundSection.contrastText, fontSize: 14 }}

                        />

                        <PolarRadiusAxis tick={{ fill: theme.palette.backgroundSection.contrastText }} />

                        <Radar
                            name="Project Count"
                            dataKey={dataKey}
                            stroke={colors[0]}
                            fill={theme.palette.backgroundSection.contrastText}
                            fillOpacity={0.35}
                            strokeWidth={3}
                        />

                        <Tooltip />
                        <Legend />
                    </RadarChart>
                );

            default:
                return null;
        }
    };

    return (
        <Card sx={{
            height: '100%',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
        }}>
            <CardContent sx={{ p: 2.5 }}>
                {title && (
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        {title}
                    </Typography>
                )}
                <Box sx={{ width: '100%', height: height }}>
                    <ResponsiveContainer>
                        {renderChart()}
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

// Enhanced Project Table
interface ProjectTableProps {
    title: string;
    projects: Array<any>;
    showRisk?: boolean;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ title, projects, showRisk = false }) => {
    const theme = useTheme();

    if (!projects || projects.length === 0) return null;

    return (
        <Card sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            height: '100%'
        }}>
            <CardContent sx={{ p: 2.5 }}>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        mb: 2.5
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{
                                borderBottom: `2px solid ${alpha('#000', 0.1)}`
                            }}>
                                <th style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    color: COLORS.gray,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Project
                                </th>
                                <th style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    color: COLORS.gray,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Status
                                </th>
                                <th style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    color: COLORS.gray,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Progress
                                </th>
                                {showRisk && (
                                    <th style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        color: COLORS.gray,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Risk
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.slice(0, 5).map((project, index) => (
                                <tr
                                    key={project.id}
                                    style={{
                                        borderBottom: index < Math.min(projects.length, 5) - 1
                                            ? `1px solid ${alpha('#000', 0.05)}`
                                            : 'none',
                                        '&:hover': {
                                            backgroundColor: alpha(COLORS.primary, 0.02)
                                        }
                                    }}
                                >
                                    <td style={{ padding: '16px' }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {project.code}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: COLORS.gray }}>
                                                {project.title}
                                            </Typography>
                                        </Box>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Chip
                                            label={project.approvalStatus}
                                            size="small"
                                            sx={{
                                                background: project.approvalStatus === 'Draft'
                                                    ? alpha(COLORS.warning, 0.1)
                                                    : alpha(COLORS.success, 0.1),
                                                color: project.approvalStatus === 'Draft'
                                                    ? COLORS.warning
                                                    : COLORS.success,
                                                fontWeight: 500,
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '16px', width: '120px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={project.totalPercentCompletion || 0}
                                                sx={{
                                                    flex: 1,
                                                    height: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: alpha('#000', 0.1),
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 3,
                                                        backgroundColor: (project.totalPercentCompletion || 0) > 70
                                                            ? COLORS.success
                                                            : (project.totalPercentCompletion || 0) > 40
                                                                ? COLORS.warning
                                                                : COLORS.error
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ minWidth: 35, fontSize: '0.75rem' }}>
                                                {project.totalPercentCompletion ? `${project.totalPercentCompletion}%` : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </td>
                                    {showRisk && (
                                        <td style={{ padding: '16px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        backgroundColor: project.riskFlag ? COLORS.error : COLORS.success,
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                    {project.riskFlag ? 'At Risk' : 'Normal'}
                                                </Typography>
                                            </Box>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

                {projects.length > 5 && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            size="small"
                            endIcon={<ArrowForward />}
                            sx={{ fontSize: '0.75rem' }}
                        >
                            View all {projects.length} projects
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
    const theme = useTheme();
    const [showPicker, setShowPicker] = useState(false);
    const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 3))); // Default: 3 months ago
    const [toDate, setToDate] = useState<Date>(new Date()); // Default: today

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

    const isDashboardData = (data: any): data is DashboardData => {
        return data && typeof data === 'object';
    };

    const dashboardData = isDashboardData(data) ? data : null;

    const handleApply = () => {
        // Re-fetch data with new dates
        refetch();
        setShowPicker(false);
    };

    if (isLoading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: 2,
                        mb: 3
                    }}
                >
                    {error?.message || 'Failed to fetch data'}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => refetch()}
                    startIcon={<Refresh />}
                >
                    Retry
                </Button>
            </Container>
        );
    }

    if (!dashboardData) {
        return (
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Alert
                    severity="info"
                    sx={{ borderRadius: 2 }}
                >
                    No dashboard data available
                </Alert>
            </Container>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 0.5,
                                    // color: theme.palette.section.contrastText
                                }}
                            >
                                Project Dashboard
                            </Typography>
                            <Typography variant="body1"
                                sx={{
                                    // color: theme.palette.section.contrastText
                                }}>
                                Real-time project metrics and analytics
                            </Typography>
                        </Box>

                        {/* Date Picker Section */}
                        {!showPicker ? (
                            <Box
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.light, 0.5),
                                    color: theme.palette.backgroundSection.contrastText,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 5,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                                onClick={() => setShowPicker(true)}
                            >
                                <CalendarToday sx={{ fontSize: 16 }} />
                                {formatDate(fromDate)} - {formatDate(toDate)}
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <DatePicker
                                    label="From"
                                    value={fromDate}
                                    onChange={(newValue) => newValue && setFromDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            sx: { width: 150 }
                                        }
                                    }}
                                />
                                <DatePicker
                                    label="To"
                                    value={toDate}
                                    onChange={(newValue) => newValue && setToDate(newValue)}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            sx: { width: 150 }
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleApply}
                                >
                                    Apply
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setShowPicker(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Summary Stats - Top Row */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h6"
                        sx={{
                            fontWeight: 600,
                            // color: theme.palette.section.contrastText
                        }}>
                        Overview
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Total Projects"
                                value={dashboardData.summary?.totalProjects || 0}
                                color={COLORS.primary}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Planned Budget"
                                value={dashboardData.summary?.totalPlannedBudget || 0}
                                unit="ETB"
                                color={COLORS.success}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Actual Cost"
                                value={dashboardData.summary?.totalActualCost || 0}
                                unit="ETB"
                                color={COLORS.warning}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Average Progress"
                                value={dashboardData.summary?.averageProgressPercent || 0}
                                unit="%"
                                color={COLORS.info}
                            />
                        </Box>
                    </Stack>
                </Stack>

                {/* Risk Indicators - Second Row */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 600, color: theme.palette.backgroundSection.contrastText,
                    }}>
                        Risk & Deadlines
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Projects at Risk"
                                value={dashboardData.riskAndDeadlines?.atRiskCount || 0}
                                color={COLORS.error}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Overdue Projects"
                                value={dashboardData.riskAndDeadlines?.overdueCount || 0}
                                color={COLORS.purple}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Due in 7 Days"
                                value={dashboardData.riskAndDeadlines?.dueIn7DaysCount || 0}
                                color={COLORS.warning}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DataDisplay
                                title="Due in 30 Days"
                                value={dashboardData.riskAndDeadlines?.dueIn30DaysCount || 0}
                                color={COLORS.teal}
                            />
                        </Box>
                    </Stack>
                </Stack>

                {/* Charts Section - Third Row */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.backgroundSection.contrastText, }}>
                        Analytics
                    </Typography>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <DynamicChart
                                data={dashboardData.pipelineByStage?.map(item => ({
                                    ...item,
                                    stageName: item.stageName || 'Unassigned'
                                })) || []}
                                dataKey="count"
                                xAxisKey="stageName"
                                chartType="bar"
                                title="Projects by Stage"
                                height={280}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DynamicChart
                                data={dashboardData.projectsByType || []}
                                dataKey="count"
                                xAxisKey="projectTypeName"
                                chartType="pie"
                                title="Projects by Type"
                                height={280}
                            />
                        </Box>
                    </Stack>
                </Stack>

                {/* Fourth Row - Manager Workload and Projects by Customer */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                        {/* Manager Workload - Takes full height on large screens */}
                        {dashboardData.managerWorkload && dashboardData.managerWorkload.length > 0 && (
                            <Box sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <DynamicChart
                                    data={dashboardData.managerWorkload.map(manager => ({
                                        ...manager,
                                        name: `Manager ${manager.projectManagerEmployeeId?.slice(-4) || 'Unknown'}`
                                    }))}
                                    dataKey="projectCount"
                                    xAxisKey="name"
                                    chartType="radar"
                                    title="Manager Workload Distribution"
                                    height={350}
                                    compact={false}
                                />
                            </Box>
                        )}

                        {/* Projects by Customer - Next to Manager Workload */}
                        <Box sx={{ flex: 1 }}>
                            <DynamicChart
                                data={dashboardData.projectsByCustomer || []}
                                dataKey="projectCount"
                                xAxisKey="customerName"
                                chartType="bar"
                                title="Projects by Customer"
                                height={350}
                            />
                        </Box>
                    </Stack>
                </Stack>

                {/* Fifth Row - Monthly Trends (Full Width) */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Box sx={{ width: '100%' }}>
                        <DynamicChart
                            data={dashboardData.monthlyTrends || []}
                            dataKey="newProjectsCount"
                            xAxisKey="month"
                            chartType="line"
                            title="Monthly Trends"
                            height={280}
                        />
                    </Box>
                </Stack>

                {/* Projects Tables - Sixth Row */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.backgroundSection.contrastText }}>
                        Project Details
                    </Typography>

                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                        {dashboardData.topProjects && dashboardData.topProjects.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <ProjectTable
                                    title="Top Projects"
                                    projects={dashboardData.topProjects}
                                    showRisk
                                />
                            </Box>
                        )}

                        {dashboardData.topRiskProjects && dashboardData.topRiskProjects.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <ProjectTable
                                    title="Risk Projects"
                                    projects={dashboardData.topRiskProjects}
                                />
                            </Box>
                        )}
                    </Stack>
                </Stack>

                {/* Timesheets Summary - Bottom */}
                {dashboardData.timesheets && (
                    <Card sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 2
                    }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 600 }}
                            >
                                Timesheets Overview
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                    <DataDisplay
                                        title="Total Tracked Hours"
                                        value={dashboardData.timesheets.totalTrackedHours || 0}
                                        unit="hrs"
                                        color={COLORS.primary}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <DataDisplay
                                        title="Total Billable Hours"
                                        value={dashboardData.timesheets.totalBillableHours || 0}
                                        unit="hrs"
                                        color={COLORS.success}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <DataDisplay
                                        title="Projects with Time Entries"
                                        value={dashboardData.timesheets.projectsWithTimeEntries || 0}
                                        color={COLORS.info}
                                    />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </LocalizationProvider>
    );
};

export default Dashboard;