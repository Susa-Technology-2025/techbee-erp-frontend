// components/ui/file-uploader.tsx
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  CloudUpload,
  Visibility,
  Delete,
  Close,
  InsertDriveFile,
  PictureAsPdf,
} from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import { uploadFile } from "@/lib/file-uploads/upload-file";

interface FileUploaderProps {
  name: string;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  required?: boolean;
  previewType?: "image" | "video" | "pdf" | "auto";
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

export function FileUploader({
  name,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = "Choose file",
  required = false,
  previewType = "auto",
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState<number | null>(null);

  const currentValue = watch(name);
  const error = errors[name]?.message as string;

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      onUploadError?.(
        new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const filePath = await uploadFile(formData, uniqueId);

      setValue(name, filePath);
      onUploadComplete?.(filePath);

      // Simulate progress for better UX
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 20);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      onUploadError?.(error as Error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setValue(name, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPdfPage(1);
    setPdfNumPages(null);
  };

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPdfPage(1);
    setPdfNumPages(null);
  };

  const getFileType = (url: string) => {
    if (previewType !== "auto") return previewType;

    const extension = url.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return "image";
    }
    if (["mp4", "webm", "ogg", "mov", "avi"].includes(extension || "")) {
      return "video";
    }
    if (["pdf"].includes(extension || "")) {
      return "pdf";
    }
    return "other";
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "File";
  };

  const isImage = getFileType(currentValue) === "image";
  const isVideo = getFileType(currentValue) === "video";
  const isPdf = getFileType(currentValue) === "pdf";

  const handlePdfPageChange = (newPage: number) => {
    if (pdfNumPages && newPage >= 1 && newPage <= pdfNumPages) {
      setPdfPage(newPage);
    }
  };

  const PdfPreview = ({ url }: { url: string }) => {
    const [loading, setLoading] = useState(true);

    return (
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            disabled={pdfPage <= 1}
            onClick={() => handlePdfPageChange(pdfPage - 1)}
          >
            Previous
          </Button>

          <Typography variant="body2">
            Page {pdfPage} of {pdfNumPages || "?"}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            disabled={!!pdfNumPages && pdfPage >= pdfNumPages}
            onClick={() => handlePdfPageChange(pdfPage + 1)}
          >
            Next
          </Button>
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1,
            minHeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.100",
          }}
        >
          {loading && <CircularProgress size={40} />}

          <iframe
            src={`${url}#page=${pdfPage}`}
            width="100%"
            height="500"
            style={{
              border: "none",
              borderRadius: "4px",
              display: loading ? "none" : "block",
            }}
            onLoad={() => setLoading(false)}
            title="PDF Preview"
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<PictureAsPdf />}
          >
            Open PDF in New Tab
          </Button>
        </Box>
      </Box>
    );
  };

  const SimplePdfPreview = ({ url }: { url: string }) => {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <PictureAsPdf sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          PDF Document
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {getFileName(url)}
        </Typography>
        <Button
          variant="contained"
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<PictureAsPdf />}
          sx={{ mt: 2 }}
        >
          Open PDF
        </Button>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={accept}
              style={{ display: "none" }}
            />

            {!currentValue ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "2px dashed",
                  borderColor: error ? "error.main" : "grey.300",
                  backgroundColor: "grey.50",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "grey.100",
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {accept !== "*/*" ? `Accepted: ${accept}` : "Any file type"} •
                  Max: {maxSize / 1024 / 1024}MB
                </Typography>
                {required && (
                  <Typography variant="caption" color="error">
                    * Required
                  </Typography>
                )}
              </Paper>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {isImage ? (
                    <Box
                      component="img"
                      src={currentValue}
                      alt="Preview"
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : isPdf ? (
                    <PictureAsPdf sx={{ fontSize: 40, color: "error.main" }} />
                  ) : (
                    <InsertDriveFile sx={{ fontSize: 40, color: "grey.400" }} />
                  )}

                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {getFileName(currentValue)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isImage
                        ? "Image"
                        : isVideo
                        ? "Video"
                        : isPdf
                        ? "PDF"
                        : "File"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {(isImage || isVideo || isPdf) && (
                    <IconButton
                      size="small"
                      onClick={handlePreviewOpen}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  )}

                  <IconButton size="small" onClick={handleRemove} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            )}

            {uploading && (
              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={24}
                />
                <Typography variant="body2" color="text.secondary">
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}

            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {error}
              </Typography>
            )}
          </Box>
        )}
      />

      {/* Enhanced Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { minHeight: "80vh" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">
            File Preview - {getFileName(currentValue)}
          </Typography>
          <IconButton onClick={handlePreviewClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
          {isImage && (
            <Box
              component="img"
              src={currentValue}
              alt="Preview"
              sx={{
                width: "100%",
                height: "70vh",
                objectFit: "contain",
                p: 2,
              }}
            />
          )}

          {isVideo && (
            <Box
              component="video"
              src={currentValue}
              controls
              autoPlay
              sx={{
                width: "100%",
                height: "70vh",
                p: 2,
              }}
            />
          )}

          {isPdf && (
            <Box sx={{ flex: 1, minHeight: "70vh" }}>
              <PdfPreview url={currentValue} />
            </Box>
          )}

          {!isImage && !isVideo && !isPdf && currentValue && (
            <Box sx={{ textAlign: "center", p: 4, color: "text.secondary" }}>
              <InsertDriveFile sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Preview not available
              </Typography>
              <Button
                variant="outlined"
                href={currentValue}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
