import React, { useState } from "react";
import {
  Popover,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Chip,
  Card,
  CardContent,
  Alert,
  Avatar,
  List,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Close,
  FormatListNumbered,
  Notifications,
  Approval,
  Description,
  Folder,
  Assignment,
  TrendingUp,
} from "@mui/icons-material";
import { Column } from "./types";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import TaskStageForm from "../../taskStages/_components/Form";

type ColumnPopoverProps = {
  column: Column;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

export function ColumnPopover({
  column,
  anchorEl,
  open,
  onClose,
}: ColumnPopoverProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setCurrentAction(action);
    setDialogOpen(true);
    onClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentAction(null);
  };

  const DetailSection = () => {
    return (
      <Box sx={{ p: 6, gap: 6, display: "flex", flexDirection: "column" }}>
        {/* Header Section */}
        <Card elevation={2} sx={{ bgcolor: "background.paper" }}>
          <CardContent sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: column.color || "primary.main",
                      width: 56,
                      height: 56,
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {column.name?.charAt(0) || "C"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      {column.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "text.secondary", fontWeight: 400 }}
                    >
                      {column.code}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  <Chip
                    label={`Sequence: ${column.sequence}`}
                    size="small"
                    variant="outlined"
                    icon={<FormatListNumbered />}
                  />
                  <Chip
                    label={column.active ? "Active" : "Inactive"}
                    size="small"
                    color={column.active ? "success" : "default"}
                  />
                  <Chip
                    label={
                      column.requiresApproval
                        ? "Approval Required"
                        : "No Approval"
                    }
                    size="small"
                    color={column.requiresApproval ? "warning" : "default"}
                    icon={<Approval />}
                  />
                  <Chip
                    label={
                      column.triggersNotification
                        ? "Notifications On"
                        : "No Notifications"
                    }
                    size="small"
                    color={column.triggersNotification ? "info" : "default"}
                    icon={<Notifications />}
                  />
                </Box>

                {column.description && (
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                  >
                    {column.description}
                  </Typography>
                )}
              </Box>

              <Chip
                label={`${column._count?.wbsItems || 0} Tasks`}
                color="primary"
                variant="filled"
                sx={{
                  fontWeight: "bold",
                  color: "primary.contrastText",
                  fontSize: "1rem",
                  py: 1,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Stage Set Information */}
          <Card elevation={1}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Folder fontSize="small" />
                Stage Set Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Set Name:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {column.setField?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Set Code:
                  </Typography>
                  <Chip
                    label={column.setField?.code}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Total Stages:
                  </Typography>
                  <Chip
                    label={column.setField?._count?.stages || 0}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Status:
                  </Typography>
                  <Chip
                    label={column.setField?.active ? "Active" : "Inactive"}
                    size="small"
                    color={column.setField?.active ? "success" : "default"}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Default Project Types */}
          {column.setField?.projectTypesDefaultFor &&
            column.setField.projectTypesDefaultFor.length > 0 && (
              <Card elevation={1}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Assignment fontSize="small" />
                    Default For Project Types
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {column.setField.projectTypesDefaultFor.map(
                      (projectType) => (
                        <Chip
                          key={projectType.id}
                          label={projectType.name}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            )}

          {/* Tasks in this Stage */}
          {column.wbsItems && column.wbsItems.length > 0 && (
            <Card elevation={1}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <TrendingUp fontSize="small" />
                  Tasks in this Stage ({column.wbsItems.length})
                </Typography>
                <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {column.wbsItems.map((task) => (
                    <Card
                      key={task.id}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              {task.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mb: 2 }}
                            >
                              {task.code} • {task.type}
                            </Typography>
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              <Chip
                                label={task.approvalStatus}
                                size="small"
                                color={
                                  task.approvalStatus === "Draft"
                                    ? "default"
                                    : "primary"
                                }
                              />
                              <Chip
                                label={`SLA: ${task.slaState}`}
                                size="small"
                                color={
                                  task.slaState === "Warning"
                                    ? "warning"
                                    : "default"
                                }
                              />
                              <Chip
                                label={`${
                                  task._count?.assignments || 0
                                } assignments`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: "right", ml: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mb: 1 }}
                            >
                              Project
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {task.project?.title}
                            </Typography>
                            <Chip
                              label={task.project?.projectStage?.name}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card elevation={1}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Description fontSize="small" />
                Additional Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Requires Approval:
                  </Typography>
                  <Chip
                    label={column.requiresApproval ? "Yes" : "No"}
                    size="small"
                    color={column.requiresApproval ? "warning" : "default"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Triggers Notification:
                  </Typography>
                  <Chip
                    label={column.triggersNotification ? "Yes" : "No"}
                    size="small"
                    color={column.triggersNotification ? "info" : "default"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Sequence Order:
                  </Typography>
                  <Chip
                    label={`#${column.sequence}`}
                    size="small"
                    color="primary"
                    icon={<FormatListNumbered />}
                  />
                </Box>
                {column.notes && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}
                    >
                      Additional Notes:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontStyle: "italic" }}
                    >
                      {column.notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };

  const DeleteSection = () => {
    const theme = useTheme();
    const { mutate: deleteColumn, isPending } = useDataMutation({
      apiEndPoint: "https://api.techbee.et/api/project/taskStages/" + column.id,
      method: "DELETE",
      onSuccess: () => {
        handleDialogClose();
      },
      onError: (message) => {
        // Handle error
      },
      invalidateQueryKey: [
        "data",
        `https://api.techbee.et/api/project/taskStages?where[setField][id]=${column.setField?.id}`,
      ],
    });

    const taskCount = column._count?.wbsItems || 0;

    return (
      <Box sx={{ p: 6 }}>
        <Alert severity="error" sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Delete Stage Column
          </Typography>
          <Typography variant="body2">
            This action will permanently delete the stage column
            {taskCount > 0 &&
              ` and affect ${taskCount} task${taskCount !== 1 ? "s" : ""}`}
            .
          </Typography>
        </Alert>

        <Card
          elevation={2}
          sx={{
            border: "2px solid",
            borderColor: "error.light",
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 4,
                color: "error.main",
              }}
            >
              Confirm Deletion
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 1,
                  backgroundColor: "error.light",
                  color: "error.contrastText",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                  You are about to delete:
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: column.color || "error.main",
                      width: 48,
                      height: 48,
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    {column.name?.charAt(0) || "C"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "error.dark" }}
                    >
                      "{column.name}"
                    </Typography>
                    <Typography variant="body2" sx={{ color: "error.dark" }}>
                      Code: {column.code} • Sequence: #{column.sequence}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {taskCount > 0 && (
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 1,
                    backgroundColor: "warning.light",
                    color: "warning.contrastText",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 2, color: "warning.dark" }}
                  >
                    ⚠️ Affected Tasks
                  </Typography>
                  <Typography variant="body2" sx={{ color: "warning.dark" }}>
                    This stage contains{" "}
                    <strong>
                      {taskCount} task{taskCount !== 1 ? "s" : ""}
                    </strong>
                    . Deleting this stage will remove these tasks from the
                    current workflow stage.
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  p: 4,
                  borderRadius: 1,
                  backgroundColor: "grey.100",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, mb: 2, color: "text.primary" }}
                >
                  🚫 This action cannot be undone
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  The stage column and all its configuration will be permanently
                  removed from the system.
                  {taskCount > 0 &&
                    " Tasks will need to be reassigned to other stages."}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 3, pt: 4 }}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  loading={isPending}
                  onClick={() => deleteColumn({})}
                  startIcon={<Delete />}
                  sx={{ flex: 1 }}
                >
                  {isPending
                    ? "Deleting..."
                    : `Delete Stage${
                        taskCount > 0 ? ` (${taskCount} tasks)` : ""
                      }`}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleDialogClose}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const getDialogContent = () => {
    switch (currentAction) {
      case "details":
        return <DetailSection />;
      case "edit":
        return (
          <TaskStageForm
            formMode="edit"
            defaultValues={column}
            invalidateQueryKey={[
              "data",
              `https://api.techbee.et/api/project/taskStages?where[setField][id]=${column.setField?.id}`,
            ]}
          />
        );
      case "delete":
        return <DeleteSection />;
      default:
        return (
          <Box sx={{ p: 6 }}>
            <Typography variant="body2">
              This is a sample dialog component for the selected column action.
            </Typography>
          </Box>
        );
    }
  };

  const getDialogTitle = () => {
    switch (currentAction) {
      case "details":
        return "Stage Details";
      case "edit":
        return "Edit Stage";
      case "delete":
        return "Delete Stage";
      default:
        return "Stage Actions";
    }
  };

  const menuItems = [
    {
      icon: <Visibility fontSize="small" />,
      text: "View Details",
      action: "details",
    },
    { icon: <Edit fontSize="small" />, text: "Edit Stage", action: "edit" },
    {
      icon: <Delete fontSize="small" />,
      text: "Delete Stage",
      action: "delete",
      color: "error" as const,
    },
  ];

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: theme.shadows[8],
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <MenuList dense sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <MenuItem
              key={item.action}
              onClick={() => handleAction(item.action)}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: item.color ? `${item.color}.main` : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  color={item.color ? item.color : "text.primary"}
                >
                  {item.text}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>

      <Dialog
        open={dialogOpen}
        onPointerDown={(e) => e.stopPropagation()}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        maxWidth="lg"
        fullWidth
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "section.main",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "common.white" }}
            >
              {getDialogTitle()}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, m: 0, bgcolor: "background.default" }}>
          {getDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
