import {
  Grid,
  Paper,
  TextField,
  IconButton,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormContext, Controller } from "react-hook-form";
import { z } from "zod";
import { LandingPageSchema } from "@/lib/schemas/core/landing-page";
import { uploadFile } from "@/lib/file-uploads/upload-file";
import { useState, useRef } from "react";

type LandingPageFormValues = z.infer<typeof LandingPageSchema>;

interface NestedFieldProps {
  index: number;
  onRemove: () => void;
}

export function MediaFields({ index, onRemove }: NestedFieldProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<LandingPageFormValues>();
  const baseName = `media.${index}` as const;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Watch the URL field to determine if we have a file to preview
  const mediaUrl = watch(`${baseName}.url`);
  const mediaType = watch(`${baseName}.typeField`);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const filePath = await uploadFile(formData, uniqueId);

      // Update the URL field with the uploaded file path
      setValue(`${baseName}.url`, filePath);

      // Auto-set alt text if empty
      const currentAlt = watch(`${baseName}.alt`);
      if (!currentAlt) {
        setValue(`${baseName}.alt`, file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      // You might want to show a toast notification here
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  const isImage =
    mediaType === "Image" &&
    mediaUrl &&
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl);
  const isVideo =
    mediaType === "Video" &&
    mediaUrl &&
    /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, border: 1, borderColor: "grey.200", borderRadius: 2 }}
    >
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            name={`${baseName}.typeField`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Media Type"
                select
                fullWidth
                variant="standard"
                error={!!(errors.media?.[index] as any)?.typeField}
                helperText={(errors.media?.[index] as any)?.typeField?.message}
              >
                <MenuItem value="Image">Image</MenuItem>
                <MenuItem value="Video">Video</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
            <Controller
              name={`${baseName}.url`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL or File"
                  fullWidth
                  variant="standard"
                  error={!!(errors.media?.[index] as any)?.url}
                  helperText={(errors.media?.[index] as any)?.url?.message}
                  InputProps={{
                    endAdornment: mediaUrl && (
                      <IconButton
                        size="small"
                        onClick={handlePreviewOpen}
                        disabled={!mediaUrl}
                        sx={{ ml: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    ),
                  }}
                />
              )}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={
                mediaType === "Image"
                  ? "image/*"
                  : mediaType === "Video"
                  ? "video/*"
                  : "*"
              }
              style={{ display: "none" }}
            />

            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              size="small"
              sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Controller
            name={`${baseName}.alt`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Alt Text"
                fullWidth
                variant="standard"
                error={!!(errors.media?.[index] as any)?.alt}
                helperText={(errors.media?.[index] as any)?.alt?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 1 }}>
          <Controller
            name={`${baseName}.sortOrder`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Order"
                type="number"
                fullWidth
                variant="standard"
                error={!!(errors.media?.[index] as any)?.sortOrder}
                helperText={(errors.media?.[index] as any)?.sortOrder?.message}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 1 }}
          sx={{ display: "flex", justifyContent: "center", pt: 1 }}
        >
          <IconButton
            onClick={onRemove}
            color="error"
            aria-label="remove media"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Media Preview
          <IconButton
            aria-label="close"
            onClick={handlePreviewClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          {isImage && (
            <Box
              component="img"
              src={mediaUrl}
              alt={watch(`${baseName}.alt`) || "Preview"}
              sx={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
            />
          )}
          {isVideo && (
            <Box
              component="video"
              src={mediaUrl}
              controls
              sx={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          )}
          {!isImage && !isVideo && mediaUrl && (
            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              <p>Preview not available for this media type</p>
              <Button
                variant="outlined"
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in new tab
              </Button>
            </Box>
          )}
          {!mediaUrl && (
            <Box sx={{ textAlign: "center", color: "text.secondary" }}>
              No media to preview
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
