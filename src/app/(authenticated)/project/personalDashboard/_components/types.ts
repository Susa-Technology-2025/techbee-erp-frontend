export interface Project {
    id: number;
    name: string;
    created: string;
    status: 'active' | 'pending' | 'completed';
    contributors: number;
    description: string;
    progress: number;
    deadline: string;
    budget?: number;
    category: string;
    favorite: boolean;
}

export interface Task {
    id: number;
    title: string;
    project: string;
    created: string;
    due: string;
    status: 'active' | 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    progress: number;
    description?: string;
    category: string;
    favorite: boolean;
}

export interface Goal {
    id: number;
    title: string;
    target: number;
    current: number;
    progress: number;
    description: string;
    due: string;
    category: string;
}

export interface Contributor {
    id: number;
    name: string;
    avatar: string;
    tasksCompleted: number;
    role: string;
}

// ========== DATA ==========
export const initialProjects: Project[] = [
    { id: 1, name: "Website Redesign", created: "2023-10-15", status: "active", contributors: 12, description: "Complete redesign of company website with new UI/UX", progress: 75, deadline: "2023-12-15", category: "Web Development", favorite: true },
    { id: 2, name: "Mobile App Development", created: "2023-10-10", status: "active", contributors: 8, description: "Development of new mobile app for iOS and Android", progress: 60, deadline: "2024-01-30", category: "Mobile Development", favorite: false },
    { id: 3, name: "ERP System Upgrade", created: "2023-10-05", status: "pending", contributors: 15, description: "Upgrade current ERP system to version 4.0", progress: 30, deadline: "2024-02-15", category: "System Upgrade", favorite: true },
    { id: 4, name: "Marketing Campaign", created: "2023-09-28", status: "completed", contributors: 6, description: "Q4 marketing campaign for product launch", progress: 100, deadline: "2023-10-31", category: "Marketing", favorite: false },
    { id: 5, name: "Data Migration", created: "2023-09-20", status: "active", contributors: 10, description: "Migration of legacy data to new cloud system", progress: 85, deadline: "2023-11-30", category: "Data Management", favorite: true },
    { id: 6, name: "Cloud Infrastructure", created: "2023-10-01", status: "active", contributors: 5, description: "Setup and deployment of cloud infrastructure", progress: 45, deadline: "2023-12-30", category: "Infrastructure", favorite: false },
];

export const initialTasks: Task[] = [
    { id: 1, title: "Design Homepage Mockup", project: "Website Redesign", created: "2023-10-18", due: "2023-10-25", status: "active", priority: "high", progress: 80, category: "Design", favorite: true },
    { id: 2, title: "API Integration Testing", project: "Mobile App Development", created: "2023-10-16", due: "2023-10-22", status: "active", priority: "medium", progress: 60, category: "Testing", favorite: false },
    { id: 3, title: "User Training Sessions", project: "ERP System Upgrade", created: "2023-10-14", due: "2023-10-30", status: "pending", priority: "medium", progress: 20, category: "Training", favorite: false },
    { id: 4, title: "Social Media Content", project: "Marketing Campaign", created: "2023-10-12", due: "2023-10-20", status: "completed", priority: "low", progress: 100, category: "Content", favorite: true },
    { id: 5, title: "Database Optimization", project: "Data Migration", created: "2023-10-08", due: "2023-10-15", status: "completed", priority: "high", progress: 100, category: "Optimization", favorite: false },
    { id: 6, title: "Client Feedback Analysis", project: "Website Redesign", created: "2023-10-05", due: "2023-10-28", status: "active", priority: "medium", progress: 40, category: "Analysis", favorite: true },
    { id: 7, title: "Security Audit", project: "Cloud Infrastructure", created: "2023-10-03", due: "2023-10-31", status: "pending", priority: "high", progress: 15, category: "Security", favorite: true },
    { id: 8, title: "Performance Testing", project: "Mobile App Development", created: "2023-10-01", due: "2023-10-29", status: "active", priority: "medium", progress: 70, category: "Testing", favorite: false },
];

export const goals: Goal[] = [
    { id: 1, title: "Project Completion", target: 16, current: 12, progress: 75, description: "Complete 12 out of 16 projects for Q4", due: "2023-12-31", category: "Project Goals" },
    { id: 2, title: "Team Productivity", target: 15, current: 12, progress: 88, description: "Increase team productivity by 15% this quarter", due: "2023-12-31", category: "Team Goals" },
    { id: 3, title: "Budget Adherence", target: 100, current: 92, progress: 92, description: "Stay within budget for all active projects", due: "2023-12-31", category: "Financial Goals" },
    { id: 4, title: "Client Satisfaction", target: 95, current: 88, progress: 93, description: "Achieve 95% client satisfaction rate", due: "2023-12-31", category: "Quality Goals" },
];

export const contributors: Contributor[] = [
    { id: 1, name: "Alex Morgan", avatar: "AM", tasksCompleted: 12, role: "Senior Developer" },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", tasksCompleted: 9, role: "UI/UX Designer" },
    { id: 3, name: "Michael Chen", avatar: "MC", tasksCompleted: 8, role: "Project Manager" },
    { id: 4, name: "David Wilson", avatar: "DW", tasksCompleted: 7, role: "Backend Developer" },
];

export const categories = [
    "All",
    "Web Development",
    "Mobile Development",
    "System Upgrade",
    "Marketing",
    "Data Management",
    "Infrastructure",
    "Design",
    "Testing",
    "Training",
    "Content",
    "Optimization",
    "Analysis",
    "Security",
];