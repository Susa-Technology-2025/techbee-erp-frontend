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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Tooltip,
    CardHeader,
    Collapse,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
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
    Tooltip as RechartsTooltip,
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
    Error as ErrorIcon,
    Schedule,
    People,
    Business,
    Timeline,
    ExpandMore,
    ExpandLess,
    ArrowDropUp,
    ArrowDropDown,
    AttachMoney,
    AccountBalance,
    ShowChart,
    PieChart as PieChartIcon,
    Timeline as TimelineIcon,
    Assessment,
    Dashboard as DashboardIcon,
    Description,
    DateRange,
    AccessTime,
    Group,
    Folder,
    Task,
    Flag,
    MonetizationOn,
    Calculate,
    Percent,
    Numbers,
    LocalAtm,
    CreditCard,
    AccountTree,
    TableChart,
    Receipt,
    BarChart as BarChartIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Link from 'next/link';
import { useRouter } from "next/navigation"

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
    lightGray: '#f5f5f0',
    blue: '#2196f3',
    green: '#4caf50',
    orange: '#ff9800',
    red: '#f44336',
    cyan: '#00bcd4',
    lime: '#cddc39',
    amber: '#ffc107',
    deepPurple: '#673ab7',
    indigo: '#3f51b5',
};

const generateColors = (count: number): string[] => {
    return [
        '#3f51b5', '#4caf50', '#ff9800', '#f44336', '#2196f3',
        '#9c27b0', '#e91e63', '#009688', '#795548', '#607d8b',
        '#00bcd4', '#cddc39', '#ffc107', '#673ab7', '#8bc34a',
        '#ff5722', '#607d8b', '#9e9e9e', '#ffeb3b', '#03a9f4'
    ].slice(0, count);
};

// Enhanced DataDisplay Component
interface DataDisplayProps {
    title: string;
    value: any;
    unit?: string;
    color?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: number;
    description?: string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
    title,
    value,
    unit = '',
    color = COLORS.primary,
    icon,
    trend,
    trendValue,
    description
}) => {
    const formatValue = (val: any) => {
        if (typeof val === 'number') {
            if (val > 1000000) {
                return `${(val / 1000000).toFixed(1)}M`;
            }
            if (val > 1000) {
                return `${(val / 1000).toFixed(1)}K`;
            }
            if (Number.isInteger(val)) {
                return val.toLocaleString();
            }
            return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
        if (val === null || val === undefined || val === '') {
            return 'N/A';
        }
        return val;
    };

    const getIcon = () => {
        if (icon) return icon;

        switch (title.toLowerCase()) {
            case 'total projects':
                return <Folder sx={{ color }} />;
            case 'planned budget':
                return <LocalAtm sx={{ color }} />;
            case 'actual cost':
                return <Receipt sx={{ color }} />;
            case 'average progress':
                return <Timeline sx={{ color }} />;
            case 'projects at risk':
                return <Warning sx={{ color }} />;
            case 'overdue projects':
                return <ErrorIcon sx={{ color }} />;
            case 'due in 7 days':
            case 'due in 30 days':
                return <Schedule sx={{ color }} />;
            case 'budget utilization':
                return <Percent sx={{ color }} />;
            case 'active projects':
                return <TrendingUp sx={{ color }} />;
            case 'closed projects':
                return <CheckCircle sx={{ color }} />;
            case 'cancelled projects':
                return <TrendingDown sx={{ color }} />;
            case 'total tracked hours':
                return <AccessTime sx={{ color }} />;
            case 'total billable hours':
                return <MonetizationOn sx={{ color }} />;
            case 'projects with time entries':
                return <Description sx={{ color }} />;
            case 'total tasks':
                return <Task sx={{ color }} />;
            case 'completed tasks':
                return <CheckCircle sx={{ color }} />;
            case 'overdue tasks':
                return <ErrorIcon sx={{ color }} />;
            case 'total milestones':
                return <Flag sx={{ color }} />;
            case 'completed milestones':
                return <CheckCircle sx={{ color }} />;
            case 'overdue milestones':
                return <ErrorIcon sx={{ color }} />;
            default:
                return <Numbers sx={{ color }} />;
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

                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
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

                            {trend && trendValue && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {trend === 'up' ? (
                                        <ArrowDropUp sx={{ color: COLORS.success }} />
                                    ) : trend === 'down' ? (
                                        <ArrowDropDown sx={{ color: COLORS.error }} />
                                    ) : null}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: trend === 'up' ? COLORS.success : COLORS.error,
                                            fontWeight: 600
                                        }}
                                    >
                                        {trendValue}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {description && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: COLORS.gray,
                                    display: 'block',
                                    mt: 1
                                }}
                            >
                                {description}
                            </Typography>
                        )}
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
    colors?: string[];
    multipleBars?: boolean;
}

const DynamicChart: React.FC<DynamicChartProps> = ({
    data,
    dataKey,
    xAxisKey,
    chartType,
    title,
    height = 300,
    compact = false,
    colors,
    multipleBars = false
}) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return (
            <Card sx={{
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}>
                <CardContent>
                    {title && (
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
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
                        bgcolor: alpha(theme.palette.text.secondary, 0.04)
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No data available for this chart
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const chartColors = colors || generateColors(data.length);

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                if (multipleBars) {
                    const keys = Object.keys(data[0]).filter(key => key !== xAxisKey);
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
                            <RechartsTooltip
                                contentStyle={{
                                    borderRadius: 6,
                                    border: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    backgroundColor: theme.palette.background.paper
                                }}
                            />
                            {!compact && <Legend />}
                            {keys.map((key, index) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={chartColors[index % chartColors.length]}
                                    radius={[4, 4, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    );
                }
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
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                backgroundColor: theme.palette.background.paper
                            }}
                        />
                        {!compact && <Legend />}
                        <Bar
                            dataKey={dataKey}
                            fill={chartColors[0]}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );

            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
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
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                backgroundColor: theme.palette.background.paper
                            }}
                        />
                        {!compact && <Legend />}
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={chartColors[0]}
                            strokeWidth={2}
                            dot={{ fill: chartColors[0], strokeWidth: 2, r: 3 }}
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
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                backgroundColor: theme.palette.background.paper
                            }}
                        />
                        {!compact && <Legend />}
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={chartColors[0]}
                            fill={chartColors[0]}
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
                            label={(entry) => `${entry[xAxisKey] || 'N/A'}`}
                            outerRadius={compact ? 60 : 80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={chartColors[index % chartColors.length]}
                                />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: 6,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                backgroundColor: theme.palette.background.paper
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
                        outerRadius="80%"
                        data={data}
                    >
                        <PolarGrid gridType="circle" stroke={alpha(theme.palette.text.secondary, 0.2)} />
                        <PolarAngleAxis
                            dataKey={xAxisKey}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        />
                        <PolarRadiusAxis tick={{ fill: theme.palette.text.secondary }} />
                        <Radar
                            name="Value"
                            dataKey={dataKey}
                            stroke={chartColors[0]}
                            fill={chartColors[0]}
                            fillOpacity={0.35}
                            strokeWidth={2}
                        />
                        <RechartsTooltip />
                        {!compact && <Legend />}
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
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        {chartType === 'bar' && <BarChartIcon fontSize="small" />}
                        {chartType === 'pie' && <PieChartIcon fontSize="small" />}
                        {chartType === 'line' && <TimelineIcon fontSize="small" />}
                        {chartType === 'radar' && <ShowChart fontSize="small" />}
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
    showBudget?: boolean;
    showProgress?: boolean;
    columns?: string[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({
    title,
    projects,
    showRisk = false,
    showBudget = false,
    showProgress = true,
    columns = []
}) => {
    // const theme = useTheme();
    const router = useRouter()
    if (!projects || projects.length === 0) {
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
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No projects data available
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

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
                        mb: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <TableChart fontSize="small" />
                    {title} ({projects.length})
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
                                {columns.includes('status') && (
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
                                )}
                                {showProgress && (
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
                                )}
                                {showBudget && (
                                    <th style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        color: COLORS.gray,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Budget
                                    </th>
                                )}
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
                                {columns.includes('daysOverdue') && (
                                    <th style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        color: COLORS.gray,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Days Overdue
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.slice(0, 5).map((project, index) => (
                                <tr
                                    key={project.id || index}
                                    onClick={() => router.push(`/project/${project.id}`)}
                                    style={{
                                        borderBottom: index < Math.min(projects.length, 5) - 1
                                            ? `1px solid ${alpha('#000', 0.05)}`
                                            : 'none',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: alpha(COLORS.primary, 0.02)
                                        }
                                    }}
                                >
                                    <td style={{ padding: '16px' }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {project.code || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: COLORS.gray }}>
                                                {project.title || 'No title'}
                                            </Typography>
                                        </Box>
                                    </td>
                                    {columns.includes('status') && (
                                        <td style={{ padding: '16px' }}>
                                            <Chip
                                                label={project.approvalStatus || 'N/A'}
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
                                    )}
                                    {showProgress && (
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
                                                    {project.totalPercentCompletion !== null && project.totalPercentCompletion !== undefined
                                                        ? `${project.totalPercentCompletion}%`
                                                        : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </td>
                                    )}
                                    {showBudget && (
                                        <td style={{ padding: '16px' }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                                {project.totalBudget ? `ETB ${project.totalBudget.toLocaleString()}` : 'N/A'}
                                            </Typography>
                                        </td>
                                    )}
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
                                    {columns.includes('daysOverdue') && (
                                        <td style={{ padding: '16px' }}>
                                            <Chip
                                                label={`${project.daysOverdue || 0} days`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: project.daysOverdue > 0
                                                        ? alpha(COLORS.error, 0.1)
                                                        : alpha(COLORS.success, 0.1),
                                                    color: project.daysOverdue > 0
                                                        ? COLORS.error
                                                        : COLORS.success,
                                                    fontSize: '0.75rem'
                                                }}
                                            />
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

// Collapsible Section Component
interface CollapsibleSectionProps {
    title: string;
    icon?: React.ReactNode;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    icon,
    defaultExpanded = false,
    children
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Box>
                }
                action={
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
                sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: alpha('#000', 0.02) }
                }}
                onClick={() => setExpanded(!expanded)}
            />
            <Collapse in={expanded}>
                <CardContent sx={{ pt: 0 }}>
                    {children}
                </CardContent>
            </Collapse>
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
    const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 3)));
    const [toDate, setToDate] = useState<Date>(new Date());

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
        refetch();
        setShowPicker(false);
    };

    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined) return 'N/A';
        if (num > 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num > 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
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
                    {error?.message || 'Failed to fetch dashboard data'}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => refetch()}
                    startIcon={<Refresh />}
                >
                    Retry Loading Data
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
                    No dashboard data available for the selected date range
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
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <DashboardIcon />
                                Project Dashboard
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Comprehensive project analytics and insights
                            </Typography>
                        </Box>

                        {/* Date Picker Section */}
                        {!showPicker ? (
                            <Box
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    px: 2,
                                    py: 1,
                                    borderRadius: 5,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                }}
                                onClick={() => setShowPicker(true)}
                            >
                                <CalendarToday sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                <Typography variant="body2" color="primary">
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
                                            sx: { width: 150 }
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

                {/* Date Range Info */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DateRange color="primary" />
                                <Typography variant="body2" color="text.secondary">
                                    Data Period: {new Date(dashboardData.window.from).toLocaleDateString()} - {new Date(dashboardData.window.to).toLocaleDateString()}
                                </Typography>
                            </Box>
                            {/* <Button
                                size="small"
                                startIcon={<Refresh />}
                                onClick={() => refetch()}
                                variant="outlined"
                            >
                                Refresh Data
                            </Button> */}
                        </Box>
                    </CardContent>
                </Card>

                {/* Overview Summary Section */}
                <CollapsibleSection title="Executive Summary" icon={<Assessment />} defaultExpanded={true}>
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Financial Overview
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Total Projects"
                                    value={dashboardData.summary?.totalProjects || 0}
                                    color={COLORS.primary}
                                    icon={<Folder />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Planned Budget"
                                    value={dashboardData.summary?.totalPlannedBudget || 0}
                                    unit="ETB"
                                    color={COLORS.success}
                                    icon={<LocalAtm />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Actual Cost"
                                    value={dashboardData.summary?.totalActualCost || 0}
                                    unit="ETB"
                                    color={COLORS.warning}
                                    icon={<Receipt />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Budget Utilization"
                                    value={dashboardData.summary?.budgetUtilizationPercent || 0}
                                    unit="%"
                                    color={dashboardData.summary?.budgetUtilizationPercent > 100 ? COLORS.error : COLORS.success}
                                    icon={<Percent />}
                                    description={dashboardData.summary?.budgetUtilizationPercent > 100 ? "Over budget" : "Within budget"}
                                />
                            </Box>
                        </Stack>
                    </Stack>

                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Project Status Distribution
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Active Projects"
                                    value={dashboardData.summary?.activeProjects || 0}
                                    color={COLORS.success}
                                    icon={<TrendingUp />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Closed Projects"
                                    value={dashboardData.summary?.closedProjects || 0}
                                    color={COLORS.info}
                                    icon={<CheckCircle />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Cancelled Projects"
                                    value={dashboardData.summary?.cancelledProjects || 0}
                                    color={COLORS.gray}
                                    icon={<TrendingDown />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Average Progress"
                                    value={dashboardData.summary?.averageProgressPercent || 0}
                                    unit="%"
                                    color={COLORS.blue}
                                    icon={<Timeline />}
                                />
                            </Box>
                        </Stack>
                    </Stack>

                    {/* Approval Status Breakdown */}
                    {dashboardData.summary?.byApprovalStatus && Object.keys(dashboardData.summary.byApprovalStatus).length > 0 && (
                        <Card sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Description />
                                    Approval Status Breakdown
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    {Object.entries(dashboardData.summary.byApprovalStatus).map(([status, count], index) => (
                                        <Chip
                                            key={status}
                                            label={`${status}: ${count}`}
                                            sx={{
                                                bgcolor: alpha(COLORS.primary, 0.1),
                                                color: COLORS.primary,
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </CollapsibleSection>

                {/* Pipeline and Types Section */}
                <CollapsibleSection title="Pipeline & Project Types" icon={<AccountTree />}>
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <DynamicChart
                                    data={dashboardData.pipelineByStage?.map(item => ({
                                        stageName: item.stageName || 'Unassigned Stage',
                                        count: item.count || 0,
                                        totalBudget: item.totalBudget || 0,
                                        averageProgressPercent: item.averageProgressPercent || 0
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
                                    data={dashboardData.projectsByType?.map(item => ({
                                        projectTypeName: item.projectTypeName || 'Unassigned Type',
                                        count: item.count || 0,
                                        totalBudget: item.totalBudget || 0
                                    })) || []}
                                    dataKey="count"
                                    xAxisKey="projectTypeName"
                                    chartType="pie"
                                    title="Projects by Type"
                                    height={280}
                                />
                            </Box>
                        </Stack>
                    </Stack>

                    {/* Billing Methods */}
                    {dashboardData.projectsByBillingMethod && dashboardData.projectsByBillingMethod.length > 0 && (
                        <Card sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CreditCard />
                                    Billing Methods Distribution
                                </Typography>
                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Billing Method</TableCell>
                                                <TableCell align="right">Project Count</TableCell>
                                                <TableCell align="right">Total Budget (ETB)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.projectsByBillingMethod.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {item.billingMethodName || 'Not Specified'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {item.projectCount || 0}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatNumber(item.totalBudget)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </CollapsibleSection>

                {/* Risk & Deadlines Section */}
                <CollapsibleSection title="Risk Management & Deadlines" icon={<Warning />}>
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Risk Indicators
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Projects at Risk"
                                    value={dashboardData.riskAndDeadlines?.atRiskCount || 0}
                                    color={COLORS.error}
                                    icon={<Warning />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Overdue Projects"
                                    value={dashboardData.riskAndDeadlines?.overdueCount || 0}
                                    color={COLORS.purple}
                                    icon={<ErrorIcon />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Due in 7 Days"
                                    value={dashboardData.riskAndDeadlines?.dueIn7DaysCount || 0}
                                    color={COLORS.warning}
                                    icon={<Schedule />}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DataDisplay
                                    title="Due in 30 Days"
                                    value={dashboardData.riskAndDeadlines?.dueIn30DaysCount || 0}
                                    color={COLORS.teal}
                                    icon={<CalendarToday />}
                                />
                            </Box>
                        </Stack>
                    </Stack>

                    {/* Risk Projects Table */}
                    {dashboardData.riskAndDeadlines?.atRiskProjects && dashboardData.riskAndDeadlines.atRiskProjects.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <ProjectTable
                                title="Projects at Risk"
                                projects={dashboardData.riskAndDeadlines.atRiskProjects}
                                showRisk={true}
                                showBudget={true}
                                showProgress={true}
                                columns={['status', 'daysOverdue']}
                            />
                        </Box>
                    )}

                    {/* Overdue Projects Table */}
                    {dashboardData.riskAndDeadlines?.overdueProjects && dashboardData.riskAndDeadlines.overdueProjects.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <ProjectTable
                                title="Overdue Projects"
                                projects={dashboardData.riskAndDeadlines.overdueProjects}
                                showRisk={true}
                                showBudget={true}
                                showProgress={true}
                                columns={['status', 'daysOverdue']}
                            />
                        </Box>
                    )}

                    {/* Upcoming Deadlines (Empty states handled) */}
                    <Stack spacing={2}>
                        {dashboardData.riskAndDeadlines?.dueIn7DaysProjects && dashboardData.riskAndDeadlines.dueIn7DaysProjects.length === 0 && (
                            <Alert severity="info">
                                No projects due in the next 7 days
                            </Alert>
                        )}
                        {dashboardData.riskAndDeadlines?.dueIn30DaysProjects && dashboardData.riskAndDeadlines.dueIn30DaysProjects.length === 0 && (
                            <Alert severity="info">
                                No projects due in the next 30 days
                            </Alert>
                        )}
                    </Stack>
                </CollapsibleSection>

                {/* Tasks & Milestones Section */}
                <CollapsibleSection title="Tasks & Milestones" icon={<Task />}>
                    {dashboardData.tasksAndMilestones && (
                        <>
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Task Summary
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Total Tasks"
                                            value={dashboardData.tasksAndMilestones.taskSummary?.totalTasks || 0}
                                            color={COLORS.primary}
                                            icon={<Task />}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Completed Tasks"
                                            value={dashboardData.tasksAndMilestones.taskSummary?.completedTasks || 0}
                                            color={COLORS.success}
                                            icon={<CheckCircle />}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Overdue Tasks"
                                            value={dashboardData.tasksAndMilestones.taskSummary?.overdueTasks || 0}
                                            color={COLORS.error}
                                            icon={<ErrorIcon />}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Tasks Due in 30 Days"
                                            value={dashboardData.tasksAndMilestones.taskSummary?.tasksDueIn30Days || 0}
                                            color={COLORS.warning}
                                            icon={<Schedule />}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>

                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Milestone Summary
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Total Milestones"
                                            value={dashboardData.tasksAndMilestones.milestoneSummary?.totalMilestones || 0}
                                            color={COLORS.purple}
                                            icon={<Flag />}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Completed Milestones"
                                            value={dashboardData.tasksAndMilestones.milestoneSummary?.completedMilestones || 0}
                                            color={COLORS.success}
                                            icon={<CheckCircle />}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <DataDisplay
                                            title="Overdue Milestones"
                                            value={dashboardData.tasksAndMilestones.milestoneSummary?.overdueMilestones || 0}
                                            color={COLORS.error}
                                            icon={<ErrorIcon />}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>

                            {/* Upcoming Tasks Tables */}
                            {dashboardData.tasksAndMilestones.upcomingTasks30Days && dashboardData.tasksAndMilestones.upcomingTasks30Days.length > 0 && (
                                <Card sx={{ mb: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                            Upcoming Tasks (Next 30 Days)
                                        </Typography>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Task Code</TableCell>
                                                        <TableCell>Title</TableCell>
                                                        <TableCell>Project</TableCell>
                                                        <TableCell align="right">Due Date</TableCell>
                                                        <TableCell align="right">Progress</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dashboardData.tasksAndMilestones.upcomingTasks30Days.map((task, index) => (
                                                        <TableRow
                                                            key={task.id || index}
                                                            component={Link}
                                                            href={`/project/${task.projectId}`}
                                                        >
                                                            <TableCell>{task.code || 'N/A'}</TableCell>
                                                            <TableCell>{task.title || 'No title'}</TableCell>
                                                            <TableCell>{task.projectTitle || 'N/A'}</TableCell>
                                                            <TableCell align="right">
                                                                {task.plannedEndDate ? new Date(task.plannedEndDate).toLocaleDateString() : 'N/A'}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {task.percentCompletion !== null ? `${task.percentCompletion}%` : 'N/A'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Empty States for Tasks */}
                            <Stack spacing={1}>
                                {dashboardData.tasksAndMilestones.overdueTasks && dashboardData.tasksAndMilestones.overdueTasks.length === 0 && (
                                    <Alert severity="success">No overdue tasks</Alert>
                                )}
                                {dashboardData.tasksAndMilestones.upcomingTasks7Days && dashboardData.tasksAndMilestones.upcomingTasks7Days.length === 0 && (
                                    <Alert severity="info">No tasks due in the next 7 days</Alert>
                                )}
                                {dashboardData.tasksAndMilestones.overdueMilestones && dashboardData.tasksAndMilestones.overdueMilestones.length === 0 && (
                                    <Alert severity="success">No overdue milestones</Alert>
                                )}
                                {dashboardData.tasksAndMilestones.upcomingMilestones7Days && dashboardData.tasksAndMilestones.upcomingMilestones7Days.length === 0 && (
                                    <Alert severity="info">No milestones due in the next 7 days</Alert>
                                )}
                                {dashboardData.tasksAndMilestones.upcomingMilestones30Days && dashboardData.tasksAndMilestones.upcomingMilestones30Days.length === 0 && (
                                    <Alert severity="info">No milestones due in the next 30 days</Alert>
                                )}
                            </Stack>
                        </>
                    )}
                </CollapsibleSection>

                {/* Team & Resources Section */}
                <CollapsibleSection title="Team & Resources" icon={<Group />}>
                    {/* Manager Workload */}
                    {dashboardData.managerWorkload && dashboardData.managerWorkload.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <DynamicChart
                                data={dashboardData.managerWorkload.map(manager => ({
                                    name: `Manager ${manager.projectManagerEmployeeId?.slice(-4) || 'Unknown'}`,
                                    projectCount: manager.projectCount || 0,
                                    totalBudget: manager.totalBudget || 0,
                                    averageProgressPercent: manager.averageProgressPercent || 0
                                }))}
                                dataKey="projectCount"
                                xAxisKey="name"
                                chartType="radar"
                                title="Manager Workload Distribution"
                                height={350}
                            />
                        </Box>
                    )}

                    {/* Projects by Customer */}
                    {dashboardData.projectsByCustomer && dashboardData.projectsByCustomer.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <DynamicChart
                                data={dashboardData.projectsByCustomer.map(customer => ({
                                    customerName: customer.customerName || 'Unnamed Customer',
                                    projectCount: customer.projectCount || 0,
                                    totalBudget: customer.totalBudget || 0
                                }))}
                                dataKey="projectCount"
                                xAxisKey="customerName"
                                chartType="bar"
                                title="Projects by Customer"
                                height={300}
                            />
                        </Box>
                    )}

                    {/* Timesheets Overview */}
                    {dashboardData.timesheets && (
                        <Card sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime />
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

                                {/* Timesheets by Project */}
                                {dashboardData.timesheets.byProject && dashboardData.timesheets.byProject.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Hours by Project
                                        </Typography>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Project</TableCell>
                                                        <TableCell align="right">Tracked Hours</TableCell>
                                                        <TableCell align="right">Billable Hours</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dashboardData.timesheets.byProject.map((project, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{project.projectTitle || 'Unknown Project'}</TableCell>
                                                            <TableCell align="right">{project.trackedHours || 0}</TableCell>
                                                            <TableCell align="right">{project.billableHours || 0}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </CollapsibleSection>

                {/* Trends & All Projects Section */}
                <CollapsibleSection title="Trends & Complete Project List" icon={<TimelineIcon />}>
                    {/* Monthly Trends */}
                    {dashboardData.monthlyTrends && dashboardData.monthlyTrends.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <DynamicChart
                                data={dashboardData.monthlyTrends.map(trend => ({
                                    month: trend.month || 'Unknown',
                                    newProjectsCount: trend.newProjectsCount || 0,
                                    totalBudget: trend.totalBudget || 0,
                                    totalTrackedHours: trend.totalTrackedHours || 0
                                }))}
                                dataKey="newProjectsCount"
                                xAxisKey="month"
                                chartType="line"
                                title="Monthly Project Trends"
                                height={300}
                            />
                        </Box>
                    )}

                    {/* All Projects Table */}
                    {dashboardData.allProjects && dashboardData.allProjects.length > 0 && (
                        <Card sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TableChart />
                                    All Projects ({dashboardData.allProjects.length})
                                </Typography>
                                <Box sx={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
                                    <Table size="small" stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Code</TableCell>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Stage</TableCell>
                                                <TableCell align="right">Progress</TableCell>
                                                <TableCell align="right">Budget</TableCell>
                                                <TableCell align="right">Cost</TableCell>
                                                <TableCell>Risk</TableCell>
                                                <TableCell align="right">Days Overdue</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.allProjects.map((project, index) => (
                                                <TableRow
                                                    key={project.id || index}
                                                    hover
                                                    component={Link}
                                                    href={`/project/${project.id}`}
                                                >
                                                    <TableCell>{project.code || 'N/A'}</TableCell>
                                                    <TableCell sx={{ maxWidth: 200 }}>
                                                        <Tooltip title={project.title || 'No title'}>
                                                            <Typography variant="body2" noWrap>
                                                                {project.title || 'No title'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>{project.customerName || 'N/A'}</TableCell>
                                                    <TableCell>{project.projectTypeName || 'N/A'}</TableCell>
                                                    <TableCell>{project.projectStageName || 'N/A'}</TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={project.totalPercentCompletion || 0}
                                                                sx={{
                                                                    width: 60,
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: (project.totalPercentCompletion || 0) > 70
                                                                            ? COLORS.success
                                                                            : (project.totalPercentCompletion || 0) > 40
                                                                                ? COLORS.warning
                                                                                : COLORS.error
                                                                    }
                                                                }}
                                                            />
                                                            <Typography variant="body2" sx={{ minWidth: 35 }}>
                                                                {project.totalPercentCompletion !== null ? `${project.totalPercentCompletion}%` : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {project.totalBudget ? `ETB ${formatNumber(project.totalBudget)}` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {project.actualCost ? `ETB ${formatNumber(project.actualCost)}` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={project.riskFlag ? 'At Risk' : 'Normal'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: project.riskFlag
                                                                    ? alpha(COLORS.error, 0.1)
                                                                    : alpha(COLORS.success, 0.1),
                                                                color: project.riskFlag ? COLORS.error : COLORS.success
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {project.daysOverdue !== null && project.daysOverdue !== undefined ? (
                                                            <Chip
                                                                label={`${project.daysOverdue} days`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: project.daysOverdue > 0
                                                                        ? alpha(COLORS.error, 0.1)
                                                                        : alpha(COLORS.success, 0.1),
                                                                    color: project.daysOverdue > 0 ? COLORS.error : COLORS.success
                                                                }}
                                                            />
                                                        ) : 'N/A'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Projects Tables */}
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mb: 3 }}>
                        {dashboardData.topProjects && dashboardData.topProjects.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <ProjectTable
                                    title="Top Projects"
                                    projects={dashboardData.topProjects}
                                    showRisk={true}
                                    showBudget={true}
                                    showProgress={true}
                                    columns={['status']}
                                />
                            </Box>
                        )}

                        {dashboardData.topRiskProjects && dashboardData.topRiskProjects.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <ProjectTable
                                    title="Risk Projects"
                                    projects={dashboardData.topRiskProjects}
                                    showRisk={true}
                                    showBudget={true}
                                    showProgress={true}
                                    columns={['daysOverdue']}
                                />
                            </Box>
                        )}
                    </Stack>
                </CollapsibleSection>

                {/* Footer Summary */}
                <Card sx={{ mt: 3, borderRadius: 2, bgcolor: alpha(COLORS.primary, 0.03) }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" align="center">
                            Dashboard last updated: {new Date().toLocaleString()} •
                            Showing {dashboardData?.allProjects?.length || 0} projects •
                            Data period: {new Date(dashboardData.window.from).toLocaleDateString()} to {new Date(dashboardData.window.to).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </LocalizationProvider>
    );
};

export default Dashboard;