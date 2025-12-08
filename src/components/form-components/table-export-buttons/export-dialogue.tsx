// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ListSubheader,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import {
  type MRT_TableInstance,
  type MRT_ColumnDef,
} from "material-react-table";
import { z } from "zod";
import { format } from "date-fns";
import { generatePdf } from "@/lib/actions/puppeteer";
import { exportToXLSX } from "./utils";

type Session = {
  id: string;
  loggedIn: boolean;
  organizationId: string;
  profilePicture: string;
  role: string[];
  username: string;
  xTenantCode: string;
};

type ExportDialogProps<T extends z.ZodTypeAny> = {
  open: boolean;
  onClose: () => void;
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  tableTitle: string;
};

const ExportDialog = <T extends z.ZodTypeAny>({
  open,
  onClose,
  table,
  columns,
  tableTitle,
}: ExportDialogProps<T>) => {
  const theme = useTheme();

  const [user, setUser] = useState<Session>({
    id: "",
    loggedIn: false,
    organizationId: "",
    profilePicture: "",
    role: ["guest"],
    username: "",
    xTenantCode: "",
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [exportType, setExportType] = useState<
    | "pdf-all"
    | "pdf-page"
    | "pdf-selected"
    | "xlsx-all"
    | "xlsx-page"
    | "xlsx-selected"
    | "xlsx-template"
  >("pdf-page");

  const [companyName, setCompanyName] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [reportDate, setReportDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const [reportVersion, setReportVersion] = useState("");
  const [confidentiality, setConfidentiality] = useState("");
  const [reportPeriod, setReportPeriod] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [recipient, setRecipient] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [department, setDepartment] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [keywords, setKeywords] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [pdfPassword, setPdfPassword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setPreparedBy(user.username);
  }, [user.username]);

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const getExportableRows = useCallback(() => {
    switch (exportType) {
      case "pdf-all":
      case "xlsx-all":
        return table.getPrePaginationRowModel().rows;
      case "pdf-page":
      case "xlsx-page":
        return table.getRowModel().rows;
      case "pdf-selected":
      case "xlsx-selected":
        return table.getSelectedRowModel().rows;
      default:
        return [];
    }
  }, [exportType, table]);

  const handleExport = useCallback(async () => {
    setIsGenerating(true);

    const now = new Date();
    const fileName = `${tableTitle}_records_${format(now, "yyyyMMdd_HHmmss")}`;

    const exportableColumns = columns.filter(
      (column) =>
        selectedColumns.includes(column.id as string) &&
        column.id !== "actions" &&
        column.id !== "id"
    );

    const tableHeaders = exportableColumns.map((c) => ({
      text: String(c.header),
      style: "tableHeader",
    }));

    if (exportType === "xlsx-template") {
      try {
        exportToXLSX({
          tableHeaders,
          tableData: [],
          fileName: `${tableTitle}_template_${format(now, "yyyyMMdd_HHmmss")}`,
        });
      } catch (error) {
        console.error("Error generating XLSX template:", error);
        if (error instanceof Error) {
          console.error("Client: Error message:", error.message);
          console.error("Client: Error stack:", error.stack);
        }
      } finally {
        setIsGenerating(false);
      }
      onClose();
      return;
    }

    const rowsToExport = getExportableRows();
    if (rowsToExport.length === 0) {
      console.log("No rows to export for the selected option.");
      setIsGenerating(false);
      return;
    }

    const tableData = rowsToExport.map((row) =>
      exportableColumns.map((colDef) => {
        const cell = row.getAllCells().find((c) => c.column.id === colDef.id);
        if (cell) {
          const renderedValue = cell.renderValue();
          const cellContext = {
            cell,
            column: cell.column,
            row,
            table,
            renderedCellValue: cell.renderValue(),
          };

          if (colDef.Cell) {
            try {
              return colDef.Cell(cellContext) || "";
            } catch (e) {
              console.warn(`Error rendering cell for column ${colDef.id}`, e);
              return String(renderedValue ?? "");
            }
          }

          if (renderedValue === null || renderedValue === undefined) return "";
          if (renderedValue instanceof Date)
            return format(renderedValue, "yyyy-MM-dd");
          if (typeof renderedValue === "boolean")
            return renderedValue ? "Yes" : "No";

          return String(renderedValue);
        }
        return "";
      })
    );

    if (exportType.startsWith("pdf")) {
      try {
        const pdfBuffer = await generatePdf({
          companyName,
          reportTitle,
          preparedBy,
          reportDate,
          reportVersion,
          confidentiality,
          reportPeriod,
          approvalStatus,
          recipient,
          projectCode,
          department,
          referenceNumber,
          keywords,
          disclaimer,
          dataSource,
          customNote,
          pdfPassword,
          tableHeaders,

          tableData,
          pageOrientation:
            exportableColumns.length > 5 ? "landscape" : "portrait",
        });

        if (pdfBuffer) {
          const blob = new Blob([pdfBuffer], { type: "application/pdf" });

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${fileName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } else {
          console.error(
            "PDF generation failed: No data received from server action or server action returned null."
          );
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
        if (error instanceof Error) {
          console.error("Client: Error message:", error.message);
          console.error("Client: Error stack:", error.stack);
        }
      } finally {
        setIsGenerating(false);
      }
    } else if (exportType.startsWith("xlsx")) {
      try {
        exportToXLSX({ tableHeaders, tableData, fileName });
      } catch (error) {
        console.error("Error generating XLSX:", error);
        if (error instanceof Error) {
          console.error("Client: Error message:", error.message);
          console.error("Client: Error stack:", error.stack);
        }
      } finally {
        setIsGenerating(false);
      }
    }

    onClose();
  }, [
    exportType,
    tableTitle,
    columns,
    selectedColumns,
    companyName,
    reportTitle,
    preparedBy,
    reportDate,
    reportVersion,
    confidentiality,
    reportPeriod,
    approvalStatus,
    recipient,
    projectCode,
    department,
    referenceNumber,
    keywords,
    disclaimer,
    dataSource,
    customNote,
    pdfPassword,
    getExportableRows,
    onClose,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "15px",
          boxShadow: theme.shadows[10],
          background: theme.palette.background.paper,
          backdropFilter: "blur(5px)",
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.section.main,
          color: theme.palette.section.contrastText,
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          textAlign: "center",
          padding: "15px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FileDownloadIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Configure Report Export
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          padding: "30px",
          background: theme.palette.background.default,
          display: "flex",
          flexDirection: "row",
          gap: theme.spacing(5),
          flexGrow: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Left Section - Report Details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: theme.palette.section.main,
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box component="span" sx={{ mr: 1 }}>
              <i className="fas fa-file-alt"></i>
            </Box>
            Report Details
          </Typography>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "0.1em",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
              },
            }}
          >
            <TextField
              label="Company Name"
              fullWidth
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              sx={{ mb: 2.5 }}
              size="small"
              helperText="Name of the organization generating the report."
            />

            <TextField
              label="Report Title"
              fullWidth
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              sx={{ mb: 2.5 }}
              size="small"
              helperText="Main title of the report."
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Prepared By"
                fullWidth
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                sx={{ mb: 2.5 }}
                size="small"
              />
              <TextField
                label="Report Date"
                type="date"
                fullWidth
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                sx={{ mb: 2.5 }}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.section.main,
                fontWeight: "bold",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                <i className="fas fa-clipboard-check"></i>
              </Box>
              Classification & Approval
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Report Version"
                fullWidth
                value={reportVersion}
                onChange={(e) => setReportVersion(e.target.value)}
                sx={{ mb: 2.5 }}
                size="small"
              />
              <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                <InputLabel>Confidentiality</InputLabel>
                <Select
                  value={confidentiality}
                  onChange={(e) => setConfidentiality(e.target.value)}
                  label="Confidentiality"
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="Confidential">Confidential</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.section.main,
                fontWeight: "bold",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                <i className="fas fa-info-circle"></i>
              </Box>
              Additional Context
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Report Period"
                fullWidth
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                sx={{ mb: 2.5 }}
                size="small"
              />
              <TextField
                label="Project Code"
                fullWidth
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                sx={{ mb: 2.5 }}
                size="small"
              />
            </Box>

            <TextField
              label="Disclaimer"
              fullWidth
              multiline
              rows={3}
              value={disclaimer}
              onChange={(e) => setDisclaimer(e.target.value)}
              sx={{ mb: 2.5 }}
              size="small"
            />
          </Box>
        </Box>

        {/* Right Section - Export Configuration */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: theme.palette.section.main,
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box component="span" sx={{ mr: 1 }}>
              <i className="fas fa-cogs"></i>
            </Box>
            Export Configuration
          </Typography>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              pr: 1,
            }}
          >
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Export Type</InputLabel>
              <Select
                value={exportType}
                onChange={(e) => setExportType(e.target.value as any)}
                label="Export Type"
              >
                <ListSubheader>PDF Exports</ListSubheader>
                <MenuItem value="pdf-all">Export All Rows (PDF)</MenuItem>
                <MenuItem value="pdf-page">Export Current Page (PDF)</MenuItem>
                <MenuItem
                  value="pdf-selected"
                  disabled={!table.getIsSomeRowsSelected()}
                >
                  Export Selected Rows (PDF)
                </MenuItem>

                <ListSubheader>Excel Exports</ListSubheader>
                <MenuItem value="xlsx-all">Export All Rows (XLSX)</MenuItem>
                <MenuItem value="xlsx-page">
                  Export Current Page (XLSX)
                </MenuItem>
                <MenuItem
                  value="xlsx-selected"
                  disabled={!table.getIsSomeRowsSelected()}
                >
                  Export Selected Rows (XLSX)
                </MenuItem>
                <MenuItem value="xlsx-template">
                  Export Template (XLSX)
                </MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.section.main,
                fontWeight: "bold",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                <i className="fas fa-columns"></i>
              </Box>
              Column Selection
            </Typography>

            <FormGroup>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexWrap: "wrap",
                  maxHeight: 300,
                  gap: 1,
                }}
              >
                {columns
                  .filter(
                    (column) => column.id !== "actions" && column.id !== "id"
                  )
                  .map((column) => (
                    <FormControlLabel
                      key={column.id}
                      control={
                        <Checkbox
                          checked={selectedColumns.includes(
                            column.id as string
                          )}
                          onChange={() =>
                            handleToggleColumn(column.id as string)
                          }
                          color="primary"
                        />
                      }
                      label={String(column.header)}
                    />
                  ))}
              </Box>
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          justifyContent: "space-between",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: theme.palette.error.main,
            fontWeight: "bold",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{
            bgcolor: theme.palette.section.main,
            color: theme.palette.section.contrastText,
            fontWeight: "bold",
            "&:hover": {
              bgcolor: theme.palette.section.dark,
            },
          }}
          disabled={isGenerating}
        >
          {isGenerating ? "Exporting..." : "Confirm Export"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
