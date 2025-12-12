import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Close,
  Timeline,
  Description,
  Group,
  ChangeCircle,
  BarChart,
  Event,
} from "@mui/icons-material";
import Milestones from "../../milestones/page";
import ChangeRequest from "../../changeRequests/page";
import ProjectAssignment from "../../projectAssignments/page";
import ProjectContract from "../../projectContracts/page";
import WbsItems from "../../wbsItems/page";
import TimeEntries from "../../timeEntries/page";
interface ProjectSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  project: any;
}
const ProjectSettingsDrawer: React.FC<ProjectSettingsDrawerProps> = ({
  open,
  onClose,
  project,
}) => {
  const menuSectionsWithComponents = [
    {
      id: "milestones",
      icon: <Timeline />,
      title: "Milestones",
      description: "Track project milestones and deadlines",
      color: "#4f46e5",
      count: project?._count?.milestones || project?.milestones?.length || 0,
      Component: Milestones,
    },
    {
      id: "wbsitems",
      icon: <BarChart />,
      title: "Tasks",
      description: "Work Breakdown Structure items",
      color: "#dc2626",
      count: project?._count?.wbsItems || project?.wbsItems?.length || 0,
      Component: WbsItems,
    },
    {
      id: "assignments",
      icon: <Group />,
      title: "Assignments",
      description: "Project and WBS assignments",
      color: "#ea580c",
      count: project?._count?.assignments || project?.assignments?.length || 0,
      Component: ProjectAssignment,
    },
    {
      id: "timentries",
      icon: <Event />,
      title: "Time Entries",
      description: "Timesheet Time Entries",
      color: "#dc2626",
      count: project?._count?.timeEntries || project?.timeEntries?.length || 0,
      Component: TimeEntries,
    },
    {
      id: "contracts",
      icon: <Description />,
      title: "Contracts",
      description: "Project contracts and agreements",
      color: "#0891b2",
      count: project?._count?.contracts || project?.contracts?.length || 0,
      Component: ProjectContract,
    },
    {
      id: "changeRequests",
      icon: <ChangeCircle />,
      title: "Change Requests",
      description: "Manage project change requests",
      color: "#c026d3",
      count:
        project?._count?.changeRequest || project?.changeRequest?.length || 0,
      Component: ChangeRequest,
    },
  ];
  const [selectedSection, setSelectedSection] = useState("milestones");
  const selectedSectionData = menuSectionsWithComponents.find(
    (section) => section.id === selectedSection
  );
  const Contentology = selectedSectionData
    ? selectedSectionData.Component
    : Milestones;
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          height: "90vh",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          background: "background.paper",
        },
      }}
    >
      <Box className="flex flex-col h-full">
        <Box className="flex items-center justify-between p-3 font-bold">
          <Box>
            <Typography variant="body1">
              {project?.title} • {project?.code}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="large">
            <Close />
          </IconButton>
        </Box>
        <Box className="flex flex-1 overflow-hidden">
          <Box className="w-80 overflow-y-auto">
            <Box className="p-3">
              <List className="space-y-2">
                {menuSectionsWithComponents.map((section) => (
                  <ListItemButton
                    key={section.id}
                    selected={selectedSection === section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className="rounded-xl transition-all duration-200 hover:shadow-md"
                    sx={{
                      backgroundColor:
                        selectedSection === section.id
                          ? "backgroundSection.main"
                          : "transparent",
                      borderLeft:
                        selectedSection === section.id
                          ? `4px solid ${section.color}`
                          : "4px solid transparent",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Badge
                        badgeContent={section.count}
                        color="primary"
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: section.color,
                          },
                        }}
                      >
                        <Box sx={{ color: section.color }}>{section.icon}</Box>
                      </Badge>
                    </ListItemIcon>
                    <Box className="flex-1">
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            className="font-semibold"
                          >
                            {section.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2">
                            {section.description}
                          </Typography>
                        }
                      />
                    </Box>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
          <Box className="flex-1 overflow-y-auto h-full">
            <Contentology
              idString={"?where[project][id]=" + project.id}
              defaultValues={{ project: { id: project.id } }}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
export default ProjectSettingsDrawer;
