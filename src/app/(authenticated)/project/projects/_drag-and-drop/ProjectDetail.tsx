import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Fab,
  useTheme,
  Chip,
  Avatar,
  AvatarGroup,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Button,
  CircularProgress,
  InputAdornment,
  Avatar as MuiAvatar,
  DialogActions,
  Divider,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack,
  Settings,
  Star,
  CalendarToday,
  People,
  PersonAdd,
  Search,
  Work,
  Percent,
  DateRange,
  Close,
} from "@mui/icons-material";
import Projectology from "../_drag-and-drop";
import ProjectSettingsDrawer from "./ProjectSettingsDrawer";
import { Project } from "../_components/schema";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onBackToList: () => void;
  onProjectSelect: (project: Project) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Transform utility functions
interface NestedObject {
  [key: string]: any;
}

const getNestedWriteAction = (
  nestedData: NestedObject
): "create" | "update" => {
  return nestedData.id ? "update" : "create";
};

const cleanNestedObject = (
  data: NestedObject,
  action: "create" | "update"
): NestedObject => {
  const cleaned: NestedObject = {};
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const value = data[key];
    if (
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "createdBy" ||
      key === "updatedBy"
    ) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      const cleanedNested = cleanNestedObject(value, action);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
    } else {
      cleaned[key] = value;
    }
  }
  if (action === "create") {
    delete cleaned.id;
  }
  return cleaned;
};

const isTargetListWriteOperation = (value: NestedObject): boolean => {
  const keys = Object.keys(value);
  return keys.some((key) => key === "create" || key === "update");
};

export const transformToPrismaInput = (data: NestedObject): NestedObject => {
  const result: NestedObject = {};
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const value = data[key];
    if (
      key === "createdAt" ||
      key === "updatedAt" ||
      key === "createdBy" ||
      key === "updatedBy"
    ) {
      continue;
    }
    if (value === null || value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      const arrayContainsObjects = value.every(
        (item) => typeof item === "object" && item !== null
      );
      if (arrayContainsObjects) {
        const createItems: NestedObject[] = [];
        const updateItems: NestedObject[] = [];
        value.forEach((item) => {
          if (item.id) {
            const cleanedData = cleanNestedObject(item, "update");
            delete cleanedData.id;
            if (Object.keys(cleanedData).length > 0) {
              updateItems.push({
                where: { id: item.id },
                data: cleanedData,
              });
            }
          } else {
            const cleanedData = cleanNestedObject(item, "create");
            if (Object.keys(cleanedData).length > 0) {
              createItems.push(cleanedData);
            }
          }
        });
        const operation: NestedObject = {};
        if (createItems.length > 0) {
          operation.create = createItems;
        }
        if (updateItems.length > 0) {
          operation.update = updateItems;
        }
        if (Object.keys(operation).length > 0) {
          result[key] = operation;
        }
        continue;
      }
    }
    const isNestedObject =
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date);
    if (isNestedObject) {
      if (key === "metadata") {
        result[key] = value;
        continue;
      }
      if (isTargetListWriteOperation(value)) {
        const cleanedOperations: NestedObject = {};
        for (const opKey of ["create", "update"]) {
          const opValue = value[opKey];
          if (opValue && Array.isArray(opValue)) {
            cleanedOperations[opKey] = opValue
              .map((item) => {
                if (opKey === "create") {
                  return cleanNestedObject(item, "create");
                } else if (opKey === "update") {
                  if (item.data) {
                    return {
                      where: item.where,
                      data: cleanNestedObject(item.data, "update"),
                    };
                  }
                  return item;
                }
                return item;
              })
              .filter((item) => {
                if (opKey === "update") {
                  return item.data && Object.keys(item.data).length > 0;
                }
                return (
                  typeof item === "object" &&
                  item !== null &&
                  Object.keys(item).length > 0
                );
              });
            if (cleanedOperations[opKey].length === 0) {
              delete cleanedOperations[opKey];
            }
          }
        }
        if (Object.keys(cleanedOperations).length > 0) {
          result[key] = cleanedOperations;
        }
        continue;
      }
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === "id") {
        result[key] = { connect: value };
        continue;
      }
      const action = getNestedWriteAction(value);
      const cleanedNestedObject = cleanNestedObject(value, action);
      if (Object.keys(cleanedNestedObject).length > 0) {
        result[key] = { [action]: cleanedNestedObject };
      }
    } else {
      result[key] = value;
    }
  }
  const finalResult: NestedObject = {};
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) continue;
    const value = result[key];
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 1 &&
      Object.keys(value)[0] === "connect"
    ) {
      const connectValue = value.connect;
      if (
        typeof connectValue === "object" &&
        connectValue !== null &&
        !Array.isArray(connectValue) &&
        Object.keys(connectValue).length === 1 &&
        Object.keys(connectValue)[0] === "id"
      ) {
        finalResult[key] = connectValue;
        continue;
      }
    }
    finalResult[key] = value;
  }
  return finalResult;
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  allProjects,
  onBackToList,
  onProjectSelect,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [memberDetailsOpen, setMemberDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const theme = useTheme();

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useDataQuery({
    apiEndPoint: "https://auth.api.techbee.et/api/users",
    noFilter: true,
    fetchWithoutRefresh: true,
  });

  // Add mutation for updating project assignments
  const { mutate: updateProjectAssignments, isPending: isUpdating } = useDataMutation({
    apiEndPoint: `https://project.api.techbee.et/api/projects/${project.id}`,
    method: "PATCH",
    // enabled: false,
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Successfully assigned users to the project",
        severity: "success",
      });
      handleCloseInviteDialog();
      // You might want to refresh the project data here
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: "Failed to assign users. Please try again.",
        severity: "error",
      });
    },
  });

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleOpenInviteDialog = () => {
    setInviteDialogOpen(true);
    setSelectedUsers([]);
    setUserRoles({});
    setSearchTerm("");
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
    setSelectedUsers([]);
    setUserRoles({});
    setSearchTerm("");
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

      // Remove role when user is deselected
      if (!newSelectedUsers.includes(userId)) {
        const newRoles = { ...userRoles };
        delete newRoles[userId];
        setUserRoles(newRoles);
      } else {
        // Set default role for new user
        setUserRoles(prevRoles => ({
          ...prevRoles,
          [userId]: "Team Member"
        }));
      }

      return newSelectedUsers;
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  const prepareAssignmentsData = () => {
    // First, handle existing assignments (update to remove if needed, or keep)
    const existingAssignments = project.assignments || [];
    const existingIds = existingAssignments.map(a => a.id).filter(Boolean);

    // For simplicity, we'll create new assignments for selected users
    // You can modify this to handle updates/deletes as needed
    const newAssignments = selectedUsers.map(userId => {
      const user = filteredUsers.find((u: any) => u.id === userId);
      const role = userRoles[userId] || "Team Member";

      return {
        employeeId: userId,
        internalResourceName: user?.name || user?.email,
        externalResourceName: user?.email,
        role: role,
        allocationPercent: 100,
        startDate: new Date().toISOString(),
        endDate: null,
        isOwner: role === "Owner",
        // projectId: project.id
      };
    });

    // Combine with existing assignments
    const allAssignments = [
      ...existingAssignments.map(assignment => ({
        ...assignment,
        // Keep existing assignments as-is
      })),
      ...newAssignments
    ];

    // Filter out duplicates based on employeeId
    const uniqueAssignments = allAssignments.filter((assignment, index, self) =>
      index === self.findIndex((a) => a.employeeId === assignment.employeeId)
    );

    return uniqueAssignments;
  };

  const handleAssignUsers = async () => {
    try {
      setLoading(true);

      const assignments = prepareAssignmentsData();

      // Transform using the utility function
      const transformedData = transformToPrismaInput({
        assignments: assignments
      });

      // Prepare the update payload
      const updatePayload = {
        assignments: transformedData.assignments || { create: [] }
      };

      // Make the API call
      updateProjectAssignments(updatePayload);

    } catch (error) {
      console.error("Error assigning users:", error);
      setSnackbar({
        open: true,
        message: "Failed to assign users. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMemberDetails = (assignment: any) => {
    setSelectedMember(assignment);
    setMemberDetailsOpen(true);
  };

  const handleCloseMemberDetails = () => {
    setMemberDetailsOpen(false);
    setSelectedMember(null);
  };

  const generateRandomColor = (seed: string) => {
    const colors = [
      "#6c63ff",
      "#ff6584",
      "#00d4aa",
      "#ffb74d",
      "#36d1dc",
      "#5b86e5",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
      "#fa709a",
      "#fee140",
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
    ];
    const hash = seed.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const teamMembers = useMemo(() => {
    if (!project?.assignments || project?.assignments.length === 0) {
      return [];
    }
    return project?.assignments.map((assignment) => ({
      id: assignment.id,
      name:
        assignment.internalResourceName ||
        assignment.externalResourceName ||
        "Unknown",
      initials: (
        assignment.internalResourceName ||
        assignment.externalResourceName ||
        "U"
      )
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
      role: assignment.role,
      allocationPercent: assignment.allocationPercent,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      isOwner: assignment.isOwner,
      externalResourceName: assignment.externalResourceName,
      internalResourceName: assignment.internalResourceName,
      color: generateRandomColor(
        assignment.employeeId ||
        assignment.id ||
        assignment.internalResourceName
      ),
      rawAssignment: assignment,
    }));
  }, [project?.assignments]);

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    const users = Array.isArray(usersData) ? usersData : [];

    // Filter out users already assigned to the project
    const assignedUserIds = new Set(
      project.assignments?.map(assignment => assignment.employeeId).filter(Boolean) || []
    );

    return users.filter((user: any) => {
      const userName = user.name || user.username || user.email || "";
      const userEmail = user.email || "";
      const searchLower = searchTerm.toLowerCase();

      // Check if user matches search AND is not already assigned
      return (
        (userName.toLowerCase().includes(searchLower) ||
          userEmail.toLowerCase().includes(searchLower)) &&
        !assignedUserIds.has(user.id)
      );
    });
  }, [usersData, searchTerm, project.assignments]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const deadline = project.plannedEndDate || project.actualEndDate || null;
  const progress = project?.totalPercentCompletion || 0;

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      className="w-full h-full flex flex-col relative overflow-auto"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <Box
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 relative z-10"
        sx={{
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.section.main, 0.6)} 0%, 
            ${alpha(theme.palette.section.main, 0.8)} 50%, 
            ${alpha(theme.palette.section.main, 1)} 100%)`,
        }}
      >
        <Box className="flex items-start space-x-4 flex-1">
          <IconButton
            onClick={onBackToList}
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.action.hover, 0.9),
                transform: "translateY(-2px)",
              },
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: "all 0.3s ease",
              mt: 0.5,
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box className="flex flex-col space-y-2 flex-1">
            <Box className="flex items-center space-x-3">
              <Typography
                className="font-bold"
                sx={{
                  color: theme.palette.info.contrastText,
                  background: `linear-gradient(135deg, ${theme.palette.primary.contrastText} 0%, ${theme.palette.secondary.contrastText} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  fontWeight: 800,
                  fontSize: { sm: "1rem", md: "2rem", lg: "3rem" },
                }}
              >
                {project.title}
              </Typography>
              <Chip
                icon={<Star sx={{ fontSize: 16 }} />}
                label={project.projectStage?.name || "Active"}
                size="small"
                sx={{ color: "white" }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.info.contrastText, 0.8),
                maxWidth: "500px",
              }}
            >
              {project.description ||
                "Manage your project tasks and collaborate with your team efficiently."}
            </Typography>
            <Box className="flex flex-wrap items-center gap-4 mt-3">
              <Box className="flex items-center space-x-2">
                <CalendarToday
                  sx={{
                    fontSize: 18,
                    color: alpha(theme.palette.info.contrastText, 0.7),
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: alpha(theme.palette.info.contrastText, 0.8) }}
                >
                  {deadline
                    ? `Due: ${formatDate(deadline)}`
                    : "No deadline set"}
                </Typography>
              </Box>
              {teamMembers.length > 0 && (
                <Tooltip title="Click to view team members">
                  <Box
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => {
                      if (teamMembers.length > 0) {
                        handleOpenMemberDetails(teamMembers[0].rawAssignment);
                      }
                    }}
                  >
                    <People
                      sx={{
                        fontSize: 18,
                        color: alpha(theme.palette.info.contrastText, 0.7),
                      }}
                    />
                    <AvatarGroup
                      max={4}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 28,
                          height: 28,
                          fontSize: 12,
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        },
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {teamMembers.map((member, index) => (
                        <Avatar
                          key={member.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMemberDetails(member.rawAssignment);
                          }}
                          sx={{
                            bgcolor: member.color,
                            fontSize: "12px",
                            fontWeight: 600,
                            border: member.isOwner
                              ? `2px solid ${theme.palette.warning.main}`
                              : "none",
                            cursor: "pointer",
                          }}
                        >
                          {member.initials}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha(theme.palette.info.contrastText, 0.7),
                        cursor: "pointer",
                      }}
                    >
                      {teamMembers.length} member
                      {teamMembers.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
              {project.customerName && (
                <Chip
                  label={project.customerName}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.info.contrastText, 0.3),
                    color: theme.palette.info.contrastText,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Tooltip title="Assign Team Members">
            <IconButton
              onClick={handleOpenInviteDialog}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.9),
                  color: theme.palette.primary.main,
                  transform: "translateY(-2px)",
                },
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.common.black,
                  0.1
                )}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "all 0.3s ease",
              }}
            >
              <PersonAdd />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Member Details Dialog */}
      <Dialog
        open={memberDetailsOpen}
        onClose={handleCloseMemberDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedMember && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Team Member Details</Typography>
                <IconButton onClick={handleCloseMemberDetails} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                gap={3}
              >
                <Box
                  sx={{
                    flex: { md: 1 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: { xs: 3, md: 0 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: 36,
                      fontWeight: 600,
                      mb: 2,
                      bgcolor: generateRandomColor(
                        selectedMember.employeeId ||
                        selectedMember.id ||
                        selectedMember.internalResourceName
                      ),
                      border: selectedMember.isOwner
                        ? `3px solid ${theme.palette.warning.main}`
                        : "none",
                    }}
                  >
                    {(
                      selectedMember.internalResourceName ||
                      selectedMember.externalResourceName ||
                      "U"
                    )
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom align="center">
                    {selectedMember.internalResourceName ||
                      selectedMember.externalResourceName ||
                      "Unknown"}
                  </Typography>
                  <Chip
                    label={
                      selectedMember.isOwner ? "Project Owner" : "Team Member"
                    }
                    color={selectedMember.isOwner ? "warning" : "default"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Box sx={{ flex: { md: 2 } }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        gutterBottom
                      >
                        Assignment Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box
                          sx={{
                            flex: {
                              xs: "1 0 100%",
                              sm: "1 0 calc(50% - 16px)",
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <Work
                              sx={{
                                mr: 1,
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Role
                              </Typography>
                              <Typography variant="body1">
                                {selectedMember.role || "Not specified"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            flex: {
                              xs: "1 0 100%",
                              sm: "1 0 calc(50% - 16px)",
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <Percent
                              sx={{
                                mr: 1,
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Allocation
                              </Typography>
                              <Typography variant="body1">
                                {selectedMember.allocationPercent || 0}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            flex: {
                              xs: "1 0 100%",
                              sm: "1 0 calc(50% - 16px)",
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <DateRange
                              sx={{
                                mr: 1,
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Start Date
                              </Typography>
                              <Typography variant="body1">
                                {formatDate(selectedMember.startDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            flex: {
                              xs: "1 0 100%",
                              sm: "1 0 calc(50% - 16px)",
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <DateRange
                              sx={{
                                mr: 1,
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                End Date
                              </Typography>
                              <Typography variant="body1">
                                {selectedMember.endDate
                                  ? formatDate(selectedMember.endDate)
                                  : "Ongoing"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  {teamMembers.length > 1 && (
                    <Box mt={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Other Team Members
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {teamMembers
                          .filter((member) => member.id !== selectedMember.id)
                          .map((member) => (
                            <Chip
                              key={member.id}
                              avatar={
                                <Avatar
                                  sx={{
                                    bgcolor: member.color,
                                    fontSize: "10px",
                                    width: 24,
                                    height: 24,
                                  }}
                                >
                                  {member.initials}
                                </Avatar>
                              }
                              label={member.name}
                              onClick={() =>
                                handleOpenMemberDetails(member.rawAssignment)
                              }
                              variant="outlined"
                              size="small"
                            />
                          ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMemberDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Assign Users Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={handleCloseInviteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Team Members to {project.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Role assignment section */}
          {selectedUsers.length > 0 && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Assign Roles for Selected Users
              </Typography>
              {selectedUsers.map((userId) => {
                const user = filteredUsers.find((u: any) => u.id === userId);
                return (
                  <Box key={userId} display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {user?.name || user?.email}
                    </Typography>
                    <FormControl size="small" sx={{ width: 150 }}>
                      <Select
                        value={userRoles[userId] || "Team Member"}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                      >
                        <MenuItem value="Team Member">Team Member</MenuItem>
                        <MenuItem value="Project Manager">Project Manager</MenuItem>
                        <MenuItem value="Developer">Developer</MenuItem>
                        <MenuItem value="Designer">Designer</MenuItem>
                        <MenuItem value="Tester">Tester</MenuItem>
                        <MenuItem value="Owner">Owner</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                );
              })}
            </Box>
          )}

          {usersLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : usersError ? (
            <Box display="flex" justifyContent="center" p={3}>
              <Typography color="error">Failed to load users</Typography>
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box display="flex" justifyContent="center" p={3}>
              <Typography color="textSecondary">
                {searchTerm ? "No matching users found" : "No users available to assign"}
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {filteredUsers.map((user: any) => (
                <ListItem
                  key={user.id}
                  button
                  onClick={() => handleUserSelect(user.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                  />
                  <ListItemAvatar>
                    <MuiAvatar
                      sx={{
                        bgcolor: generateRandomColor(user.id || user.email),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.name?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </MuiAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name || user.username || user.email}
                    secondary={user.email || user.role}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {selectedUsers.length > 0 && (
            <Box
              mt={2}
              p={2}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                Selected {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Cancel</Button>
          <Button
            onClick={handleAssignUsers}
            variant="contained"
            disabled={selectedUsers.length === 0 || loading || isUpdating}
            startIcon={(loading || isUpdating) ? <CircularProgress size={20} /> : null}
          >
            {(loading || isUpdating) ? "Assigning..." : "Assign Selected Users"}
          </Button>
        </DialogActions>
      </Dialog>
      {}
      {}
      <Box
        className="flex-1 p-6 relative z-10"
        sx={{
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.background.default,
            0
          )} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            height: "100%",
          }}
        >
          <Projectology project={project} />
        </Box>
      </Box>

      {/* Settings FAB */}
      <Box className="fixed bottom-8 right-8 z-50">
        <Fab
          variant="extended"
          color="primary"
          onClick={toggleSettings}
          className="shadow-2xl hover:shadow-3xl transition-all duration-300 px-6 py-4"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              transform: "translateY(-4px) scale(1.05)",
              boxShadow: `0 20px 40px ${alpha(
                theme.palette.primary.main,
                0.3
              )}`,
            },
            boxShadow: `0 15px 35px ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: "16px",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transition: "left 0.5s ease",
            },
            "&:hover::before": {
              left: "100%",
            },
          }}
        >
          <Settings sx={{ mr: 2, fontSize: 20 }} />
          Project Tools
        </Fab>
      </Box>

      {/* Settings Drawer */}
      <ProjectSettingsDrawer
        open={settingsOpen}
        onClose={toggleSettings}
        project={project}
      />

      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "3%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(${alpha(
            theme.palette.secondary.main,
            0.08
          )} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetail;