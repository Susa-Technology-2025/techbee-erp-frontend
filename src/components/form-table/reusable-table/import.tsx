import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const ImportButton = () => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [dryRun, setDryRun] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFiles([]);
    setDryRun(false);
  };

  const handleImport = async () => {
    setLoading(true);
    console.log("Importing file(s)...");
    files.forEach((file) => {
      console.log("File Name:", file.name);
      console.log("File Size:", file.size);
      console.log("File Type:", file.type);
    });
    console.log("Dry Run:", dryRun);
    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Import File" arrow>
        <IconButton
          onClick={handleOpen}
          //   sx={{
          //     color: "primary.main",
          //     backgroundColor: "rgba(25, 118, 210, 0.08)",
          //     "&:hover": {
          //       backgroundColor: "primary.main",
          //       color: "white",
          //       transform: "scale(1.05)",
          //       boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          //     },
          //     transition: "all 0.2s ease-in-out",
          //     p: 1.5,
          //   }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6" component="span">
            Import File
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              transition: "border .24s ease-in-out",
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, color: "grey.600", mb: 1 }} />
            {isDragActive ? (
              <Typography>Drop the file here ...</Typography>
            ) : (
              <Typography>
                Drag 'n' drop a file here, or click to select a file
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Only .xlsx format is supported
            </Typography>
          </Box>
          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Selected File:
              </Typography>
              <List dense>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          <Box mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
              }
              label="Dry Run (Validate file without importing)"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={files.length === 0 || loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
          >
            {loading ? "Importing..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportButton;
