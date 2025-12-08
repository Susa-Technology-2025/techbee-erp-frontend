"use client";
import React, { useState, useMemo, useEffect, SyntheticEvent } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Portal,
  Snackbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  VerifiedOutlined,
} from "@mui/icons-material";
import { useGetPayslipsByBatchIdQuery } from "@/app/(authenticated)/hr/_queries/payslips";
import { Payslip } from "@/app/(authenticated)/hr/_schemas/payslips";
import { createFetch } from "next/dist/client/components/router-reducer/fetch-server-response";
import { useVerifyPayrollbatchesMutation } from "../../_queries/payrollBatches";
import { Verify } from "crypto";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";

interface PayslipData {
  id: string;
  name: string;
  employeeId: string;
  employeeCode: string;
  tinNumber: string;
  contractId: string;
  baseSalary: number;
  contractStartDate: string;
  contractEndDate: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: string;
  periodStart: string;
  periodEnd: string;
  currency: string | null;
  analyticAccountId: string | null;
  approvedByFinance: boolean;
  approvedByHr: boolean;
  approvedByManager: boolean;
  journalEntryCode: string | null;
  journalEntryId: string | null;
  organizationNodeId: string | null;
  components: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    amount: number;
    code: string;
    salaryRuleId: string;
  }>;
}

interface PayslipsByBatchIdModalProps {
  open: boolean;
  onClose: () => void;
  batchId: string;
  batchName: string;
  batchStatus: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return { bg: "#fef3c7", color: "#92400e" };
    case "approved":
      return { bg: "#d1fae5", color: "#065f46" };
    case "pending":
      return { bg: "#bfdbfe", color: "#1e40af" };
    default:
      return { bg: "#f3f4f6", color: "#374151" };
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "tax":
      return { bg: "#fee2e2", color: "#b91c1c" };
    case "pension":
      return { bg: "#dcfce7", color: "#166534" };
    case "basic salary":
      return { bg: "#e0e7ff", color: "#3730a3" };
    default:
      return { bg: "#e0e7ff", color: "#4f46e5" };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
  }).format(amount);
};
export default function PayslipsByBatchIdModal({
  open,
  onClose,
  batchId,
  batchName,
  batchStatus,
}: PayslipsByBatchIdModalProps) {
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);

  // Fetch real payslip data using custom hook
  const {
    data: payslipsResponse = {},
    isLoading,
    isError,
    error,
  } = useDataQuery<any>({
    apiEndPoint: `https://api.techbee.et/api/hr/payslips?where[payrollBatchId]=${batchId}`,
    enabled: !!(batchId && open),
    noFilter: true,
  });
  const payslips =
    payslipsResponse.data ||
    payslipsResponse.content ||
    payslipsResponse.items ||
    payslipsResponse.result ||
    [];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleCloseSnackbar = (
    event: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // At the top of the component
  const verifyPayrollBatchMutation = useDataMutation<{ success: boolean }, any>(
    {
      apiEndPoint: `https://api.techbee.et/api/hr/payrollBatches/${batchId}/verify`, // placeholder
      method: "POST",
      invalidateQueryKey: [
        "data",
        "https://api.techbee.et/api/hr/payrollBatches",
      ],
    }
  );

  // Function to call when user clicks verify         cmfqjyaa3000f8w6gdym1x07b
  const handleVerifyPayrollBatch = async (batchId: string) => {
    try {
      await verifyPayrollBatchMutation.mutateAsync({});

      setSnackbarMessage("Payroll batch verified successfully ✅");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (err: any) {
      console.error("Failed to verify payroll batch:", err);
      setSnackbarMessage(err?.message || "Failed to verify payroll batch ❌");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // useEffect(() => {
  //   setLoading(true);
  // }, [batchId, open, payslips]);

  // useEffect(() => {
  //   setLoading(false);
  // }, [payslips]);

  // Transform API data to match our interface
  const transformedPayslips: PayslipData[] = useMemo(() => {
    return payslips.map((payslip: any) => ({
      id: payslip.id,
      name:
        `${payslip.employee?.firstName || ""} ${
          payslip.employee?.lastName || ""
        }`.trim() || "Unknown Employee",
      employeeId: payslip?.employeeId || payslip.employee?.id || "N/A",
      employeeCode: payslip.employee?.employeeCode || "N/A",
      tinNumber: payslip.employee?.tinNumber || "N/A",
      contractId: payslip.contractId || "N/A",
      baseSalary: payslip.contract?.baseSalary || 0,
      contractStartDate: payslip.contract?.startDate || "N/A",
      contractEndDate: payslip.contract?.endDate || "N/A",
      grossPay: payslip.grossPay || 0,
      deductions: payslip.deductions || 0,
      netPay: payslip.netPay || 0,
      status: payslip.status || "Unknown",
      periodStart: payslip.periodStart || "N/A",
      periodEnd: payslip.periodEnd || "N/A",
      currency: payslip.currency,
      analyticAccountId: payslip.analyticAccountId,
      approvedByFinance: payslip.approvedByFinance || false,
      approvedByHr: payslip.approvedByHr || false,
      approvedByManager: payslip.approvedByManager || false,
      journalEntryCode: payslip.journalEntryCode,
      journalEntryId: payslip.journalEntryId,
      organizationNodeId: payslip.organizationNodeId,
      components:
        payslip.components?.map((comp: any) => ({
          id: comp.id,
          name: comp.salaryRule?.name || "Unknown Component",
          description: comp.description || "No description available",
          category: comp.salaryRule?.category?.name || "Uncategorized",
          amount: comp.amount || 0,
          code: comp.salaryRule?.code || "N/A",
          salaryRuleId: comp.salaryRuleId,
        })) || [],
    }));
  }, [payslips, batchId]);

  const currentEmployee = transformedPayslips[currentEmployeeIndex];

  // Reset index when data changes
  React.useEffect(() => {
    if (
      transformedPayslips.length > 0 &&
      currentEmployeeIndex >= transformedPayslips.length
    ) {
      setCurrentEmployeeIndex(0);
    }
  }, [transformedPayslips.length, currentEmployeeIndex]);

  const totalEarnings =
    currentEmployee?.components
      ?.filter((comp) => comp.category === "Basic Salary")
      ?.reduce((sum, comp) => sum + comp.amount, 0) || 0;
  const totalDeductions =
    currentEmployee?.components
      ?.filter((comp) => comp.category !== "Basic Salary")
      ?.reduce((sum, comp) => sum + comp.amount, 0) || 0;
  const netPay = currentEmployee?.netPay || 0;

  const handleEmployeeChange = (event: any) => {
    setCurrentEmployeeIndex(parseInt(event.target.value));
  };

  const handlePrevious = () => {
    if (currentEmployeeIndex > 0) {
      setCurrentEmployeeIndex(currentEmployeeIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentEmployeeIndex < transformedPayslips.length - 1) {
      setCurrentEmployeeIndex(currentEmployeeIndex + 1);
    }
  };
  const handleClose = () => {
    onClose();
    setCurrentEmployeeIndex(0);
  };
  // Show loading state
  if (isLoading) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography>Loading payslips...</Typography>
        </Box>
      </Modal>
    );
  }

  // Show error state
  if (isError) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            maxWidth: 500,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load payslips:{" "}
            {(error as any)?.message || "Unknown error"}
          </Alert>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    );
  }

  // Show empty state
  if (transformedPayslips.length === 0) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            No Payslips Found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            No payslips have been generated for this batch yet.
          </Typography>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "#f9fafb",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            Payroll Batch: {batchName}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Employee Navigation */}
        <Box
          sx={{
            p: 1.5,
            bgcolor: "#f9fafb",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Select
              value={currentEmployeeIndex}
              onChange={handleEmployeeChange}
              fullWidth
              size="small"
              sx={{ bgcolor: "white" }}
            >
              {transformedPayslips.map((emp, index) => (
                <MenuItem key={emp.id} value={index}>
                  {emp.name} {index === currentEmployeeIndex && "(Current)"}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handlePrevious}
              disabled={currentEmployeeIndex === 0}
              startIcon={<PrevIcon />}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleNext}
              disabled={currentEmployeeIndex === transformedPayslips.length - 1}
              endIcon={<NextIcon />}
            >
              Next
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, overflow: "auto", flex: 1 }}>
          {/* Employee Info Cards */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "primary.main", mb: 1.5 }}
                >
                  Employee Details
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Employee Name:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee?.name}
                    </Typography>
                  </Box>
                  {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Employee ID:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.employeeId}
                    </Typography>
                  </Box> */}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Employee Code:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.employeeCode}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      TIN Number:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.tinNumber}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "primary.main", mb: 1.5 }}
                >
                  Contract Details
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Contract ID:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.contractId}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Base Salary:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(currentEmployee.baseSalary)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Contract Period:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.contractStartDate !== "N/A" &&
                      currentEmployee.contractEndDate !== "N/A"
                        ? `${new Date(
                            currentEmployee.contractStartDate
                          ).toLocaleDateString()} - ${new Date(
                            currentEmployee.contractEndDate
                          ).toLocaleDateString()}`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Additional Details Cards */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ color: "primary.main", mb: 1.5 }}
                >
                  Payroll Details
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Gross Pay:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(currentEmployee.grossPay)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Deductions:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(currentEmployee.deductions)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Net Pay:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(currentEmployee.netPay)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Currency:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.currency || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "primary.main", mb: 1.5 }}>
                  Approval Status
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      HR Approval:
                    </Typography>
                    <Chip
                      label={currentEmployee.approvedByHr ? "Approved" : "Pending"}
                      size="small"
                      color={currentEmployee.approvedByHr ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Manager Approval:
                    </Typography>
                    <Chip
                      label={currentEmployee.approvedByManager ? "Approved" : "Pending"}
                      size="small"
                      color={currentEmployee.approvedByManager ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Finance Approval:
                    </Typography>
                    <Chip
                      label={currentEmployee.approvedByFinance ? "Approved" : "Pending"}
                      size="small"
                      color={currentEmployee.approvedByFinance ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">
                      Journal Entry:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentEmployee.journalEntryCode || 'Not created'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card> */}
          </Stack>

          {/* Pay Period */}
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
              p: 1,
              bgcolor: "#f9fafb",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "primary.main", fontWeight: 600 }}
            >
              Pay Period:{" "}
              {currentEmployee.periodStart !== "N/A" &&
              currentEmployee.periodEnd !== "N/A"
                ? `${new Date(
                    currentEmployee.periodStart
                  ).toLocaleDateString()} - ${new Date(
                    currentEmployee.periodEnd
                  ).toLocaleDateString()}`
                : "N/A"}
              <Chip
                label={currentEmployee.status}
                size="small"
                sx={{
                  ml: 2,
                  bgcolor: getStatusColor(currentEmployee.status).bg,
                  color: getStatusColor(currentEmployee.status).color,
                }}
              />
            </Typography>
          </Box>

          {/* Components Table */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payroll Components
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "primary.main", color: "white" }}>
                    Component
                  </TableCell>
                  <TableCell sx={{ bgcolor: "primary.main", color: "white" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ bgcolor: "primary.main", color: "white" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ bgcolor: "primary.main", color: "white" }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentEmployee.components.map((component, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#f9fafb" : "white",
                    }}
                  >
                    <TableCell>{component.name}</TableCell>
                    <TableCell>{component.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={component.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(component.category).bg,
                          color: getCategoryColor(component.category).color,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(component.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Summary Section */}
          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                  Earnings
                </Typography>
                <Stack spacing={1.5}>
                  {currentEmployee.components
                    .filter((comp) => comp.category === "Basic Salary")
                    .map((comp, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">{comp.name}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(comp.amount)}
                        </Typography>
                      </Box>
                    ))}
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      Total Earnings
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatCurrency(totalEarnings)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, bgcolor: "#f9fafb" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
                  Deductions
                </Typography>
                <Stack spacing={1.5}>
                  {currentEmployee.components
                    .filter((comp) => comp.category !== "Basic Salary")
                    .map((comp, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">{comp.name}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(comp.amount)}
                        </Typography>
                      </Box>
                    ))}
                  <Divider />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      Total Deductions
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatCurrency(totalDeductions)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Net Pay */}
          <Card sx={{ bgcolor: "#f9fafb" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#10b981", fontWeight: 600 }}
                >
                  Net Pay
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#10b981", fontWeight: 600 }}
                >
                  {formatCurrency(netPay)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Payroll Batch: {batchName} | Showing {currentEmployeeIndex + 1} of{" "}
            {transformedPayslips.length} employees
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleVerifyPayrollBatch(batchId)}
              startIcon={<VerifiedOutlined />}
              disabled={batchStatus === "Verified"}
            >
              {batchStatus === "Verified" ? "Verified" : "verify"}
            </Button>
            {/* <Button variant="outlined" size="small" startIcon={<PdfIcon />}>
              Export All as PDF
            </Button>
            {/* <Button variant="contained" size="small" startIcon={<PrintIcon />}>
              Print Current
            </Button> 
            <Button variant="contained" size="small" startIcon={<PdfIcon />}>
              Export Current as PDF
            </Button> */}
          </Stack>
        </Box>

        <Portal>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={30000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              variant="filled"
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Portal>
      </Box>
    </Modal>
  );
}
