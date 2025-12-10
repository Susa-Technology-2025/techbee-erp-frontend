'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Chip,
    Avatar,
    LinearProgress,
    Drawer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Divider,
    Stack,
    useTheme,
    useMediaQuery,
    Tabs,
    Tab,
    InputAdornment,
    CardHeader,
    Fade,
    Tooltip,
    Alert,
    CardActionArea,
    Switch,
    FormControlLabel,
    CircularProgress,
    AlertTitle,
    alpha,
    AppBar,
    Toolbar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import TaskIcon from '@mui/icons-material/Task';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import Link from 'next/link';
import TaskCreationDialog from './_components/taskDialog';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store/store";
import { CheckCircle, Close, MoreVert, Warning } from '@mui/icons-material';
import Form from "../projects/_components/Form";
import ProjectMenuDialog from '../_dashboard/ProjectMenuDialog';
import { colors, formatCurrency, mainProjectAPI, mainTaskAPI } from '../_dashboard/consts'
import ProjectCreateInputForm from '../projects/_components/Form';
import { color } from 'html2canvas/dist/types/css/types/color';
import WbsItemCreateInput from '../wbsItems/_components/Form';
import TaskMenuDialog from '../_dashboard/TaskMenuDialog';
// ========== TYPES ==========
interface Project {
    projectId: string;
    code: string;
    title: string;
    description: string;
    customerName: string;
    projectType: string;
    projectTypeCode: string;
    projectStage: string;
    totalPercentCompletion: number;
    riskFlag: boolean;
    approvalStatus: string;
    priority: string | null;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string | null;
    projectManagerEmployeeId: string;
    billingMethod: string;
    contributors: Contributor[];
    totalContributors: number;
}

interface Task {
    wbsItemId: string;
    code: string;
    title: string;
    description: string;
    projectId: string;
    projectCode: string;
    projectTitle: string;
    projectType: string;
    projectTypeCode: string;
    priority: string | null;
    approvalStatus: string;
    taskStage: string;
    percentCompletion: number | null;
    plannedStartDate: string;
    plannedEndDate: string;
    actualCompletionDate: string | null;
    durationDays: number | null;
    riskOrIssues: string | null;
}

interface TaskIAssigned extends Task {
    assignments: Assignment[];
    assignedBy: string;
}

interface Goal {
    id: string;
    code: string;
    title: string;
    description: string;
    category: string;
    percentCompletion: number;
    plannedEndDate: string;
    actualCompletionDate: string | null;
    createdAt: string;
    approvalStatus: string;
    priority: string;
    responsibleOwner: string;
    assignedTeamOrDept: string;
    billable: boolean | null;
    billingAmount: number | null;
}

interface Contributor {
    employeeId: string;
    name: string | null;
    role: string;
    allocationPercent: number;
    isOwner: boolean;
}

interface TeamMember {
    employeeId: string;
    name: string | null;
    email: string;
    role: string | null;
    department: string | null;
    assignments: TeamAssignment[];
    tasksCompleted: number;
    tasksActive: number;
    performance: number | null;
    availability: string;
}

interface TeamAssignment {
    projectId: string;
    projectCode: string;
    allocationPercent: number | null;
    isOwner: boolean;
    startDate: string | null;
    endDate: string | null;
}

interface Assignment {
    employeeId: string;
    allocationPercent: number;
    startDate: string;
    endDate: string | null;
    role: string;
}

interface TimeEntry {
    timeEntryId: string;
    workDate: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    wbsItemId: string;
    wbsItemTitle: string;
    projectCode: string;
    projectTitle: string;
    notes: string;
    billable: boolean;
    approvalStatus: string;
    type: string;
}

interface HoursByProject {
    projectId: string;
    projectCode: string;
    projectTitle: string;
    plannedHours: number;
    actualHours: number;
    remainingHours: number;
}

interface DashboardData {
    window: {
        from: string;
        to: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
    myTasks: {
        summary: {
            total: { count: number };
            upcoming: { count: number };
            overdue: { count: number; percent: number };
            completed: { count: number; percent: number };
        };
        view: string;
        upcoming: Task[];
        overdue: Task[];
        completed: Task[];
        all: Task[];
    };
    myProjects: {
        summary: {
            totalActive: number;
            totalPending: number;
            totalCompleted: number;
            totalProjects: number;
        };
        view: string;
        recent: Project[];
    };
    tasksIAssigned: {
        summary: {
            total: number;
            active: number;
            pending: number;
            completed: number;
            overdue: number;
        };
        upcoming: TaskIAssigned[];
        overdue: TaskIAssigned[];
        completed: TaskIAssigned[];
        activeItems: TaskIAssigned[];
        all: TaskIAssigned[];
    };
    myWeek: {
        weekRange: {
            start: string;
            end: string;
        };
        hoursByProject: HoursByProject[];
        timeEntries: TimeEntry[];
        tasksDueThisWeek: number;
        tasksCompletedThisWeek: number;
        overdueTasks: number;
    };
    goals: {
        quarterly: Goal[];
        summary: {
            total: number;
            onTrack: number;
            atRisk: number;
            completed: number;
        };
    };
    team: {
        summary: {
            totalMembers: number;
            activeMembers: number;
            availableMembers: number;
        };
        members: TeamMember[];
    };
    upcomingDeadlines: Array<{
        type: string;
        id: string;
        code: string;
        title: string;
        description: string;
        projectCode: string;
        projectTitle: string;
        plannedEndDate: string;
        priority: string | null;
        approvalStatus: string;
        taskStage: string;
        percentCompletion: number | null;
        projectType: string;
        riskFlag: boolean | null;
        category: string | null;
        responsibleOwner: string;
        deadline: string;
    }>;
    dashboardStats: {
        overallProgress: number;
        onTimeDelivery: number | null;
        budgetUtilization: number | null;
        teamUtilization: number;
        customerSatisfaction: number | null;
    };
}

// Helper functions
const getPriorityColor = (priority: string | null) => {
    if (!priority) return '#64748b';
    switch (priority.toLowerCase()) {
        case 'high': return '#dc3545';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#64748b';
    }
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'completed': return 'success';
        case 'in progress': return 'primary';
        case 'active': return 'success';
        case 'pending': return 'warning';
        case 'draft': return 'default';
        case 'todo': return 'warning';
        case 'done': return 'success';
        case 'stage 1': return 'info';
        default: return 'default';
    }
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ========== MAIN COMPONENT ==========
export default function PersonalDashboard() {
    const session = useSelector((state: RootState) => state.session);
    const theme = useTheme();
    const [taskViewType, setTaskViewType] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
    const [assignedTaskViewType, setAssignedTaskViewType] = useState<'all' | 'upcoming' | 'overdue' | 'completed' | 'active'>('all');
    const { data, isLoading, isFetching, isError, error, refetch } = useDataQuery<DashboardData>({
        apiEndPoint: `https://project.api.techbee.et/api/projects/analytics/personal?userId=${session?.user?.id}`,
        enabled: Boolean(session?.user?.id)
    });

    const [selectedItem, setSelectedItem] = useState<Project | Task | TaskIAssigned | Goal | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [detailViewOpen, setDetailViewOpen] = useState(false);
    const [tabValue, setTabValue] = useState('overview');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [sortBy, setSortBy] = useState<'date' | 'progress' | 'name'>('date');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleTaskCreated = (newTask: any) => {
        alert('Task created successfully!');
    };

    const handleProjectClick = (project: Project) => {
        setSelectedItem(project);
        setDetailViewOpen(true);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedItem(task);
        setDetailViewOpen(true);
    };

    const handleCreateTask = () => {
        setIsTaskModalOpen(true);
    };

    const handleCreateProject = () => {
        setIsProjectModalOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailViewOpen(false);
        setSelectedItem(null);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const clearFilters = () => {
        setSelectedCategory('All');
        setStatusFilter('All');
        setPriorityFilter('All');
        setSearchQuery('');
        setShowFavoritesOnly(false);
        setSortBy('date');
        setTaskViewType('all');
        setAssignedTaskViewType('all');
    };

    if (isLoading || !data) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !data) {
        console.log(data, isError)
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    Failed to load dashboard data. Please try again later.
                </Alert>
            </Box>
        );
    }

    // Extract data from API response
    const {
        myTasks,
        myProjects,
        tasksIAssigned,
        goals,
        team,
        upcomingDeadlines,
        dashboardStats,
        user,
        myWeek,
        window: timeWindow
    } = data;

    // Helper function to get filtered tasks based on view type
    const getFilteredTasks = () => {
        let tasks: Task[] = [];

        // Get tasks based on selected view type
        switch (taskViewType) {
            case 'upcoming':
                tasks = myTasks.upcoming || [];
                break;
            case 'overdue':
                tasks = myTasks.overdue || [];
                break;
            case 'completed':
                tasks = myTasks.completed || [];
                break;
            case 'all':
            default:
                tasks = myTasks.all || [];
                break;
        }

        // Apply additional filters
        return tasks.filter(task => {
            const matchesStatus = statusFilter === 'All' || task.taskStage === statusFilter;
            const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
            const matchesSearch = searchQuery === '' ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesStatus && matchesPriority && matchesSearch;
        });
    };

    const filteredTasks = getFilteredTasks();

    // Helper function to get filtered assigned tasks
    const getFilteredAssignedTasks = () => {
        let tasks: TaskIAssigned[] = [];

        switch (assignedTaskViewType) {
            case 'upcoming':
                tasks = tasksIAssigned.upcoming || [];
                break;
            case 'overdue':
                tasks = tasksIAssigned.overdue || [];
                break;
            case 'completed':
                tasks = tasksIAssigned.completed || [];
                break;
            case 'active':
                tasks = tasksIAssigned.activeItems || [];
                break;
            case 'all':
            default:
                tasks = tasksIAssigned.all || [];
                break;
        }

        return tasks.filter(task => {
            const matchesSearch = searchQuery === '' ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    };

    const filteredAssignedTasks = getFilteredAssignedTasks();

    // Filter and sort functions for projects
    const filteredProjects = (myProjects.recent || []).filter(project => {
        const matchesStatus = statusFilter === 'All' || project.projectStage === statusFilter;
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.plannedStartDate).getTime() - new Date(a.plannedStartDate).getTime();
        if (sortBy === 'progress') return b.totalPercentCompletion - a.totalPercentCompletion;
        return a.title.localeCompare(b.title);
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.plannedStartDate).getTime() - new Date(a.plannedStartDate).getTime();
        if (sortBy === 'progress') return (b.percentCompletion || 0) - (a.percentCompletion || 0);
        return a.title.localeCompare(b.title);
    });

    // Component for Task Card in Grid View
    const TaskCardGrid = ({ task, isAssigned = false }: { task: Task | TaskIAssigned, isAssigned?: boolean }) => {
        const isOverdue = (myTasks.overdue || []).some(t => t.wbsItemId === task.wbsItemId);
        const isCompleted = (myTasks.completed || []).some(t => t.wbsItemId === task.wbsItemId);
        const assignedTask = task as TaskIAssigned;

        return (
            <Link href={`/project/${task.projectId}`} passHref key={task.wbsItemId}>
                <Box key={task.wbsItemId} sx={{ position: 'relative', height: '100%' }}>
                    <Card sx={{
                        height: '100%',
                        position: 'relative',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 3
                        },
                        borderLeft: isOverdue ? '4px solid #dc3545' :
                            isCompleted ? '4px solid #10b981' : '4px solid transparent'
                    }}>
                        {/* Overdue/Completed Badge and Menu Button */}
                        <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            zIndex: 2
                        }}>
                            {isOverdue && (
                                <Box sx={{
                                    bgcolor: '#fee2e2',
                                    color: '#dc3545',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <Warning fontSize="small" />
                                    Overdue
                                </Box>
                            )}
                            {isCompleted && (
                                <Box sx={{
                                    bgcolor: '#d1fae5',
                                    color: '#10b981',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <CheckCircle fontSize="small" />
                                    Completed
                                </Box>
                            )}

                            {/* Menu Button - positioned at top-right */}
                            <Box onClick={(e) => e.stopPropagation()}>
                                <TaskMenuDialog
                                    task={task}
                                    colors={colors}
                                    refetch={refetch}
                                    apiUrl={mainTaskAPI}
                                    TaskCreateInputForm={WbsItemCreateInput}
                                />
                            </Box>
                        </Box>

                        {/* Card Header */}
                        <CardHeader
                            onClick={() => window.open(`/project/${task.projectId}`, '_blank')}
                            sx={{ cursor: 'pointer' }}
                            avatar={
                                <Avatar sx={{
                                    bgcolor: isOverdue ? '#fee2e2' :
                                        isCompleted ? '#d1fae5' : '#e0e7ff'
                                }}>
                                    <TaskIcon sx={{
                                        color: isOverdue ? '#dc3545' :
                                            isCompleted ? '#10b981' : '#4361ee'
                                    }} />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h6" fontWeight={600}>
                                    {task.title}
                                </Typography>
                            }
                            subheader={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                    <Chip label={task.projectType} size="small" />
                                    {task.priority && (
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                bgcolor: getPriorityColor(task.priority),
                                                color: 'white'
                                            }}
                                        />
                                    )}
                                    {isAssigned && (
                                        <Chip
                                            icon={<AssignmentIcon />}
                                            label="Assigned"
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            }
                        />

                        {/* Card Content */}
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Project: {task.projectTitle || task.projectCode}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {task.description || 'No description available'}
                            </Typography>

                            {/* Progress Bar */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">Progress</Typography>
                                    <Typography variant="caption" fontWeight={600}>
                                        {task.percentCompletion !== null ? `${task.percentCompletion}%` : 'Not set'}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={task.percentCompletion || 0}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: alpha('#6366F1', 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: isOverdue ? '#dc3545' :
                                                isCompleted ? '#10b981' : '#6366F1'
                                        }
                                    }}
                                />
                            </Box>

                            {/* Assigned To */}
                            {isAssigned && assignedTask.assignments && assignedTask.assignments.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Assigned to: {assignedTask.assignments.map(a => a.role).join(', ')}
                                    </Typography>
                                </Box>
                            )}

                            {/* Due Date and Status */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" />
                                    <Typography variant="caption">
                                        Due: {formatDate(task.plannedEndDate)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={task.taskStage}
                                    size="small"
                                    color={getStatusColor(task.taskStage)}
                                />
                            </Box>

                            {/* Duration */}
                            {task.durationDays !== null && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Duration: {task.durationDays} days
                                </Typography>
                            )}

                            {/* Approval Status */}
                            {task.approvalStatus && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    Status: {task.approvalStatus}
                                </Typography>
                            )}
                        </CardContent>

                        {/* Card Actions */}
                        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskClick(task);
                                }}
                                sx={{ borderRadius: 1 }}
                            >
                                View Details
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Link>
        );
    };

    // Component for Project Card in Grid View
    const ProjectCardGrid = ({ project }: { project: Project }) => (
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
                                apiUrl={mainProjectAPI}
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
                    <Button size="small">
                        View Details
                    </Button>
                </CardActions>
            </Card>
        </Link>
    );

    // Component for Goal Card
    const GoalCard = ({ goal }: { goal: Goal }) => (
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>{goal.title}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip label={goal.category} size="small" />
                            {goal.priority && (
                                <Chip
                                    label={goal.priority}
                                    size="small"
                                    sx={{
                                        bgcolor: getPriorityColor(goal.priority),
                                        color: 'white'
                                    }}
                                />
                            )}
                            <Chip
                                label={goal.approvalStatus}
                                size="small"
                                color={getStatusColor(goal.approvalStatus)}
                            />
                        </Box>
                    </Box>
                    <Typography variant="h4" fontWeight={700} color="#4361ee">
                        {goal.percentCompletion}%
                    </Typography>
                </Box>
                <Typography variant="body2" color="#64748b" paragraph>
                    {goal.description || 'No description available'}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={goal.percentCompletion}
                    sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="caption" color="#64748b" display="block">
                            Owner: {goal.responsibleOwner}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            Team: {goal.assignedTeamOrDept}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="#64748b">
                        Due: {formatDate(goal.plannedEndDate)}
                    </Typography>
                </Box>
                {goal.billable !== null && (
                    <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 1 }}>
                        {goal.billable ? 'Billable' : 'Non-billable'}
                        {goal.billingAmount !== null && ` • $${goal.billingAmount}`}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    // Component for Team Member Card
    const TeamMemberCard = ({ member }: { member: TeamMember }) => (
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#4361ee', width: 56, height: 56 }}>
                        {member.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {member.name || 'Unnamed User'}
                        </Typography>
                        <Typography variant="body2" color="#64748b" noWrap>
                            {member.email}
                        </Typography>
                        {member.department && (
                            <Typography variant="caption" color="#64748b" display="block">
                                {member.department}
                            </Typography>
                        )}
                        {member.role && (
                            <Typography variant="caption" color="#64748b">
                                {member.role}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#4361ee">
                            {member.tasksCompleted}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            Tasks Completed
                        </Typography>
                    </Box>
                    <Chip
                        label={member.availability}
                        size="small"
                        color={member.availability === 'available' ? 'success' : 'warning'}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="#64748b">
                            Active Tasks: {member.tasksActive}
                        </Typography>
                    </Box>
                    {member.performance !== null && (
                        <Typography variant="body2" color="#4361ee" fontWeight={600}>
                            {member.performance}% Performance
                        </Typography>
                    )}
                </Box>
                {member.assignments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="#64748b" display="block">
                            Assigned to {member.assignments.length} project(s)
                        </Typography>
                        {member.assignments.slice(0, 2).map((assignment, idx) => (
                            <Typography key={idx} variant="caption" color="#64748b" display="block">
                                • {assignment.projectCode} ({assignment.allocationPercent || 0}%)
                            </Typography>
                        ))}
                        {member.assignments.length > 2 && (
                            <Typography variant="caption" color="#64748b">
                                +{member.assignments.length - 2} more
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    // Component for Upcoming Deadline Card
    const UpcomingDeadlineCard = ({ deadline }: { deadline: any }) => {
        const isTask = deadline.type === 'wbsItem';
        const deadlineDate = new Date(deadline.deadline);
        const today = new Date();
        const daysDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Determine urgency color
        const getUrgencyColor = () => {
            if (daysDiff < 0) return '#dc3545'; // Overdue
            if (daysDiff <= 1) return '#ef4444'; // Due tomorrow/today
            if (daysDiff <= 3) return '#f59e0b'; // Due in 3 days
            if (daysDiff <= 7) return '#3b82f6'; // Due in a week
            return '#10b981'; // More than a week
        };

        const urgencyColor = getUrgencyColor();

        // Format the due text
        const dueText = daysDiff < 0 ? `${Math.abs(daysDiff)}d overdue` :
            daysDiff === 0 ? 'Due today' :
                daysDiff === 1 ? 'Due tomorrow' :
                    `${daysDiff}d`;

        return (
            <Card sx={{
                mb: 2,
                position: 'relative',
                borderLeft: `4px solid ${urgencyColor}`,
                transition: 'all 0.2s ease',
                overflow: 'visible'
            }}>
                <CardContent sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    position: 'relative',
                    pr: 8 // Leave space for menu button
                }}>
                    {/* Avatar */}
                    <Avatar sx={{
                        bgcolor: `${urgencyColor}15`,
                        width: 44,
                        height: 44,
                        mt: 0.5
                    }}>
                        {isTask ?
                            <TaskIcon sx={{ color: urgencyColor, fontSize: 20 }} /> :
                            <FolderIcon sx={{ color: urgencyColor, fontSize: 20 }} />
                        }
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* First row: Title + Due date */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 0.5
                        }}>
                            <Typography
                                fontWeight={600}
                                variant="body2"
                                sx={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    pr: 1
                                }}
                            >
                                {deadline.title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {/* Due date badge */}
                                <Box sx={{
                                    bgcolor: `${urgencyColor}15`,
                                    color: urgencyColor,
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.25,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap'
                                }}>
                                    {dueText}
                                </Box>

                                {/* Menu button */}
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                >
                                    {isTask ? (
                                        <TaskMenuDialog
                                            task={deadline}
                                            colors={colors}
                                            refetch={refetch}
                                            apiUrl={mainTaskAPI}
                                            TaskCreateInputForm={WbsItemCreateInput}
                                        />
                                    ) : (
                                        <ProjectMenuDialog
                                            project={deadline}
                                            colors={colors}
                                            refetch={refetch}
                                            apiUrl={mainProjectAPI}
                                            formatCurrency={formatCurrency}
                                            ProjectCreateInputForm={ProjectCreateInputForm}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Description */}
                        <Typography
                            variant="caption"
                            color="#64748b"
                            sx={{
                                display: 'block',
                                mb: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {deadline.description || deadline.projectTitle}
                        </Typography>

                        {/* Second row: Chips + Progress */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1
                        }}>
                            {/* Chips */}
                            <Box sx={{
                                display: 'flex',
                                gap: 0.75,
                                flexWrap: 'wrap'
                            }}>
                                {deadline.priority && (
                                    <Chip
                                        label={deadline.priority}
                                        size="small"
                                        sx={{
                                            bgcolor: getPriorityColor(deadline.priority),
                                            color: 'white',
                                            height: 20,
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                )}
                                <Chip
                                    label={deadline.taskStage || (isTask ? 'Task' : 'Project')}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem'
                                    }}
                                />
                                <Chip
                                    label={deadline.projectType}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem'
                                    }}
                                />
                            </Box>

                            {/* Progress */}
                            {deadline.percentCompletion !== null && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    flexShrink: 0
                                }}>
                                    <Box sx={{
                                        width: 40,
                                        height: 4,
                                        bgcolor: '#e2e8f0',
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{
                                            width: `${deadline.percentCompletion}%`,
                                            height: '100%',
                                            bgcolor: urgencyColor
                                        }} />
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color={urgencyColor}
                                        fontWeight={600}
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        {deadline.percentCompletion}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Component for Time Entry Card
    const TimeEntryCard = ({ entry }: { entry: TimeEntry }) => (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography fontWeight={600} variant="body1">
                        {entry.wbsItemTitle}
                    </Typography>
                    <Chip
                        label={`${entry.durationHours}h`}
                        size="small"
                        color="primary"
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {entry.projectTitle} ({entry.projectCode})
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(entry.workDate)} • {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                    </Typography>
                    <Chip
                        label={entry.billable ? 'Billable' : 'Non-billable'}
                        size="small"
                        color={entry.billable ? 'success' : 'default'}
                    />
                </Box>
                {entry.notes && (
                    <Typography variant="caption" color="text.secondary">
                        Notes: {entry.notes}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                        label={entry.type}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={entry.approvalStatus}
                        size="small"
                        color={getStatusColor(entry.approvalStatus)}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    // Component for Hours by Project Card
    const HoursByProjectCard = ({ projectHours }: { projectHours: HoursByProject }) => {
        const completionPercent = projectHours.plannedHours > 0
            ? (projectHours.actualHours / projectHours.plannedHours) * 100
            : 0;

        return (
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                            <Typography fontWeight={600}>
                                {projectHours.projectTitle}
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                                {projectHours.projectCode}
                            </Typography>
                        </Box>
                        <Chip
                            label={`${projectHours.actualHours}/${projectHours.plannedHours} hrs`}
                            color={projectHours.actualHours >= projectHours.plannedHours ? 'success' : 'warning'}
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercent}
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="#64748b">
                            Remaining: {projectHours.remainingHours} hrs
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            {Math.round(completionPercent)}% Complete
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', pl: 0, pr: 0 }}>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#3a0ca3">
                            Welcome, {user.name}!
                        </Typography>
                        <Typography variant="subtitle1" color="#64748b">
                            Dashboard Period: {formatDate(timeWindow.from)} to {formatDate(timeWindow.to)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateTask}
                            sx={{ bgcolor: '#4361ee' }}
                        >
                            New Task
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleCreateProject}
                            sx={{ borderColor: '#4361ee', color: '#4361ee' }}
                        >
                            New Project
                        </Button>
                    </Box>
                </Box>

                {/* Dashboard Stats Summary */}
                {dashboardStats && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <DashboardIcon sx={{ color: '#4361ee' }} />
                            Dashboard Overview
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight={700} color="#4361ee">
                                        {dashboardStats.overallProgress}%
                                    </Typography>
                                    <Typography color="#64748b" variant="body2">
                                        Overall Progress
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight={700} color="#10b981">
                                        {dashboardStats.teamUtilization}%
                                    </Typography>
                                    <Typography color="#64748b" variant="body2">
                                        Team Utilization
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight={700} color={dashboardStats.onTimeDelivery !== null ? '#f59e0b' : '#64748b'}>
                                        {dashboardStats.onTimeDelivery !== null ? `${dashboardStats.onTimeDelivery}%` : 'N/A'}
                                    </Typography>
                                    <Typography color="#64748b" variant="body2">
                                        On-time Delivery
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight={700} color={dashboardStats.budgetUtilization !== null ? '#8b5cf6' : '#64748b'}>
                                        {dashboardStats.budgetUtilization !== null ? `${dashboardStats.budgetUtilization}%` : 'N/A'}
                                    </Typography>
                                    <Typography color="#64748b" variant="body2">
                                        Budget Utilization
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight={700} color={dashboardStats.customerSatisfaction !== null ? '#ec4899' : '#64748b'}>
                                        {dashboardStats.customerSatisfaction !== null ? `${dashboardStats.customerSatisfaction}%` : 'N/A'}
                                    </Typography>
                                    <Typography color="#64748b" variant="body2">
                                        Customer Satisfaction
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                )}

                {/* Tabs */}
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
                        <TabList onChange={handleTabChange} aria-label="dashboard tabs" variant="scrollable">
                            <Tab label="Overview" value="overview" />
                            <Tab label="My Tasks" value="tasks" />
                            <Tab label="My Projects" value="projects" />
                            <Tab label="Assigned Tasks" value="assigned" />
                            <Tab label="My Week" value="week" />
                            <Tab label="Goals" value="goals" />
                            <Tab label="Team" value="team" />
                            <Tab label="Data Summary" value="summary" />
                        </TabList>
                    </Box>

                    {/* Overview Tab */}
                    <TabPanel value="overview" sx={{ p: 0 }}>
                        {/* Stats Cards */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                            <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #4361ee' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight={700} color="#4361ee">
                                                {myTasks.summary.total.count}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Total Tasks
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Upcoming</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {myTasks.summary.upcoming.count}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(myTasks.summary.upcoming.count / myTasks.summary.total.count) * 100}
                                                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Completed</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {myTasks.summary.completed.count}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(myTasks.summary.completed.count / myTasks.summary.total.count) * 100}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ color: '#e0e7ff', fontSize: 40 }}>
                                            <TaskIcon fontSize="inherit" />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #10b981' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight={700} color="#10b981">
                                                {myProjects.summary.totalProjects}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Total Projects
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Active</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {myProjects.summary.totalActive}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(myProjects.summary.totalActive / myProjects.summary.totalProjects) * 100}
                                                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Completed</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {myProjects.summary.totalCompleted}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(myProjects.summary.totalCompleted / myProjects.summary.totalProjects) * 100}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ color: '#d1fae5', fontSize: 40 }}>
                                            <FolderIcon fontSize="inherit" />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #f59e0b' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                                {tasksIAssigned.summary.total}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Tasks Assigned
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Active</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {tasksIAssigned.summary.active}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(tasksIAssigned.summary.active / tasksIAssigned.summary.total) * 100}
                                                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Overdue</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {tasksIAssigned.summary.overdue}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(tasksIAssigned.summary.overdue / tasksIAssigned.summary.total) * 100}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ color: '#fef3c7', fontSize: 40 }}>
                                            <AssignmentIcon fontSize="inherit" />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #8b5cf6' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                                {team.summary.totalMembers}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Team Members
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Active</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {team.summary.activeMembers}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(team.summary.activeMembers / team.summary.totalMembers) * 100}
                                                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Available</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {team.summary.availableMembers}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(team.summary.availableMembers / team.summary.totalMembers) * 100}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ color: '#ede9fe', fontSize: 40 }}>
                                            <PeopleIcon fontSize="inherit" />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Goals Section */}
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <TrackChangesIcon sx={{ color: '#4361ee' }} />
                            Quarterly Goals Progress ({goals.summary.total})
                        </Typography>
                        {goals.quarterly.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                                {goals.quarterly.map((goal) => (
                                    <GoalCard key={goal.id} goal={goal} />
                                ))}
                            </Box>
                        ) : (
                            <Card sx={{ mb: 4 }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <TrackChangesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">
                                        No goals set for this quarter
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent Activity */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <HistoryIcon sx={{ color: '#4361ee' }} />
                                            Recent Projects ({myProjects.recent.length})
                                        </Typography>
                                        {myProjects.recent.length > 0 ? (
                                            <>
                                                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                    {myProjects.recent.slice(0, 4).map((project) => (
                                                        <Box key={project.projectId} sx={{ position: 'relative' }}>
                                                            <ListItem
                                                                onClick={() => window.open(`/project/${project.projectId}`, '_blank')}
                                                                sx={{
                                                                    borderBottom: '1px solid #e2e8f0',
                                                                    cursor: 'pointer',
                                                                    transition: 'background-color 0.2s',
                                                                    '&:hover': {
                                                                        bgcolor: '#f1f5f9',
                                                                        '& .project-menu': {
                                                                            opacity: 1
                                                                        }
                                                                    },
                                                                    py: 1.5
                                                                }}
                                                                secondaryAction={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Chip
                                                                            label={project.projectStage}
                                                                            size="small"
                                                                            color={getStatusColor(project.projectStage)}
                                                                            sx={{ height: 24 }}
                                                                        />
                                                                        <Box
                                                                            className="project-menu"
                                                                            sx={{
                                                                                // opacity: 0,
                                                                                transition: 'opacity 0.2s',

                                                                            }}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <ProjectMenuDialog
                                                                                project={project}
                                                                                colors={colors}
                                                                                refetch={refetch}
                                                                                apiUrl={mainProjectAPI}
                                                                                formatCurrency={formatCurrency}
                                                                                ProjectCreateInputForm={ProjectCreateInputForm}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                }
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{
                                                                        bgcolor: '#e0e7ff',
                                                                        width: 40,
                                                                        height: 40
                                                                    }}>
                                                                        <FolderIcon sx={{ color: '#4361ee' }} />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography fontWeight={600} noWrap>
                                                                            {project.title}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                            <Typography variant="caption" color="#64748b">
                                                                                {project.projectType}
                                                                            </Typography>
                                                                            {project.totalPercentCompletion !== null && (
                                                                                <>
                                                                                    <Typography variant="caption" color="#64748b">•</Typography>
                                                                                    <Box sx={{
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        gap: 0.5
                                                                                    }}>
                                                                                        <Box sx={{
                                                                                            width: 40,
                                                                                            height: 4,
                                                                                            bgcolor: '#e2e8f0',
                                                                                            borderRadius: 2,
                                                                                            overflow: 'hidden'
                                                                                        }}>
                                                                                            <Box sx={{
                                                                                                width: `${project.totalPercentCompletion}%`,
                                                                                                height: '100%',
                                                                                                bgcolor: project.totalPercentCompletion >= 75 ? '#10B981' :
                                                                                                    project.totalPercentCompletion >= 50 ? '#F59E0B' : '#EF4444'
                                                                                            }} />
                                                                                        </Box>
                                                                                        <Typography variant="caption" color="#64748b">
                                                                                            {project.totalPercentCompletion}%
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </>
                                                                            )}
                                                                        </Box>
                                                                    }
                                                                    sx={{
                                                                        '& .MuiListItemText-primary': {
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis'
                                                                        }
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        </Box>
                                                    ))}
                                                </List>
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <Button
                                                        onClick={() => setTabValue('projects')}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        View All Projects ({myProjects.recent.length})
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                <Typography color="text.secondary">
                                                    No recent projects
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <ScheduleIcon sx={{ color: '#4361ee' }} />
                                            Upcoming Deadlines ({upcomingDeadlines.length})
                                        </Typography>
                                        {upcomingDeadlines.length > 0 ? (
                                            <>
                                                {upcomingDeadlines.slice(0, 4).map((deadline, index) => (
                                                    <UpcomingDeadlineCard key={index} deadline={deadline} />
                                                ))}
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <Button onClick={() => setTabValue('tasks')}>
                                                        View All Tasks
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                                <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                <Typography color="text.secondary">
                                                    No upcoming deadlines
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </TabPanel>

                    {/* My Tasks Tab */}
                    <TabPanel value="tasks" sx={{ p: 0 }}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                {/* Task Filter Buttons Section */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant={taskViewType === 'all' ? 'contained' : 'outlined'}
                                            onClick={() => setTaskViewType('all')}
                                            size="small"
                                            sx={{
                                                bgcolor: taskViewType === 'all' ? '#4361ee' : 'transparent',
                                                color: taskViewType === 'all' ? 'white' : '#4361ee',
                                                borderColor: '#4361ee',
                                                '&:hover': {
                                                    bgcolor: taskViewType === 'all' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                                }
                                            }}
                                        >
                                            All ({myTasks.all.length})
                                        </Button>
                                        <Button
                                            variant={taskViewType === 'upcoming' ? 'contained' : 'outlined'}
                                            onClick={() => setTaskViewType('upcoming')}
                                            size="small"
                                            sx={{
                                                bgcolor: taskViewType === 'upcoming' ? '#4361ee' : 'transparent',
                                                color: taskViewType === 'upcoming' ? 'white' : '#4361ee',
                                                borderColor: '#4361ee',
                                                '&:hover': {
                                                    bgcolor: taskViewType === 'upcoming' ? '#3a0ca3' : 'rgba(67, 97, 238, 0.04)'
                                                }
                                            }}
                                        >
                                            Upcoming ({myTasks.upcoming.length})
                                        </Button>
                                        <Button
                                            variant={taskViewType === 'overdue' ? 'contained' : 'outlined'}
                                            onClick={() => setTaskViewType('overdue')}
                                            size="small"
                                            sx={{
                                                bgcolor: taskViewType === 'overdue' ? '#dc3545' : 'transparent',
                                                color: taskViewType === 'overdue' ? 'white' : '#dc3545',
                                                borderColor: taskViewType === 'overdue' ? '#dc3545' : 'rgba(220, 53, 69, 0.5)',
                                                '&:hover': {
                                                    bgcolor: taskViewType === 'overdue' ? '#bd2130' : 'rgba(220, 53, 69, 0.04)'
                                                }
                                            }}
                                        >
                                            Overdue ({myTasks.overdue.length})
                                        </Button>
                                        <Button
                                            variant={taskViewType === 'completed' ? 'contained' : 'outlined'}
                                            onClick={() => setTaskViewType('completed')}
                                            size="small"
                                            sx={{
                                                bgcolor: taskViewType === 'completed' ? '#10b981' : 'transparent',
                                                color: taskViewType === 'completed' ? 'white' : '#10b981',
                                                borderColor: taskViewType === 'completed' ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                                                '&:hover': {
                                                    bgcolor: taskViewType === 'completed' ? '#0da271' : 'rgba(16, 185, 129, 0.04)'
                                                }
                                            }}
                                        >
                                            Completed ({myTasks.completed.length})
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <TextField
                                            size="small"
                                            placeholder="Search tasks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                                            {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Add summary chips for current view */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                    <Chip
                                        icon={<ScheduleIcon />}
                                        label={`${filteredTasks.length} tasks`}
                                        variant="outlined"
                                        size="small"
                                    />
                                    {taskViewType === 'all' && (
                                        <>
                                            <Chip
                                                icon={<ErrorIcon />}
                                                label={`${myTasks.overdue.length} overdue`}
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                            />
                                            <Chip
                                                icon={<CheckIcon />}
                                                label={`${myTasks.completed.length} completed`}
                                                variant="outlined"
                                                size="small"
                                                color="success"
                                            />
                                            <Chip
                                                icon={<HourglassEmptyIcon />}
                                                label={`${myTasks.upcoming.length} upcoming`}
                                                variant="outlined"
                                                size="small"
                                                color="info"
                                            />
                                        </>
                                    )}
                                </Box>

                                {/* Tasks Display */}
                                {filteredTasks.length > 0 ? (
                                    viewMode === 'list' ? (
                                        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                                            {sortedTasks.map((task) => (
                                                <Link href={`/project/${task.projectId}`} passHref key={task.wbsItemId}>
                                                    <ListItem
                                                        key={task.wbsItemId}
                                                        sx={{
                                                            borderBottom: '1px solid #e2e8f0',
                                                            cursor: 'pointer',
                                                            '&:hover': { bgcolor: '#f1f5f9' }
                                                        }}
                                                        onClick={() => handleTaskClick(task)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar sx={{
                                                                bgcolor: taskViewType === 'overdue' ? '#fee2e2' :
                                                                    taskViewType === 'completed' ? '#d1fae5' : '#e0e7ff'
                                                            }}>
                                                                <TaskIcon sx={{
                                                                    color: taskViewType === 'overdue' ? '#dc3545' :
                                                                        taskViewType === 'completed' ? '#10b981' : '#4361ee'
                                                                }} />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                                    <Typography fontWeight={600}>
                                                                        {task.title}
                                                                    </Typography>
                                                                    {taskViewType === 'overdue' && (
                                                                        <ErrorIcon fontSize="small" color="error" />
                                                                    )}
                                                                    {taskViewType === 'completed' && (
                                                                        <CheckIcon fontSize="small" color="success" />
                                                                    )}
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <>
                                                                    <Typography variant="body2" color="#64748b">
                                                                        {task.projectTitle} • {task.projectType} • Due: {formatDate(task.plannedEndDate)}
                                                                    </Typography>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={task.percentCompletion || 0}
                                                                        sx={{
                                                                            height: 4,
                                                                            borderRadius: 2,
                                                                            width: "200px",
                                                                            mt: 1,
                                                                            bgcolor: taskViewType === 'completed' ? '#d1fae5' : '#e2e8f0'
                                                                        }}
                                                                    />
                                                                </>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <Box sx={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        bgcolor: getPriorityColor(task.priority)
                                                                    }} />
                                                                    <Typography variant="caption" color="#64748b">
                                                                        {task.priority?.toUpperCase() || 'No priority'}
                                                                    </Typography>
                                                                </Box>
                                                                <Chip
                                                                    label={task.taskStage}
                                                                    size="small"
                                                                    color={getStatusColor(task.taskStage)}
                                                                />
                                                            </Box>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </Link>
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
                                            {sortedTasks.map((task) => (
                                                <TaskCardGrid key={task.wbsItemId} task={task} />
                                            ))}
                                        </Box>
                                    )
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            {taskViewType === 'upcoming' && 'No upcoming tasks found.'}
                                            {taskViewType === 'overdue' && 'No overdue tasks found.'}
                                            {taskViewType === 'completed' && 'No completed tasks found.'}
                                            {taskViewType === 'all' && 'No tasks found matching your filters.'}
                                        </Typography>
                                        {(searchQuery || statusFilter !== 'All' || priorityFilter !== 'All') && (
                                            <Button onClick={clearFilters} sx={{ mt: 2 }}>
                                                Clear all filters
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* Projects Tab */}
                    <TabPanel value="projects" sx={{ p: 0 }}>
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
                                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                            >
                                                <MenuItem value="date">Recent</MenuItem>
                                                <MenuItem value="progress">Progress</MenuItem>
                                                <MenuItem value="name">Name</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
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
                                                <Link href={`/project/${project.projectId}`} passHref key={project.projectId}>
                                                    <ListItem
                                                        sx={{
                                                            borderBottom: '1px solid #e2e8f0',
                                                            cursor: 'pointer',
                                                            '&:hover': { bgcolor: '#f1f5f9' }
                                                        }}
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
                                                </Link>
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
                                                <ProjectCardGrid key={project.projectId} project={project} />
                                            ))}
                                        </Box>
                                    )
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            No projects found matching your filters.
                                        </Typography>
                                        <Button onClick={clearFilters} sx={{ mt: 2 }}>
                                            Clear all filters
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* Assigned Tasks Tab */}
                    <TabPanel value="assigned" sx={{ p: 0 }}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                {/* Assigned Task Filter Buttons Section */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant={assignedTaskViewType === 'all' ? 'contained' : 'outlined'}
                                            onClick={() => setAssignedTaskViewType('all')}
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
                                            onClick={() => setAssignedTaskViewType('upcoming')}
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
                                            onClick={() => setAssignedTaskViewType('overdue')}
                                            size="small"
                                            sx={{
                                                bgcolor: assignedTaskViewType === 'overdue' ? '#dc3545' : 'transparent',
                                                color: assignedTaskViewType === 'overdue' ? 'white' : '#dc3545',
                                                borderColor: taskViewType === 'overdue' ? '#dc3545' : 'rgba(220, 53, 69, 0.5)',
                                                '&:hover': {
                                                    bgcolor: assignedTaskViewType === 'overdue' ? '#bd2130' : 'rgba(220, 53, 69, 0.04)'
                                                }
                                            }}
                                        >
                                            Overdue ({tasksIAssigned.overdue.length})
                                        </Button>
                                        <Button
                                            variant={assignedTaskViewType === 'completed' ? 'contained' : 'outlined'}
                                            onClick={() => setAssignedTaskViewType('completed')}
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
                                            onClick={() => setAssignedTaskViewType('active')}
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
                                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                            <TaskCardGrid key={task.wbsItemId} task={task} isAssigned={true} />
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
                                            {assignedTaskViewType === 'all' && 'No assigned tasks found matching your filters.'}
                                        </Typography>
                                        {searchQuery && (
                                            <Button onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                                                Clear search
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* My Week Tab */}
                    <TabPanel value="week" sx={{ p: 0 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <CalendarTodayIcon sx={{ color: '#4361ee' }} />
                                    My Week Overview
                                    <Typography variant="caption" color="#64748b" sx={{ ml: 1 }}>
                                        {formatDate(myWeek.weekRange.start)} - {formatDate(myWeek.weekRange.end)}
                                    </Typography>
                                </Typography>

                                {/* Week Summary Stats */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                                    {myWeek.tasksDueThisWeek}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Tasks Due This Week
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                                    {myWeek.tasksCompletedThisWeek}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Tasks Completed
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                                    {myWeek.overdueTasks}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Overdue Tasks
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                                    {myWeek.timeEntries.length}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Time Entries
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#ec4899">
                                                    {myWeek.hoursByProject.length}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Projects Tracked
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>

                                {/* Hours by Project */}
                                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AccessTimeIcon />
                                    Hours by Project ({myWeek.hoursByProject.length})
                                </Typography>
                                {myWeek.hoursByProject.length > 0 ? (
                                    <Box sx={{ mb: 4 }}>
                                        {myWeek.hoursByProject.map((projectHours, index) => (
                                            <HoursByProjectCard key={index} projectHours={projectHours} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 4, textAlign: 'center', py: 4 }}>
                                        <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            No hours logged for projects this week
                                        </Typography>
                                    </Box>
                                )}

                                {/* Time Entries */}
                                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <WorkIcon />
                                    Recent Time Entries ({myWeek.timeEntries.length})
                                </Typography>
                                {myWeek.timeEntries.length > 0 ? (
                                    <Box>
                                        {myWeek.timeEntries.map((entry) => (
                                            <TimeEntryCard key={entry.timeEntryId} entry={entry} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <WorkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            No time entries for this week
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* Goals Tab */}
                    <TabPanel value="goals" sx={{ p: 0 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <TrackChangesIcon sx={{ color: '#4361ee' }} />
                                    Quarterly Goals & Progress
                                </Typography>

                                {/* Goals Summary Stats */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                                    {goals.summary.total}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Total Goals
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                                    {goals.summary.onTrack}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    On Track
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                                    {goals.summary.atRisk}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    At Risk
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                                    {goals.summary.completed}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Completed
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>

                                {goals.quarterly.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                                        {goals.quarterly.map((goal) => (
                                            <GoalCard key={goal.id} goal={goal} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <TrackChangesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            No goals set for this quarter
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* Team Tab */}
                    <TabPanel value="team" sx={{ p: 0 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <PeopleIcon sx={{ color: '#4361ee' }} />
                                    Team Members ({team.summary.totalMembers})
                                </Typography>

                                {/* Team Summary Stats */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                                    {team.summary.totalMembers}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Total Members
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                                    {team.summary.activeMembers}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Active Members
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                                    {team.summary.availableMembers}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Available Members
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                                    {team.members.reduce((sum, member) => sum + member.tasksActive, 0)}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Active Tasks
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#ec4899">
                                                    {team.members.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Completed Tasks
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>

                                {team.members.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                                        {team.members.map((member) => (
                                            <TeamMemberCard key={member.employeeId} member={member} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">
                                            No team members found
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </TabPanel>

                    {/* Data Summary Tab */}
                    <TabPanel value="summary" sx={{ p: 0 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <AssessmentIcon sx={{ color: '#4361ee' }} />
                                    Data Summary & Statistics
                                </Typography>

                                {/* Data Overview Cards */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <TaskIcon color="primary" />
                                                <Typography variant="subtitle2" color="text.secondary">My Tasks</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{myTasks.all.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Total: {myTasks.summary.total.count} • Upcoming: {myTasks.upcoming.length} • Overdue: {myTasks.overdue.length} • Completed: {myTasks.completed.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <FolderIcon color="secondary" />
                                                <Typography variant="subtitle2" color="text.secondary">Projects</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{myProjects.recent.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Active: {myProjects.summary.totalActive} • Completed: {myProjects.summary.totalCompleted} • Pending: {myProjects.summary.totalPending}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <AssignmentIcon color="info" />
                                                <Typography variant="subtitle2" color="text.secondary">Assigned Tasks</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{tasksIAssigned.all.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Active: {tasksIAssigned.activeItems.length} • Overdue: {tasksIAssigned.overdue.length} • Completed: {tasksIAssigned.completed.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <PeopleIcon color="success" />
                                                <Typography variant="subtitle2" color="text.secondary">Team</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{team.members.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Active: {team.summary.activeMembers} • Available: {team.summary.availableMembers}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <TrackChangesIcon color="warning" />
                                                <Typography variant="subtitle2" color="text.secondary">Goals</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{goals.quarterly.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                On Track: {goals.summary.onTrack} • At Risk: {goals.summary.atRisk} • Completed: {goals.summary.completed}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{ flex: '1 1 180px', minWidth: 180 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <AccessTimeIcon color="error" />
                                                <Typography variant="subtitle2" color="text.secondary">This Week</Typography>
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{myWeek.timeEntries.length}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Time Entries: {myWeek.timeEntries.length} • Projects Tracked: {myWeek.hoursByProject.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>

                                {/* Data Tables */}
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Detailed Data Breakdown
                                </Typography>

                                <TableContainer component={Paper} sx={{ mb: 3 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data Category</TableCell>
                                                <TableCell align="right">Count</TableCell>
                                                <TableCell>Details</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>My Tasks (All)</TableCell>
                                                <TableCell align="right">{myTasks.all.length}</TableCell>
                                                <TableCell>View in My Tasks tab</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>My Tasks (Upcoming)</TableCell>
                                                <TableCell align="right">{myTasks.upcoming.length}</TableCell>
                                                <TableCell>Due in the future</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>My Tasks (Overdue)</TableCell>
                                                <TableCell align="right">{myTasks.overdue.length}</TableCell>
                                                <TableCell>Past due date</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>My Tasks (Completed)</TableCell>
                                                <TableCell align="right">{myTasks.completed.length}</TableCell>
                                                <TableCell>Finished tasks</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Projects</TableCell>
                                                <TableCell align="right">{myProjects.recent.length}</TableCell>
                                                <TableCell>Active: {myProjects.summary.totalActive}, Completed: {myProjects.summary.totalCompleted}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Tasks I Assigned (All)</TableCell>
                                                <TableCell align="right">{tasksIAssigned.all.length}</TableCell>
                                                <TableCell>View in Assigned Tasks tab</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Tasks I Assigned (Active)</TableCell>
                                                <TableCell align="right">{tasksIAssigned.activeItems.length}</TableCell>
                                                <TableCell>Currently in progress</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Team Members</TableCell>
                                                <TableCell align="right">{team.members.length}</TableCell>
                                                <TableCell>Available: {team.summary.availableMembers}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Goals</TableCell>
                                                <TableCell align="right">{goals.quarterly.length}</TableCell>
                                                <TableCell>On Track: {goals.summary.onTrack}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Time Entries (This Week)</TableCell>
                                                <TableCell align="right">{myWeek.timeEntries.length}</TableCell>
                                                <TableCell>Logged work hours</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Upcoming Deadlines</TableCell>
                                                <TableCell align="right">{upcomingDeadlines.length}</TableCell>
                                                <TableCell>Tasks and projects with approaching deadlines</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* API Response Info */}
                                <Card variant="outlined" sx={{ mt: 3 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinkIcon />
                                            Period
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Dashboard Period: {formatDate(timeWindow.from)} to {formatDate(timeWindow.to)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            User: {user.name} ({user.email})
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </TabPanel>
                </TabContext>
            </Box>

            {/* Task Creation Modal */}
            <TaskCreationDialog
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={handleTaskCreated}
            />

            {/* Project Creation Modal */}
            <Dialog
                open={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: "hidden",
                        backdropFilter: "blur(20px)",
                        background: alpha(theme.palette.background.paper, 0.9),
                    },
                }}
            >
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        bgcolor: "section.main",
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, fontWeight: 600 }}
                        >
                            Create New Project
                        </Typography>
                        <IconButton
                            edge="end"
                            onClick={() => setIsProjectModalOpen(false)}
                            aria-label="close"
                            sx={{ color: "text.secondary" }}
                        >
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent sx={{ p: 0 }}>
                    <Form formMode="create" />
                </DialogContent>
            </Dialog>

            {/* Detail View Drawer */}
            <Drawer
                anchor="right"
                open={detailViewOpen}
                onClose={handleCloseDetail}
                PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}
            >
                {selectedItem && (
                    <Box sx={{ p: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleCloseDetail}
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

                                {'projectId' in selectedItem && selectedItem.contributors && (
                                    <>
                                        <Typography variant="h6" gutterBottom>Contributors</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                                            {selectedItem?.contributors.map((contributor, index) => (
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
                                            {selectedItem.assignments.map((assignment, index) => (
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
                )}
            </Drawer>
        </Box>
    );
}