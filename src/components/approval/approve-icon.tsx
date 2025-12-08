"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Badge,
  IconButton,
  TextField,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";
import { session } from "@/lib/auth/session";
import { format } from "date-fns";
import { MaterialReactTable } from "material-react-table";
import { documentUIMap, FallbackUI } from "./doc-type-ui";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface Task {
  id: string;
  documentType: string;
  document: {
    id: string;
    approvalStatus?: string;
    employee?: {
      firstName: string;
      fatherName: string;
      employeeCode: string;
    };
  };
  requester?: {
    employee?: {
      firstName: string;
      fatherName: string;
      position?: {
        title: string;
      };
    };
    user?: {
      firstName: string;
      fatherName: string;
      username: string;
    };
    organization?: {
      name: string;
    };
    isSystem?: boolean;
  };
  requestedAt?: string;
}

interface TaskDetailDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  refetchTasks: () => void;
  userId: string;
}

const TaskDetailDialog = ({
  open,
  onClose,
  task,
  refetchTasks,
  userId,
}: TaskDetailDialogProps) => {
  const [comment, setComment] = useState("");
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error" | "info" | "";
    message: string;
  }>({
    type: "",
    message: "",
  });

  const documentId = task?.document?.id || "";
  const documentType = task?.documentType || "";
  const lowerCaseDocumentType = documentType.toLowerCase();

  const handleMutationSuccess = (action: string) => {
    setAlertMessage({
      type: "success",
      message: `${documentType} successfully ${action}! Closing dialog and refreshing task list.`,
    });
    refetchTasks();
    setTimeout(onClose, 1000);
  };

  const approveMutation = useDataMutation({
    apiEndPoint: `https://api.techbee.et/api/hr/approvals/${lowerCaseDocumentType}/${documentId}/approve`,
    method: "POST",
    onSuccess: () => handleMutationSuccess("approved"),
    onError: (e: Error) => {
      const errorMsg = e.message || `Failed to approve ${documentType}.`;
      setAlertMessage({ type: "error", message: errorMsg });
    },
  });

  const rejectMutation = useDataMutation({
    apiEndPoint: `https://api.techbee.et/api/hr/approvals/${lowerCaseDocumentType}/${documentId}/reject`,
    method: "POST",
    onSuccess: () => handleMutationSuccess("rejected"),
    onError: (e: Error) => {
      const errorMsg = e.message || `Failed to reject ${documentType}.`;
      setAlertMessage({ type: "error", message: errorMsg });
    },
  });

  useEffect(() => {
    if (open && task) {
      setComment("");
      setAlertMessage({ type: "", message: "" });
      approveMutation.reset();
      rejectMutation.reset();
    }
  }, [open, task]);

  const DocumentComponent = useMemo(() => {
    if (!task) return null;
    return documentUIMap[documentType] || FallbackUI;
  }, [task, documentType]);

  if (!task) return null;

  const handleApprove = () => {
    approveMutation.mutate({
      actorUserId: userId,
      comment: comment || "Approved.",
    });
  };

  const handleReject = () => {
    rejectMutation.mutate({
      actorUserId: userId,
      comment: comment || "Rejected.",
    });
  };

  const status = task.document?.approvalStatus?.toLowerCase();
  const isPermanentlyFinalized = status === "approved" || status === "rejected";
  const isAnyMutating = approveMutation.isPending || rejectMutation.isPending;
  const isLocallyFinalized =
    approveMutation.isSuccess || rejectMutation.isSuccess;
  const isTaskDisabled =
    isAnyMutating || isLocallyFinalized || isPermanentlyFinalized;

  // User details
  const requester = task.requester;
  const requesterFirstName =
    requester?.employee?.firstName || requester?.user?.firstName || "Unknown";
  const requesterFatherName =
    requester?.employee?.fatherName || requester?.user?.fatherName || "";
  const requesterName = `${requesterFirstName} ${requesterFatherName}`.trim();
  const requesterPosition = requester?.employee?.position?.title || "N/A";
  const requesterUsername = requester?.user?.username || "N/A";
  const requesterOrganization = requester?.organization?.name || "N/A";
  const isSystemRequester = requester?.isSystem === true;

  const employeeName = `${task.document?.employee?.firstName || "Unknown"} ${
    task.document?.employee?.fatherName || "Employee"
  }`;
  const employeeCode = task.document?.employee?.employeeCode || "N/A";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h2" fontWeight="600">
            Approval Detail: {task.documentType}
          </Typography>
          {isPermanentlyFinalized && (
            <Chip
              label={task.document.approvalStatus}
              color={status === "approved" ? "success" : "error"}
              size="small"
              sx={{ color: "white", fontWeight: "bold" }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {/* Alert Messages */}
        {(approveMutation.isError || rejectMutation.isError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {approveMutation.error?.message ||
              rejectMutation.error?.message ||
              "An error occurred."}
          </Alert>
        )}
        {alertMessage.type && (
          <Alert severity={alertMessage.type} sx={{ mb: 3 }}>
            {alertMessage.message}
          </Alert>
        )}
        {isPermanentlyFinalized && !isLocallyFinalized && (
          <Alert severity="info" sx={{ mb: 3 }}>
            This task has already been processed with status:{" "}
            {task.document.approvalStatus}.
          </Alert>
        )}

        {/* User Information Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Requester Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ spaceY: 1.5 }}>
                  <InfoRow label="Name" value={requesterName} />
                  <InfoRow
                    label="Organization"
                    value={requesterOrganization}
                    icon={<BusinessIcon fontSize="small" />}
                  />
                  <InfoRow label="Position" value={requesterPosition} />
                  <InfoRow label="Username" value={requesterUsername} />
                </Box>

                {isSystemRequester && (
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="System User"
                    color="warning"
                    size="small"
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon color="secondary" sx={{ mr: 1.5 }} />
                  <Typography variant="h6" fontWeight="600" color="secondary">
                    Employee Details
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2.5 }} />

                <Box sx={{ spaceY: 1.5 }}>
                  <InfoRow label="Name" value={employeeName} />
                  <InfoRow label="Employee Code" value={employeeCode} />
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 3,
                    pt: 2,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  Requested At:{" "}
                  {task.requestedAt
                    ? format(new Date(task.requestedAt), "PPP 'at' p")
                    : "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Document Content */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 2, color: "text.primary" }}
        >
          Document Content
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 3, mb: 3, bgcolor: "background.default" }}
        >
          <DocumentComponent task={task} document={task.document} />
        </Paper>

        {/* Comment Section */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <TextField
            label="Comment for Approval/Rejection"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isTaskDisabled}
            variant="outlined"
            helperText={
              isTaskDisabled
                ? "This task is finalized or action is pending."
                : "Add a comment (optional)"
            }
            sx={{ mb: 1 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isAnyMutating}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
        <Button
          onClick={handleReject}
          color="error"
          variant="contained"
          disabled={isTaskDisabled}
          startIcon={
            rejectMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <RejectIcon />
            )
          }
        >
          {rejectMutation.isPending ? "Rejecting..." : "Reject"}
        </Button>
        <Button
          onClick={handleApprove}
          color="success"
          variant="contained"
          disabled={isTaskDisabled}
          startIcon={
            approveMutation.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ApproveIcon />
            )
          }
        >
          {approveMutation.isPending ? "Approving..." : "Approve"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper component for info rows
const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
    {icon && <Box sx={{ mr: 1, color: "text.secondary" }}>{icon}</Box>}
    <Typography variant="body2" sx={{ minWidth: 120, color: "text.secondary" }}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
      {value}
    </Typography>
  </Box>
);

export default function ApprovalTasks() {
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { id: userId } = useSelector((state: RootState) => state.session.user);

  const {
    data: tasks = [],
    isLoading,
    error: tasksError,
    isError,
    refetch: refetchTasks,
  } = useDataQuery({
    apiEndPoint: `https://hr.api.techbee.et/api/approvals/my-tasks/${userId}`,
    columnFilters: [],
    globalFilter: "",
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 50 },
    enabled: Boolean(userId),
  });

  const handleListDialogClose = () => {
    setListDialogOpen(false);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedTask(null);
  };

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row: Task) => {
          const firstName =
            row.requester?.employee?.firstName ||
            row.requester?.user?.firstName ||
            "Unknown";
          const fatherName =
            row.requester?.employee?.fatherName ||
            row.requester?.user?.fatherName ||
            "";
          return `${firstName} ${fatherName}`.trim();
        },
        id: "requesterName",
        header: "Requester",
        size: 200,
      },
      {
        accessorKey: "documentType",
        header: "Document Type",
        size: 150,
      },
      {
        accessorFn: (row: Task) => row.document?.approvalStatus || "N/A",
        id: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }: any) => (
          <Chip
            label={cell.getValue()}
            size="small"
            color={
              cell.getValue() === "Approved"
                ? "success"
                : cell.getValue() === "Rejected"
                ? "error"
                : "default"
            }
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: "requestedAt",
        header: "Requested At",
        size: 150,
        Cell: ({ cell }: any) =>
          cell.getValue()
            ? format(new Date(cell.getValue()), "MMM d, yyyy")
            : "N/A",
      },
    ],
    []
  );

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (isError) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Error: {tasksError?.message || "Failed to load tasks"}
        </Alert>
      );
    }
    if (tasks.length === 0) {
      return (
        <Box sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Approval Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any pending approval tasks at the moment.
          </Typography>
        </Box>
      );
    }
    return (
      <Paper elevation={1} sx={{ overflow: "hidden" }}>
        <MaterialReactTable
          renderTopToolbarCustomActions={() => (
            <Typography
              variant="h6"
              fontWeight="600"
              color="primary.main"
              sx={{ p: 2 }}
            >
              Pending Approval Tasks
            </Typography>
          )}
          columns={columns}
          data={tasks}
          enableColumnActions={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleTaskClick(row.original),
            sx: {
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          })}
          initialState={{
            density: "comfortable",
          }}
          state={{
            isLoading,
          }}
          muiTablePaperProps={{
            elevation: 0,
          }}
        />
      </Paper>
    );
  }, [isLoading, isError, tasks, tasksError, columns, handleTaskClick]);

  return (
    <>
      {tasks.length > 0 && (
        <Badge
          badgeContent={tasks.length}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              top: 8,
              right: 8,
              fontWeight: "bold",
              fontSize: "0.75rem",
            },
          }}
        >
          <IconButton
            onClick={() => setListDialogOpen(true)}
            color="primary"
            title="View Approval Tasks"
            sx={{
              backgroundColor: "background.paper",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <InfoIcon />
          </IconButton>
        </Badge>
      )}

      <Dialog
        open={listDialogOpen}
        onClose={handleListDialogClose}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            minHeight: "60vh",
          },
        }}
      >
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ minHeight: 400 }}>{renderContent}</Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleListDialogClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TaskDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        task={selectedTask}
        refetchTasks={refetchTasks}
        userId={userId}
      />
    </>
  );
}
