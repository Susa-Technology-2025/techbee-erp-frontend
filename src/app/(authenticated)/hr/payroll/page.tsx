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
  Chip,
  alpha,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { theme } from "@/theme";

const PayrollDashboard: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
  const [toDate, setToDate] = useState<Dayjs>(dayjs());
  const [queryParams, setQueryParams] = useState({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  });
  // This would come from your API hook
  const { data, isLoading } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/payrollBatches/dashboard?from=${encodeURIComponent(
      queryParams.from
    )}&to=${encodeURIComponent(queryParams.to)}`,
  });

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  const handleApply = () => {
    setQueryParams({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    });
    setShowPicker(false);
  };
  // Format date function
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Flatten summary data for cards
  const flattenSummary = (
    obj: Record<string, any>,
    parentKey = ""
  ): { title: string; value: any }[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const title = parentKey ? `${parentKey} → ${key}` : key;
      if (typeof value === "object" && value !== null) {
        return flattenSummary(value, key);
      }
      return {
        title: title
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        value,
      };
    });
  };

  const cards = flattenSummary(data.summary);

  // Calculate percentage for batch status
  const totalBatches = data.distributions.byBatchStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const batchStatusWithPercentage = data.distributions.byBatchStatus.map(
    (item) => ({
      ...item,
      percentage:
        totalBatches > 0 ? Math.round((item.count / totalBatches) * 100) : 0,
    })
  );

  // Colors for charts
  const COLORS = ["#4361ee", "#4cc9f0", "#3f37c9", "#2ecc71", "#f72585"];

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
        <Typography variant="h5" color="primary">
          Payroll Analytics Dashboard
        </Typography>
        {!showPicker ? (
          <Box
            bgcolor={alpha(theme.palette.primary.main, 0.1)}
            px={2}
            py={1}
            borderRadius={5}
            fontSize={14}
            onClick={() => setShowPicker(true)}
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
        {cards.map((item, i) => (
          <Card key={i} sx={{ flex: "1 1 280px", p: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {item.title}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {item.value}
            </Typography>
          </Card>
        ))}
      </Stack>

      {/* Charts and Tables */}
      <Stack gap={2}>
        {/* Batch Status & Monthly Trends */}
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Batch Status Distribution
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distributions.byBatchStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {data.distributions.byBatchStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Monthly Payroll Trends
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gross"
                    stroke="#4361ee"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#4cc9f0"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="batches"
                    stroke="#ee610fff"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="slipsFinalized"
                    stroke="#0c6410ff"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Stack>

        {/* Monthly Payroll Details Table */}
        {/* <Card sx={{ p: 2 }}>
          <Typography variant="body2" mb={2}>Monthly Payroll Details</Typography>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Batches</TableCell>
                <TableCell>Gross Pay</TableCell>
                <TableCell>Net Pay</TableCell>
                <TableCell>Finalized Slips</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.monthlyTrends.length > 0 ? (
                data.monthlyTrends.map((trend, index) => (
                  <TableRow key={index}>
                    <TableCell>{trend.month}</TableCell>
                    <TableCell>{trend.batches}</TableCell>
                    <TableCell>${trend.gross}</TableCell>
                    <TableCell>${trend.net}</TableCell>
                    <TableCell>{trend.slipsFinalized}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No monthly data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card> */}

        {/* Policy Info & Data Quality */}
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {/* <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>Policy Information</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={policyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3f37c9" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card> */}
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Staging Data
            </Typography>
            {data.staging.byStatus.length > 0 ? (
              <Table component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.staging.byStatus.map((status, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box
                          component="span"
                          bgcolor="#fff3cd"
                          px={1.5}
                          py={0.5}
                          borderRadius={5}
                        >
                          {status.status}
                        </Box>
                      </TableCell>
                      <TableCell>{status.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box p={3} textAlign="center" color="gray">
                <Typography>No staging data available</Typography>
              </Box>
            )}
          </Card>
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Anomalies
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {Object.entries(data.anomalies).map(([key, value]) => (
                <Paper
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: 1,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize", fontWeight: 500 }}
                  >
                    {key.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {value}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Card>
        </Stack>

        {/* Distribution Details */}
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {/* Batch Status Details */}
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Batch Status Details
            </Typography>
            <Table component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Count</TableCell>
                  <TableCell>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchStatusWithPercentage.length > 0 ? (
                  batchStatusWithPercentage.map((status, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box
                          component="span"
                          bgcolor={alpha(theme.palette.success.main, 0.2)}
                          px={1.5}
                          py={0.5}
                          borderRadius={5}
                        >
                          {status.status}
                        </Box>
                      </TableCell>
                      <TableCell>{status.count}</TableCell>
                      <TableCell>{status.percentage}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No batch status data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Slip Status Details */}
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Slip Status Details
            </Typography>
            {data.distributions.bySlipStatus.length > 0 ? (
              <Table component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.distributions.bySlipStatus.map((status, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box
                          component="span"
                          bgcolor={alpha(theme.palette.success.main, 0.2)}
                          px={1.5}
                          py={0.5}
                          borderRadius={5}
                        >
                          {status.status}
                        </Box>
                      </TableCell>
                      <TableCell>{status.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box p={3} textAlign="center" color="gray">
                <Typography>No slip status data available</Typography>
              </Box>
            )}
          </Card>
        </Stack>

        {/* Additional Distribution Details */}
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {/* Rule Category Details */}
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Rule Category Distribution
            </Typography>
            {data.distributions.byRuleCategory.length > 0 ? (
              <Table component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.distributions.byRuleCategory.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell>{category.code}</TableCell>
                      <TableCell align="right">
                        {category.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isDeduction ? "Deduction" : "Earning"}
                          color={category.isDeduction ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box p={3} textAlign="center" color="gray">
                <Typography>No rule category data available</Typography>
              </Box>
            )}
          </Card>

          {/* Input Code Details */}
          <Card sx={{ flex: "1 1 500px", p: 2 }}>
            <Typography variant="body2" mb={2}>
              Input Code Distribution
            </Typography>
            {data.distributions.byInputCode.length > 0 ? (
              <Table component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Input Code</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.distributions.byInputCode.map((input, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box
                          component="span"
                          bgcolor="#cce5ff"
                          px={1.5}
                          py={0.5}
                          borderRadius={5}
                        >
                          {input.status}
                        </Box>
                      </TableCell>
                      <TableCell>{input.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Box p={3} textAlign="center" color="gray">
                <Typography>No input code data available</Typography>
              </Box>
            )}
          </Card>
        </Stack>

        {/* Cost Center Details */}
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" mb={2}>
            Cost Center Distribution
          </Typography>
          {data.distributions.byCostCenter.length > 0 ? (
            <Table component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Cost Center ID</TableCell>
                  <TableCell align="right">Employee Count</TableCell>
                  <TableCell align="right">Gross</TableCell>
                  <TableCell align="right">Net</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.distributions.byCostCenter.map((center, index) => (
                  <TableRow key={index}>
                    {/* <TableCell>{center.organizationNodeId}</TableCell> */}
                    <TableCell>{"Organization"}</TableCell>
                    <TableCell align="right">{center.count}</TableCell>
                    <TableCell align="right">
                      {center.gross.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      {center.net.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box p={3} textAlign="center" color="gray">
              <Typography>No cost center data available</Typography>
            </Box>
          )}
        </Card>

        {/* Staging Data */}

        {/* Top Payslips Empty State */}
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" mb={2}>
            Open Payslips
          </Typography>
          {data.openPayslipsTop.length > 0 ? (
            <Table component={Paper}>
              <TableHead>
                <TableRow>
                  <TableCell>Payslip ID</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.openPayslipsTop.map((payslip, index) => (
                  <TableRow key={index}>
                    <TableCell>{payslip.payslipId || "Payslip ID"}</TableCell>
                    <TableCell>
                      {payslip.employeeName || "No name available"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payslip.status}
                        color={
                          payslip.status === "Draft" ? "warning" : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {payslip.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card sx={{ p: 3, textAlign: "center", color: "gray" }}>
              <Typography fontSize={48}>💼</Typography>
              <Typography>
                No finalized payslips available for display
              </Typography>
            </Card>
          )}
        </Card>
      </Stack>
    </Box>
  );
};

export default PayrollDashboard;
