import { useDroppable, useDraggable } from "@dnd-kit/core";
import { TaskCard } from "./card";
import { AddCard } from "./add-card";
import { Column as ColumnType, Task } from "./types";
import {
  Paper,
  Typography,
  Stack,
  alpha,
  IconButton,
  Box,
  useTheme,
  Fade,
} from "@mui/material";
import { MoreVert, DragIndicator } from "@mui/icons-material";
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
  } = useDraggable({
    id: `column-${column.id}`,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 500,
        rotate: transform.x !== 0 ? `${transform.x * 0.01}deg` : "0deg",
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative transition-all duration-200 ease-out"
        sx={{
          width: "288px",
          minWidth: "288px",
          height: "fit-content",
          maxHeight: "calc(80vh - 160px)",
          margin: 0,
          scrollbarWidth: "thin",
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          position: isDragging ? "relative" : "static",
          backgroundColor:
            isOver || isDragging
              ? alpha(column?.color || theme.palette.section.main, 0.08)
              : alpha(theme.palette.background.paper, 0.98),
          cursor: isDragging ? "grabbing" : "grab",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          ...style,
        }}
      >
        {}
        <Box
          className="flex items-center justify-between px-3 py-2.5"
          sx={{
            borderBottom: `0.5px solid ${alpha(theme.palette.divider, 0.1)}`,
            // backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backgroundColor: alpha(
              column.color || theme.palette.primary.main,
              0.6
            ),
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box className="flex items-center gap-2 flex-1 min-w-0">
            <Fade in={isHovered}>
              <DragIndicator
                // className="text-gray-400"
                sx={{
                  fontSize: "16px",
                  opacity: 0.5,
                  "&:hover": { opacity: 1 },
                }}
              />
            </Fade>
            <Typography
              variant="subtitle2"
              className="font-semibold truncate"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: theme.palette.text.primary,
                flex: 1,
                minWidth: 0,
              }}
            >
              {column.name}
            </Typography>
            <Box
              className="flex items-center justify-center"
              sx={{
                color: column.color || theme.palette.primary.main,
                borderRadius: "8px",
                padding: "2px 8px",
                minWidth: "24px",
                height: "20px",
                border: `0.5px solid white`,
              }}
            >
              <Typography
                className="font-bold"
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "text.primary",
                }}
              >
                {tasks.length} tasks
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleMoreClick}
            onPointerDown={(e) => e.stopPropagation()}
            className="ml-2"
            sx={{
              padding: "4px",
              backgroundColor: "transparent",
              color: theme.palette.text.disabled,
              border: `0.5px solid transparent`,
              borderRadius: "6px",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <MoreVert sx={{ fontSize: "18px" }} />
          </IconButton>
        </Box>
        {}
        <Box
          ref={setDroppableNodeRef}
          className="flex-1 p-2"
          sx={{
            minHeight: "120px",
            backgroundColor: isOver
              ? alpha(
                  theme.palette.section.main || theme.palette.primary.main,
                  0.03
                )
              : "transparent",
            transition: "background-color 0.2s ease",
            border: isOver
              ? `1px dashed ${alpha(
                  column.color || theme.palette.primary.main,
                  0.3
                )}`
              : "1px dashed transparent",
            borderRadius: "8px",
            margin: "0 4px 4px",
          }}
        >
          <Stack spacing={1.5} className="pb-1">
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
        {}
        {isDragging && (
          <Box
            className="absolute inset-0"
            sx={{
              backgroundColor: alpha(
                column.color || theme.palette.primary.main,
                0.05
              ),
              backdropFilter: "blur(2px)",
              border: `2px solid ${alpha(
                column.color || theme.palette.primary.main,
                0.2
              )}`,
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />
        )}
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
