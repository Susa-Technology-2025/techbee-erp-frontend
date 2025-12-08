"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { useUploadMutation } from "@/lib/tanstack/upload";

export function AvatarUploadField() {
  const { watch, setValue } = useFormContext<any>();
  const avatarUrl = watch("avatarUrl");

  const {
    user: { id: userId },
  } = useSelector((state: RootState) => state.session);
  const tenantCode = useSelector(
    (state: RootState) => state.session.tenantCode
  );

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { mutate: upload, isPending } = useUploadMutation({
    method: "POST",
    code: tenantCode,
    onSuccess: (data) => {
      setValue("avatarUrl", data.originalUrl, { shouldDirty: true });
      setFile(null);
      setMessage({ type: "success", text: "Avatar uploaded successfully!" });
    },
    onError: () =>
      setMessage({
        type: "error",
        text: "Failed to upload avatar. Try again.",
      }),
  });

  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }
    setFile(selected);
    setMessage(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleUpload = () => {
    if (!file) return;
    upload({
      file,
      folder: `avatars`,
      fileName: userId + file.name,
      method: avatarUrl ? "PATCH" : "POST",
    });
  };

  const removeAvatar = () => {
    setValue("avatarUrl", "");
    setFile(null);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 3,
          flexWrap: { xs: "wrap", md: "nowrap" },
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            minWidth: 80,
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{ width: 80, height: 80, border: "2px solid #ddd" }}
            alt="Profile Avatar"
          >
            {!avatarUrl && "U"}
          </Avatar>
          {avatarUrl && (
            <IconButton size="small" onClick={removeAvatar} color="error">
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Profile Picture
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a high-quality image. Max size 5MB.
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              mt: 1,
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "divider",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Typography variant="body2" color="text.secondary">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Drag & drop or click to select an image
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {file && (
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={isPending}
                startIcon={
                  isPending ? <CircularProgress size={16} /> : <CloudUpload />
                }
                size="small"
                sx={{ textTransform: "none" }}
              >
                {isPending ? "Uploading..." : "Upload"}
              </Button>
            )}
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mt: 1 }}>
              {message.text}
            </Alert>
          )}
        </Box>
      </Box>
    </Grid>
  );
}
