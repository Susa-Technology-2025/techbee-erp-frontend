import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  List,
  ListItemText,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { FaPaperclip } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import toast from "react-hot-toast";
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";
import { useForm, FormProvider } from "react-hook-form";

const AttachmentsMenuContent = ({ task }) => {
  const theme = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);
  const [currentDeleteEndpoint, setCurrentDeleteEndpoint] = useState("");

  // React Hook Form for file upload
  const methods = useForm({
    defaultValues: {
      fileName: "",
      url: "",
    },
  });

  const { control, watch, setValue, reset: resetForm, handleSubmit } = methods;

  // Query to fetch attachments
  const attachmentEndpoint = `https://api.techbee.et/api/project/attachments?where[wbsItem][id]=${task.id}`;
  const {
    data: attachmentsData,
    isLoading: isLoadingAttachments,
    isError: isAttachmentsError,
    error: attachmentsError,
    refetch: refetchAttachments,
  } = useDataQuery({
    apiEndPoint: attachmentEndpoint,
    queryKey: ["attachments", task.id],
  });

  const attachments = attachmentsData?.data || [];

  // Delete attachment mutation - using local state for endpoint
  const { mutate: deleteAttachment, isPending: isDeletingAttachment } =
    useDataMutation({
      apiEndPoint: currentDeleteEndpoint,
      method: "DELETE",
      onError: (error) => {
        toast.error(error?.message || "Error while deleting attachment");
        setDeletingAttachmentId(null);
        setCurrentDeleteEndpoint("");
      },
      onSuccess: () => {
        toast.success("Attachment deleted successfully");
        refetchAttachments();
        setDeletingAttachmentId(null);
        setCurrentDeleteEndpoint("");
      },
    });

  // Create attachment mutation
  const { mutate: createAttachment, isPending: isCreatingAttachment } =
    useDataMutation({
      apiEndPoint: "https://api.techbee.et/api/project/attachments",
      method: "POST",
      onError: (error) => {
        toast.error(error?.message || "Error while attaching file");
      },
      onSuccess: () => {
        toast.success("File attached successfully");
        refetchAttachments();
        setUploadDialogOpen(false);
        resetForm();
      },
    });

  const handlePreviewClick = (attachment) => {
    setSelectedAttachment(attachment);
    setPreviewOpen(true);
  };

  const handleRemoveAttachment = (id) => {
    setDeletingAttachmentId(id);
    const endpoint = `https://api.techbee.et/api/project/attachments/${id}`;
    setCurrentDeleteEndpoint(endpoint);

    // The mutation will trigger automatically when currentDeleteEndpoint changes
    // But we need to trigger it manually since useDataMutation might not re-trigger on endpoint change
    deleteAttachment({});
  };

  const handleAttachFile = () => {
    resetForm();
    setUploadDialogOpen(true);
  };

  // Handle file upload submission
  const onUploadSubmit = (data) => {
    const url = watch("url");

    if (!url) {
      toast.error("Please upload a file first");
      return;
    }

    const fileName = data.fileName || url.split("/").pop() || "uploaded_file";

    // Prepare the payload - removed mimeType field
    const payload = {
      url,
      fileName,
      wbsItem: { id: task.id },
      version: 1, // Default version
    };

    createAttachment(payload);
  };

  // Loading state
  if (isLoadingAttachments) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Loading attachments...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (isAttachmentsError) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
          Error loading attachments
        </Typography>
        <Button
          onClick={() => refetchAttachments()}
          size="small"
          sx={{ mt: 1 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const PreviewDialog = () => (
    <Dialog
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
        Preview: {selectedAttachment?.fileName}
      </DialogTitle>
      <DialogContent
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selectedAttachment?.url ? (
          <Box sx={{ width: "100%", height: "100%" }}>
            {/* Detect file type from URL extension */}
            {selectedAttachment.url.match(
              /\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i
            ) ? (
              <img
                src={selectedAttachment.url}
                alt={selectedAttachment.fileName}
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "contain",
                }}
              />
            ) : selectedAttachment.url.match(/\.(pdf)$/i) ? (
              <iframe
                src={selectedAttachment.url}
                style={{ width: "100%", height: "500px", border: "none" }}
                title={selectedAttachment.fileName}
              />
            ) : selectedAttachment.url.match(
                /\.(mp4|webm|ogg|mov|avi|mkv)$/i
              ) ? (
              <video controls style={{ width: "100%", maxHeight: "400px" }}>
                <source
                  src={selectedAttachment.url}
                  type={`video/${selectedAttachment.fileName.split(".").pop()}`}
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Preview not available. <br />
                <a
                  href={selectedAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.primary.main }}
                >
                  Open file directly
                </a>
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            No preview available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPreviewOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      sx={{
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ color: theme.palette.text.secondary }}
      >
        Attachments ({attachments.length})
      </Typography>

      <List
        dense
        sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1 }}
      >
        {attachments.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.disabled, p: 1 }}
          >
            No files attached.
          </Typography>
        ) : (
          attachments.map((attachment) => (
            <Paper
              key={attachment.id}
              sx={{
                bgcolor: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.2s",
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <ListItemText
                primary={attachment.fileName}
                sx={{
                  pl: 1.5,
                  cursor: "pointer",
                  flexGrow: 1,
                }}
                onClick={() => handlePreviewClick(attachment)}
              />
              <IconButton
                edge="end"
                size="small"
                onClick={() => handleRemoveAttachment(attachment.id)}
                sx={{
                  color:
                    deletingAttachmentId === attachment.id
                      ? theme.palette.text.disabled
                      : theme.palette.error.light,
                  mr: 0.5,
                  width: 32,
                  height: 32,
                }}
                disabled={
                  deletingAttachmentId === attachment.id || isDeletingAttachment
                }
              >
                {deletingAttachmentId === attachment.id ? (
                  <CircularProgress
                    size={16}
                    sx={{ color: theme.palette.text.disabled }}
                  />
                ) : (
                  <TbTrash size={16} />
                )}
              </IconButton>
            </Paper>
          ))
        )}
      </List>

      <Button
        onClick={handleAttachFile}
        variant="contained"
        size="small"
        startIcon={<FaPaperclip size={14} />}
        disabled={isLoadingAttachments || isDeletingAttachment}
      >
        Attach File
      </Button>

      <PreviewDialog />

      {/* Upload Dialog */}
      {uploadDialogOpen && (
        <UploadDialogComponent
          open={uploadDialogOpen}
          onClose={() => !isCreatingAttachment && setUploadDialogOpen(false)}
          methods={methods}
          task={task}
          isCreatingAttachment={isCreatingAttachment}
          handleSubmit={handleSubmit}
          onUploadSubmit={onUploadSubmit}
          resetForm={resetForm}
          setUploadDialogOpen={setUploadDialogOpen}
          theme={theme}
        />
      )}
    </Box>
  );
};

// Separate UploadDialog component to prevent re-renders
const UploadDialogComponent = ({
  open,
  onClose,
  methods,
  task,
  isCreatingAttachment,
  handleSubmit,
  onUploadSubmit,
  resetForm,
  setUploadDialogOpen,
  theme,
}: any) => {
  const { control, watch, setValue } = methods;
  const fileUrl = watch("url");
  const fileNameValue = watch("fileName");

  return (
    <FormProvider {...methods}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ borderBottom: 1, borderColor: theme.palette.divider }}
        >
          Attach File
        </DialogTitle>
        <DialogContent
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <FileUploadWithPreview
            folder="logo"
            fileName={fileNameValue}
            watchField="url"
            acceptedFileTypes={[
              ".pdf",
              ".png",
              ".jpg",
              ".jpeg",
              ".doc",
              ".docx",
              ".xls",
              ".xlsx",
              ".txt",
              ".csv",
              ".mp4",
              ".webm",
              ".mov",
            ]}
            maxSize={10485760} // 10MB
            label="Upload File"
          />

          <TextField
            label="Custom File Name"
            variant="outlined"
            size="small"
            value={fileNameValue}
            required
            onChange={(e) => setValue("fileName", e.target.value)}
            fullWidth
            placeholder={
              fileUrl
                ? `Default: ${fileUrl.split("/").pop()}`
                : "Enter file name"
            }
            disabled={isCreatingAttachment}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: theme.palette.text.primary,
                "& fieldset": {
                  borderColor: theme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.disabled, fontSize: "0.75rem" }}
          >
            Leave empty to use the original file name
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setUploadDialogOpen(false);
              resetForm();
            }}
            color="secondary"
            disabled={isCreatingAttachment}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onUploadSubmit)}
            color="primary"
            variant="contained"
            disabled={!fileUrl || isCreatingAttachment}
            sx={{ minWidth: 100 }}
          >
            {isCreatingAttachment ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default AttachmentsMenuContent;
