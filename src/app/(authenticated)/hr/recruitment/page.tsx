"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
  Stack,
  Skeleton,
  Alert as MuiAlert,
  AlertTitle,
  LinearProgress,
  Tabs,
  Tab,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  AccessTime,
  People,
  Work,
  Assignment,
  Event,
  Notifications,
  Warning,
  TrendingUp,
  Info,
  EmojiPeople,
  Diversity3,
  CheckCircle,
  PlayArrow,
  Schedule,
  Task,
  Group,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { useGetApplicationDashboardQuery } from "./_queries/dashboard";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const ONBOARDING_STATUS_COLORS = {
  NotStarted: "#bdbdbd",
  InProgress: "#ffb74d",
  Completed: "#4caf50",
  Overdue: "#f44336",
};

// Empty state components
const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 4,
      height: 300,
    }}
  >
    <Icon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {description}
    </Typography>
  </Box>
);

const LoadingSkeleton = () => (
  <Box sx={{ width: "100%" }}>
    <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={200} />
  </Box>
);

const RecruitmentDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<number>(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [queryParams, setQueryParams] = useState({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  });

  const { data, isLoading } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/applications/dashboard?from=${encodeURIComponent(
      queryParams.from
    )}&to=${encodeURIComponent(queryParams.to)}`,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (!data)
    return (
      <Box sx={{ p: 3 }}>
        <MuiAlert severity="error">
          <AlertTitle>Error Loading Data</AlertTitle>
          Unable to load dashboard data. Please try again later.
        </MuiAlert>
      </Box>
    );

  const recruitmentData = data.recruitment;
  const onboardingData = data.onboarding;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // KPI Cards component for Recruitment
  const RecruitmentKPICards = () => (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={2}
      sx={{ mt: 2, width: "100%" }}
    >
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Open Positions</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.totalOpenPositions}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Applications</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.totalApplications}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "success.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">In Pipeline</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.candidatesInPipeline}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "warning.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Time to Hire</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.timeToHire} days
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "info.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Time to Fill</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.timeToFill} days
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "purple", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Acceptance Rate</Typography>
            <Typography variant="h4">
              {recruitmentData.kpis.offerAcceptanceRate}%
            </Typography>
          </CardContent>
        </Card>
      </Box>
      {recruitmentData.kpis.costPerHire !== null && (
        <Box flex="1 1 200px" minWidth="200px">
          <Card sx={{ bgcolor: "brown", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Cost per Hire</Typography>
              <Typography variant="h4">
                ${recruitmentData.kpis.costPerHire?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Stack>
  );

  // KPI Cards component for Onboarding
  const OnboardingKPICards = () => (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={2}
      sx={{ mt: 2, width: "100%" }}
    >
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "primary.light", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Active Plans</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.activePlans}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Total Tasks</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.totalTasks}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "success.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Tasks Completed</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.tasksCompleted}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "warning.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">In Progress</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.tasksInProgress}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "error.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Overdue Tasks</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.overdueTasks}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "info.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Due This Week</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.dueThisWeek}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box flex="1 1 200px" minWidth="200px">
        <Card sx={{ bgcolor: "purple", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Avg Completion</Typography>
            <Typography variant="h4">
              {onboardingData.kpis.avgCompletionDays} days
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );

  // Funnel Visualization component - Updated to handle no data
  const FunnelVisualization = () => {
    const hasData =
      recruitmentData.candidatePipeline &&
      recruitmentData.candidatePipeline.some((item) => item.candidates > 0);

    if (!hasData) {
      return (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recruitment Funnel
          </Typography>
          <EmptyState
            icon={TrendingUp}
            title="No Funnel Data Available"
            description="The recruitment funnel will display here once candidates start applying to your positions."
          />
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recruitment Funnel
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={recruitmentData.candidatePipeline} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip formatter={(value) => [`${value} candidates`, "Count"]} />
            <Legend />
            <Bar dataKey="candidates" name="Candidates" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  // Job Requisitions component - Updated for no data
  const JobRequisitions = () => {
    // Since jobRequisitions is not in the API data, show empty state
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Open Positions
        </Typography>
        <EmptyState
          icon={Work}
          title="No Open Positions Data"
          description="Open positions data is not currently available in the API response."
        />
      </Paper>
    );
  };

  // Candidate Pipeline component - Updated to use actual API data
  const CandidatePipeline = () => {
    const hasData =
      recruitmentData.candidatePipeline &&
      recruitmentData.candidatePipeline.some((stage) => stage.candidates > 0);

    if (!hasData) {
      return (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Candidate Pipeline
          </Typography>
          <EmptyState
            icon={People}
            title="Pipeline Data Not Available"
            description="Candidate pipeline data is not available in the current API response."
          />
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Candidate Pipeline
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={recruitmentData.candidatePipeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="candidates" name="Candidates" fill="#413ea0" />
            <Line
              type="monotone"
              dataKey="avgTime"
              name="Avg Time (days)"
              stroke="#ff7300"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  // Source of Hire component - Updated for no data
  const SourceOfHire = () => {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Source of Hire
        </Typography>
        <EmptyState
          icon={Assignment}
          title="No Source Data Available"
          description="Source of hire information is not included in the current API response."
        />
      </Paper>
    );
  };

  // Upcoming Interviews component - Updated for no data
  const UpcomingInterviews = () => {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upcoming Interviews
        </Typography>
        <EmptyState
          icon={Event}
          title="No Interview Data Available"
          description="Upcoming interview information is not included in the current API response."
        />
      </Paper>
    );
  };

  // Diversity Metrics component - Updated for no data
  const DiversityMetrics = () => {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          <Diversity3 sx={{ verticalAlign: "middle", mr: 1 }} />
          Diversity Metrics
        </Typography>
        <EmptyState
          icon={Diversity3}
          title="Diversity Data Not Available"
          description="Diversity metrics are not included in the current API response."
        />
      </Paper>
    );
  };

  // Tasks by Status component - Updated to use actual API data
  const TasksByStatus = () => {
    const hasData =
      onboardingData.tasksByStatus && onboardingData.tasksByStatus.length > 0;

    if (!hasData) {
      return (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tasks by Status
          </Typography>
          <EmptyState
            icon={Task}
            title="No Task Status Data"
            description="Task status information is not available in the current API response."
          />
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tasks by Status
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={onboardingData.tasksByStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ status, count, percent }) =>
                `${status}: ${count} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {onboardingData.tasksByStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ONBOARDING_STATUS_COLORS[
                      entry.status as keyof typeof ONBOARDING_STATUS_COLORS
                    ] || "#8884d8"
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    );
  };

  // Template Usage component - Updated for no data
  const TemplateUsage = () => {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Template Usage
        </Typography>
        <EmptyState
          icon={Group}
          title="No Template Data Available"
          description="Template usage information is not included in the current API response."
        />
      </Paper>
    );
  };

  // Progress Overview component - Updated to use actual API data
  const ProgressOverview = () => {
    const completionRate =
      onboardingData.kpis.totalTasks > 0
        ? (onboardingData.kpis.tasksCompleted /
            onboardingData.kpis.totalTasks) *
          100
        : 0;

    const data = [
      { name: "Completed", value: completionRate, fill: "#4caf50" },
      { name: "Remaining", value: 100 - completionRate, fill: "#e0e0e0" },
    ];

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Onboarding Progress
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="90%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                minPointSize={15}
                background
                dataKey="value"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x="50%"
                  dy="-0.2em"
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    fill: "#5e5a5aff",
                  }}
                >
                  {completionRate.toFixed(0)}%
                </tspan>
                <tspan
                  x="50%"
                  dy="1.5em"
                  style={{ fontSize: "14px", fill: "#b9b2b2ff" }}
                >
                  Complete
                </tspan>
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Tasks Completed: {onboardingData.kpis.tasksCompleted} /{" "}
              {onboardingData.kpis.totalTasks}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{ height: 10, borderRadius: 5 }}
              color={completionRate === 100 ? "success" : "primary"}
            />
          </Box>
        </Box>
      </Paper>
    );
  };

  // Alerts component (combined recruitment and onboarding) - Updated to use actual API data
  const Alerts = () => {
    // Recruitment alerts are not in the API data, only onboarding alerts are present
    const allAlerts = [...(onboardingData.alerts || [])];

    if (allAlerts.length === 0) {
      return (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            <Warning sx={{ verticalAlign: "middle", mr: 1 }} />
            Alerts & Notifications
          </Typography>
          <MuiAlert severity="success" sx={{ mt: 2 }}>
            <AlertTitle>All Clear</AlertTitle>
            No alerts at this time. Everything is running smoothly!
          </MuiAlert>
        </Paper>
      );
    }

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          <Warning sx={{ verticalAlign: "middle", mr: 1 }} />
          Alerts & Notifications
        </Typography>
        <List>
          {allAlerts.map((alert) => (
            <ListItem key={alert.id} divider>
              <ListItemIcon>
                <Notifications
                  color={
                    alert.priority === "High"
                      ? "error"
                      : alert.priority === "Medium"
                      ? "warning"
                      : "success"
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary={alert.message}
                secondary={`Priority: ${alert.priority}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  // Filters component
  const Filters = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <FormControl sx={{ minWidth: "200px", flex: "1 1 auto" }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: "200px", flex: "1 1 auto" }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={departmentFilter}
            label="Department"
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="all">All Departments</MenuItem>
            <MenuItem value="engineering">Engineering</MenuItem>
            <MenuItem value="product">Product</MenuItem>
            <MenuItem value="design">Design</MenuItem>
            <MenuItem value="analytics">Analytics</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search Positions"
          sx={{ minWidth: "200px", flex: "1 1 auto" }}
        />
        <TextField
          label="Location"
          sx={{ minWidth: "200px", flex: "1 1 auto" }}
        />
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, position: "relative" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "white" }}>
        Application Dashboard
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab icon={<People />} label="Recruitment" />
          <Tab icon={<EmojiPeople />} label="Onboarding" />
        </Tabs>
      </Paper>

      {/* <Filters /> */}

      {activeTab === 0 ? (
        <>
          <RecruitmentKPICards />
          <Stack direction={{ xs: "column", lg: "row" }} gap={2}>
            <Box flex={2}>
              <FunnelVisualization />
              <CandidatePipeline />
              <DiversityMetrics />
            </Box>

            <Box flex={1}>
              <JobRequisitions />
              <SourceOfHire />
              <UpcomingInterviews />
              <Alerts />
            </Box>
          </Stack>
        </>
      ) : (
        <>
          <OnboardingKPICards />
          <Stack direction={{ xs: "column", lg: "row" }} gap={2}>
            <Box flex={2}>
              <ProgressOverview />
              <TasksByStatus />
            </Box>

            <Box flex={1}>
              <TemplateUsage />
              <Alerts />
            </Box>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default RecruitmentDashboard;
