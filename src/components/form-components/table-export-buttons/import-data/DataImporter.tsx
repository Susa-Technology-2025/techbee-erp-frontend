// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  Portal,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";
import { ZodSchema } from "zod";
import DataTable from "./DataTable";
import { processExcelFile } from "./fileProcessor";

// Local storage keys
const STORAGE_KEY = "dataImporterState";

interface DataImporterProps<T extends ZodSchema<any>> {
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  schema: T;
  mutation: any;
}

interface StoredState {
  data: any[];
  headers: string[];
  fileName: string;
}

export default function DataImporter<T extends ZodSchema<any>>({
  table,
  columns,
  schema,
  mutation,
}: DataImporterProps<T>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning",
  });

  // Load saved state on mount
  // useEffect(() => {
  //   const savedState = localStorage.getItem(STORAGE_KEY);
  //   if (savedState) {
  //     try {
  //       const { data, headers, fileName } = JSON.parse(
  //         savedState
  //       ) as StoredState;
  //       setData(data);
  //       setHeaders(headers);
  //       setFileName(fileName);
  //     } catch (e) {
  //       localStorage.removeItem(STORAGE_KEY);
  //     }
  //   }
  // }, []);

  // Save state whenever it changes
  // useEffect(() => {
  //   if (data.length > 0) {
  //     const stateToSave: StoredState = { data, headers, fileName };
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  //   }
  // }, [data, headers, fileName]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      try {
        setFileName(acceptedFiles[0].name);
        const { headers, data } = await processExcelFile(acceptedFiles[0]);
        setHeaders(headers);
        setData(data);
        showSnackbar("File uploaded successfully", "success");
      } catch (error) {
        showSnackbar("Error processing file", "error");
      }
    },
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExit = () => {
    setData([]);
    setHeaders([]);
    setFileName("");
    // localStorage.removeItem(STORAGE_KEY);
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <CloudUpload />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          Import Data
          <IconButton
            aria-label="close"
            onClick={handleExit}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {data.length === 0 ? (
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "4px",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <p>Drag & drop an Excel or CSV file here, or click to select</p>
            </Box>
          ) : (
            <Stack gap={2}>
              <DataTable
                data={data}
                headers={headers}
                setData={setData}
                setHeaders={setHeaders}
                schema={schema}
                expectedColumns={columns}
                mutation={mutation}
                fileName={fileName}
                onClose={handleClose}
                onExit={handleExit}
                showSnackbar={showSnackbar}
              />
            </Stack>
          )}
        </DialogContent>
      </Dialog>
      <Portal>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}
