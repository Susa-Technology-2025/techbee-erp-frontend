// pages/hr-hub.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  Money,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import Link from "next/link";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Helper function to format numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US");
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const HRHubDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPicker, setShowPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());

  const [queryParams, setQueryParams] = useState({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  });

  const { data, isLoading, isError } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/employees/hr-hub/dashboard?from=${encodeURIComponent(
      queryParams.from
    )}&to=${encodeURIComponent(queryParams.to)}`,
  });
  const handleApply = () => {
    setQueryParams({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    });
    setShowPicker(false);
  };
  if (!data || isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography>Loading HR Hub Data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", p: isMobile ? 1 : 3, minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)",
          color: "white",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              HR Hub Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Comprehensive overview of your HR operations
            </Typography>
          </Box>
          {!showPicker ? (
            <Chip
              clickable
              onClick={() => setShowPicker(true)}
              label={`${formatDate(data.window.from)} - ${formatDate(
                data.window.to
              )}`}
              variant="outlined"
              sx={{
                mt: isMobile ? 1 : 0,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                p: 1,
                borderRadius: 1,
              }}
            >
              <DatePicker
                label="From"
                value={fromDate}
                onChange={(newValue) => newValue && setFromDate(newValue)}
                sx={{ borderRadius: 1 }}
              />
              <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue) => newValue && setToDate(newValue)}
                sx={{ borderRadius: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleApply}
                sx={{
                  backgroundColor: "white",
                  color: "#4361ee",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowPicker(false)}
                sx={{ borderColor: "white", color: "white" }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Key Metrics Cards */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        {/* Employees Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#4361ee", mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Employees
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Workforce Overview
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#4361ee" }}
                >
                  {formatNumber(data.employees.total)}
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={2} gap={1}>
                  <Chip
                    label={`${data.employees.active} Active`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${data.employees.newHires} New Hires`}
                    color="info"
                    size="small"
                  />
                  <Chip
                    label={`${data.employees.onLeave} On Leave`}
                    color="warning"
                    size="small"
                  />
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/employees"
                variant="outlined"
                size="small"
                sx={{ mt: 7, alignSelf: "flex-start" }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Recruitment Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#7209b7", mr: 2 }}>
                  <WorkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Recruitment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Talent Acquisition
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#7209b7" }}
                >
                  {formatNumber(data.recruitment.openPositions)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Open Positions
                </Typography>
                <Box display="flex" flexWrap="wrap" mt={2} gap={1}>
                  <Chip
                    label={`${data.recruitment.activeCandidates} Candidates`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${data.recruitment.interviewsScheduled} Interviews`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/recruitment"
                variant="outlined"
                size="small"
                sx={{ mt: 7, alignSelf: "flex-start" }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Payroll Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#f72585", mr: 2 }}>
                  <Money />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Payroll
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compensation Management
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#f72585" }}
                >
                  ETB {formatNumber(data.payroll.net)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Net Payroll
                </Typography>
                <Box mt={2}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">Processed</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {data.payroll.processed}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="body2">Pending</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error">
                      {data.payroll.pending}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/payroll"
                variant="outlined"
                size="small"
                sx={{ mt: 7, alignSelf: "flex-start" }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Attendance Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(25% - 18px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#4cc9f0", mr: 2 }}>
                  <TimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Attendance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Workforce Presence
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#4cc9f0" }}
                >
                  {data.attendance.attendanceRate}%
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Attendance Rate
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Overtime Hours: {data.attendance.overtimeHours}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.attendance.attendanceRate}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mt: 1,
                      backgroundColor: "#e9ecef",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          data.attendance.attendanceRate > 80
                            ? "#4caf50"
                            : data.attendance.attendanceRate > 60
                            ? "#ff9800"
                            : "#f44336",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/attendance"
                variant="outlined"
                size="small"
                sx={{ mt: 2, alignSelf: "flex-start" }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Second Row Metrics */}
      <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
        {/* Performance Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(33.3% - 16px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#3a0ca3", mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Employee Evaluations
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                mt={2}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#3a0ca3" }}
                  >
                    {data.performance.submittedEvaluations}
                  </Typography>
                  <Typography variant="body2">Submitted</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#3a0ca3" }}
                  >
                    {data.performance.avgScore}/5
                  </Typography>
                  <Typography variant="body2">Avg Score</Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/performance"
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                fullWidth
              >
                Manage Evaluations
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Training Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(33.3% - 16px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#560bad", mr: 2 }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Training
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Development Programs
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                mt={2}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#560bad" }}
                  >
                    {data.training.completed}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#560bad" }}
                  >
                    {data.training.planned}
                  </Typography>
                  <Typography variant="body2">Planned</Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/training"
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                fullWidth
              >
                View Programs
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Leave Management Card */}
        <Box
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(33.3% - 16px)",
            },
          }}
        >
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "#4895ef", mr: 2 }}>
                  <EventIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    Leave Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time Off Requests
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                mt={2}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#4895ef" }}
                  >
                    {data.leave.pending}
                  </Typography>
                  <Typography variant="body2">Pending</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#4895ef" }}
                  >
                    {data.leave.approved}
                  </Typography>
                  <Typography variant="body2">Approved</Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/hr/leave"
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                fullWidth
              >
                Manage Requests
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions Section */}
      {/* <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button variant="contained" component={Link} href="/hr/employees/add">
            Add New Employee
          </Button>
          <Button variant="outlined" component={Link} href="/hr/recruitment/create">
            Create Job Posting
          </Button>
          <Button variant="outlined" component={Link} href="/hr/payroll/process">
            Process Payroll
          </Button>
          <Button variant="outlined" component={Link} href="/hr/reports">
            Generate Reports
          </Button>
        </Box>
      </Paper> */}

      {/* Notifications Section */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <NotificationsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Recent Activities & Notifications
          </Typography>
        </Box>
        <List>
          <ListItem>
            <ListItemIcon>
              <PeopleIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary={`${data.employees.newHires} new employees hired this period`}
              secondary="Click to review onboarding process"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <MoneyIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={`${data.payroll.pending} payroll items pending processing`}
              secondary="Needs attention before next pay cycle"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <EventIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary={`${data.leave.pending} leave requests awaiting approval`}
              secondary="Review and take action"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <WorkIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={`${data.recruitment.openPositions} positions currently open`}
              secondary="View recruitment pipeline"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default HRHubDashboard;
