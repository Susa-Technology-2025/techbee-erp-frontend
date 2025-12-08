"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  AppBar,
  Toolbar,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Chip,
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
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
} from "recharts";
import {
  Drafts,
  CheckCircle,
  Schedule,
  Group,
  TrendingUp,
  School,
  EmojiEvents,
  Assessment,
} from "@mui/icons-material";
import { useGetTrainingDashboardQuery } from "../_queries/trainingRecords";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define types based on the provided data structure
interface Window {
  from: string;
  to: string;
}

interface StatusCount {
  status: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

interface PlansSummary {
  total: number;
  byApproval: StatusCount[];
  estimatedBudget: number;
}

interface ProgramsSummary {
  total: number;
  byType: TypeCount[];
}

interface SessionsSummary {
  inWindow: number;
  byStatus: StatusCount[];
  byType: TypeCount[];
  totalDurationHours: number;
}

interface EnrollmentsSummary {
  total: number;
  attended: number;
  completed: number;
  hoursAttended: number;
  participants: number;
}

interface RecordsSummary {
  completedCount: number;
}

interface FeedbackSummary {
  surveys: number;
  responses: number;
  responseRatePct: number;
}

interface DevelopmentSummary {
  totalPlans: number;
  byStatus: StatusCount[];
}

interface TrainersSummary {
  byType: TypeCount[];
}

interface Summary {
  plans: PlansSummary;
  programs: ProgramsSummary;
  sessions: SessionsSummary;
  enrollments: EnrollmentsSummary;
  records: RecordsSummary;
  feedback: FeedbackSummary;
  development: DevelopmentSummary;
  trainers: TrainersSummary;
}

interface Distributions {
  enrollmentsBySessionStatus: StatusCount[];
  enrollmentsByDept: StatusCount[];
  programStartsInWindow: StatusCount[];
}

interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  trainer: string;
  location: string;
}

interface Upcoming {
  nextSessions: Session[];
}

interface Detail {
  // This would be expanded based on actual API response
  [key: string]: any;
}

interface TrainingRecord {
  window: Window;
  summary: Summary;
  distributions: Distributions;
  upcoming: Upcoming;
  detail: Detail;
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {`${label}`}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography
            key={`item-${index}`}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {`${entry.name}: ${entry.value}`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

// Custom label for pie chart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`; // "YYYY-MM"
}; // "YYYY-MM"
const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const getDateRange = (monthValue: string) => {
  const [year, month] = monthValue.split("-").map(Number);

  const start = new Date(year, month - 1, 1); // start of month
  const end = new Date(year, month, 0); // last day of month

  const today = new Date();
  // If selected month is current month → cap end date at today

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;

  const effectiveEnd = isCurrentMonth ? today : end;

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: effectiveEnd.toISOString().split("T")[0],
  };
};

const TrainingDashboard: React.FC = () => {
  const theme = useTheme();

  const today = new Date();
  const currentMonth = formatMonth(today);

  const [dateRange, setDateRange] = useState<string>(currentMonth);

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return {
      value: formatMonth(d), // "YYYY-MM"
      label: formatMonthLabel(d), // "Month YYYY"
    };
  });
  const handleDateChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
    const { startDate, endDate } = getDateRange(event.target.value);
    console.log("API range →", startDate, endDate);
  };

  const { startDate, endDate } = getDateRange(dateRange);

  // Fetch data using the provided query
  const { data, error, isLoading } = useDataQuery<TrainingRecord>({
    apiEndPoint: `https://api.techbee.et/api/hr/trainingProgramPlans/dashboard?from=${encodeURIComponent(
      startDate
    )}&to=${encodeURIComponent(endDate)}`,
  });

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading training dashboard data
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ width: "100%", p: 4 }}>
        <Typography variant="h6">No training data available</Typography>
      </Box>
    );
  }

  const trainingData = data as unknown as TrainingRecord;
  const summary = trainingData.summary;

  // Prepare data for charts
  const programTypeData = summary?.programs?.byType;
  const enrollmentStatusData = [
    { name: "Attended", value: summary?.enrollments?.attended },
    {
      name: "Not Attended",
      value: summary?.enrollments?.total - summary?.enrollments?.attended,
    },
  ];

  const planStatusData = summary?.plans.byApproval;

  // Colors for charts
  const PROGRAM_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const ENROLLMENT_COLORS = ["#00C49F", "#FF8042"];
  const STATUS_COLORS = ["#FF8042", "#0088FE", "#00C49F"];

  // Calculate percentages for display
  const attendanceRate =
    summary?.enrollments?.total > 0
      ? (summary?.enrollments?.attended / summary?.enrollments?.total) * 100
      : 0;

  const completionRate =
    summary?.enrollments?.total > 0
      ? (summary?.enrollments?.completed / summary?.enrollments?.total) * 100
      : 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            Training Dashboard
          </Typography>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="date-range-label">Period</InputLabel>
            <Select
              labelId="date-range-label"
              value={dateRange}
              label="Period"
              onChange={handleDateChange}
            >
              {months.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      {/* Summary Cards */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          "& > *": {
            flex: "1 1 200px",
            minWidth: 0,
          },
        }}
      >
        <Card sx={{ bgcolor: "primary.main", color: "white" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <School />
              <Typography variant="h6">Training Plans</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {summary?.plans.total}
            </Typography>
            <Typography variant="body2">
              ${summary?.plans.estimatedBudget} budget
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Group />
              <Typography variant="h6">Enrollments</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {summary?.enrollments?.total}
            </Typography>
            <Typography variant="body2">
              {summary?.enrollments?.participants} participants
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "success.main", color: "white" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircle />
              <Typography variant="h6">Completion Rate</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {completionRate.toFixed(1)}%
            </Typography>
            <Typography variant="body2">
              {summary?.enrollments?.completed} completed
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: "info.main", color: "white" }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Assessment />
              <Typography variant="h6">Feedback Response</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {summary?.feedback.responseRatePct}%
            </Typography>
            <Typography variant="body2">
              {summary?.feedback.responses} responses
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Program Types */}
        {/* <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Program Types
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            {programTypeData && <PieChart>
              <Pie
                data={programTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                nameKey={"type"}
                fill="#8884d8"
                dataKey="count"
              >
                {programTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PROGRAM_COLORS[index % PROGRAM_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>}
          </ResponsiveContainer>
        </Paper> */}

        {/* Enrollment Status */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Enrollment Status
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            {enrollmentStatusData && (
              <BarChart data={enrollmentStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.primary.main} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Additional Metrics */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Plan Status */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Plan Status
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={planStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Attendance Progress */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Progress
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">Attendance Rate</Typography>
              <Typography variant="body2">
                {attendanceRate.toFixed(1)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={attendanceRate}
              sx={{ height: 10, borderRadius: 5 }}
              color={
                attendanceRate > 70
                  ? "success"
                  : attendanceRate > 40
                  ? "warning"
                  : "error"
              }
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">Completion Rate</Typography>
              <Typography variant="body2">
                {completionRate.toFixed(1)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{ height: 10, borderRadius: 5 }}
              color={
                completionRate > 70
                  ? "success"
                  : completionRate > 40
                  ? "warning"
                  : "error"
              }
            />
          </Box>

          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2">Feedback Response Rate</Typography>
              <Typography variant="body2">
                {summary?.feedback.responseRatePct}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={summary?.feedback.responseRatePct}
              sx={{ height: 10, borderRadius: 5 }}
              color={
                summary?.feedback.responseRatePct > 70
                  ? "success"
                  : summary?.feedback.responseRatePct > 40
                  ? "warning"
                  : "error"
              }
            />
          </Box>
        </Paper>
      </Box>

      {/* Session Details */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Session Summary */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Session Summary
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Schedule color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Sessions in Period"
                secondary={summary?.sessions.inWindow}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <TrendingUp color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Total Duration Hours"
                secondary={summary?.sessions.totalDurationHours}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Group color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Hours Attended"
                secondary={summary?.enrollments?.hoursAttended}
              />
            </ListItem>
          </List>
        </Paper>

        {/* Development Plans */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Development Plans
          </Typography>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <EmojiEvents sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h4">
              {summary?.development?.totalPlans}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Development Plans
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", flexWrap: "wrap" }}
          >
            {summary?.development?.byStatus.map((status, index) => (
              <Chip
                key={index}
                label={`${status.status}: ${status.count}`}
                color={
                  status.status === "Completed"
                    ? "success"
                    : status.status === "In Progress"
                    ? "warning"
                    : "default"
                }
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Upcoming Sessions */}
      {trainingData.upcoming.nextSessions.length > 0 && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Sessions
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Session</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainingData.upcoming.nextSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Typography variant="body2">{session.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {`${new Date(
                          session.startDate
                        ).toLocaleDateString()} to ${new Date(
                          session.endDate
                        ).toLocaleDateString()}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {session.trainer && session?.trainer.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {session?.trainer}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.location ? session?.location : "N/A"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Empty State for Upcoming Sessions */}
      {trainingData.upcoming.nextSessions.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 4 }}>
          <Schedule sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Upcoming Sessions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no training sessions scheduled for the selected period.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TrainingDashboard;
