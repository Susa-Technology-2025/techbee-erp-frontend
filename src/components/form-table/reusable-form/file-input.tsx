"use client";

import React, { useCallback, useState, useTransition, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Re-added
import Modal from "@mui/material/Modal"; // Re-added
import CloseIcon from "@mui/icons-material/Close"; // Re-added
// Removed: Link import
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// !! IMPORTANT: USING YOUR SPECIFIED SERVER ACTION !!
import { uploadImage } from "@/lib/file-uploads/upload-file";

// Utility to generate a unique ID
const generateUniqueId = () => {
  return `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// --- Component Definition ---

type FileFieldProps = {
  label: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /** The URL of the uploaded file. */
  value?: string;
  /** Callback with the resulting URL or undefined if deleted/cleared. */
  onChange: (value: string | undefined) => void;
  allowedFileTypes: string[];
  minSize?: number;
  maxSize?: number;
};

const FileField = ({
  label,
  helperText,
  error,
  disabled,
  value,
  onChange,
  allowedFileTypes,
  minSize,
  maxSize,
}: FileFieldProps) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [openModal, setOpenModal] = useState(false); // Re-added
  const [isPending, startTransition] = useTransition();

  // Manage file name based on URL value (passed down or returned by action)
  useEffect(() => {
    if (value) {
      try {
        const url = new URL(value);
        const pathSegments = url.pathname.split("/");
        setFileName(decodeURIComponent(pathSegments.pop() || "Uploaded File"));
      } catch (e) {
        setFileName(value.split("/").pop() || "Uploaded File");
      }
      setUploadError(null);
    } else {
      setFileName("");
    }
  }, [value]);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return;

      const backendId = generateUniqueId();
      const formData = new FormData();
      formData.append("file", file);

      setUploadError(null);
      setFileName(file.name);

      startTransition(async () => {
        try {
          const url = await uploadImage(formData, backendId);
          onChange(url); // Success: Update the form value with the URL
        } catch (err: any) {
          const errorMessage =
            err.message || "Upload failed: Server action error.";
          console.error("Upload Server Action Error:", errorMessage);
          setUploadError(errorMessage);
          onChange(undefined);
          setFileName("");
        }
      });
    },
    [onChange]
  );

  // Handle file deletion
  const handleClear = () => {
    onChange(undefined);
    setFileName("");
    setUploadError(null);
  };

  // Handle file drop/selection
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: allowedFileTypes.reduce(
        (acc: { [key: string]: string[] }, mimeType) => {
          acc[mimeType] = [];
          return acc;
        },
        {}
      ),
      minSize,
      maxSize,
      disabled: disabled || isPending,
    });

  const dropzoneStyles = {
    border: "2px dashed",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: disabled || isPending ? "not-allowed" : "pointer",
    borderColor: isDragActive
      ? "primary.main"
      : error || uploadError
      ? "error.main"
      : "#cccccc",
    backgroundColor: disabled || isPending ? "#f5f5f5" : "inherit",
    mt: 1,
  };

  // Preview logic (re-implemented)
  const isImage = value && /\.(jpe?g|png|gif|webp|svg|tiff)$/i.test(value);
  const isPdf = value && /\.pdf$/i.test(value);
  const showPreview = value && (isImage || isPdf);

  const handleOpenModal = () => setOpenModal(true); // Re-added
  const handleCloseModal = () => setOpenModal(false); // Re-added

  // Determine the display state for the dropzone content
  let dropzoneContent;
  if (isPending) {
    dropzoneContent = (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CircularProgress size={20} sx={{ mr: 2 }} />
        <Typography>Uploading **{fileName}**...</Typography>
      </Box>
    );
  } else if (isDragActive) {
    dropzoneContent = <Typography>Drop the file here ...</Typography>;
  } else if (!!value) {
    dropzoneContent = (
      <Typography>Click or drag to replace **{fileName}**</Typography>
    );
  } else {
    dropzoneContent = (
      <Typography>
        Drag 'n' drop a file here, or click to select file
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" component="label">
        {label}
      </Typography>

      {/* Dropzone Area - Always visible */}
      <Box {...getRootProps()} sx={dropzoneStyles}>
        <input {...getInputProps()} />
        {dropzoneContent}
      </Box>

      {/* Display for uploaded file (URL) - Now back to TextField with Preview Button */}
      {!!value && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
            p: 1,
          }}
        >
          {/* TextField for displaying filename */}
          <TextField
            value={fileName}
            fullWidth
            variant="standard"
            disabled
            InputProps={{
              startAdornment: (
                <CloudUploadIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          {/* Preview Button */}
          {showPreview && (
            <IconButton
              onClick={handleOpenModal}
              disabled={disabled}
              aria-label="view file"
              sx={{ ml: 1 }}
            >
              <VisibilityIcon />
            </IconButton>
          )}

          {/* Delete Button */}
          {!disabled && (
            <IconButton
              onClick={handleClear}
              aria-label="delete file"
              sx={{ ml: 1 }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )}

      {/* Error and Helper Text Blocks */}
      {fileRejections.length > 0 && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {fileRejections.map(({ file, errors }) => (
            <span key={file.name}>
              File '{file.name}' rejected:{" "}
              {errors.map((e) => e.message).join(", ")}
            </span>
          ))}
        </Typography>
      )}

      {uploadError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Upload Error: {uploadError}
        </Typography>
      )}

      {helperText && !error && !uploadError && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}

      {/* Preview Modal (re-added) */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Use the 'value' URL directly for image preview */}
          {isImage && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "calc(90vh - 100px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={value}
                alt="file preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          {/* Use the 'value' URL directly for PDF iframe */}
          {isPdf && (
            <iframe
              src={value}
              title="pdf preview"
              style={{
                width: "100%",
                height: "calc(90vh - 100px)",
                border: "none",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default FileField;
