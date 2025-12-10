import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { TbSubtask, TbChevronDown, TbTrash, TbEdit } from "react-icons/tb";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import toast from "react-hot-toast";
import WbsItemCreateInput from "../../wbsItems/_components/Form";
const SubtaskMenuContent = ({ task }) => {
  const theme = useTheme();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [currentTaskToBeDeleted, setCurrentTaskToBeDeleted] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskToBeEdited, setTaskToBeEdited] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const {
    data: subTasksData,
    isLoading: subtasksLoading,
    isError: subtasksError,
    refetch: refetchSubtasks,
  } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/project/wbsItems?where[parent][id]=${task.id}`,
  });
  const subtasks = subTasksData?.data || [];
  const { mutate: addSubtask, isPending: addingSubTask } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/project/wbsItems",
    method: "POST",
    onSuccess: () => {
      toast.success("Subtask created successfully");
      setNewTitle("");
      setNewDescription("");
      refetchSubtasks();
    },
    onError: (error) => toast.error(error?.message || "Error creating subtask"),
  });
  const { mutate: deleteSubtask, isPending: deletingSubTask } = useDataMutation(
    {
      apiEndPoint: currentTaskToBeDeleted
        ? `https://api.techbee.et/api/project/wbsItems/${currentTaskToBeDeleted}`
        : "",
      method: "DELETE",
      onError: (error) => {
        toast.error(error?.message || "Error deleting subtask");
        setCurrentTaskToBeDeleted(null);
      },
      onSuccess: () => {
        toast.success("Subtask deleted successfully");
        refetchSubtasks();
        setCurrentTaskToBeDeleted(null);
      },
    }
  );
  const handleAddSubtask = () => {
    if (!newTitle.trim()) {
      toast.error("Subtask title cannot be empty");
      return;
    }
    const payload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      approvalRequired: false,
      approvalStatus: "Draft",
      notifyTaskAssignmentChanged: false,
      slaState: "Ok",
      type: "Subtask",
      project: { id: task.project?.id },
      projectId: task.project?.id,
      parent: { id: task.id },
    };
    console.log("payload", JSON.stringify(payload));
    addSubtask(payload);
  };
  const handleDeleteSubtask = (id) => {
    setCurrentTaskToBeDeleted(id);
    deleteSubtask({});
  };
  const handleEditClick = (subtask) => {
    setTaskToBeEdited(subtask);
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setTaskToBeEdited(null);
    setIsSaving(false);
  };
  const handleSaveEdit = (formData) => {
    if (!taskToBeEdited?.id) {
      toast.error("No subtask selected for editing");
      return;
    }
    setIsSaving(true);
    const payload = {
      ...formData,
      type: "Subtask",
      project: task.project?.id,
      parent: { id: task.id },
    };
    updateSubtask({
      apiEndPoint: `https://api.techbee.et/api/project/wbsItems/${taskToBeEdited.id}`,
      data: payload,
    });
  };
  if (subtasksLoading) {
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
          Loading subtasks...
        </Typography>
      </Box>
    );
  }
  if (subtasksError) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
          Error loading subtasks
        </Typography>
        <Button onClick={() => refetchSubtasks()} size="small" sx={{ mt: 1 }}>
          Retry
        </Button>
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
      {subtasks.length === 0 ? (
        <Typography
          sx={{ p: 2, color: theme.palette.text.disabled, textAlign: "center" }}
        >
          No subtasks defined.
        </Typography>
      ) : (
        subtasks.map((subtask, index) => (
          <Accordion
            key={subtask.id}
            expanded={expanded === `panel${index}`}
            onChange={handleAccordionChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<TbChevronDown />}
              sx={{
                minHeight: 48,
              }}
            >
              <Typography variant="body2">
                {subtask.title}
                {subtask.code && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      ml: 1,
                      color: theme.palette.text.secondary,
                      fontFamily: "monospace",
                    }}
                  >
                    ({subtask.code})
                  </Typography>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {subtask.description || "No description provided."}
              </Typography>
              {}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(subtask)}
                  disabled={deletingSubTask}
                  sx={{
                    color: theme.palette.primary.main,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <TbEdit size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  disabled={
                    currentTaskToBeDeleted === subtask.id || deletingSubTask
                  }
                  sx={{
                    color:
                      currentTaskToBeDeleted === subtask.id
                        ? theme.palette.text.disabled
                        : theme.palette.error.light,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {currentTaskToBeDeleted === subtask.id ? (
                    <CircularProgress size={14} />
                  ) : (
                    <TbTrash size={16} />
                  )}
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
      <Accordion>
        <AccordionSummary
          sx={{
            bgcolor: "section.main",
            color: "section.contrastText",
          }}
          expandIcon={<TbChevronDown color="white" />}
        >
          Add New Sub Task
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              p: 1,
            }}
          >
            <TextField
              label="Title"
              variant="standard"
              size="small"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={addingSubTask}
              required
            />
            <TextField
              label="Description (Optional)"
              variant="standard"
              size="small"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={addingSubTask}
              multiline
            />
            <Button
              onClick={handleAddSubtask}
              variant="contained"
              size="small"
              startIcon={<TbSubtask />}
              loading={addingSubTask}
              disabled={!newTitle.trim()}
              sx={{ mt: 1 }}
            >
              Add
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
      >
        <DialogTitle
          sx={{ borderBottom: 1, borderColor: theme.palette.divider }}
        >
          Edit Subtask
        </DialogTitle>
        <DialogContent sx={{ p: 0, m: 0 }}>
          {taskToBeEdited && (
            <WbsItemCreateInput
              formMode="edit"
              defaultValues={taskToBeEdited}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default SubtaskMenuContent;
