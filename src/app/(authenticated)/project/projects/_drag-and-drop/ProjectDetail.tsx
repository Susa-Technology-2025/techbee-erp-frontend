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
  Badge,
  Paper,
  Fade,
  Zoom,
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
  MoreVert,
  FilterList,
  Share,
  Timeline,
  ViewKanban,
  Dashboard,
  Menu as MenuIcon,
  ChevronLeft,
  Notifications,
  Favorite,
  Visibility,
  VisibilityOff,
  Download,
  Print,
  Refresh,
  HelpOutline,
  Fullscreen,
  MoreHoriz,
  KeyboardArrowDown,
  KeyboardArrowUp,
  DragIndicator,
} from "@mui/icons-material";
import Projectology from "../_drag-and-drop";
import ProjectSettingsDrawer from "./ProjectSettingsDrawer";
import { Project } from "../_components/schema";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import { transformToPrismaInput } from "../_components/transformToPrismaInput";

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onBackToList: () => void;
  onProjectSelect: (project: Project) => void;
}

// ... (keep all your existing transform utility functions as they are)

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
  const { mutate: updateProjectAssignments, isPending: isUpdating } =
    useDataMutation({
      apiEndPoint: `https://project.api.techbee.et/api/projects/${project?.id}`,
      method: "PATCH",
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Successfully assigned users to the project",
          severity: "success",
        });
        handleCloseInviteDialog();
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

      if (!newSelectedUsers.includes(userId)) {
        const newRoles = { ...userRoles };
        delete newRoles[userId];
        setUserRoles(newRoles);
      } else {
        setUserRoles((prevRoles) => ({
          ...prevRoles,
          [userId]: "Team Member",
        }));
      }

      return newSelectedUsers;
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const prepareAssignmentsData = () => {
    const existingAssignments = project?.assignments || [];
    const existingIds = existingAssignments.map((a) => a.id).filter(Boolean);

    const newAssignments = selectedUsers.map((userId) => {
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
      };
    });

    const allAssignments = [
      ...existingAssignments.map((assignment) => ({
        ...assignment,
      })),
      ...newAssignments,
    ];

    const uniqueAssignments = allAssignments.filter(
      (assignment, index, self) =>
        index === self.findIndex((a) => a.employeeId === assignment.employeeId)
    );

    return uniqueAssignments;
  };

  const handleAssignUsers = async () => {
    try {
      setLoading(true);
      const assignments = prepareAssignmentsData();
      const transformedData = transformToPrismaInput({
        assignments: assignments,
      });
      const updatePayload = {
        assignments: transformedData.assignments || { create: [] },
      };
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
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.dark,
      theme.palette.secondary.main,
      theme.palette.secondary.light,
      theme.palette.secondary.dark,
      theme.palette.section?.main || theme.palette.primary.main,
      theme.palette.section?.light || theme.palette.primary.light,
      theme.palette.section?.dark || theme.palette.primary.dark,
      theme.palette.backgroundSection?.main || theme.palette.primary.main,
      theme.palette.backgroundSection?.light || theme.palette.primary.light,
      theme.palette.backgroundSection?.dark || theme.palette.primary.dark,
      // Add some variations
      alpha(theme.palette.primary.main, 0.7),
      alpha(theme.palette.secondary.main, 0.7),
      alpha(theme.palette.section?.main || theme.palette.primary.main, 0.7),
    ].filter(Boolean);

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
    const assignedUserIds = new Set(
      project?.assignments
        ?.map((assignment) => assignment?.employeeId)
        .filter(Boolean) || []
    );

    return users.filter((user: any) => {
      const userName = user.name || user.username || user.email || "";
      const userEmail = user.email || "";
      const searchLower = searchTerm.toLowerCase();

      return (
        (userName.toLowerCase().includes(searchLower) ||
          userEmail.toLowerCase().includes(searchLower)) &&
        !assignedUserIds.has(user.id)
      );
    });
  }, [usersData, searchTerm, project?.assignments]);

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

  const deadline = project?.plannedEndDate || project?.actualEndDate || null;
  const progress = project?.totalPercentCompletion || 0;

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        height: "89vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "clip",
        // border: "2px solid red"
        // backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Floating Top Bar */}
      <Fade in={true} timeout={600}>
        <Paper
          elevation={2}
          sx={{
            position: "fixed",
            top: 66,
            left: "52%",
            transform: "translateX(-50%)",
            width: "95%",
            maxWidth: "1400px",
            height: "64px",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 1,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            zIndex: 1000,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Back Button */}
            <Tooltip title="Back to Projects">
              <IconButton
                onClick={onBackToList}
                size="medium"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>

            {/* Project Info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 4,
                  height: 28,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {project.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                  <Chip
                    label={project.projectStage?.name || "Active"}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem',
                    }}
                  />
                  {project.customerName && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.75rem',
                      }}
                    >
                      • {project.customerName}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Center Section - Stats */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Deadline */}
            <Tooltip title={`Due: ${deadline ? formatDate(deadline) : 'No deadline'}`}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                    Deadline
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {deadline ? formatDate(deadline) : "Not set"}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            {/* Progress */}
            <Tooltip title={`Progress: ${progress}%`}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}
                  >
                    <Timeline sx={{ fontSize: 18 }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 17,
                      height: 17,
                      borderRadius: '50%',
                      backgroundColor: progress >= 75 ? theme.palette.success.main :
                        progress >= 50 ? theme.palette.warning.main :
                          theme.palette.error.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.5rem', fontWeight: 700, color: 'white' }}>
                      {progress}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {progress}% Complete
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            {/* Team Members */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (teamMembers.length > 0) {
                    // Get a random team member or the first one
                    const randomIndex = Math.floor(Math.random() * teamMembers.length);
                    handleOpenMemberDetails(teamMembers[randomIndex].rawAssignment);
                  }
                }}
              >
                <People sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                  Team
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>


                  <AvatarGroup
                    max={3}
                    componentsProps={{
                      additionalAvatar: {
                        sx: {
                          width: 20,
                          height: 20,
                          fontSize: 9,
                          border: `1.5px solid ${theme.palette.background.paper}`,
                          cursor: 'pointer',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            transform: 'scale(1.1)',
                          },
                        },
                        onClick: (event) => {
                          event.stopPropagation();
                          // Open a dialog to show all team members
                          // Or you can open the member details for the first extra member
                          if (teamMembers.length > 3) {
                            handleOpenMemberDetails(teamMembers[3].rawAssignment);
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 20,
                        height: 20,
                        fontSize: 9,
                        border: `1.5px solid ${theme.palette.background.paper}`,
                        '&:hover': {
                          transform: 'scale(1.2)',
                        },
                      },
                    }}
                  >
                    {teamMembers.map((member) => (
                      <Tooltip key={member.id} title={member.name}>
                        <Avatar
                          sx={{
                            bgcolor: member.color,
                            fontSize: '9px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenMemberDetails(member.rawAssignment)}
                        >
                          {member.initials}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      cursor: teamMembers.length > 0 ? 'pointer' : 'default',
                      '&:hover': teamMembers.length > 0 ? {
                        textDecoration: 'underline',
                        color: theme.palette.primary.main,
                      } : {},
                    }}
                    onClick={() => {
                      if (teamMembers.length > 0) {
                        // Get a random team member or the first one
                        const randomIndex = Math.floor(Math.random() * teamMembers.length);
                        handleOpenMemberDetails(teamMembers[randomIndex].rawAssignment);
                      }
                    }}
                  >
                    {teamMembers.length}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Section - Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

            {/* Share Button */}
            <Tooltip title="Share project">
              <IconButton
                size="small"
                onClick={handleOpenInviteDialog}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <Share sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            {/* Filter Button */}
            {/* <Tooltip title="Show filters">
              <IconButton
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  backgroundColor: showFilters ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  color: showFilters ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <FilterList sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip> */}

            {/* More Actions */}
            {/* <Tooltip title="More actions">
              <IconButton
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.2),
                  },
                }}
              >
                <MoreVert sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip> */}

            {/* Settings FAB */}
            <Zoom in={true} style={{ transitionDelay: '300ms' }}>
              <Tooltip title="Project Tools">
                <IconButton
                  onClick={toggleSettings}
                  sx={{
                    ml: 1,
                    width: 40,
                    height: 40,
                    backgroundColor: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    color: 'white',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                      transform: "translateY(-2px) scale(1.05)",
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <Settings sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Zoom>
          </Box>
        </Paper>
      </Fade>


      <Box
        sx={{
          flex: 1,
          // mt: showFilters ? '136px' : '96px', // Adjust margin based on filters visibility
          // height: `calc(100vh - ${showFilters ? '136px' : '96px'})`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.03)} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Board Container with max width but full height */}
        <Box
          sx={{
            minHeight: '100%',
            width: '100%',
            px: 3,
            pb: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              minHeight: '100%',
              borderRadius: 3,
              backgroundColor: "transparent",
              overflow: 'hidden',
            }}
          >
            {/* Board Header */}
            <Box
              sx={{
                p: 3,
                // borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >

            </Box>

            {/* The Actual Board - Takes full available height */}
            <Box sx={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
              <Projectology project={project} />
            </Box>
          </Paper>
        </Box>
      </Box>

      <Dialog
        open={memberDetailsOpen}
        onClose={handleCloseMemberDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedMember && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Team Member Details</Typography>
                <IconButton onClick={handleCloseMemberDetails} size="small">
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                <Box sx={{ flex: { md: 1 }, display: "flex", flexDirection: "column", alignItems: "center", mb: { xs: 3, md: 0 } }}>
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
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Assignment Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        <Box sx={{ flex: { xs: "1 0 100%", sm: "1 0 calc(50% - 16px)" } }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Work sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Role
                              </Typography>
                              <Typography variant="body1">
                                {selectedMember.role || "Not specified"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ flex: { xs: "1 0 100%", sm: "1 0 calc(50% - 16px)" } }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Percent sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Allocation
                              </Typography>
                              <Typography variant="body1">
                                {selectedMember.allocationPercent || 0}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ flex: { xs: "1 0 100%", sm: "1 0 calc(50% - 16px)" } }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <DateRange sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Start Date
                              </Typography>
                              <Typography variant="body1">
                                {formatDate(selectedMember.startDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ flex: { xs: "1 0 100%", sm: "1 0 calc(50% - 16px)" } }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <DateRange sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Box>
                              <Typography variant="caption" color="textSecondary">
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
                {searchTerm
                  ? "No matching users found"
                  : "No users available to assign"}
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
            <Box mt={2} p={2} sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
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
            startIcon={loading || isUpdating ? <CircularProgress size={20} /> : null}
          >
            {loading || isUpdating ? "Assigning..." : "Assign Selected Users"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Drawer */}
      <ProjectSettingsDrawer
        open={settingsOpen}
        onClose={toggleSettings}
        project={project}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box >
  );
};

export default ProjectDetail;