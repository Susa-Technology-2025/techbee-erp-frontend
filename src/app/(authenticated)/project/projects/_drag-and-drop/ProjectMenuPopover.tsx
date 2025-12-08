"use client";
import React from "react";
import {
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Explore, Edit } from "@mui/icons-material";

interface ProjectMenuPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onExploreProject: () => void;
  onEditProject: () => void;
}

const ProjectMenuPopover: React.FC<ProjectMenuPopoverProps> = ({
  anchorEl,
  onClose,
  onExploreProject,
  onEditProject,
}) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
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
    >
      <List sx={{ width: 200 }}>
        <ListItemButton onClick={onExploreProject}>
          <ListItemIcon>
            <Explore fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Explore Project" />
        </ListItemButton>
        <ListItemButton onClick={onEditProject}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Project" />
        </ListItemButton>
      </List>
    </Popover>
  );
};

export default ProjectMenuPopover;
