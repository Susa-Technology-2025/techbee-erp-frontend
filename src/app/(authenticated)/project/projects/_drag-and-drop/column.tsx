import { useDroppable, useDraggable } from "@dnd-kit/core";
import { TaskCard } from "./card";
import { AddCard } from "./add-card";
import { Column as ColumnType, Task } from "./types";
import {
  Box,
  IconButton,
  useTheme,
  Paper,
  Typography,
  Stack,
  alpha,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { ColumnPopover } from "./column-popover";
type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
  onAddCard: (task: Omit<Task, "id">) => void;
  project: any;
};
export function Column({ column, tasks, onAddCard, project }: ColumnProps) {
  const theme = useTheme();
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
    activeNodeRect,
    activatorEvent,
    active,
    node,
    over,
    setActivatorNodeRef,
  } = useDraggable({
    id: `column-${column.id}`,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 500,
      }
    : undefined;
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const popoverOpen = Boolean(anchorEl);
  return (
    <>
      <Paper
        ref={setDraggableNodeRef}
        {...listeners}
        {...attributes}
        sx={{
          width: 320,
          minWidth: 300,
          maxHeight: 500,
          m: 0,
          // flexGrow: 1,
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: isDragging ? "relative" : undefined,
          bgcolor:
            isOver || isDragging
              ? alpha(theme.palette.section.main, 0.5)
              : alpha(column?.color || theme.palette.section.main, 0.5),
          cursor: isDragging ? "grabbing" : "grab",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme.shadows[4],
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
          // borderTop: `6px solid ${column.color}`,
          ...style,
        }}
        elevation={isDragging ? 8 : 2}
      >
        <Box
          sx={{
            display: "flex",
            p: 2,
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            position: "relative",
            // bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
                background: `linear-gradient(135deg, ${
                  theme.palette.text.primary
                } 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {column.name}
            </Typography>
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                px: 1.5,
                py: 0.5,
                borderRadius: 12,
                fontSize: "0.75rem",
                fontWeight: 600,
                minWidth: 24,
                textAlign: "center",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              {tasks.length} task{tasks.length > 1 ? "s" : ""}
            </Box>
          </Box>
          <IconButton
            size="small"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleMoreClick}
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <Box
          ref={setDroppableNodeRef}
          sx={{
            p: 1,
            flexGrow: 1,
          }}
        >
          <Stack spacing={2.5}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            <AddCard
              columnId={column.id}
              onAddCard={onAddCard}
              column={column}
              project={project}
            />
          </Stack>
        </Box>
      </Paper>
      <ColumnPopover
        column={column}
        anchorEl={anchorEl}
        open={popoverOpen}
        onClose={handlePopoverClose}
      />
    </>
  );
}
