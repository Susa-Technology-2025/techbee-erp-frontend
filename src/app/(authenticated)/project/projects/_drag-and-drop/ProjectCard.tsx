"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  useTheme,
  LinearProgress,
  alpha,
} from "@mui/material";
import {
  MoreVert,
  Business,
} from "@mui/icons-material";
import { Project } from "./schema";

interface ProjectCardProps {
  project: Project;
  onProjectSelect: (project: Project) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onProjectSelect,
  onMenuClick,
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      case "Draft":
        return "default";
      default:
        return "default";
    }
  };

  const progress = project.totalPercentCompletion || 0;
  const customer = project.customerName || "—";
  const budget =
    project.currency && project.totalBudget
      ? `${project.currency} ${project.totalBudget.toLocaleString()}`
      : "—";

  const cardStyles = {
    cursor: "pointer",
    borderRadius: 2,
    height: 240,
    width: 350,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    "&:hover": {
      borderColor: theme.palette.divider,
      boxShadow: theme.shadows[1],
    },
    transition: "all 0.2s ease",
  };

  const contentStyles = {
    p: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const progressBarStyles = {
    height: 4,
    borderRadius: 2,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    "& .MuiLinearProgress-bar": {
      borderRadius: 2,
      bgcolor: theme.palette.primary.main,
    },
  };

  const smallIconStyles = {
    fontSize: "0.875rem",
    color: alpha(theme.palette.text.secondary, 0.7),
  };

  const smallChipStyles = {
    height: 20,
    fontSize: "0.65rem",
    fontWeight: 500,
    borderRadius: 1,
  };

  const riskChipStyles = {
    ...smallChipStyles,
    bgcolor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
  };

  const handleCardClick = () => onProjectSelect(project);
  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) =>
    onMenuClick(e, project);

  return (
    <Card onClick={handleCardClick} sx={cardStyles}>
      <CardContent sx={contentStyles}>
        {/* Header Section */}
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.7rem",
                }}
              >
                {project.code}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Status Chip */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={project.approvalStatus}
            color={getStatusColor(project.approvalStatus)}
            size="small"
            sx={smallChipStyles}
          />
        </Box>

        {/* Progress Section */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={progressBarStyles}
          />
        </Box>

        {/* Details Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Business sx={smallIconStyles} />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {customer}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {budget}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
