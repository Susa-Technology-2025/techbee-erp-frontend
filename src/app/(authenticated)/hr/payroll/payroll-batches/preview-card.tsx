"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  BarChart as ChartIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { useDataMutation } from "@/lib/tanstack/useDataQuery";

interface PayrollPreviewData {
  preview: boolean;
  totalEmployeesProcessed: number;
  payslips: Array<{
    id: string;
    employeeId: string;
    contractId: string;
    organizationNodeId: string;
    grossPay: number;
    netPay: number;
    status: string;
    periodStart: string;
    periodEnd: string;
    createdAt: string | null;
    updatedAt: string | null;
    employee: {
      id: string;
      firstName: string;
      lastName: string;
      tinNumber: string | null;
      positionId: string;
      organizationNodeId: string | null;
    };
    contract: {
      id: string;
      baseSalary: number;
      startDate: string;
      endDate: string;
    };
    components: Array<{
      amount: number;
      description: string;
      salaryRule: {
        id: string;
        name: string;
        code: string;
        category: {
          name: string;
        };
      };
    }>;
    payrollBatch: {
      id: string;
      name: string;
      periodStart: string;
      periodEnd: string;
    };
  }>;
  skippedEmployees: any[];
  summary: {
    totalGross: number;
    totalNet: number;
    totalDeductions: number;
    totalByRule: Record<
      string,
      {
        id: string;
        name: string;
        code: string;
        total: number;
      }
    >;
    totalByCategory: Record<string, number>;
    totalPayslipsGenerated: number;
    employerContributions: number;
  };
}

interface PayrollPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  batchId?: string | null;
  type: "batch" | "single";
  payslipData?: any;
}

const PayrollPreviewModal: React.FC<PayrollPreviewModalProps> = ({
  open,
  onClose,
  onConfirm,
  batchId,
  type,
  payslipData,
}) => {
  const [previewData, setPreviewData] = useState<PayrollPreviewData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace RTK Query mutations with custom hooks
  const generatePreviewMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/payrollBatches/generate-batch-pay-slip",
    method: "POST",
  });
  const generateSinglePreviewMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/paySlips/generate-single-payslip",
    method: "POST",
  });

  const [generatePreview] = [generatePreviewMutation.mutateAsync];
  const [generateSinglePreview] = [generateSinglePreviewMutation.mutateAsync];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch preview data when modal opens
  useEffect(() => {
    let isMounted = true;

    async function fetchPreviewData() {
      if (!open) return;

      setLoading(true);
      setError(null);
      setPreviewData(null);

      try {
        let response;

        if (type === "batch" && batchId) {
          response = await generatePreview({
            batchId,
            preview: true,
          });
        } else if (type === "single" && payslipData) {
          response = await generateSinglePreview(payslipData);
        }

        if (!response) return;

        // 🔹 Normalize both responses into a common structure
        let normalized: PayrollPreviewData;

        if (type === "single" && response.payslip) {
          normalized = {
            preview: response.preview,
            totalEmployeesProcessed: 1,
            payslips: [response.payslip],
            skippedEmployees: response.skippedEmployees || [],
            summary: {
              totalGross: response.payslip.grossPay || 0,
              totalNet: response.payslip.netPay || 0,
              totalDeductions:
                (response.payslip.grossPay || 0) -
                (response.payslip.netPay || 0),
              totalByRule: response.summary?.totalByRule || {},
              totalByCategory: response.summary?.totalByCategory || {},
              totalPayslipsGenerated: 1,
              employerContributions:
                response.summary?.employerContributions || 0,
            },
          };
        } else {
          normalized = response;
        }

        if (isMounted) {
          setPreviewData(normalized);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load preview data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPreviewData();

    return () => {
      isMounted = false;
    };
  }, [open, batchId, payslipData, type]);

  // Handle loading state
  if (loading) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={600} color="primary">
            Payroll Preview
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading preview data...
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>
            Payroll Preview
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Please try again or contact support if the issue persists.
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Handle no data state
  if (
    !previewData ||
    !previewData.payslips ||
    previewData.payslips.length === 0
  ) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>
            Payroll Preview
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No employees found for this batch
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This could be due to:
            </Typography>
            <Stack
              spacing={1}
              sx={{ textAlign: "left", maxWidth: 400, mx: "auto" }}
            >
              <Typography variant="body2" color="text.secondary">
                • No employees match the batch criteria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Employee filters are too restrictive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Employees don't have active contracts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Batch period doesn't overlap with employee contracts
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Please check the batch configuration and employee data.
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const summary = previewData.summary;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>
          Payroll Preview - {previewData.totalEmployeesProcessed} Employees
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Payroll Period Section */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <CalendarIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="primary">
                Payroll Period
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: "primary.main",
                  bgcolor: "grey.50",
                  minWidth: 200,
                  flex: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Payroll Batch
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {previewData.payslips[0]?.payrollBatch?.name || "N/A"}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: "primary.main",
                  bgcolor: "grey.50",
                  minWidth: 200,
                  flex: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Period Start
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {previewData.payslips[0]?.periodStart
                    ? formatDate(previewData.payslips[0].periodStart)
                    : "N/A"}
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  borderLeft: 3,
                  borderColor: "primary.main",
                  bgcolor: "grey.50",
                  minWidth: 200,
                  flex: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Period End
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {previewData.payslips[0]?.periodEnd
                    ? formatDate(previewData.payslips[0].periodEnd)
                    : "N/A"}
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* All Employees Payslips Section */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <PersonIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="primary">
                Employee Payslips ({previewData.payslips.length})
              </Typography>
            </Stack>

            {previewData.payslips.map((payslip: any, index: number) => (
              <Card
                key={payslip.employeeId}
                elevation={0}
                sx={{ mb: 2, border: 1, borderColor: "divider" }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Employee Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 1,
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {payslip.employee?.firstName || "N/A"}{" "}
                          {payslip.employee?.lastName || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {payslip.employeeId || "N/A"} | TIN:{" "}
                          {payslip.employee?.tinNumber || "N/A"}
                        </Typography>
                      </Box>
                      <Chip
                        label={payslip.status || "N/A"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    {/* Salary Components Table */}
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{ border: 1, borderColor: "divider" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              Component
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              Category
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                textAlign: "right",
                                fontSize: "0.875rem",
                              }}
                            >
                              Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payslip.components?.map(
                            (component: any, compIndex: number) => (
                              <TableRow key={compIndex}>
                                <TableCell sx={{ fontSize: "0.875rem" }}>
                                  {component.salaryRule?.name || "N/A"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.875rem" }}>
                                  {component.salaryRule?.category?.name ||
                                    "N/A"}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.875rem" }}>
                                  {component.description || "N/A"}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    textAlign: "right",
                                    fontFamily: "monospace",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {formatCurrency(component.amount || 0)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell
                              colSpan={3}
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              Gross Pay
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatCurrency(payslip.grossPay || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell
                              colSpan={3}
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              Total Deductions
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatCurrency(
                                (payslip.grossPay || 0) - (payslip.netPay || 0)
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow sx={{ bgcolor: "primary.50" }}>
                            <TableCell
                              colSpan={3}
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              Net Pay
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "right",
                                fontWeight: 600,
                                color: "primary.main",
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatCurrency(payslip.netPay || 0)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Payroll Summary Section */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              <ChartIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="primary">
                Batch Summary
              </Typography>
            </Stack>
            <Card elevation={0} sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary"
                  sx={{ mb: 2, gap: 16 }}
                >
                  Totals
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ flexWrap: "wrap", gap: 2, mb: 2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "white",
                      minWidth: 200,
                      flex: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Total Employees
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {previewData.totalEmployeesProcessed || 0}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "white",
                      minWidth: 200,
                      flex: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Total Gross Pay
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {formatCurrency(summary.totalGross || 0)}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "white",
                      minWidth: 200,
                      flex: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Total Deductions
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {formatCurrency(summary.totalDeductions || 0)}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "white",
                      minWidth: 200,
                      flex: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Total Net Pay
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {formatCurrency(summary.totalNet || 0)}
                    </Typography>
                  </Paper>
 

                  {summary?.totalByRule &&
                    Object.values(summary.totalByRule).map(
                      (rule: any, index: number) => (
                        <Paper
                          elevation={0}
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: "white",
                            minWidth: 200,
                            flex: 1,
                            boxShadow: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {rule.name}
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            {formatCurrency(rule.total || 0)}
                          </Typography>
                        </Paper>
                      )
                    )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          startIcon={<CancelIcon />}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          startIcon={<CheckCircleIcon />}
          sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
        >
          Confirm and Process
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollPreviewModal;
