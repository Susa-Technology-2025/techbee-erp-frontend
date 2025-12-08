"use client";
// use client
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
  alpha,
  useTheme,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Description as TemplateIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import QuestionBuilder from "@/components/question-generator/question-builder";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";

// Types
interface Template {
  id: string;
  code: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = "https://api.techbee.et/api/hr/templates"; // Define base URL

const TemplatesPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // This state will drive the dynamic API endpoint for deletion
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const theme = useTheme();

  // 1. Data Query
  const { data, isLoading, error, isError, refetch } = useDataQuery<Template[]>(
    {
      apiEndPoint: API_BASE_URL,
      refetchInterval: false,
      enabled: true,
    }
  );

  const templatesList = data?.data || [];

  // 2. Data Mutation (Delete) - DECLARE ONCE AT THE TOP LEVEL
  // The API endpoint is dynamically constructed using the templateToDelete state.
  const { mutate: deleteMutate, isPending: isDeleting } = useDataMutation<
    any,
    null
  >({
    // TVariables set to null as body is empty
    apiEndPoint: templateToDelete
      ? `${API_BASE_URL}/${templateToDelete.id}` // CORRECT: Appends ID if templateToDelete is set
      : API_BASE_URL, // Fallback base URL when no template is selected
    method: "DELETE",
    onSuccessInvalidate: true,
    getBody: () => undefined, // Ensure no body is sent for DELETE
    onSuccess: () => {
      console.log("Template deleted successfully!");
      setTemplateToDelete(null); // Clear the state
      refetch(); // Refetch the list
    },
    onError: (err) => {
      console.error("Failed to delete template:", err);
      // Optional: Handle error display
    },
  });

  // Edit/View Template Dialog Handlers
  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTemplate(null);
    setIsCreating(false);
  };

  // Delete Template Handlers
  const openDeleteConfirm = (template: Template) => {
    // Setting this state will re-render the component and update the deleteMutation's apiEndPoint
    setTemplateToDelete(template);
  };

  const closeDeleteConfirm = () => {
    setTemplateToDelete(null);
  };

  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      // CONSOLE LOG FOR DEBUGGING:
      const finalApiUrl = `${API_BASE_URL}/${templateToDelete.id}`;
      console.log("Calling DELETE on:", finalApiUrl);

      // Call mutate. The URL is already set via the `templateToDelete` state above.
      deleteMutate(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading templates: {error?.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 2, fontSize: "0.875rem", position: "relative" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TemplateIcon color="primary" sx={{ mr: 1, fontSize: "1.5rem" }} />
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
            Templates
          </Typography>
          <Chip
            label={`${templatesList.length} items`}
            size="small"
            variant="outlined"
            sx={{ ml: 2, fontSize: "0.75rem", height: 24 }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTemplate}
          size="small"
          sx={{ borderRadius: 1, fontSize: "0.75rem", py: 0.5 }}
        >
          New Template
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 1, overflow: "hidden" }}
      >
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                "& th": {
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  py: 1,
                },
              }}
            >
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templatesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <TemplateIcon
                      sx={{ fontSize: "2rem", color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No templates found
                    </Typography>
                    <Button
                      size="small"
                      onClick={handleCreateTemplate}
                      sx={{ mt: 1, fontSize: "0.75rem" }}
                    >
                      Create your first template
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              templatesList.map((template) => (
                <TableRow
                  key={template.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "& td": { py: 1, fontSize: "0.75rem" },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={template.code}
                      size="small"
                      variant="filled"
                      color="primary"
                      sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {template.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {template.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.questions.length}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(template.updatedAt)}</TableCell>
                  <TableCell>{formatDate(template.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit template" arrow placement="top">
                      <IconButton
                        size="small"
                        onClick={() => handleTemplateClick(template)}
                        sx={{
                          fontSize: "0.875rem",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                          },
                        }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    {/* Delete button logic */}
                    <Tooltip title="Delete template" arrow placement="top">
                      <IconButton
                        size="small"
                        onClick={() => openDeleteConfirm(template)}
                        disabled={isDeleting}
                        sx={{
                          fontSize: "0.875rem",
                          color: theme.palette.error.main,
                          ml: 0.5,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        {isDeleting && templateToDelete?.id === template.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <DeleteIcon fontSize="inherit" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit/Create Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, mb: 2 }}>
          <DialogTitle sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <QuestionBuilder
            initialTemplate={isCreating ? undefined : selectedTemplate}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!templateToDelete}
        onClose={closeDeleteConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the template:{" "}
            <Typography component="span" fontWeight="bold">
              {templateToDelete?.title} ({templateToDelete?.code})
            </Typography>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDeleteConfirm}
            color="primary"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTemplate}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TemplatesPage;
