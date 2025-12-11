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
  Card,
  CardContent,
  Alert,
  Box,
  alpha,
  Stack,
  Paper,
  LinearProgress,
} from "@mui/material";
import { Visibility, Edit, Delete, Close, Warning } from "@mui/icons-material";
import { Task } from "./types";
import WbsItemForm from "../../wbsItems/_components/Form";
import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import { TaskDetailSection } from "./TaskDetailsSection";
type TaskPopoverProps = {
  task: Task;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};
export function TaskPopover({
  task,
  anchorEl,
  open,
  onClose,
}: TaskPopoverProps) {
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
  const DeleteSection = () => {
    const { mutate: deleteTask, isPending } = useDataMutation({
      apiEndPoint: "https://api.techbee.et/api/project/wbsitems/" + task.id,
      method: "DELETE",
      onSuccess: () => {
        handleDialogClose();
      },
      onError: (message) => {},
      invalidateQueryKey: [
        "data",
        `https://api.techbee.et/api/project/wbsItems?where[project][id]=${task.project?.id}`,
        `https://api.techbee.et/api/project/projects/${task.project?.id}`,
      ],
    });
    return (
      <Box sx={{ p: 3 }}>
        {}
        <Alert
          severity="error"
          icon={<Warning />}
          sx={{
            mb: 3,
            bgcolor: alpha(theme.palette.error.main, 0.06),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            borderRadius: 1.5,
            "& .MuiAlert-icon": {
              color: theme.palette.error.main,
            },
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Delete Task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All associated data will be
            permanently removed.
          </Typography>
        </Alert>
        {}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              TASK TO BE DELETED
            </Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Code
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {task.code || "—"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {task.type}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        {}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            bgcolor: alpha(theme.palette.warning.main, 0.03),
            borderRadius: 2,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={600}
            color="warning.main"
            gutterBottom
          >
            <Box
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Warning fontSize="small" />
              What will be deleted
            </Box>
          </Typography>
          <Stack spacing={0.75} sx={{ mt: 2 }}>
            {[
              "Task details and descriptions",
              "All assignments and team member allocations",
              "Activity history and time tracking",
              "Attachments and related documents",
              "Comments and discussion threads",
            ].map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: "text.secondary",
                    opacity: 0.6,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
        {}
        {isPending && (
          <LinearProgress
            sx={{
              mb: 3,
              borderRadius: 1,
              height: 4,
              "& .MuiLinearProgress-bar": {
                bgcolor: theme.palette.error.main,
              },
            }}
          />
        )}
        {}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteTask({})}
            disabled={isPending}
            startIcon={<Delete />}
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: theme.palette.error.main,
              "&:hover": {
                bgcolor: theme.palette.error.dark,
              },
            }}
          >
            {isPending ? "Deleting..." : "Delete Task"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            disabled={isPending}
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: 1.5,
              textTransform: "none",
              borderColor: alpha(theme.palette.divider, 0.5),
              "&:hover": {
                borderColor: theme.palette.divider,
              },
            }}
          >
            Cancel
          </Button>
        </Stack>
        {}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            fontSize: "0.75rem",
          }}
        >
          Deleted items cannot be recovered
        </Typography>
      </Box>
    );
  };
  const getDialogContent = () => {
    switch (currentAction) {
      case "details":
        return <TaskDetailSection task={task} />;
      case "edit":
        return (
          <WbsItemForm
            formMode="edit"
            defaultValues={task}
            invalidateQueryKey={[
              "data",
              `https://api.techbee.et/api/project/wbsItems?where[project][id]=${task.project?.id}`,
              // `https://api.techbee.et/api/project/projects/${task.project?.id}`,
            ]}
          />
        );
      case "delete":
        return <DeleteSection />;
      default:
        return (
          <Box sx={{ p: 6 }}>
            <Typography variant="body2">
              This is a sample dialog component for the selected action.
            </Typography>
          </Box>
        );
    }
  };

  const menuItems = [
    {
      icon: <Visibility fontSize="small" />,
      text: "View Details",
      action: "details",
    },
    { icon: <Edit fontSize="small" />, text: "Edit Task", action: "edit" },
    {
      icon: <Delete fontSize="small" />,
      text: "Delete Task",
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
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        maxWidth="lg"
        fullWidth
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "section.main" }}
            >
              {task.title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <Close sx={{ color: "section.main" }} />
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
