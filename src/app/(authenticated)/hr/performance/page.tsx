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
} from "@mui/material";
import {
  LineChart,
  Line,
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
} from "recharts";
import { useGetPerformanceCycleDashboardQuery } from "../_queries/performanceReviews";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define types based on the provided data structure
interface Metrics {
  totalEmployees: number;
  totalCycles: number;
  totalPlans: number;
  totalEvaluations: number;
  avgScore: number;
  objectivesTotal: number;
  objectivesActive: number;
  goalsTotal: number;
  goalsCompleted: number;
  kpisTotal: number;
  incidents: number;
  disciplinaryActions: number;
  recognitions: number;
}

interface TrendData {
  date: string;
  plansStart: number;
  evalsSubmitted: number;
  goalsDue: number;
  incidents: number;
  actions: number;
  recognitions: number;
}

interface EmployeePerformance {
  employeeId: string;
  name: string;
  avgScore: number;
  completion: number;
  index: number;
}

interface Leaders {
  topPerformers: EmployeePerformance[];
  lowPerformers: EmployeePerformance[];
}

interface Employee {
  id: string;
  name: string;
  code: string;
  department: string | null;
}

interface SampleData {
  employee: Employee;
  evaluations: {
    count: number;
    avgScore: number;
  };
  goals: {
    total: number;
    completed: number;
    completionRatio: number;
  };
  incidents: number;
  disciplinaryActions: number;
  recognitions: number;
  perfIndex: number;
}

interface PerformanceReview {
  metrics: Metrics;
  trend: TrendData[];
  leaders: Leaders;
  sample: SampleData[];
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {`Date: ${label}`}
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
  const today = new Date(); // If selected month is current month → cap end date at today
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;
  const effectiveEnd = isCurrentMonth ? today : end;
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: effectiveEnd.toISOString().split("T")[0],
  };
};

const PerformanceDashboard: React.FC = () => {
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

  // Format dates for API call
  const handleDateChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
    const { startDate, endDate } = getDateRange(event.target.value);
    console.log("API range →", startDate, endDate);
  };

  const { startDate, endDate } = getDateRange(dateRange);

  console.log(
    "Encoded API URL →",
    `https://api.techbee.et/api/hr/performanceCycles/dashboard?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`
  );

  // Fetch data using the provided query
  const { data, error, isLoading } = useDataQuery<any>({
    apiEndPoint: `https://hr.api.techbee.et/api/performanceCycles/dashboard?startDate=${startDate}&endDate=${endDate}`,
  });

  // const handleDateChange = (event: SelectChangeEvent) => {
  //   setDateRange(event.target.value);
  // };

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
          Error loading dashboard data
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ width: "100%", p: 4 }}>
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  const performanceData = data as unknown as PerformanceReview;

  // Prepare data for charts
  const trendData = performanceData.trend;
  const metrics = performanceData.metrics;

  // Data for goals completion pie chart
  const goalsData = [
    { name: "Completed", value: metrics.goalsCompleted },
    { name: "Pending", value: metrics.goalsTotal - metrics.goalsCompleted },
  ];

  // Data for objectives status
  const objectivesData = [
    { name: "Active", value: metrics.objectivesActive },
    {
      name: "Inactive",
      value: metrics.objectivesTotal - metrics.objectivesActive,
    },
  ];

  // Colors for pie charts
  const GOALS_COLORS = ["#00C49F", "#FF8042"];
  const OBJECTIVES_COLORS = ["#0088FE", "#FFBB28"];

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: "100vh", position: "relative" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: theme.palette.backgroundSection.contrastText,
              fontWeight: "bold",
            }}
          >
            Performance Cycle Dashboard
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
            <Typography variant="h6" gutterBottom>
              Total Employees
            </Typography>
            <Typography variant="h4">{metrics.totalEmployees}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "secondary.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Cycles
            </Typography>
            <Typography variant="h4">{metrics.totalCycles}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "success.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Avg. Score
            </Typography>
            <Typography variant="h4">{metrics.avgScore.toFixed(1)}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: "info.main", color: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recognitions
            </Typography>
            <Typography variant="h4">{metrics.recognitions}</Typography>
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
        {/* Trend Chart */}
        <Paper sx={{ p: 2, flex: { md: 2 } }}>
          <Typography variant="h6" gutterBottom>
            Performance Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => {
                  const day = new Date(value).getDate();
                  return day.toString().padStart(2, "0");
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="evalsSubmitted"
                stroke={theme.palette.primary.main}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="goalsDue"
                stroke={theme.palette.secondary.main}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        {/* Goals Completion */}
        <Paper sx={{ p: 2, flex: { md: 1 } }}>
          <Typography variant="h6" gutterBottom>
            Goals Completion
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={goalsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {goalsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GOALS_COLORS[index % GOALS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
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
        {/* Objectives Status */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Objectives Status
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={objectivesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Incidents & Actions */}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Incidents & Actions
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Incidents", value: metrics.incidents },
                {
                  name: "Disciplinary Actions",
                  value: metrics.disciplinaryActions,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.palette.error.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Low Performers */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Low Performers
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Average Score</TableCell>
                <TableCell>Completion</TableCell>
                <TableCell>Performance Index</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performanceData.leaders.lowPerformers.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {employee.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{employee.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{employee.avgScore.toFixed(1)}</TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={employee.completion}
                      sx={{ width: "80%" }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {employee.completion}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.index}
                      color={employee.index < 50 ? "error" : "warning"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Sample Employee Data */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Employee Performance Overview
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Evaluations</TableCell>
                <TableCell>Goals Completion</TableCell>
                <TableCell>Incidents</TableCell>
                <TableCell>Recognitions</TableCell>
                <TableCell>Perf. Index</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performanceData.sample.slice(0, 5).map((employee) => (
                <TableRow key={employee.employee.id}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {employee.employee.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {employee.employee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {employee.employee.department || "No department"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.evaluations.count} (
                      {employee.evaluations.avgScore.toFixed(1)})
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={employee.goals.completionRatio}
                        />
                      </Box>
                      <Typography variant="body2">
                        {employee.goals.completed}/{employee.goals.total}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.incidents}
                      color={employee.incidents > 0 ? "error" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.recognitions}
                      color={employee.recognitions > 0 ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.perfIndex}
                      color={
                        employee.perfIndex >= 80
                          ? "success"
                          : employee.perfIndex >= 50
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PerformanceDashboard;
