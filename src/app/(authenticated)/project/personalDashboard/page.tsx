'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    CircularProgress,
    Alert,
    AlertTitle,
    Card,
    CardContent
} from '@mui/material';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Tab from '@mui/material/Tab';
import { useSelector } from 'react-redux';
import TaskCreationDialog from './_components/dialogs/taskDialog';
import { useDataQuery } from '@/lib/tanstack/useDataQuery';
import { RootState } from "@/lib/store/store";
import { DashboardData, Project, Task, TaskIAssigned, Goal } from '../_utils/types';
import { formatDate } from '../_utils/helpers';
import OverviewTab from './_components/sections/OverviewTab';
import TasksTab from './_components/sections/TasksTab';
import ProjectsTab from './_components/sections/ProjectsTab';
import AssignedTasksTab from './_components/sections/AssignedTasksTab';
import WeekTab from './_components/sections/WeekTab';
import GoalsTab from './_components/sections/GoalsTab';
import TeamTab from './_components/sections/TeamTab';
import SummaryTab from './_components/sections/SummaryTab';
import DetailDrawer from './_components/sections/DetailDrawer';
import ProjectCreationDialog from './_components/dialogs/ProjectCreationDialog';

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
        refetch();
    };

    const handleProjectClick = (project: Project) => {
        setSelectedItem(project);
        setDetailViewOpen(true);
    };

    const handleTaskClick = (task: Task | TaskIAssigned) => {
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
                        <OverviewTab
                            data={data}
                            onViewAllProjects={() => setTabValue('projects')}
                            onViewAllTasks={() => setTabValue('tasks')}
                            refetch={refetch}
                        />
                    </TabPanel>

                    {/* My Tasks Tab */}
                    <TabPanel value="tasks" sx={{ p: 0 }}>
                        <TasksTab
                            myTasks={myTasks}
                            taskViewType={taskViewType}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                            filteredTasks={filteredTasks}
                            sortedTasks={sortedTasks}
                            onTaskViewTypeChange={setTaskViewType}
                            onViewModeChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            onSearchChange={setSearchQuery}
                            onClearFilters={clearFilters}
                            onTaskClick={handleTaskClick}
                            refetch={refetch}
                        />
                    </TabPanel>

                    {/* Projects Tab */}
                    <TabPanel value="projects" sx={{ p: 0 }}>
                        <ProjectsTab
                            myProjects={myProjects}
                            filteredProjects={filteredProjects}
                            sortedProjects={sortedProjects}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                            sortBy={sortBy}
                            onViewModeChange={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            onSearchChange={setSearchQuery}
                            onSortChange={setSortBy}
                            onClearFilters={clearFilters}
                            onProjectClick={handleProjectClick}
                            refetch={refetch}
                        />
                    </TabPanel>

                    {/* Assigned Tasks Tab */}
                    <TabPanel value="assigned" sx={{ p: 0 }}>
                        <AssignedTasksTab
                            tasksIAssigned={tasksIAssigned}
                            assignedTaskViewType={assignedTaskViewType}
                            filteredAssignedTasks={filteredAssignedTasks}
                            searchQuery={searchQuery}
                            onAssignedTaskViewTypeChange={setAssignedTaskViewType}
                            onSearchChange={setSearchQuery}
                            onTaskClick={handleTaskClick}
                            refetch={refetch}
                        />
                    </TabPanel>

                    {/* My Week Tab */}
                    <TabPanel value="week" sx={{ p: 0 }}>
                        <WeekTab myWeek={myWeek} />
                    </TabPanel>

                    {/* Goals Tab */}
                    <TabPanel value="goals" sx={{ p: 0 }}>
                        <GoalsTab goals={goals} />
                    </TabPanel>

                    {/* Team Tab */}
                    <TabPanel value="team" sx={{ p: 0 }}>
                        <TeamTab team={team} />
                    </TabPanel>

                    {/* Data Summary Tab */}
                    <TabPanel value="summary" sx={{ p: 0 }}>
                        <SummaryTab data={data} timeWindow={timeWindow} user={user} />
                    </TabPanel>
                </TabContext>
            </Box>

            {/* Task Creation Modal */}
            {/* <TaskCreationDialog
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={handleTaskCreated}
            /> */}
            <TaskCreationDialog
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={handleTaskCreated}
            />

            {/* Project Creation Modal */}
            <ProjectCreationDialog
                open={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSuccess={(project) => {
                    alert('Project created successfully!');
                    refetch();
                }}
            />

            {/* Detail View Drawer */}
            <DetailDrawer
                open={detailViewOpen}
                selectedItem={selectedItem}
                onClose={handleCloseDetail}
            />
        </Box>
    );
}