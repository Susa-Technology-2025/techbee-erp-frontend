"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Preview as PreviewIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
} from "@mui/icons-material";
import { useUploadMutation } from "@/lib/tanstack/upload";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface FileUploadWithPreviewProps {
  folder: string;
  fileName: string;
  watchField: string;
  acceptedFileTypes?: string[];
  maxSize?: number;
  label?: string;
}

export default function FileUploadWithPreview({
  folder,
  fileName,
  watchField,
  acceptedFileTypes = ["image/*", "video/*", "application/pdf"],
  maxSize = 5242880,
  label = "Upload File",
}: FileUploadWithPreviewProps) {
  const { watch, setValue } = useFormContext<any>();
  const fileUrl = watch(watchField);

  const [file, setFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewType, setPreviewType] = useState<
    "image" | "video" | "pdf" | "unknown"
  >("unknown");
  const [manualUrl, setManualUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const tenantCode = useSelector(
    (state: RootState) => state.session.tenantCode
  );
  const { mutate: upload, isPending } = useUploadMutation({
    method: "POST",
    code: tenantCode,
    onSuccess: (result) => {
      setMessage({
        type: "success",
        text: "File uploaded successfully!",
      });
      setValue(watchField, result.originalUrl);
      setFile(null);
    },
    onError: (error) =>
      setMessage({
        type: "error",
        text: error.message ?? "Failed to upload file. Try again.",
      }),
  });

  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    setFile(selected);
    setMessage(null);

    if (selected) {
      upload({
        file: selected,
        folder,
        fileName: fileName || selected.name,
        method: "POST",
        code: "susa",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFileTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize,
  });

  const handlePreview = (url: string) => {
    if (!url) return;

    setPreviewUrl(url);

    if (url.match(/\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i)) {
      setPreviewType("image");
    } else if (url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
      setPreviewType("video");
    } else if (url.match(/\.(pdf)$/i)) {
      setPreviewType("pdf");
    } else {
      setPreviewType("unknown");
    }

    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl("");
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim()) {
      setValue(watchField, manualUrl.trim());
      setMessage({
        type: "success",
        text: "URL set successfully!",
      });
      setManualUrl("");
    }
  };

  const getFileType = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|svg|webp|bmp)$/i)) return "image";
    if (url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) return "video";
    if (url.match(/\.(pdf)$/i)) return "pdf";
    return "unknown";
  };

  const getFileIcon = (url: string) => {
    const type = getFileType(url);
    switch (type) {
      case "image":
        return <ImageIcon className="text-green-500" />;
      case "video":
        return <VideoIcon className="text-purple-500" />;
      case "pdf":
        return <PdfIcon className="text-red-500" />;
      default:
        return <FileIcon className="text-gray-500" />;
    }
  };

  const getFileTypeChip = (url: string) => {
    const type = getFileType(url);
    const color =
      type === "image"
        ? "success"
        : type === "video"
        ? "secondary"
        : type === "pdf"
        ? "error"
        : "default";
    return <Chip label={type} size="small" color={color} variant="outlined" />;
  };

  const renderPreview = () => {
    switch (previewType) {
      case "image":
        return (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        );
      case "video":
        return (
          <video controls className="max-w-full max-h-full rounded-lg">
            <source src={previewUrl} />
            Your browser does not support the video tag.
          </video>
        );
      case "pdf":
        return (
          <iframe
            src={previewUrl}
            className="w-full h-full min-h-[500px] rounded-lg border"
            title="PDF Preview"
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <FileIcon style={{ fontSize: 64 }} />
            <p className="mt-4 text-lg font-medium">Preview not available</p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-lg font-semibold ">{label}</label>
        {fileUrl && (
          <Chip
            label="File Attached"
            color="success"
            variant="filled"
            size="small"
          />
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === "upload"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UploadIcon className="w-5 h-5 mr-2 inline" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === "url"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LinkIcon className="w-5 h-5 mr-2 inline" />
          Enter URL
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-25"
            } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <UploadIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {isPending ? (
                <div className="space-y-2">
                  <CircularProgress size={32} />
                  <p className="text-lg font-medium text-gray-700">
                    Uploading...
                  </p>
                  <p className="text-sm text-gray-500">
                    Please wait while we upload your file
                  </p>
                </div>
              ) : file ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    File selected and uploading...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    {isDragActive
                      ? "Drop your file here"
                      : "Drag & drop your file here"}
                  </p>
                  <p className="text-sm text-gray-500">
                    or{" "}
                    <span className="text-blue-600 font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Supports: Images, Videos, PDFs (Max: 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* URL Tab */}
      {activeTab === "url" && (
        <div className="space-y-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="https://example.com/file.pdf"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualUrlSubmit()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            className="rounded-lg"
          />
          <button
            type="button"
            onClick={handleManualUrlSubmit}
            disabled={!manualUrl.trim()}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Set URL
          </button>
        </div>
      )}

      {/* Current File Display */}
      {fileUrl && (
        <div className="rounded-2xl p-6 border border-gray-200">
          <div
            className="flex items-center space-x-4 flex-1 min-w-0 cursor-pointer"
            onClick={() => handlePreview(fileUrl)}
          >
            {/* <div className="flex-shrink-0">{getFileIcon(fileUrl)}</div> */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Click Here To Preview
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {getFileTypeChip(fileUrl)}
                <span className="text-xs">{fileUrl}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <Alert
          severity={message.type}
          className="rounded-xl"
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          className="p-0 relative"
          sx={{ bgcolor: "section.main", opacity: 0.9 }}
        >
          <IconButton
            onClick={handleClosePreview}
            className="absolute top-4 right-4 z-10  shadow-lg "
            size="medium"
            sx={{ color: "section.contrastText" }}
          >
            <CloseIcon />
          </IconButton>
          <Box className="flex items-center justify-center p-8 min-h-[500px]">
            {renderPreview()}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
