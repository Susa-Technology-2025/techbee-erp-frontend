import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Business as OrganizationIcon,
  Work as WorkIcon,
  AccountTree as DepartmentIcon,
  AttachMoney as MoneyIcon,
  Lock as LockIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Error as RejectedIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

interface PayrollBatchDetailModalProps {
  open: boolean;
  onClose: () => void;
  batchData: any; // Replace with your specific type
  organizationNodes: any[]; // Replace with your specific type
  positions: any[]; // Replace with your specific type
  salaryStructures: any[]; // Replace with your specific type
}

const PayrollBatchDetailModal: React.FC<PayrollBatchDetailModalProps> = ({
  open,
  onClose,
  batchData,
  organizationNodes,
  positions,
  salaryStructures,
}) => {
  console.log(batchData);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  // const { mutateAsync: generatePreview } = useDataMutation<any, { batchId: string; preview: boolean }>({
  //   apiEndPoint: "https://hr.api.techbee.et/api/generate-batch-payslip", // Replace with your actual endpoint
  //   method: "POST",
  // });

  // Helper functions
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  const getOrganizationName = (id: string) => {
    const node = organizationNodes.find((node) => node.id === id);
    return node ? node.name : id;
  };

  const getPositionName = (id: string) => {
    const position = positions.find((pos) => pos.id === id);
    return position ? position.title : id;
  };

  const getSalaryStructureName = (id: string) => {
    const structure = salaryStructures.find((ss) => ss.id === id);
    return structure ? structure.name : id;
  };

  const getStatusIcon = () => {
    switch (batchData.status) {
      case "Verified":
        return <ApprovedIcon color="success" />;
      case "Draft":
        return <PendingIcon color="warning" />;
      case "Rejected":
        return <RejectedIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  // Fetch preview when modal opens
  // useEffect(() => {
  //   let isMounted = true;
  //   async function fetchPreview() {
  //     if (!open || !batchData?.id) return;
  //     setPreviewLoading(true);
  //     setPreviewError(null);
  //     setPreviewData(null);
  //     try {
  //       // const resp = await generatePreview({ batchId: batchData.id, preview: true });
  //       if (isMounted) setPreviewData(resp);
  //     } catch (err: any) {
  //       if (isMounted) setPreviewError(err?.message || 'Failed to load preview.');
  //     } finally {
  //       if (isMounted) setPreviewLoading(false);
  //     }
  //   }
  //   fetchPreview();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [open, batchData?.id, generatePreview]);

  // Early return after all hooks are called
  if (!batchData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <DescriptionIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Payroll Batch: {batchData.name}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                {batchData.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {getStatusIcon()}
                <Typography variant="body1" color="text.secondary">
                  Status:{" "}
                  <strong style={{ textTransform: "capitalize" }}>
                    {batchData.status}
                  </strong>
                </Typography>
              </Box>
              {/* <Typography variant="body2" color="text.secondary">
                Batch ID: {batchData.id}
              </Typography> */}
            </Box>

            <Box
              sx={{
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 2,
                minWidth: 200,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Batch Type
              </Typography>
              <Chip
                label={batchData.batchType}
                color="secondary"
                size="small"
                sx={{ textTransform: "capitalize" }}
              />
              {batchData.locked && (
                <Box display="flex" alignItems="center" mt={1}>
                  <LockIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Locked
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Main Details */}
          <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
            {/* Left Column */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  Period Details
                </Typography>

                <Box sx={{ ml: 3 }}>
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography>{formatDate(batchData.periodStart)}</Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography>{formatDate(batchData.periodEnd)}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography>{formatDate(batchData.createdAt)}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <OrganizationIcon color="primary" sx={{ mr: 1 }} />
                  Organization
                </Typography>

                <Box sx={{ ml: 3 }}>
                  <Typography>
                    {batchData.organizationNodeId
                      ? getOrganizationName(batchData.organizationNodeId)
                      : "Not specified"}
                  </Typography>
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                  Description
                </Typography>

                <Box sx={{ ml: 3 }}>
                  <Typography>
                    {batchData.description || "No description provided"}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Right Column */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  Employee Filters
                </Typography>

                <Box sx={{ ml: 3 }}>
                  {batchData.filters && (
                    <>
                      {batchData.filters.positionIds?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Positions
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {batchData.filters.positionIds.map((id: string) => (
                              <Chip
                                key={id}
                                label={getPositionName(id)}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {batchData.filters.employmentTerms?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Employment Terms
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {batchData.filters.employmentTerms.map(
                              (term: string) => (
                                <Chip
                                  key={term}
                                  label={term}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                            )}
                          </Box>
                        </Box>
                      )}

                      {batchData.filters.salaryStructureIds?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Salary Structures
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {batchData.filters.salaryStructureIds.map(
                              (id: string) => (
                                <Chip
                                  key={id}
                                  label={getSalaryStructureName(id)}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                            )}
                          </Box>
                        </Box>
                      )}

                      {batchData.filters.organizationNodeIds?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Organization Nodes
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {batchData.filters.organizationNodeIds.map(
                              (id: string) => (
                                <Chip
                                  key={id}
                                  label={getOrganizationName(id)}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Add Pools filter display */}
                      {batchData.filters.pools?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Pools
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            {batchData.filters.pools.map(
                              (pool: any, index: number) => (
                                <Box
                                  key={index}
                                  sx={{
                                    p: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    Pool {index + 1}
                                  </Typography>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Amount: {pool.amount}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Strategy:{" "}
                                      {pool.strategy?.type || "Not specified"}
                                    </Typography>
                                  </Box>
                                  {pool.eligibility?.salaryStructureIds
                                    ?.length > 0 && (
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Eligible Structures:
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 0.5,
                                          mt: 0.5,
                                        }}
                                      >
                                        {pool.eligibility.salaryStructureIds.map(
                                          (id: string) => (
                                            <Chip
                                              key={id}
                                              label={getSalaryStructureName(id)}
                                              size="small"
                                              variant="outlined"
                                            />
                                          )
                                        )}
                                      </Box>
                                    </Box>
                                  )}
                                  {/* {pool.salaryRuleId && (
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Salary Rule: {pool.salaryRuleId}
                                    </Typography>
                                  </Box>
                                )} */}
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Inherit Batch Filters:{" "}
                                      {pool.inheritBatchFilters ? "Yes" : "No"}
                                    </Typography>
                                  </Box>
                                </Box>
                              )
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Add Rounding filter display */}
                      {batchData.filters.rounding && (
                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary">
                            Rounding
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Chip
                              label={`Mode: ${
                                batchData.filters.rounding.mode ||
                                "Not specified"
                              }`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`Step: ${
                                batchData.filters.rounding.step ||
                                "Not specified"
                              }`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Paper>

              {/* Preview Section */}
              {/* {      batchData.status == "Draft" && <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                  Payslip Preview
                </Typography>
                <Box sx={{ ml: 3 }}>
                  {previewLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} />
                      <Typography variant="body2">Loading preview…</Typography>
                    </Box>
                  )}
                  {previewError && (
                    <Alert severity="error" sx={{ my: 1 }}>{previewError}</Alert>
                  )}
                  {!previewLoading && !previewError && previewData && (
                    <Box sx={{
                      p: 1.5,
                      bgcolor: 'grey.50',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      maxHeight: 300,
                      overflow: 'auto',
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                      fontSize: 12
                    }}>
                      <pre style={{ margin: 0 }}>
{`${JSON.stringify(previewData, null, 2)}`}
                      </pre>
                    </Box>
                  )}
                </Box>
              </Paper>} */}

              {/* <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  Approval Status
                </Typography>
                
                <Box sx={{ ml: 3 }}>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                    <Box sx={{ minWidth: 120 }}>
                      <Box display="flex" alignItems="center">
                        {batchData.approvedByManager ? (
                          <Tooltip title="Approved by Manager">
                            <ApprovedIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Pending approval by Manager">
                            <PendingIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Manager
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                      <Box display="flex" alignItems="center">
                        {batchData.approvedByHr ? (
                          <Tooltip title="Approved by HR">
                          <ApprovedIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Pending approval by HR">
                            <PendingIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          HR
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                      <Box display="flex" alignItems="center">
                        {batchData.approvedByFinance ? (
                          <Tooltip title="Approved by Finance">
                            <ApprovedIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Pending approval by Finance">
                            <PendingIcon color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Finance
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Paper> */}

              {batchData.rejectionReason && (
                <Paper
                  elevation={0}
                  sx={{ p: 2, borderRadius: 2, mt: 3, bgcolor: "error.light" }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <RejectedIcon color="error" sx={{ mr: 1 }} />
                    Rejection Reason
                  </Typography>

                  <Typography variant="body2" sx={{ ml: 3 }}>
                    {batchData.rejectionReason}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: "background.default" }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
        {/* {batchData.status === 'Draft' && (
          <Button color="primary" variant="contained">
            Edit Batch
          </Button> 
        )}*/}
      </DialogActions>
    </Dialog>
  );
};

export default PayrollBatchDetailModal;
