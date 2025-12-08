// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    IconButton,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    Card,
    CardContent,
    CardActions,
    Divider,
    Tooltip,
    useTheme,
    useMediaQuery,
    styled,
    alpha
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Work as WorkIcon,
    EventNote as EventNoteIcon,
    TrendingUp as TrendingUpIcon,
    Business as BusinessIcon,
    Add as AddIcon,
    Mail as MailIcon,
    Person as PersonIcon,
    Home as HomeIcon,
    Inbox as InboxIcon,
    Task as TaskIcon,
    Folder as FolderIcon,
    Dashboard as DashboardIcon,
    NotificationsNone as NotificationsNoneIcon,
    Group as GroupIcon,
    Settings as SettingsIcon,
    Circle as CircleIcon,
    MoreHoriz as MoreHorizIcon,
    ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';

// Styled components to match the exact UI
const LeftIconSidebar = styled(Box)(({ theme }) => ({
    width: 60,
    height: '100vh',
    backgroundColor: '#1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 2000,
    justifyContent: 'space-between',
}));

const SidebarButton = styled(Box)<{ active?: boolean; add?: boolean }>(({ theme, active, add }) => ({
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: add ? '#353535' : active ? '#353535' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative',
    '&:hover': {
        backgroundColor: add ? '#404040' : '#2b2b2b',
    },
    '& svg': {
        width: 22,
        height: 22,
        opacity: add ? 1 : 0.8,
        fill: add ? '#fff' : '#ccc',
    },
}));

const MainSidebar = styled(Box)(({ theme }) => ({
    width: 260,
    backgroundColor: '#1f2933',
    color: '#e6eef6',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    position: 'fixed',
    left: 60,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    overflowY: 'auto',
}));

const TopNavbar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#1f2933',
    padding: theme.spacing(1, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    left: 320,
    right: 0,
    width: 'auto',
}));

const SearchBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing(1, 2),
    borderRadius: 999,
    width: '100%',
    maxWidth: 500,
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ffffff',
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 300,
    flex: 1,
}));

const ProjBadge = styled(Box)<{ color: 'purple' | 'pink' | 'blue' | 'grey' }>(({ theme, color }) => {
    const gradients = {
        purple: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
        pink: 'linear-gradient(180deg, #f472b6, #f43f5e)',
        blue: 'linear-gradient(180deg, #60a5fa, #3b82f6)',
        grey: 'linear-gradient(180deg, #9ca3af, #6b7280)',
    };

    return {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        padding: theme.spacing(1.5),
        borderRadius: 10,
        color: '#fff',
        fontWeight: 600,
        fontSize: 13,
        background: gradients[color],
    };
});

// Types
interface SidebarIcon {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    add?: boolean;
}

interface Project {
    name: string;
    color: 'purple' | 'pink' | 'blue' | 'grey';
}

interface NavItem {
    name: string;
    active?: boolean;
}

export default function AsanaDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeSidebarIcon, setActiveSidebarIcon] = useState('Work');
    const [activeTab, setActiveTab] = useState('Upcoming');

    // Sidebar icons
    const topIcons: SidebarIcon[] = [
        { label: 'Work', icon: <WorkIcon />, active: true },
        { label: 'Plan', icon: <EventNoteIcon /> },
        { label: 'Workflow', icon: <TrendingUpIcon /> },
        { label: 'Company', icon: <BusinessIcon /> },
    ];

    const bottomIcons: SidebarIcon[] = [
        { label: 'Add', icon: <AddIcon />, add: true },
        { label: 'Mail', icon: <MailIcon /> },
        { label: 'Profile', icon: <PersonIcon /> },
    ];

    // Navigation items
    const navItems: NavItem[] = [
        { name: 'Home', active: true },
        { name: 'Inbox' },
        { name: 'My tasks' },
        { name: 'Projects' },
        { name: 'Portfolios' },
    ];

    // Projects list
    const sidebarProjects = [
        { name: 'Beaeka ERP', color: '#7c3aed' as const },
        { name: 'Cyber Security Pres...', color: '#ef476f' as const },
        { name: 'Cybersecurity Toolkit', color: '#f59e0b' as const },
        { name: 'Dashen Superapp', color: '#60a5fa' as const },
        { name: 'E-Birr', color: '#94a3b8' as const },
        { name: 'Initial Security Ass...', color: '#f472b6' as const },
        { name: 'Potential Customers', color: '#10b981' as const },
    ];

    // Dashboard projects
    const dashboardProjects: Project[] = [
        { name: 'Initial Security Assessments', color: 'purple' },
        { name: 'Beaeka ERP', color: 'pink' },
        { name: 'Potential Customers', color: 'blue' },
        { name: 'E-Birr', color: 'grey' },
        { name: 'Cyber Security Presentation', color: 'pink' },
    ];

    // Tabs
    const tabs = ['Upcoming', 'Overdue', 'Completed'];

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                if (searchInput) searchInput.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Mobile layout adjustments
    const mainContentMargin = isMobile ? 0 : '320px';
    const sidebarLeft = isMobile ? 0 : 60;
    const navbarLeft = isMobile ? 0 : '320px';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* LEFT ICON SIDEBAR */}
            <LeftIconSidebar sx={{ display: isMobile ? 'none' : 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    {/* Hamburger Icon */}
                    <IconButton sx={{ color: '#ccc', padding: 0.5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ width: 20, height: 3, backgroundColor: '#ccc', borderRadius: 2 }} />
                            <Box sx={{ width: 20, height: 3, backgroundColor: '#ccc', borderRadius: 2 }} />
                            <Box sx={{ width: 20, height: 3, backgroundColor: '#ccc', borderRadius: 2 }} />
                        </Box>
                    </IconButton>

                    {/* Top Icons */}
                    {topIcons.map((icon) => (
                        <Tooltip key={icon.label} title={icon.label} placement="right" arrow>
                            <SidebarButton
                                active={activeSidebarIcon === icon.label}
                                add={icon.add}
                                onClick={() => setActiveSidebarIcon(icon.label)}
                            >
                                {icon.icon}
                            </SidebarButton>
                        </Tooltip>
                    ))}
                </Box>

                {/* Bottom Icons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 2.5 }}>
                    {bottomIcons.map((icon) => (
                        <Tooltip key={icon.label} title={icon.label} placement="right" arrow>
                            <SidebarButton add={icon.add}>
                                {icon.icon}
                            </SidebarButton>
                        </Tooltip>
                    ))}
                </Box>
            </LeftIconSidebar>

            {/* MAIN SIDEBAR */}
            <MainSidebar sx={{
                display: isMobile ? 'none' : 'flex',
                left: sidebarLeft,
                width: isMobile ? '100%' : 260
            }}>
                {/* Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#ff6b6b' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
                        Asana-ish
                    </Typography>
                </Box>

                {/* Navigation */}
                <List sx={{ mt: 0.75, p: 0 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.name} disablePadding>
                            <ListItemButton
                                sx={{
                                    padding: '9px 10px',
                                    borderRadius: 8,
                                    backgroundColor: item.active ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={item.name}
                                    sx={{
                                        color: item.active ? '#fff' : '#cbd5e1',
                                        fontWeight: item.active ? 600 : 400,
                                        fontSize: 14,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Work Section */}
                <Typography
                    variant="caption"
                    sx={{
                        color: '#9aa6b2',
                        mt: 1.75,
                        textTransform: 'uppercase',
                        letterSpacing: 0.6,
                        fontSize: 12,
                    }}
                >
                    Work
                </Typography>

                {/* Projects List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.75, overflow: 'auto', pr: 0.5 }}>
                    {sidebarProjects.map((project) => (
                        <Box
                            key={project.name}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                padding: 1,
                                borderRadius: 8,
                                cursor: 'pointer',
                                color: '#e6eef6',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                },
                            }}
                        >
                            <Box sx={{ width: 10, height: 10, borderRadius: 4, backgroundColor: project.color, flexShrink: 0 }} />
                            <Typography sx={{ fontSize: 14 }}>{project.name}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Upgrade Button */}
                <Button
                    sx={{
                        mt: 'auto',
                        backgroundColor: '#ffd8a8',
                        color: '#713f12',
                        padding: '8px 10px',
                        borderRadius: 10,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ffc478',
                        },
                    }}
                >
                    Upgrade
                </Button>
            </MainSidebar>

            {/* MAIN CONTENT */}
            <Box sx={{
                marginLeft: mainContentMargin,
                padding: isMobile ? 1.5 : 3,
                width: '100%',
                minHeight: '100vh'
            }}>
                {/* FIXED NAVBAR */}
                <TopNavbar
                    position="fixed"
                    sx={{
                        left: navbarLeft,
                        display: isMobile ? 'none' : 'flex'
                    }}
                >
                    <SearchBar>
                        <SearchIcon sx={{ color: '#94a3b8', width: 18, height: 18 }} />
                        <TextField
                            placeholder="Search (Ctrl K)"
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    color: '#e6eef6',
                                    fontSize: 14,
                                    width: '100%',
                                },
                            }}
                            sx={{ width: '100%' }}
                        />
                        <Chip
                            label="Ctrl K"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: '#e6eef6',
                                fontSize: 12,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: 24,
                            }}
                        />
                    </SearchBar>
                </TopNavbar>

                {/* Main Content Area */}
                <Box sx={{ mt: isMobile ? 0 : '60px', mb: 2.25 }}>
                    <Box sx={{ margin: isMobile ? 2 : '4%' }}>
                        {/* Top Content */}
                        <Box sx={{ mb: 2.25 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25, width: '100%', justifyContent: 'space-between', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                                {/* Date and Greeting */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                    <Typography sx={{ color: '#6b7280', fontSize: 13, m: 0 }}>
                                        Tuesday, December 2
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, fontSize: 24, m: 0 }}>
                                        Good afternoon, Sam
                                    </Typography>
                                </Box>

                                {/* Header Controls */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: isMobile ? 2 : 0, flexWrap: 'wrap' }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            padding: '8px 12px',
                                            borderRadius: 999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            fontSize: 13,
                                            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>My week</Typography>
                                    </Paper>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            padding: '8px 12px',
                                            borderRadius: 999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            fontSize: 13,
                                            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>0 tasks completed</Typography>
                                    </Paper>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            padding: '8px 12px',
                                            borderRadius: 999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            fontSize: 13,
                                            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        <Chip
                                            label="0"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#eef2ff',
                                                fontWeight: 600,
                                                color: '#3730a3',
                                                fontSize: 13,
                                                height: 24,
                                            }}
                                        />
                                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>collaborators</Typography>
                                    </Paper>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            padding: '8px 12px',
                                            borderRadius: 999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.25,
                                            fontSize: 13,
                                            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Customize</Typography>
                                        <ArrowDropDownIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                                    </Paper>
                                </Box>
                            </Box>
                        </Box>

                        {/* DASHBOARD */}
                        <Box sx={{
                            maxWidth: 1500,
                            mt: 2.25,
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: 2.5,
                            flexWrap: 'wrap'
                        }}>
                            {/* First Row */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: 2.5,
                                width: '100%'
                            }}>
                                {/* My Tasks Card */}
                                <DashboardCard sx={{ flex: isMobile ? '1 1 100%' : '1 1 50%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontSize: 18 }}>
                                            My tasks
                                        </Typography>
                                        <IconButton size="small" sx={{ color: '#6b7280' }}>
                                            <MoreHorizIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    {/* Tabs */}
                                    <Box sx={{ display: 'flex', gap: 1.25, mt: 1, color: '#6b7280' }}>
                                        {tabs.map((tab) => (
                                            <Box
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                sx={{
                                                    padding: '6px 8px',
                                                    borderRadius: 8,
                                                    cursor: 'pointer',
                                                    color: activeTab === tab ? '#111' : '#6b7280',
                                                    backgroundColor: activeTab === tab ? '#eef2ff' : 'transparent',
                                                    fontWeight: activeTab === tab ? 600 : 400,
                                                    fontSize: 14,
                                                }}
                                            >
                                                {tab}
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Create Task */}
                                    <Box
                                        sx={{
                                            mt: 2.25,
                                            padding: 1.5,
                                            borderRadius: 10,
                                            border: '1px dashed #e6eef6',
                                            color: '#6b7280',
                                            cursor: 'pointer',
                                            flexGrow: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        + Create task
                                    </Box>
                                </DashboardCard>

                                {/* Projects Card */}
                                <DashboardCard sx={{ flex: isMobile ? '1 1 100%' : '1 1 50%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontSize: 18 }}>
                                            Projects
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                                            Recents <ArrowDropDownIcon sx={{ fontSize: 16 }} />
                                        </Typography>
                                    </Box>

                                    {/* Project Grid */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        gap: 1.25,
                                        mt: 1.25,
                                        flexGrow: 1
                                    }}>
                                        {dashboardProjects.map((project) => (
                                            <ProjBadge key={project.name} color={project.color} sx={{ flex: '1 1 calc(50% - 10px)' }}>
                                                {project.name}
                                            </ProjBadge>
                                        ))}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 10,
                                                backgroundColor: '#f8fafc',
                                                color: '#334155',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                padding: 1.5,
                                                flex: '1 1 calc(50% - 10px)',
                                            }}
                                        >
                                            + Create project
                                        </Box>
                                    </Box>

                                    <Typography sx={{ mt: 'auto', fontSize: 13, color: '#6b7280' }}>
                                        Show more
                                    </Typography>
                                </DashboardCard>
                            </Box>

                            {/* Second Row */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: 2.5,
                                width: '100%'
                            }}>
                                {/* Tasks I've Assigned Card */}
                                <DashboardCard sx={{ flex: isMobile ? '1 1 100%' : '1 1 50%' }}>
                                    <Typography variant="h6" sx={{ fontSize: 18, mb: 1 }}>
                                        Tasks I've assigned
                                    </Typography>
                                    <Typography sx={{ color: '#6b7280', fontSize: 14, flexGrow: 1 }}>
                                        Upgrade to Asana Starter to keep track of tasks you've assigned your colleagues.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 'auto',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            backgroundColor: '#f59e0b',
                                            color: '#fff',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#d97706',
                                            },
                                        }}
                                    >
                                        Try for free
                                    </Button>
                                </DashboardCard>

                                {/* Goals Card */}
                                <DashboardCard sx={{ flex: isMobile ? '1 1 100%' : '1 1 50%' }}>
                                    <Typography variant="h6" sx={{ fontSize: 18, mb: 1 }}>
                                        Goals
                                    </Typography>
                                    <Typography sx={{ color: '#6b7280', fontSize: 14, flexGrow: 1 }}>
                                        Try Advanced to make traction on your goals.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 'auto',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            backgroundColor: '#fde68a',
                                            color: '#92400e',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: '#fcd34d',
                                            },
                                        }}
                                    >
                                        Try for free
                                    </Button>
                                </DashboardCard>
                            </Box>
                        </Box>

                        {/* Footer Note */}
                        <Box sx={{ maxWidth: 1500, mt: 2.25, color: '#6b7280', fontSize: 13 }}>
                            <Typography variant="caption">
                                Tip: this single-file example is a starting point — replace text and colors to match your project
                                and wire up real data as needed.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}