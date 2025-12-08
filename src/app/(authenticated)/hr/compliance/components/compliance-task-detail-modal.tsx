// components/compliance-task-detail-modal.tsx
"use client";

import {
  Modal,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Paper,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  BusinessCenter as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

interface ComplianceTaskDetailModalProps {
  open: boolean;
  handleClose: () => void;
  row: any;
}

export const ComplianceTaskDetailModal = ({
  open,
  handleClose,
  row,
}: ComplianceTaskDetailModalProps) => {
  if (!row) return null;
  
  console.log("************** Compliance Task Modal:", open, row);

  const task = row;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Overdue":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon />;
      case "Overdue":
        return <ErrorIcon />;
      case "Pending":
        return <ScheduleIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const isOverdue = () => {
    if (task.status === "Completed") return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="compliance-task-detail-modal-title"
      aria-describedby="compliance-task-detail-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "75%", lg: "60%" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <AssignmentIcon color="primary" />
            <Typography
              id="compliance-task-detail-modal-title"
              variant="h6"
              component="h2"
            >
              Compliance Task Details
            </Typography>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Status Chip */}
        <Box sx={{ mb: 3 }}>
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            icon={getStatusIcon(task.status)}
            size="medium"
          />
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Stack spacing={3}>
            {/* Requirement Information */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Compliance Requirement
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Requirement Code
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {task.requirement.code}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Requirement Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {task.requirement.name}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {task.requirement.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Task Details */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Task Information
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Entity Type
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {task.entityType}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Entity ID
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {task.entityId}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Due Date
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CalendarIcon color={isOverdue() ? "error" : "action"} />
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        color={isOverdue() ? "error" : "text.primary"}
                      >
                        {formatDate(task.dueDate)}
                      </Typography>
                    </Stack>
                  </Box>
                  {task.completedAt && (
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Completed At
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon color="success" />
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(task.completedAt)}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>

            {/* Assignment Information */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Assignment Details
                </Typography>
              </Stack>
              
              {task.employee ? (
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={`https://picsum.photos/seed/${task.employee.id}/200/300`}
                      sx={{ width: 56, height: 56 }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {task.employee.firstName} {task.employee.fatherName}
                      </Typography>
                      {task.employee.employeeCode && (
                        <Typography variant="body2" color="text.secondary">
                          Employee Code: {task.employee.employeeCode}
                        </Typography>
                      )}
                      <Chip
                        label="Assigned to Employee"
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Stack>
                </Stack>
              ) : task.assignedToRole ? (
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Assigned to Role:
                  </Typography>
                  <Chip
                    label={task.assignedToRole}
                    color="secondary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No assignment specified
                </Typography>
              )}
            </Paper>

            {/* Notes */}
            {task.notes && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Notes & Instructions
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {task.notes}
                </Typography>
              </Paper>
            )}

            {/* Metadata */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                System Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(task.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};