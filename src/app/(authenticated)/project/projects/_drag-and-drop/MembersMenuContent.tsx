import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { FaUserPlus, FaTimesCircle, FaUser, FaEye } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import toast from "react-hot-toast";
import WbsAssignmentForm from "../../wbsAssignments/_components/Form";

const MembersMenuContent = ({ task }) => {
  const theme = useTheme();
  const [currentMemberToBeAdded, setCurrentMemberToBeAdded] = useState(null);
  const [currentMemberToBeDeleted, setCurrentMemberToBeDeleted] =
    useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Query to fetch available users
  const {
    data: usersData,
    isLoading: loadingUsers,
    isError: errorLoadingUsers,
  } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/project/projectAssignments",
    queryKey: ["available-users"],
  });

  // Query to fetch assigned members
  const {
    data: membersData,
    isLoading: loadingMembers,
    isError: errorLoadingMembers,
    refetch: refetchMembers,
  } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/wbsAssignments?where[wbsItem][id]=${task.id}`,
    queryKey: ["assigned-members", task.id],
  });

  const availableUsers = usersData?.data || [];
  const assignedMembers = membersData?.data || [];

  // Add member mutation
  const { mutate: addMember, isPending: addingMember } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/project/wbsAssignments",
    method: "POST",
    onError: (error) => {
      toast.error(error?.message || "Error assigning member");
      setCurrentMemberToBeAdded(null);
    },
    onSuccess: () => {
      toast.success("Member assigned successfully");
      refetchMembers();
      setCurrentMemberToBeAdded(null);
      setInputValue("");
    },
  });

  // Delete member mutation
  const { mutate: deleteMember, isPending: deletingMember } = useDataMutation({
    apiEndPoint: currentMemberToBeDeleted
      ? `https://api.techbee.et/api/project/wbsAssignments/${currentMemberToBeDeleted}`
      : "",
    method: "DELETE",
    onError: (error) => {
      toast.error(error?.message || "Error removing member");
      setCurrentMemberToBeDeleted(null);
    },
    onSuccess: () => {
      toast.success("Member removed successfully");
      refetchMembers();
      setCurrentMemberToBeDeleted(null);
    },
  });

  // Filter out already assigned users
  const unassignedUsers = availableUsers.filter(
    (user) =>
      !assignedMembers.some((member) => {
        // Check both internal and external IDs
        const memberId = member.employeeId || member.externalMemberEmail;
        const userId = user.employeeId || user.externalMemberEmail;
        return memberId === userId;
      })
  );

  const handleAssignUser = (user) => {
    if (!user) return;

    setCurrentMemberToBeAdded(user.id || user.email);

    // Prepare payload according to API requirements
    const payload = {
      employeeId: user.employeeId || null,
      externalResourceName: user.externalResourceName || null,
      externalMemberName: user.externalMemberName || null,
      internalResourceName: user.internalResourceName || null,
      wbsItem: { id: task.id },
    };

    addMember(payload);
  };

  const handleRemoveUser = (assignmentId) => {
    setCurrentMemberToBeDeleted(assignmentId);
    deleteMember({});
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedMember(null);
  };

  // Get display name for user
  const getDisplayName = (user) => {
    return (
      user.internalResourceName ||
      user.externalResourceName ||
      user.externalMemberName ||
      user.employeeId ||
      "Unknown User"
    );
  };

  // Get avatar initials
  const getAvatarInitials = (user) => {
    const name = getDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  // Loading state for members
  if (loadingMembers) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress
          size={24}
          sx={{ color: theme.palette.text.secondary }}
        />
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, mt: 1 }}
        >
          Loading members...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Autocomplete for user search */}
      <Autocomplete
        options={unassignedUsers}
        getOptionLabel={(option) => getDisplayName(option)}
        isOptionEqualToValue={(option, value) => {
          const optionId = option.employeeId || option.externalMemberEmail;
          const valueId = value.employeeId || value.externalMemberEmail;
          return optionId === valueId;
        }}
        inputValue={inputValue}
        disableListWrap
        disableClearable
        sx={{
          width: 250,
        }}
        clearOnEscape
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        size="small"
        loading={loadingUsers}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Assign"
            variant="standard"
            disabled={addingMember}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              overflow: "hidden",
            }}
          >
            <Avatar
              sx={{
                width: 24,
                height: 24,
                mr: 1,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {getAvatarInitials(option)}
            </Avatar>
            <ListItemText
              primary={getDisplayName(option)}
              slotProps={{
                primary: {
                  variant: "body2",
                  color: theme.palette.text.primary,
                },
                secondary: {
                  variant: "caption",
                  color: theme.palette.text.secondary,
                },
              }}
              secondary={
                option.externalResourceEmail ||
                option.internalResourceName ||
                option.employeeId
              }
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAssignUser(option);
              }}
              sx={{ color: theme.palette.primary.main }}
              disabled={addingMember}
            >
              {currentMemberToBeAdded === (option.id || option.email) ? (
                <CircularProgress size={14} />
              ) : (
                <FaUserPlus size={16} />
              )}
            </IconButton>
          </Box>
        )}
      />

      {/* Assigned members list */}
      <Typography
        variant="subtitle2"
        sx={{ color: theme.palette.text.secondary }}
      >
        Assigned ({assignedMembers.length})
      </Typography>
      <List dense sx={{ m: 0, p: 0 }}>
        {assignedMembers.length === 0 ? (
          <Typography
            sx={{
              p: 1,
              color: theme.palette.text.disabled,
              textAlign: "center",
            }}
          >
            No members assigned.
          </Typography>
        ) : (
          assignedMembers.map((member) => (
            <ListItem
              key={member.id}
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
                mb: 0.5,
                border: `1px solid ${theme.palette.divider}`,
              }}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => handleViewMember(member)}
                    size="small"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <FaEye size={14} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => handleRemoveUser(member.id)}
                    size="small"
                    sx={{
                      color:
                        currentMemberToBeDeleted === member.id
                          ? theme.palette.text.disabled
                          : theme.palette.error.main,
                    }}
                    disabled={
                      currentMemberToBeDeleted === member.id || deletingMember
                    }
                  >
                    {currentMemberToBeDeleted === member.id ? (
                      <CircularProgress size={14} />
                    ) : (
                      <TbTrash size={16} />
                    )}
                  </IconButton>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {getAvatarInitials(member)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={getDisplayName(member)}
                sx={{ color: theme.palette.text.primary }}
              />
            </ListItem>
          ))
        )}
      </List>

      {/* View Member Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ borderBottom: 1, borderColor: theme.palette.divider }}
        >
          Member Details
        </DialogTitle>
        <DialogContent sx={{ p: 0, m: 0 }}>
          <WbsAssignmentForm formMode="edit" defaultValues={selectedMember} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MembersMenuContent;
