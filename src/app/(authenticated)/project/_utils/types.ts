export interface Project {
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

export interface Task {
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

export interface TaskIAssigned extends Task {
    assignments: Assignment[];
    assignedBy: string;
}

export interface Goal {
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

export interface Contributor {
    employeeId: string;
    name: string | null;
    role: string;
    allocationPercent: number;
    isOwner: boolean;
}

export interface TeamMember {
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

export interface TeamAssignment {
    projectId: string;
    projectCode: string;
    allocationPercent: number | null;
    isOwner: boolean;
    startDate: string | null;
    endDate: string | null;
}

export interface Assignment {
    employeeId: string;
    allocationPercent: number;
    startDate: string;
    endDate: string | null;
    role: string;
}

export interface TimeEntry {
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

export interface HoursByProject {
    projectId: string;
    projectCode: string;
    projectTitle: string;
    plannedHours: number;
    actualHours: number;
    remainingHours: number;
}

export interface DashboardData {
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