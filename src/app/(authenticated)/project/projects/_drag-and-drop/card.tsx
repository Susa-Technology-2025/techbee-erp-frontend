import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Task } from "./types";
import { useState } from "react";
import { TaskPopover } from "./task-popover";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Typography,
  AppBar,
  alpha,
  useTheme,
} from "@mui/material";
import { TaskMenuButton } from "./task-menu-button";
import { Close } from "@mui/icons-material";
import WbsAssignments from "../../wbsAssignments/page";
import WbsAttachments from "../../attachments/page";
import WbsAssignmentForm from "../../wbsAssignments/_components/Form";
import TaskQuickDetail from "./TaskQuickDetail";
type TaskCardProps = {
  task: Task;
  isOverlay?: boolean;
};
type DialogContentType =
  | "attachments"
  | "avatars"
  | "task-details"
  | "assignTask"
  | null;
export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContentType, setDialogContentType] =
    useState<DialogContentType>(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: task.id });
  const combinedRef = (node: HTMLElement | null) => {
    setNodeRef(node);
    if (!isOverlay) setDroppableRef(node);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  const handleContentClick =
    (contentType: DialogContentType) => (event: React.MouseEvent) => {
      event.stopPropagation();
      setDialogContentType(contentType);
      setDialogOpen(true);
    };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogContentType(null);
  };
  const theme = useTheme();
  const handleMenuClose = () => setMenuAnchor(null);
  const renderDialogContent = () => {
    switch (dialogContentType) {
      case "task-details":
        return <TaskQuickDetail task={task} />;

        return (
          <WbsAssignmentForm
            formMode="create"
            defaultValues={{ wbsItem: { id: task.id } }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <>
      <Paper
        ref={combinedRef}
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
        sx={{
          bgcolor: isOverlay
            ? "backgroundSection.main"
            : alpha(task.color || theme.palette.background.paper, 0.3),
          position: "relative",
          p: 0,
        }}
      >
        <Box
          className="flex flex-col items-start gap-2 p-4"
          onClick={handleContentClick("task-details")}
          sx={{
            cursor: isOverlay ? "grabbing" : "pointer",
          }}
        >
          <Typography>{task.title}</Typography>
        </Box>
        <TaskMenuButton onClick={handleMenuClick} />
      </Paper>
      <Dialog
        onPointerDown={(e) => e.stopPropagation()}
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth={"lg"}
        fullWidth
        sx={{ overflow: "hidden" }}
      >
        <AppBar
          position="relative"
          elevation={0}
          sx={{
            m: 0,
            p: 2,
            borderRadius: 1,
            background: "transparent",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              bgcolor: "error.main",
              color: "error.contrastText",
              "&:hover": {
                bgcolor: "error.dark",
              },
              transition: "background-color 0.2s ease",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Close />
          </IconButton>
        </AppBar>
        <DialogContent
          sx={{
            p: 0,
            overflow: "hidden",
          }}
        >
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
      <TaskPopover
        task={task}
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      />
    </>
  );
}
