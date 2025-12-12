'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    useTheme,
    Alert,
    CircularProgress,
    alpha
} from '@mui/material';
import { useDataMutation, useDataQuery } from '@/lib/tanstack/useDataQuery';
import dayjs, { Dayjs } from 'dayjs';
import toast from 'react-hot-toast';

// Import components
import DateRangePicker from './_components/DateRangePicker';
import SummarySection from './sections/SummarySection';
import ProjectsAnalyticsSection from './sections/ProjectsAnalyticsSection';
import RiskDeadlinesSection from './sections/RiskDeadlinesSection';
import TasksMilestonesSection from './sections/TasksMilestonesSection';
import AnalyticsTrendsSection from './sections/AnalyticsTrendsSection';
import AllProjectsSection from './sections/AllProjectsSection';

// Import utilities
import { mainProjectAPI } from '../_utils/consts';

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


export default function ProjectAnalyticsDashboard() {
    const theme = useTheme();
    const [showPicker, setShowPicker] = useState(false);
    // Initialize with null - we'll set them after data loads
    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    // Track if user has selected custom dates
    const [hasCustomDates, setHasCustomDates] = useState(false);
    // Add a ref to track initial data setting
    const initialDataLoaded = React.useRef(false);

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
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const formatDate = (date: Date): string => {
        return dayjs(date).format('YYYY-MM-DD');
    };

    // Build API URL based on whether custom dates are set
    const buildApiUrl = () => {
        const baseUrl = `${mainProjectAPI}/analytics/overview`;

        // If user hasn't selected custom dates, fetch without date params
        if (!hasCustomDates) {
            return baseUrl;
        }

        // If user has selected custom dates AND dates exist, include them
        if (fromDate && toDate) {
            const params = new URLSearchParams({
                from: formatDate(fromDate.toDate()),
                to: formatDate(toDate.toDate())
            });
            return `${baseUrl}?${params.toString()}`;
        }

        // Fallback to base URL (shouldn't happen, but just in case)
        return baseUrl;
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
            setOpenDeleteDialog(false);
            setSelectedProject(null);
            refetch();
        },
        onError: (error) => {
            toast.error(`Failed to delete project: ${error.message || 'Unknown error'}`);
        }
    });

    const dashboardData = data as DashboardData;

    // Set dates from API when data loads (only once on initial load)
    useEffect(() => {
        if (dashboardData?.window && !hasCustomDates && !initialDataLoaded.current) {
            // Set dates from API response for display
            setFromDate(dayjs(dashboardData.window.from));
            setToDate(dayjs(dashboardData.window.to));
            initialDataLoaded.current = true;
        }
    }, [dashboardData, hasCustomDates]);

    const handleApply = () => {
        // Only apply if both dates are selected
        if (fromDate && toDate) {
            setHasCustomDates(true);
            // Use setTimeout to ensure state updates before refetch
            setTimeout(() => {
                refetch();
            }, 0);
            setShowPicker(false);
        }
    };

    const handleClearDates = () => {
        // Clear custom dates flag
        setHasCustomDates(false);
        // Don't reset dates to API dates - keep showing the current dates in UI
        // The refetch will happen automatically because apiUrl changes
        // Use setTimeout to ensure state updates before refetch
        setTimeout(() => {
            refetch();
        }, 0);
    };

    const handleDateChange = (type: 'from' | 'to', newDate: Dayjs | null) => {
        // Update the displayed dates without fetching
        if (type === 'from') {
            setFromDate(newDate);
        } else {
            setToDate(newDate);
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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
                No data available.
            </Alert>
        );
    }

    const budget = dashboardData?.summary?.budgetUtilizationPercent;

    return (
        <Box sx={{ p: 2 }}>
            {/* Header with Date Picker */}
            <DateRangePicker
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={(date) => handleDateChange('from', date)}
                setToDate={(date) => handleDateChange('to', date)}
                onApply={handleApply}
                onClear={handleClearDates}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                hasCustomDates={hasCustomDates}
                window={dashboardData?.window}
            />

            {/* Summary Section */}
            <SummarySection
                dashboardData={dashboardData}
                expanded={expandedSections.summary}
                budget={budget}
            />

            {/* Projects Analytics Section */}
            <ProjectsAnalyticsSection
                dashboardData={dashboardData}
                expanded={expandedSections.projects}
            />

            {/* Risk & Deadlines Section */}
            <RiskDeadlinesSection
                dashboardData={dashboardData}
                expanded={expandedSections.risks}
                refetch={refetch}
            />

            {/* Tasks & Milestones Section */}
            <TasksMilestonesSection
                dashboardData={dashboardData}
                expanded={expandedSections.tasks}
                taskFilter={taskFilter}
                setTaskFilter={setTaskFilter}
                milestoneFilter={milestoneFilter}
                setMilestoneFilter={setMilestoneFilter}
                refetch={refetch}
                apiUrl={apiUrl}
            />

            {/* Analytics & Trends Section */}
            <AnalyticsTrendsSection
                dashboardData={dashboardData}
                expanded={expandedSections.analytics}
            />

            {/* All Projects Section */}
            <AllProjectsSection
                dashboardData={dashboardData}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                riskFilter={riskFilter}
                setRiskFilter={setRiskFilter}
                refetch={refetch}
            />
        </Box>
    );
}