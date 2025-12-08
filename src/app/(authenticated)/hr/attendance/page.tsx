// pages/index.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Stack,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Select,
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
import { useGetAttendanceDashBoardStatQuery } from "../_queries/attendances";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define TypeScript interfaces
interface Employee {
  id: string;
  name: string;
  code: string;
  department: string | null;
  shiftCode: string | null;
}

interface SampleData {
  employee: Employee;
  workedHours: number;
  otHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  presentDays: number;
}

interface TrendData {
  date: string;
  present: number;
  absent: number;
  onLeave: number;
  weekend: number;
  holiday: number;
  avgWorkedHours: number;
}

interface Leaders {
  topLate: any[];
  topEarlyLeave: any[];
}

interface Metrics {
  totalEmployees: number;
  totalEmployeeDays: number;
  presentDays: number;
  absentDays: number;
  onLeaveDays: number;
  weekendDays: number;
  holidayDays: number;
  lateCount: number;
  earlyLeaveCount: number;
  avgWorkedHours: number;
  avgOtHours: number;
}

interface DashboardData {
  metrics: Metrics;
  trend: TrendData[];
  leaders: Leaders;
  sample: SampleData[];
}

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

// Dashboard Component
export default function Dashboard() {
  const today = new Date();

  const currentMonth = formatMonth(today);

  // Decide end date: if today is before end of month → use today, else use endOfMonth

  const [dateRange, setDateRange] = useState<string>(currentMonth);

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    return {
      value: formatMonth(d), // "YYYY-MM"
      label: formatMonthLabel(d), // "Month YYYY"
    };
  });
  // Format dates for API call
  // const startDate = `${dateRange}-01`;
  // const endDate = `${dateRange}-31`;

  const handleDateChange = (event: SelectChangeEvent) => {
    setDateRange(event.target.value);
    const { startDate, endDate } = getDateRange(event.target.value);
    console.log("API range →", startDate, endDate);
  };

  const { startDate, endDate } = getDateRange(dateRange);

  // Example date range - you can make this dynamic later
  const { data, error, isLoading } = useDataQuery<any>({
    apiEndPoint: `https://hr.api.techbee.et/api/attendances/dashboard?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isLoading) {
    return (
      <Typography sx={{ position: "relative" }}>
        Loading dashboard...
      </Typography>
    );
  }

  if (error || !data) {
    return (
      <Typography sx={{ position: "relative" }} color="error">
        Failed to load dashboard data
      </Typography>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Prepare data for pie chart
  const pieChartData = [
    { name: "Present", value: data.metrics.presentDays, color: "#4caf50" },
    { name: "Absent", value: data.metrics.absentDays, color: "#f44336" },
    { name: "On Leave", value: data.metrics.onLeaveDays, color: "#2196f3" },
    { name: "Weekend", value: data.metrics.weekendDays, color: "#ff9800" },
    { name: "Holiday", value: data.metrics.holidayDays, color: "#9c27b0" },
  ];

  // Prepare trend data for charts
  const trendData = data.trend.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  // Metric Card Component
  const MetricCard = ({
    title,
    value,
    unit,
    color,
  }: {
    title: string;
    value: number | string;
    unit?: string;
    color?: string;
  }) => (
    <Card
      sx={{
        minWidth: 150,
        flex: 1,
        m: 1,
        bgcolor: color || "background.paper",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" component="div">
          {value} {unit}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2, minHeight: "100vh", position: "relative" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Employee Attendance Dashboard
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
      {/* Metrics Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <MetricCard
          title="Total Employees"
          value={data.metrics.totalEmployees}
        />
        <MetricCard
          title="Total Employee Days"
          value={data.metrics.totalEmployeeDays}
        />
        <MetricCard title="Present Days" value={data.metrics.presentDays} />
        <MetricCard title="Absent Days" value={data.metrics.absentDays} />
        <MetricCard
          title="On Leave Days"
          value={data.metrics.onLeaveDays || "No Data"}
        />
        <MetricCard
          title="Weekend Days"
          value={data.metrics.weekendDays || "No Data"}
        />
        <MetricCard
          title="Holiday Days"
          value={data.metrics.holidayDays || "No Data"}
        />
        <MetricCard
          title="Late Count"
          value={data.metrics.lateCount || "No Data"}
        />
        <MetricCard
          title="Early Leave Count"
          value={data.metrics.earlyLeaveCount || "No Data"}
        />
        <MetricCard
          title="Avg Worked Hours"
          value={data.metrics.avgWorkedHours.toFixed(2)}
          unit="hrs"
        />
        <MetricCard
          title="Avg OT Hours"
          value={data.metrics.avgOtHours.toFixed(2) || "No Data"}
          unit="hrs"
        />
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Attendance Trend Chart */}
        <Card sx={{ flex: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Trend
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
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#4caf50"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="#f44336"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="onLeave"
                stroke="#2196f3"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Attendance Distribution Pie Chart */}
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Box>

      {/* Employee Summary and Leaders Board */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        {/* Employee Summary Table */}
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employee Summary
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Worked Hours</TableCell>
                  <TableCell>OT Hours</TableCell>
                  <TableCell>Present Days</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.sample.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{employee.employee.name}</TableCell>
                    <TableCell>{employee.workedHours.toFixed(2)}</TableCell>
                    <TableCell>{employee.otHours.toFixed(2)}</TableCell>
                    <TableCell>{employee.presentDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Leaders Board */}
        <Card sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Leaders Board
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Top Late Arrivals
              </Typography>
              {data.leaders.topLate.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Late Minutes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.leaders.topLate.map((leader, index) => (
                        <TableRow key={index}>
                          <TableCell>{leader.name}</TableCell>
                          <TableCell>{leader.lateMinutes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  No late arrivals recorded
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Top Early Leavers
              </Typography>
              {data.leaders.topEarlyLeave.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Early Leave Minutes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.leaders.topEarlyLeave.map((leader, index) => (
                        <TableRow key={index}>
                          <TableCell>{leader.name}</TableCell>
                          <TableCell>{leader.earlyLeaveMinutes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  No early leavers recorded
                </Typography>
              )}
            </Box>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
