// @ts-nocheck
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  type MRT_Cell,
  type MRT_Row,
  type MRT_TableInstance,
} from "material-react-table";
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Check,
  Close,
  Info,
  Edit,
  Send,
  ExitToApp,
  Delete,
  Download,
} from "@mui/icons-material";
import { ZodSchema } from "zod";
import { parseExcelData } from "./validationUtils";
import * as XLSX from "xlsx";

interface DataTableProps<T extends ZodSchema<any>> {
  data: Record<string, any>[];
  headers: string[];
  setData: (data: Record<string, any>[]) => void;
  setHeaders: (headers: string[]) => void;
  schema: T;
  expectedColumns: MRT_ColumnDef<z.infer<T>>[];
  mutation: (formData: FormData) => Promise<any>;
  fileName: string;
  onClose: () => void;
  showSnackbar: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
  onExit: () => void;
}

type ValidationState = {
  isValid: boolean;
  errors: Record<string, string[]>;
  showErrors: boolean;
};

interface ApiResponse {
  validCount: number;
  invalidCount: number;
  errors: string[];
  dryRun: boolean;
}

export default function DataTable<T extends ZodSchema<any>>({
  data,
  headers,
  setData,
  setHeaders,
  schema,
  expectedColumns,
  mutation,
  fileName,
  onClose,
  showSnackbar,
  onExit,
}: DataTableProps<T>) {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: false,
    errors: {},
    showErrors: false,
  });

  const [isValidating, setIsValidating] = useState(false);
  const [editingHeader, setEditingHeader] = useState<number | null>(null);
  const [headerEditValue, setHeaderEditValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [isGeneratingFile, setIsGeneratingFile] = useState(false);
  const [showApiResponseModal, setShowApiResponseModal] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<ApiResponse | null>(
    null
  );
  const [isTableReady, setIsTableReady] = useState(false); // New state for initial table render spinner

  const [sendToBackEnd, { isLoading: isSubmitting }] = mutation();

  // Effect to manage the initial table readiness spinner
  useEffect(() => {
    // A small timeout to allow the initial render cycle to complete for large datasets
    // before considering the table "ready" and removing the overlay.
    const timer = setTimeout(() => {
      setIsTableReady(true);
    }, 100); // Adjust delay as needed, e.g., 100ms or 200ms

    return () => clearTimeout(timer);
  }, []); // Run once on component mount

  const columns = useMemo<MRT_ColumnDef<Record<string, any>>[]>(() => {
    return headers.map((header, index) => ({
      accessorKey: `col${index}`,
      header: (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {editingHeader === index ? (
            <input
              value={headerEditValue}
              onChange={(e) => setHeaderEditValue(e.target.value)}
              onBlur={() => {
                const newHeaders = [...headers];
                newHeaders[index] = headerEditValue;
                setHeaders(newHeaders);
                setEditingHeader(null);
              }}
              autoFocus
              style={{ width: "100%" }}
            />
          ) : (
            <>
              <span>{header}</span>
              <IconButton
                size="small"
                onClick={() => {
                  setHeaderEditValue(header);
                  setEditingHeader(index);
                }}
                sx={{ ml: 1 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ),
      Cell: ({ cell }) => <Box>{cell.getValue<string>()}</Box>,
      size: 200,
    }));
  }, [headers, editingHeader, headerEditValue]);

  const handleSaveRow: MRT_TableOptions<
    Record<string, any>
  >["onEditingRowSave"] = async ({ exitEditingMode, row, values }) => {
    const newData = [...data];
    newData[row.index] = values;
    setData(newData);
    handleValidate(newData);
    exitEditingMode();
  };

  const handleValidate = useCallback(
    (currentData: Record<string, any>[]) => {
      setIsValidating(true);
      try {
        const { isValid, errors } = parseExcelData(
          currentData,
          headers,
          schema,
          expectedColumns
        );
        setValidationState({
          isValid,
          errors,
          showErrors: !isValid,
        });

        if (isValid) {
          showSnackbar("All data is valid!", "success");
        } else {
          const errorCount = Object.values(errors).flat().length;
          showSnackbar(`Found ${errorCount} validation errors`, "error");
          setValidationState((prev) => ({ ...prev, showErrors: true }));
        }
      } catch (error) {
        showSnackbar("Validation failed", "error");
        setValidationState((prev) => ({ ...prev, showErrors: true }));
      } finally {
        setIsValidating(false);
      }
    },
    [headers, schema, expectedColumns, showSnackbar]
  );

  const handleDeleteRows = useCallback(() => {
    const rowsToDelete = Object.keys(rowSelection).map(Number);
    if (rowsToDelete.length === 0) {
      showSnackbar("No rows selected for deletion", "info");
      return;
    }

    const newData = data.filter((_, index) => !rowsToDelete.includes(index));
    setData(newData);
    setRowSelection({});
    showSnackbar(`${rowsToDelete.length} row(s) deleted`, "success");
  }, [data, rowSelection, setData, showSnackbar]);

  const generateExcelBlob = useCallback(() => {
    const wb = XLSX.utils.book_new();

    const sheetData = [headers];

    data.forEach((row) => {
      const rowValues: any[] = [];
      for (let i = 0; i < headers.length; i++) {
        rowValues.push(row[`col${i}`]);
      }
      sheetData.push(rowValues);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    return new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }, [data, headers]);

  const handleDownloadFile = () => {
    setIsGeneratingFile(true);
    const blob = generateExcelBlob();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSnackbar("File downloaded successfully", "success");
    }
    setIsGeneratingFile(false);
  };

  const handleSubmitConfirmed = async () => {
    const blob = generateExcelBlob();
    if (!blob) {
      showSnackbar("Failed to generate Excel file for submission.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("dryRun", dryRun.toString());

      const res: ApiResponse = await sendToBackEnd(formData).unwrap();
      setApiResponseData(res);
      setShowApiResponseModal(true);
      showSnackbar("Submission process completed. See details.", "info");
    } catch (error) {
      console.error("handleSubmit: Submission failed:", error);
      showSnackbar("Failed to submit data", "error");
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: true,
    editDisplayMode: "modal",
    onEditingRowSave: handleSaveRow,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableTopToolbar: true,
    renderTopToolbarCustomActions: ({ table }) => (
      <Stack direction="row" gap={1}>
        {/* <Button
          onClick={() => handleValidate(data)}
          disabled={isValidating}
          variant="contained"
          color="primary"
          startIcon={
            isValidating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Check />
            )
          }
        >
          {isValidating ? "Validating..." : "Validate"}
        </Button> 
         <Button
          onClick={() =>
            setValidationState((prev) => ({ ...prev, showErrors: true }))
          }
          disabled={
            validationState.isValid ||
            Object.keys(validationState.errors).length === 0
          }
          variant="outlined"
          color="error"
          startIcon={<ErrorIcon />}
        >
          Show Errors
        </Button> */}
        <Button
          onClick={handleDeleteRows}
          disabled={Object.keys(rowSelection).length === 0}
          variant="outlined"
          color="error"
          startIcon={<Delete />}
        >
          Delete Selected Rows ({Object.keys(rowSelection).length})
        </Button>
        <Button
          onClick={() => setShowSubmitModal(true)}
          // disabled={!validationState.isValid || isSubmitting}
          variant="contained"
          color="success"
          startIcon={<Send />}
          sx={{ ml: "auto" }}
        >
          Submit
        </Button>
        <Button
          onClick={onExit}
          variant="outlined"
          color="inherit"
          startIcon={<ExitToApp />}
        >
          Clear
        </Button>
      </Stack>
    ),
    muiTablePaperProps: {
      sx: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
      },
    },
    muiTableContainerProps: {
      sx: {
        flex: "1 1 auto",
        maxHeight: "70vh",
      },
    },
    initialState: {
      density: "compact",
    },
  });

  return (
    <>
      {/* Conditional rendering for initial table load spinner */}
      {!isTableReady ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading table data...</Typography>
        </Box>
      ) : (
        <MaterialReactTable table={table} />
      )}

      {/* Validation Errors Modal */}
      <Dialog
        open={validationState.showErrors}
        onClose={() =>
          setValidationState((prev) => ({ ...prev, showErrors: false }))
        }
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Validation Errors</DialogTitle>
        <DialogContent>
          {Object.entries(validationState.errors).map(([rowId, errors]) => (
            <Box key={rowId} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {rowId === "-1"
                  ? "Header Errors"
                  : `Row ${parseInt(rowId) + 1}`}
              </Typography>
              <List dense>
                {errors.map((error, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={error}
                      primaryTypographyProps={{ color: "error" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setValidationState((prev) => ({ ...prev, showErrors: false }))
            }
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submission Confirmation Modal */}
      <Dialog
        open={showSubmitModal}
        onClose={!isSubmitting ? () => setShowSubmitModal(false) : undefined}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={isSubmitting}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            File to be sent to the server:
          </Typography>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="info"
              startIcon={
                isGeneratingFile ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Download />
                )
              }
              onClick={handleDownloadFile}
              disabled={isSubmitting || isGeneratingFile}
            >
              {isGeneratingFile ? "Generating..." : "Download Excel File"}
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="Perform Dry Run (no actual changes to server data)"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowSubmitModal(false)}
            color="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitConfirmed}
            color="success"
            variant="contained"
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Send />
              )
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm & Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Response Modal */}
      <Dialog
        open={showApiResponseModal}
        onClose={() => {
          setShowApiResponseModal(false);
          setShowSubmitModal(false);
          onClose();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>API Submission Result</DialogTitle>
        <DialogContent dividers>
          {apiResponseData ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <Typography component="span" fontWeight="bold">
                  Valid Records:
                </Typography>{" "}
                {apiResponseData.validCount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <Typography component="span" fontWeight="bold">
                  Invalid Records:
                </Typography>{" "}
                {apiResponseData.invalidCount}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <Typography component="span" fontWeight="bold">
                  Dry Run:
                </Typography>{" "}
                {apiResponseData.dryRun ? "Yes" : "No"}
              </Typography>

              {apiResponseData.errors && apiResponseData.errors.length > 0 ? (
                <Box>
                  <Typography variant="h6" color="error" gutterBottom>
                    Errors:
                  </Typography>
                  <List
                    dense
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      border: "1px solid #fdd",
                      borderRadius: "4px",
                      p: 1,
                    }}
                  >
                    {apiResponseData.errors.map(
                      (error: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={error}
                            primaryTypographyProps={{ color: "error" }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
              ) : (
                <Typography variant="body1" color="success">
                  No errors reported in the API response.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography>No response data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowApiResponseModal(false);
              setShowSubmitModal(false);
              onClose();
            }}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
