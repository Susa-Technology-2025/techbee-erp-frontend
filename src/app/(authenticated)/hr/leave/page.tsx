"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useGetLeavegeManagementDashboardQuery } from "../_queries/leaveRequests";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define TypeScript interfaces for the data
interface WindowData {
  from: string;
  to: string;
}

interface LeaveBalance {
  leaveTypeId: string;
  name: string;
  isPaid: boolean;
  opening: number;
  carryForward: number;
  taken: number;
  current: number;
  entitled: number;
  utilizationPct: number;
}

interface LeaveSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  onLeaveNow: number;
}

interface LeaveDashboardData {
  window: WindowData;
  summary: LeaveSummary;
  balances: {
    byType: LeaveBalance[];
  };
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LeaveManagementDashboard: React.FC = () => {
  // This would come from your API hook
  const [showPicker, setShowPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());

  const [queryParams, setQueryParams] = useState({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  });

  const { data, isLoading } = useDataQuery<LeaveDashboardData>({
    apiEndPoint: `https://api.techbee.et/api/hr/leaveRequests/dashboard?from=${encodeURIComponent(
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
    return <div>Loading...</div>;
  }

  // Format date function
  // const formatDate = (dateString: string) => {
  //   return format(new Date(dateString), "MMM dd, yyyy");
  // };

  // Prepare request status data for chart
  const requestStatusData = [
    { name: "Pending", value: data.summary.pendingRequests },
    { name: "Approved", value: data.summary.approvedRequests },
    { name: "Rejected", value: data.summary.rejectedRequests },
  ];

  // Prepare leave balance data for chart
  const leaveBalanceData = data.balances.byType.map((balance) => ({
    name: balance.name,
    current: balance.current,
    entitled: balance.entitled,
  }));

  // Colors for charts
  const COLORS = ["#ff9e00", "#4cc9f0", "#f72585", "#4361ee", "#3f37c9"];

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Requests",
      value: data.summary.totalRequests,
      icon: "📄",
      color: "#4361ee",
    },
    {
      title: "Pending Requests",
      value: data.summary.pendingRequests,
      icon: "⏳",
      color: "#ff9e00",
    },
    {
      title: "Approved Requests",
      value: data.summary.approvedRequests,
      icon: "✅",
      color: "#4cc9f0",
    },
    {
      title: "Rejected Requests",
      value: data.summary.rejectedRequests,
      icon: "❌",
      color: "#f72585",
    },
    {
      title: "On Leave Now",
      value: data.summary.onLeaveNow,
      icon: "🏖️",
      color: "#3f37c9",
    },
  ];

  return (
    <Box p={3} minHeight="100vh" position="relative">
      {/* Header */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          color="primary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <span>📅</span> Leave Management Dashboard
        </Typography>
        {!showPicker ? (
          <Box
            onClick={() => setShowPicker(true)}
            bgcolor="#f8f9fa3a"
            px={2}
            py={1}
            borderRadius={5}
            fontSize={14}
            sx={{ cursor: "pointer" }}
          >
            {formatDate(data.window.from)} - {formatDate(data.window.to)}
          </Box>
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
      </Card>

      {/* Summary Cards */}
      <Stack direction="row" flexWrap="wrap" gap={2} mb={3}>
        {summaryCards.map((card, i) => (
          <Card
            key={i}
            sx={{
              flex: "1 1 220px",
              p: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                bgcolor: card.color,
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              mb={1}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <span>{card.icon}</span> {card.title}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {card.value}
            </Typography>
          </Card>
        ))}
      </Stack>

      {/* Charts Section */}
      <Stack direction="row" flexWrap="wrap" gap={2} mb={3}>
        {/* Request Status Chart */}
        <Card sx={{ flex: "1 1 500px", p: 2 }}>
          <Typography
            variant="body2"
            mb={2}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span>📊</span> Leave Request Status
          </Typography>
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) =>
                    (value ?? 0) < 0.05 ? null : `${name}: ${value}`
                  }
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Leave Balance Chart */}
        <Card sx={{ flex: "1 1 500px", p: 2 }}>
          <Typography
            variant="body2"
            mb={2}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <span>⚖️</span> Leave Balances
          </Typography>
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveBalanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#4361ee" name="Current Balance" />
                <Bar dataKey="entitled" fill="#3f37c9" name="Entitled" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Stack>

      {/* Leave Balance Details Table */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Typography
          variant="body2"
          mb={2}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <span>📋</span> Leave Balance Details
        </Typography>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Leave Type</TableCell>
              <TableCell>Opening Balance</TableCell>
              <TableCell>Carry Forward</TableCell>
              <TableCell>Taken</TableCell>
              <TableCell>Current Balance</TableCell>
              <TableCell>Entitled</TableCell>
              <TableCell>Utilization</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.balances.byType.length > 0 ? (
              data.balances.byType.map((balance, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box
                      component="span"
                      bgcolor="#e2e3e5"
                      px={1.5}
                      py={0.5}
                      borderRadius={5}
                    >
                      {balance.name} {balance.isPaid ? "💰" : "❌"}
                    </Box>
                  </TableCell>
                  <TableCell>{balance.opening}</TableCell>
                  <TableCell>{balance.carryForward}</TableCell>
                  <TableCell>{balance.taken}</TableCell>
                  <TableCell>
                    <Box
                      fontWeight="bold"
                      color={
                        balance.current > 0 ? "success.main" : "error.main"
                      }
                    >
                      {balance.current}
                    </Box>
                  </TableCell>
                  <TableCell>{balance.entitled}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {balance.utilizationPct}%
                      </Typography>
                      <Box
                        width="100%"
                        height={8}
                        bgcolor="#e9ecef"
                        borderRadius={4}
                        overflow="hidden"
                        mt={0.5}
                      >
                        <Box
                          width={`${balance.utilizationPct}%`}
                          height="100%"
                          bgcolor={
                            balance.utilizationPct < 50
                              ? "#4cc9f0"
                              : balance.utilizationPct < 80
                              ? "#ff9e00"
                              : "#f72585"
                          }
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No leave balance data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Recent Leave Requests */}
      <Card sx={{ p: 3, textAlign: "center", color: "gray" }}>
        <Typography fontSize={48}>📥</Typography>
        <Typography>No recent leave requests to display</Typography>
      </Card>
    </Box>
  );
};

export default LeaveManagementDashboard;
