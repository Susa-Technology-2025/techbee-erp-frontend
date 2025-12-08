// pages/index.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Divider,
  Avatar,
  alpha,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Person as PersonIcon,
  Event as EventIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  Group as GroupIcon,
  TransferWithinAStation as TransferIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  EmojiEvents as AwardsIcon,
  Gavel as GavelIcon,
  LocationOn as LocationIcon,
  CorporateFare as DepartmentIcon,
  WorkOutline as TitleIcon,
  Grade as GradeIcon,
  MoneyOffCsred,
  Payment,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import Link from "next/link";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store"; // Helper function to format dates

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

// Color palette for charts
const COLORS = [
  "#4361ee",
  "#4cc9f0",
  "#4895ef",
  "#560bad",
  "#f72585",
  "#7209b7",
  "#3a0ca3",
];

const HRAnalyticsDashboard: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPicker, setShowPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());

  const [queryParams, setQueryParams] = useState({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  });
  const {
    user: { id: userId },
  } = useSelector((state: RootState) => state.session);

  const { data, isLoading } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/employees/dashboard?from=${encodeURIComponent(
      queryParams.from
    )}&to=${encodeURIComponent(queryParams.to)}`,
    enabled: Boolean(userId),
  });

  const handleApply = () => {
    setQueryParams({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    });
    setShowPicker(false);
  };

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  // Prepare data for charts
  const statusChartData = data.distributions.byStatus.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const employmentTermChartData = data.distributions.byEmploymentTerm.map(
    (item) => ({
      name: item.employmentTerm || "Not Specified",
      value: item.count,
    })
  );

  const departmentChartData = data.distributions.byDepartment
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.orgNode ? item.orgNode.name : "Not Assigned",
      employees: item.count,
    }));

  const leaveChartData = data.leave.utilization.map((item) => ({
    name: item.name,
    used: item.used,
    allocated: item.allocated,
    remaining: item.remaining,
  }));

  const titleChartData = data.distributions.byTitle
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.title.name,
      employees: item.count,
    }));

  const gradeChartData = data.distributions.byGrade
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.grade.name,
      employees: item.count,
    }));

  const locationChartData = data.distributions.byLocation
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.city || "Unknown",
      employees: item.count,
    }));

  // Calculate data quality percentages
  const totalEmployees = data.summary.total;
  const dataQualityItems = [
    { name: "Missing Email", count: data.dataQuality.missingEmail },
    { name: "Missing Phone", count: data.dataQuality.missingPhone },
    { name: "Missing TIN", count: data.dataQuality.missingTIN },
    { name: "No Manager Assigned", count: data.dataQuality.orphanNoManager },
    { name: "No Position Assigned", count: data.dataQuality.orphanNoPosition },
  ];

  return (
    <Box sx={{ p: isMobile ? 1 : 3, minHeight: "100vh", position: "relative" }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            HR Analytics Dashboard
          </Typography>
          {!showPicker ? (
            <Chip
              clickable
              onClick={() => setShowPicker(true)}
              label={
                data
                  ? `${formatDate(data.window.from)} - ${formatDate(
                      data.window.to
                    )}`
                  : "Select date range"
              }
              variant="outlined"
              sx={{ mt: isMobile ? 1 : 0 }}
            />
          ) : (
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => newValue && setFromDate(newValue)}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => newValue && setToDate(newValue)}
              />
              <Button variant="contained" size="small" onClick={handleApply}>
                Apply
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowPicker(false)}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        {/* Total Employees */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Employees
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {formatNumber(data.summary.total)}
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <TrendingUpIcon
                  color="success"
                  sx={{ fontSize: 20, mr: 0.5 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {data.summary.newHires} new hire
                  {data.summary.newHires !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Active Employees */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Active Employees
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {formatNumber(data.summary.active)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {data.summary.onLeave} on leave • {data.summary.onProbation} on
                probation
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Attendance & Overtime */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Attendance
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {data.summary.attendanceRate}%
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <WorkIcon color="info" sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {data.summary.overtimeHours} overtime hours
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Payroll Summary */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Payment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Payroll Summary
                </Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                Gross: ETB {formatNumber(data.summary.payroll.gross)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Net: ETB {formatNumber(data.summary.payroll.net)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.summary.payroll.periods} periods
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Distribution Charts Section */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        {/* Employee Status Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Employee Distribution by Status
              </Typography>
              <Button component={Link} href="/hr/employees/employees">
                see Employee list
              </Button>
            </Box>
            {statusChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        (percent ?? 0) < 0.05
                          ? null
                          : `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  mt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {statusChartData.map((entry, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: "2px",
                        }}
                      />
                      <Typography variant="body2">
                        {entry.name}: {formatNumber(entry.value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No status distribution data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Employment Term Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Employee Distribution by Employment Term
              </Typography>
              <Button component={Link} href="/hr/employees/employees">
                see Employee list
              </Button>
            </Box>
            {employmentTermChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={employmentTermChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {employmentTermChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatNumber(Number(value))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  mt={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {employmentTermChartData.map((entry, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: "2px",
                        }}
                      />
                      <Typography variant="body2">
                        {entry.name}: {formatNumber(entry.value)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No employment term data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Department Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Employee Distribution by Department
              </Typography>
              <Button component={Link} href="/hr/employees/employees">
                see Employee list
              </Button>
            </Box>
            {departmentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="employees" fill="#4361ee" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No department distribution data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Leave Utilization Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Leave Utilization
            </Typography>
            {leaveChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leaveChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="used" fill="#f72585" name="Used" />
                  <Bar dataKey="allocated" fill="#4cc9f0" name="Allocated" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No leave utilization data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Title Distribution Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Employee Distribution by Title
            </Typography>
            {titleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={titleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="employees" fill="#7209b7" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No title distribution data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Grade Distribution Chart */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Employee Distribution by Grade
            </Typography>
            {gradeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="employees" fill="#3a0ca3" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No grade distribution data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* People Operations Section */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              People Operations
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
              <Card variant="outlined" sx={{ p: 2, minWidth: 120, flex: 1 }}>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {data.peopleOps.performance.reviews}
                  </Typography>
                </Box>
                <Typography variant="body2">Performance Reviews</Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Score: {data.peopleOps.performance.avgScore}
                </Typography>
              </Card>

              <Card variant="outlined" sx={{ p: 2, minWidth: 120, flex: 1 }}>
                <Box display="flex" alignItems="center">
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {data.peopleOps.trainingCompleted}
                  </Typography>
                </Box>
                <Typography variant="body2">Trainings Completed</Typography>
              </Card>

              <Card variant="outlined" sx={{ p: 2, minWidth: 120, flex: 1 }}>
                <Box display="flex" alignItems="center">
                  <GavelIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {data.peopleOps.disciplinaryActions}
                  </Typography>
                </Box>
                <Typography variant="body2">Disciplinary Actions</Typography>
              </Card>

              <Card variant="outlined" sx={{ p: 2, minWidth: 120, flex: 1 }}>
                <Box display="flex" alignItems="center">
                  <AwardsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    {data.peopleOps.recognitions}
                  </Typography>
                </Box>
                <Typography variant="body2">Recognitions</Typography>
              </Card>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Benefits Enrollment
            </Typography>
            {data.peopleOps.benefitsEnrollment.length > 0 ? (
              <List dense>
                {data.peopleOps.benefitsEnrollment.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit.name}
                      secondary={`${benefit.count} enrolled • ${benefit.typeField}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No benefits enrollment data available
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Loans Outstanding
            </Typography>
            <Typography variant="body2">
              Total: ${formatNumber(data.peopleOps.loansOutstanding)}
            </Typography>
          </Paper>
        </Box>

        {/* Workforce Analytics */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Workforce Analytics
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Card
                variant="outlined"
                sx={{ p: 2, textAlign: "center", flex: 1 }}
              >
                <Typography variant="h4" color="primary">
                  {(data.workforceAnalytics.turnoverRate * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2">Turnover Rate</Typography>
              </Card>
              <Card
                variant="outlined"
                sx={{ p: 2, textAlign: "center", flex: 1 }}
              >
                <Typography variant="h4" color="primary">
                  {(data.workforceAnalytics.promotionRate * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2">Promotion Rate</Typography>
              </Card>
              <Card
                variant="outlined"
                sx={{ p: 2, textAlign: "center", flex: 1 }}
              >
                <Typography variant="h4" color="primary">
                  {data.workforceAnalytics.femaleRatio}%
                </Typography>
                <Typography variant="body2">Female Ratio</Typography>
              </Card>
              <Card
                variant="outlined"
                sx={{ p: 2, textAlign: "center", flex: 1 }}
              >
                <Typography variant="h4" color="primary">
                  {data.workforceAnalytics.avgTenureYears}y
                </Typography>
                <Typography variant="body2">Avg. Tenure</Typography>
              </Card>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Leave Summary
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" color="primary">
                  {data.leave.planned}
                </Typography>
                <Typography variant="body2">Planned Leave</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" color="primary">
                  {data.leave.pending}
                </Typography>
                <Typography variant="body2">Pending Requests</Typography>
              </Card>
              <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6" color="primary">
                  {data.leave.sick}
                </Typography>
                <Typography variant="body2">Sick Leave</Typography>
              </Card>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Recent Activity and Alerts */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {data.recentActivity && data.recentActivity.length > 0 ? (
              <List>
                {data.recentActivity.slice(0, 5).map((activity, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {activity.type.includes("Promotion") ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TransferIcon color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {activity.subtitle}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(activity.when)} • {activity.type}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h6" component="div">
                Alerts
              </Typography>
              <Chip
                label={
                  data.alerts.contractsExpiringSoon.length +
                  data.alerts.probationEndingSoon.length +
                  (data.alerts.terminationsRecent
                    ? data.alerts.terminationsRecent.length
                    : 0)
                }
                color="error"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>

            {data.alerts.contractsExpiringSoon.length === 0 &&
            data.alerts.probationEndingSoon.length === 0 &&
            (!data.alerts.terminationsRecent ||
              data.alerts.terminationsRecent.length === 0) ? (
              <Typography variant="body2" color="text.secondary">
                No alerts at this time
              </Typography>
            ) : (
              <>
                {/* Contracts Expiring */}

                {/* Contract Expiring */}
                {data.alerts.contractsExpiringSoon.map((alert, index) => (
                  <Box
                    key={`contract-${index}`}
                    mb={2}
                    p={2}
                    bgcolor={
                      isDark
                        ? alpha(theme.palette.warning.main, 0.2)
                        : "#fff3e0"
                    }
                    borderRadius={1}
                  >
                    <Box display="flex" alignItems="center">
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Contract Expiring: {alert.employee.firstName}{" "}
                        {alert.employee.fatherName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Ends on {formatDate(alert.endDate)} •{" "}
                      {alert.salaryStructure.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Employee Code: {alert.employee.employeeCode || "N/A"}
                    </Typography>
                  </Box>
                ))}

                {/* Probation Ending */}
                {data.alerts.probationEndingSoon.map((alert, index) => (
                  <Box
                    key={`probation-${index}`}
                    mb={2}
                    p={2}
                    bgcolor={
                      isDark
                        ? alpha(theme.palette.success.main, 0.2)
                        : "#e8f5e9"
                    }
                    borderRadius={1}
                  >
                    <Box display="flex" alignItems="center">
                      <EventIcon color="info" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Probation Ending: {alert.firstName} {alert.fatherName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Ends on {formatDate(alert.probationEndDate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Employee Code: {alert.employeeCode || "N/A"}
                    </Typography>
                  </Box>
                ))}

                {/* Recent Terminations */}
                {data.alerts.terminationsRecent &&
                  data.alerts.terminationsRecent.map((termination, index) => (
                    <Box
                      key={`termination-${index}`}
                      mb={2}
                      p={2}
                      bgcolor="#ffebee"
                      borderRadius={1}
                    >
                      <Box display="flex" alignItems="center">
                        <WarningIcon color="error" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">
                          Recent Termination
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Date: {formatDate(termination.terminationDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reason: {termination.reason || "Not specified"}
                      </Typography>
                    </Box>
                  ))}
              </>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Data Quality and Manager Span */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Data Quality Issues
            </Typography>
            {dataQualityItems.map((item, index) => {
              const percentage =
                totalEmployees > 0 ? (item.count / totalEmployees) * 100 : 0;
              return (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2">
                      {formatNumber(item.count)} ({percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mt: 1,
                      backgroundColor: "#e9ecef",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          percentage > 50 ? "#f72585" : "#4361ee",
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Paper>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manager Span of Control
            </Typography>
            {data.managersTopSpan.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Manager</TableCell>
                      <TableCell>Employee Code</TableCell>
                      <TableCell align="right">Span</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.managersTopSpan.map((manager, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {manager.manager.firstName}{" "}
                          {manager.manager.fatherName}
                        </TableCell>
                        <TableCell>
                          {manager.manager.employeeCode || "N/A"}
                        </TableCell>
                        <TableCell align="right">{manager.span}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No manager span data available
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Location Distribution */}
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employee Distribution by Location
          </Typography>
          {locationChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="employees" fill="#560bad" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box
              sx={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No location distribution data available
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default HRAnalyticsDashboard;
