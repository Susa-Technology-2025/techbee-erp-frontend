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
import Link from 'next/link';
import TaskCreationDialog from './_components/taskDialog';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store/store";
import { Close, MoreVert } from '@mui/icons-material';
import Form from "../projects/_components/Form";

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
    priority: string;
    approvalStatus: string;
    taskStage: string;
    percentCompletion: number;
    plannedStartDate: string;
    plannedEndDate: string;
    actualCompletionDate: string | null;
    durationDays: number;
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
    allocationPercent: number;
    isOwner: boolean;
    startDate: string;
    endDate: string | null;
}

interface Assignment {
    employeeId: string;
    allocationPercent: number;
    startDate: string;
    endDate: string | null;
    role: string;
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
        items: Task[];
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
        items: TaskIAssigned[];
    };
    myWeek: {
        weekRange: {
            start: string;
            end: string;
        };
        hoursByProject: Array<{
            projectId: string;
            projectCode: string;
            projectTitle: string;
            plannedHours: number;
            actualHours: number;
            remainingHours: number;
        }>;
        timeEntries: Array<{
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
        }>;
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
        priority: string;
        approvalStatus: string;
        taskStage: string;
        percentCompletion: number;
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
const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
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
        default: return 'default';
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatDateTime = (dateString: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ========== MAIN COMPONENT ==========
export default function PersonalDashboard() {
    const session = useSelector((state: RootState) => state.session);
    const theme = useTheme();

    const { data, isLoading, isError, error } = useDataQuery<DashboardData>({
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
        user
    } = data;

    // Calculate stats
    const totalTasks = myTasks.summary.total.count;
    const overdueTasks = myTasks.summary.overdue.count;
    const completedTasks = myTasks.summary.completed.count;
    const activeProjects = myProjects.summary.totalActive;
    const pendingProjects = myProjects.summary.totalPending;
    const completedProjects = myProjects.summary.totalCompleted;
    const totalProjects = myProjects.summary.totalProjects;
    const totalTeamMembers = team.summary.totalMembers;
    const activeTeamMembers = team.summary.activeMembers;

    // Calculate completion percentage
    const tasksCompletionPercent = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    const projectsCompletionPercent = totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Filter and sort functions
    const filteredProjects = myProjects.recent.filter(project => {
        const matchesStatus = statusFilter === 'All' || project.projectStage === statusFilter;
        const matchesSearch = searchQuery === '' ||
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const filteredTasks = myTasks.items.filter(task => {
        const matchesStatus = statusFilter === 'All' || task.taskStage === statusFilter;
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        const matchesSearch = searchQuery === '' ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.plannedStartDate).getTime() - new Date(a.plannedStartDate).getTime();
        if (sortBy === 'progress') return b.totalPercentCompletion - a.totalPercentCompletion;
        return a.title.localeCompare(b.title);
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.plannedStartDate).getTime() - new Date(a.plannedStartDate).getTime();
        if (sortBy === 'progress') return b.percentCompletion - a.percentCompletion;
        return a.title.localeCompare(b.title);
    });

    // Get all categories from data
    const allCategories = Array.from(new Set([
        ...myProjects.recent.map(p => p.projectType),
        ...myTasks.items.map(t => t.projectType),
        ...goals.quarterly.map(g => g.category)
    ])).filter(Boolean);

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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
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
                        </Box>

                    }

                    action={
                        <IconButton size="small">
                            <MoreVert fontSize="small" />
                        </IconButton>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Button size="small"
                    // onClick={() => handleProjectClick(project)}
                    >
                        View Details
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* <Tooltip title="Edit">
                            <IconButton size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                            <IconButton size="small">
                                <ShareIcon fontSize="small" />
                            </IconButton>
                        </Tooltip> */}
                    </Box>
                </CardActions>
            </Card>
        </Link >
    );

    // Component for Task Card in Grid View
    const TaskCardGrid = ({ task }: { task: Task }) => (
        // <Link href={`/tasks/${task.wbsItemId}`} passHref>
        <Card sx={{
            height: '100%',
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
        }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                        <TaskIcon sx={{ color: '#4361ee' }} />
                    </Avatar>
                }
                title={
                    <Typography variant="h6" fontWeight={600}>
                        {task.title}
                    </Typography>
                }
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip label={task.projectType} size="small" />
                        <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                                bgcolor: getPriorityColor(task.priority),
                                color: 'white'
                            }}
                        />
                    </Box>
                }
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Project: {task.projectTitle || task.projectCode}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description || 'No description available'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Progress</Typography>
                        <Typography variant="caption" fontWeight={600}>
                            {task.percentCompletion}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={task.percentCompletion}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small" />
                        <Typography variant="caption">
                            {formatDate(task.plannedEndDate)}
                        </Typography>
                    </Box>
                    <Chip
                        label={task.taskStage}
                        size="small"
                        color={getStatusColor(task.taskStage)}
                    />
                </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                <Button size="small" onClick={() => handleTaskClick(task)}>
                    View Details
                </Button>
                {/* <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Mark Complete">
                            <IconButton size="small">
                                <CheckIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box> */}
            </CardActions>
        </Card>
        // </Link>
    );

    // Component for Goal Card
    const GoalCard = ({ goal }: { goal: Goal }) => (
        <Card sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={600}>{goal.title}</Typography>
                        <Chip label={goal.category} size="small" sx={{ mt: 1 }} />
                        {goal.priority && (
                            <Chip
                                label={goal.priority}
                                size="small"
                                sx={{
                                    bgcolor: getPriorityColor(goal.priority),
                                    color: 'white',
                                    ml: 1
                                }}
                            />
                        )}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="#64748b">
                            Status: {goal.approvalStatus}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="#64748b">
                        Due: {formatDate(goal.plannedEndDate)}
                    </Typography>
                </Box>
                {goal.responsibleOwner && (
                    <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 1 }}>
                        Owner: {goal.responsibleOwner}
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
                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {member.name || 'Unnamed User'}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            {member.email}
                        </Typography>
                        {member.department && (
                            <Typography variant="caption" color="#64748b">
                                {member.department}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 1 }}>
                        Assigned to {member.assignments.length} project(s)
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    // Component for Upcoming Deadline Card
    const UpcomingDeadlineCard = ({ deadline }: { deadline: any }) => (
        <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                    {deadline.type === 'wbsItem' ?
                        <TaskIcon sx={{ color: '#4361ee' }} /> :
                        <FolderIcon sx={{ color: '#4361ee' }} />
                    }
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} variant="body2">
                        {deadline.title}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                        {deadline.description || deadline.projectTitle}
                    </Typography>
                    {deadline.priority && (
                        <Chip
                            label={deadline.priority}
                            size="small"
                            sx={{
                                bgcolor: getPriorityColor(deadline.priority),
                                color: 'white',
                                mt: 0.5,
                                mr: 1
                            }}
                        />
                    )}
                    <Chip
                        label={deadline.taskStage || 'Task'}
                        size="small"
                        sx={{ mt: 0.5 }}
                    />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" fontWeight={600} color="#4361ee">
                        {formatDate(deadline.deadline)}
                    </Typography>
                    <Typography variant="caption" color="#64748b" display="block">
                        {deadline.percentCompletion}% complete
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', pl: 0, pr: 0 }}>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#3a0ca3">
                            Welcome, {user.name}!
                        </Typography>
                        <Typography variant="subtitle1" color="#64748b">
                            Project & Task Dashboard • {formatDate(data.window.from)} to {formatDate(data.window.to)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                            {dashboardStats.onTimeDelivery !== null && (
                                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                    <CardContent>
                                        <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                            {dashboardStats.onTimeDelivery}%
                                        </Typography>
                                        <Typography color="#64748b" variant="body2">
                                            On-time Delivery
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                            {dashboardStats.customerSatisfaction !== null && (
                                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                                    <CardContent>
                                        <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                            {dashboardStats.customerSatisfaction}%
                                        </Typography>
                                        <Typography color="#64748b" variant="body2">
                                            Customer Satisfaction
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Tabs */}
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <TabList onChange={handleTabChange} aria-label="dashboard tabs">
                            <Tab label="Overview" value="overview" />
                            <Tab label="Projects" value="projects" />
                            <Tab label="Tasks" value="tasks" />
                            <Tab label="Goals" value="goals" />
                            <Tab label="Team" value="team" />
                            <Tab label="My Week" value="week" />
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
                                                {totalTasks}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Total Tasks
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Completed</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {tasksCompletionPercent}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={tasksCompletionPercent}
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
                                                {totalProjects}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Total Projects
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Completed</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {projectsCompletionPercent}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={projectsCompletionPercent}
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
                                                {overdueTasks}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Overdue Tasks
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Resolved</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {myTasks.summary.overdue.percent}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={myTasks.summary.overdue.percent}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Box sx={{ color: '#fef3c7', fontSize: 40 }}>
                                            <ErrorIcon fontSize="inherit" />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card sx={{ flex: '1 1 250px', minWidth: 250, borderTop: '4px solid #8b5cf6' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                                {totalTeamMembers}
                                            </Typography>
                                            <Typography color="#64748b" variant="body2" gutterBottom>
                                                Team Members
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption">Active</Typography>
                                                    <Typography variant="caption" fontWeight={600}>
                                                        {activeTeamMembers}/{totalTeamMembers}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={totalTeamMembers > 0 ? (activeTeamMembers / totalTeamMembers) * 100 : 0}
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
                                <CardContent>
                                    <Typography color="text.secondary" align="center">
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
                                            Recent Projects
                                        </Typography>
                                        {myProjects.recent.length > 0 ? (
                                            <>
                                                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                    {myProjects.recent.slice(0, 4).map((project) => (
                                                        <Link href={`/project/${project.projectId}`} passHref>

                                                            <ListItem
                                                                key={project.projectId}
                                                                sx={{
                                                                    borderBottom: '1px solid #e2e8f0',
                                                                    cursor: 'pointer',
                                                                    '&:hover': { bgcolor: '#f1f5f9' }
                                                                }}
                                                            // onClick={() => handleProjectClick(project)}
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                                        <FolderIcon sx={{ color: '#4361ee' }} />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography fontWeight={600}>
                                                                            {project.title}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Typography variant="body2" color="#64748b">
                                                                            {project.projectType} • {project.totalPercentCompletion}% complete
                                                                        </Typography>
                                                                    }
                                                                />
                                                                <ListItemSecondaryAction>
                                                                    <Chip
                                                                        label={project.projectStage}
                                                                        size="small"
                                                                        color={getStatusColor(project.projectStage)}
                                                                    />
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </Link>
                                                    ))}
                                                </List>
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <Button onClick={() => setTabValue('projects')}>
                                                        View All Projects
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Typography color="text.secondary" align="center">
                                                No recent projects
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                            <ScheduleIcon sx={{ color: '#4361ee' }} />
                                            Upcoming Deadlines
                                        </Typography>
                                        {upcomingDeadlines.length > 0 ? (
                                            <>
                                                {upcomingDeadlines.map((deadline, index) => (
                                                    <UpcomingDeadlineCard key={index} deadline={deadline} />
                                                ))}
                                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                                    <Button onClick={() => setTabValue('tasks')}>
                                                        View All Tasks
                                                    </Button>
                                                </Box>
                                            </>
                                        ) : (
                                            <Typography color="text.secondary" align="center">
                                                No upcoming deadlines
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>

                        {/* Tasks I Assigned Section */}
                        {tasksIAssigned.items.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <AssignmentIcon sx={{ color: '#4361ee' }} />
                                    Tasks I Assigned ({tasksIAssigned.summary.total})
                                </Typography>
                                <Card>
                                    <CardContent>
                                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {tasksIAssigned.items.map((task) => (
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
                                                        <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                            <TaskIcon sx={{ color: '#4361ee' }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography fontWeight={600}>
                                                                {task.title}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="#64748b">
                                                                Assigned to: {task.assignments.length} person(s) • {task.percentCompletion}% complete
                                                            </Typography>
                                                        }
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Chip
                                                            label={task.taskStage}
                                                            size="small"
                                                            color={getStatusColor(task.taskStage)}
                                                        />
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                    </TabPanel>

                    {/* Projects Tab */}
                    <TabPanel value="projects" sx={{ p: 0 }}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        All Projects ({filteredProjects.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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

                                {filteredProjects.length > 0 ? (
                                    viewMode === 'list' ? (
                                        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                                            {sortedProjects.map((project) => (
                                                <Link href={`/project/${project.projectId}`} passHref>

                                                    <ListItem
                                                        key={project.projectId}
                                                        sx={{
                                                            borderBottom: '1px solid #e2e8f0',
                                                            cursor: 'pointer',
                                                            '&:hover': { bgcolor: '#f1f5f9' }
                                                        }}
                                                    // onClick={() => handleProjectClick(project)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                                <FolderIcon sx={{ color: '#4361ee' }} />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

                    {/* Tasks Tab */}
                    <TabPanel value="tasks" sx={{ p: 0 }}>
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        All Tasks ({filteredTasks.length})
                                    </Typography>
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

                                {filteredTasks.length > 0 ? (
                                    viewMode === 'list' ? (
                                        <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                                            {sortedTasks.map((task) => (
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
                                                        <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                            <TaskIcon sx={{ color: '#4361ee' }} />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Typography fontWeight={600}>
                                                                    {task.title}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <>
                                                                <Typography variant="body2" color="#64748b">
                                                                    {task.projectTitle} • {task.projectType} • Due: {formatDate(task.plannedEndDate)}
                                                                </Typography>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={task.percentCompletion}
                                                                    sx={{ height: 4, borderRadius: 2, width: "200px", mt: 1 }}
                                                                />
                                                            </>
                                                        }
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                <Box sx={{
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: '50%',
                                                                    bgcolor: getPriorityColor(task.priority)
                                                                }} />
                                                                <Typography variant="caption" color="#64748b">
                                                                    {task.priority?.toUpperCase()}
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
                                        <Typography color="text.secondary">
                                            No tasks found matching your filters.
                                        </Typography>
                                        <Button onClick={clearFilters} sx={{ mt: 2 }}>
                                            Clear all filters
                                        </Button>
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
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No goals set for this quarter
                                    </Typography>
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
                                    </Box>
                                </Box>

                                {team.members.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                                        {team.members.map((member) => (
                                            <TeamMemberCard key={member.employeeId} member={member} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No team members found
                                    </Typography>
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
                                        {formatDate(data.myWeek.weekRange.start)} - {formatDate(data.myWeek.weekRange.end)}
                                    </Typography>
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                                    {data.myWeek.tasksDueThisWeek}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Tasks Due This Week
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                                    {data.myWeek.tasksCompletedThisWeek}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Tasks Completed
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                                            <CardContent sx={{ textAlign: 'center' }}>
                                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                                    {data.myWeek.overdueTasks}
                                                </Typography>
                                                <Typography variant="body2" color="#64748b">
                                                    Overdue Tasks
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Box>

                                {/* Hours by Project */}
                                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                    Hours by Project
                                </Typography>
                                {data.myWeek.hoursByProject.length > 0 ? (
                                    <Box sx={{ mb: 4 }}>
                                        {data.myWeek.hoursByProject.map((projectHours, index) => (
                                            <Card key={index} sx={{ mb: 2 }}>
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
                                                        value={(projectHours.actualHours / projectHours.plannedHours) * 100}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                        <Typography variant="caption" color="#64748b">
                                                            Remaining: {projectHours.remainingHours} hrs
                                                        </Typography>
                                                        <Typography variant="caption" color="#64748b">
                                                            {Math.round((projectHours.actualHours / projectHours.plannedHours) * 100)}% Complete
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ mb: 4, py: 2 }}>
                                        No hours logged for this week
                                    </Typography>
                                )}

                                {/* Time Entries */}
                                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                                    Recent Time Entries
                                </Typography>
                                {data.myWeek.timeEntries.length > 0 ? (
                                    <List>
                                        {data.myWeek.timeEntries.map((entry) => (
                                            <ListItem key={entry.timeEntryId} sx={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: '#e0e7ff' }}>
                                                        <WorkIcon sx={{ color: '#4361ee' }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography fontWeight={600}>
                                                            {entry.wbsItemTitle}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body2" color="#64748b">
                                                            {entry.projectTitle} • {entry.durationHours} hours • {formatDateTime(entry.workDate)}
                                                            {entry.notes && ` • ${entry.notes}`}
                                                        </Typography>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <Chip
                                                        label={entry.billable ? 'Billable' : 'Non-billable'}
                                                        size="small"
                                                        color={entry.billable ? 'success' : 'default'}
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                                        No time entries for this week
                                    </Typography>
                                )}
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
                                                    {selectedItem.percentCompletion}%
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '100%' }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={selectedItem.percentCompletion}
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
                                                        secondary={`${assignment.allocationPercent}% allocation`}
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