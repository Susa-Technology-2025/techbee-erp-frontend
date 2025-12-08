import { Task } from "./types";
import {
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Schedule as ScheduleIcon,
  Scale as ScaleIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Approval as ApprovalIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Comment as CommentIcon,
  Attachment as AttachmentIcon,
  Link as LinkIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  styled,
} from "@mui/material";
import { useState } from "react";

interface TaskGeneralizationProps {
  task: Task;
}

// Custom styled components
const CompactAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "transparent",
  "&:before": { display: "none" },
  boxShadow: "none",
  margin: 0,
  padding: 0,
  minHeight: "auto",
  "&.Mui-expanded": {
    margin: 0,
  },
}));

const CompactAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: 24,
  padding: "2px 0",
  "& .MuiAccordionSummary-content": {
    margin: 0,
    alignItems: "center",
    gap: 4,
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    padding: 0,
    marginLeft: 4,
  },
}));

const CompactAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: "4px 0 0 0",
  margin: 0,
}));

export const TaskGeneralization = ({ task }: TaskGeneralizationProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<
      string,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      Draft: "default",
      "In Progress": "info",
      Completed: "success",
      Approved: "primary",
      Rejected: "error",
      Done: "success",
    };
    return colors[status] || "default";
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 0.5,
        }}
      >
        {/* Status & Progress */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          <Chip
            label={task.approvalStatus}
            color={getStatusColor(task.approvalStatus)}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              px: 0.75,
              py: 0.25,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderRadius: "12px",
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <TimelineIcon
              sx={{ width: 14, height: 14, color: theme.palette.success.main }}
            />
            <Typography
              variant="body2"
              fontWeight="bold"
              color={theme.palette.success.main}
              sx={{ fontSize: "0.85rem" }}
            >
              {task.percentCompletion}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={task.percentCompletion}
        sx={{
          height: 4,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.15),
          "& .MuiLinearProgress-bar": {
            bgcolor: theme.palette.success.main,
            borderRadius: 2,
          },
        }}
      />

      {/* Primary Metrics Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flexWrap: "wrap",
          py: 0.25,
        }}
      >
        {/* Task Stage */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: task.taskStage.color,
              border: `1px solid ${alpha("#fff", 0.3)}`,
            }}
          />
          <Typography
            variant="body2"
            color={theme.palette.text.primary}
            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            {task.taskStage.name}
          </Typography>
        </Box>

        {/* Weight */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ScaleIcon
            sx={{ width: 14, height: 14, color: theme.palette.warning.main }}
          />
          <Typography
            variant="body2"
            color={theme.palette.warning.main}
            sx={{ fontSize: "0.85rem", fontWeight: 600 }}
          >
            {task.weightPercent}%
          </Typography>
        </Box>

        {/* SLA Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <CheckCircleIcon
            sx={{
              width: 14,
              height: 14,
              color:
                task.slaState === "Ok"
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            }}
          />
          <Typography
            variant="body2"
            color={
              task.slaState === "Ok"
                ? theme.palette.success.main
                : theme.palette.error.main
            }
            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            {task.slaState}
          </Typography>
        </Box>

        {/* Duration */}
        {task.durationDays && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ScheduleIcon
              sx={{ width: 14, height: 14, color: theme.palette.info.main }}
            />
            <Typography
              variant="body2"
              color={theme.palette.info.main}
              sx={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              {task.durationDays}d
            </Typography>
          </Box>
        )}

        {/* Dates - Pushed to right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarIcon
              sx={{
                width: 14,
                height: 14,
                color: alpha(theme.palette.text.secondary, 0.7),
              }}
            />
            <Typography
              variant="body2"
              color={theme.palette.text.secondary}
              sx={{ fontSize: "0.8rem" }}
            >
              {formatDate(task.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Enhanced Compact Accordion */}
      <CompactAccordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <CompactAccordionSummary
          expandIcon={
            <KeyboardArrowDownIcon
              sx={{
                width: 16,
                height: 16,
                color: theme.palette.primary.main,
                transition: "transform 0.2s ease",
                transform: expanded ? "rotate(180deg)" : "none",
              }}
            />
          }
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 0.75,
              py: 0.25,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: "12px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          >
            <AddCircleIcon
              sx={{
                width: 12,
                height: 12,
                color: theme.palette.primary.main,
                transition: "transform 0.2s",
                transform: expanded ? "rotate(45deg)" : "none",
              }}
            />
            <Typography
              variant="body2"
              color={theme.palette.primary.main}
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {expanded ? "Hide details" : "Show details"}
            </Typography>
          </Box>
        </CompactAccordionSummary>

        <CompactAccordionDetails>
          {/* Configuration Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              mb: 1,
              py: 0.5,
              px: 0.75,
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: "8px",
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ApprovalIcon
                sx={{
                  width: 14,
                  height: 14,
                  color: theme.palette.warning.main,
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                  sx={{ fontSize: "0.75rem", display: "block" }}
                >
                  Approval
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {task.approvalRequired ? "Required" : "Not required"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <NotificationsIcon
                sx={{ width: 14, height: 14, color: theme.palette.info.main }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                  sx={{ fontSize: "0.75rem", display: "block" }}
                >
                  Notify
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {task.notifyTaskAssignmentChanged ? "Enabled" : "Disabled"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <UpdateIcon
                sx={{
                  width: 14,
                  height: 14,
                  color: theme.palette.text.secondary,
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                  sx={{ fontSize: "0.75rem", display: "block" }}
                >
                  Updated
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {formatDate(task.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Activity Counts Row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: 1,
              mb: 1.5,
              py: 0.75,
              px: 1,
              bgcolor: alpha(theme.palette.grey[50], 0.7),
              borderRadius: "8px",
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            }}
          >
            {[
              {
                icon: AssignmentIcon,
                count: task._count.assignments,
                label: "Assign",
                color: theme.palette.primary.main,
              },
              {
                icon: AttachmentIcon,
                count: task._count.attachments,
                label: "Files",
                color: theme.palette.info.main,
              },
              {
                icon: CommentIcon,
                count: task._count.comments,
                label: "Comments",
                color: theme.palette.success.main,
              },
              {
                icon: LinkIcon,
                count:
                  task._count.dependenciesFrom + task._count.dependenciesTo,
                label: "Deps",
                color: theme.palette.warning.main,
              },
            ].map((item, index) => (
              <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.25,
                    mb: 0.25,
                  }}
                >
                  <item.icon
                    sx={{ width: 14, height: 14, color: item.color }}
                  />
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  color={theme.palette.text.primary}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {item.count}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Milestone (if exists) */}
          {task.milestone && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                p: 0.75,
                bgcolor: alpha(theme.palette.secondary.main, 0.08),
                borderRadius: "8px",
                border: `1px solid ${alpha(
                  theme.palette.secondary.main,
                  0.15
                )}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                }}
              >
                <FlagIcon sx={{ width: 14, height: 14 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{ fontSize: "0.9rem" }}
                  noWrap
                >
                  {task.milestone.title}
                </Typography>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Milestone • {task.milestone.code}
                </Typography>
              </Box>
              <Chip
                label={task.milestone.approvalStatus}
                color={getStatusColor(task.milestone.approvalStatus)}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              />
            </Box>
          )}
        </CompactAccordionDetails>
      </CompactAccordion>
    </Box>
  );
};
