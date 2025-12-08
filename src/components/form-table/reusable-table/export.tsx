"use client";

import React, { useState, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Autocomplete,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Tooltip,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Grid,
} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Portrait as PortraitIcon,
  Landscape as LandscapeIcon,
  Description as DocumentIcon,
  TableChart as TableIcon,
  DataObject as JsonIcon,
  ExpandMore as ExpandIcon,
  ViewColumn as ColumnIcon,
  CheckBox as CheckboxIcon,
  CheckBoxOutlineBlank as CheckboxEmptyIcon,
  SelectAll as SelectAllIcon,
  FilePresent as TemplateIcon,
} from "@mui/icons-material";
import { MRT_TableInstance } from "material-react-table";
import { exportTable } from "./export-function";
import { session } from "@/lib/auth/session";

interface ReportParams {
  companyName: string;
  reportTitle: string;
  preparedBy: string;
  reportDate: string;
  reportVersion: string;
  confidentiality: string;
  reportPeriod: string;
  approvalStatus: string;
  recipient: string;
  projectCode: string;
  department: string;
  referenceNumber: string;
  keywords: string;
  disclaimer: string;
  dataSource: string;
  customNote: string;
  pageOrientation: "portrait" | "landscape";
  exportFormat: "pdf" | "xlsx" | "csv" | "json" | "template";
  content: string;
  selectedColumns: string[];
  companyLogo: string;
}

interface ExportColumn {
  id: string;
  header: string;
}

interface TableExportButtonProps {
  table: MRT_TableInstance<any>;
}

const confidentialityOptions = [
  "Internal Use Only",
  "Confidential",
  "Public",
  "Restricted",
];
const approvalStatusOptions = ["Draft", "Pending", "Approved", "Rejected"];
const departmentOptions = ["Operations", "Finance", "HR", "IT", "Marketing"];
const dataSourceOptions = [
  "Internal Database",
  "External API",
  "Manual Entry",
  "Third-Party Provider",
];
const exportFormatOptions = ["pdf", "xlsx", "csv", "json", "template"];

const formatIcons = {
  pdf: <PdfIcon />,
  xlsx: <TableIcon />,
  csv: <DocumentIcon />,
  json: <JsonIcon />,
  template: <TemplateIcon />,
};

const TableExportButton: React.FC<TableExportButtonProps> = ({ table }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allColumns, setAllColumns] = useState<ExportColumn[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [reportParams, setReportParams] = useState<ReportParams>({
    companyName: "",
    reportTitle: "",
    preparedBy: "",
    reportDate: new Date().toISOString().split("T")[0],
    reportVersion: "1.0",
    confidentiality: "",
    reportPeriod: `${new Date().getFullYear()}`,
    approvalStatus: "",
    recipient: "",
    projectCode: "",
    department: "",
    referenceNumber: ``,
    keywords: "data, report, analysis",
    disclaimer: "",
    dataSource: "",
    customNote: "",
    pageOrientation: "portrait",
    exportFormat: "pdf",
    content: "",
    selectedColumns: [],
    companyLogo: "",
  });

  useEffect(() => {
    session().then((user) => {
      if (user.username && user.xTenantCode) {
        setReportParams({
          ...reportParams,
          preparedBy: user.firstName + " " + user.lastName,
          companyName: user.tenantName,
          companyLogo: user.tenantLogoUrl,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (table) {
      const visibleColumns = table.getVisibleLeafColumns();
      const exportColumns: ExportColumn[] = visibleColumns
        .filter(
          (col) =>
            col.id !== "mrt-row-select" &&
            col.id !== "mrt-row-actions" &&
            col.id !== "mrt-expand"
        )
        .map((col) => ({
          id: col.id,
          // Ensure we capture the user-friendly header
          header: (col.columnDef.header as string) || col.id,
        }));

      setAllColumns(exportColumns);
      setReportParams((prev) => ({
        ...prev,
        selectedColumns: [],
      }));
    }
  }, [table]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  const handleInputChange = (name: string, value: string) => {
    setReportParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (value: string) => {
    setReportParams((prev) => {
      const newParams = { ...prev, exportFormat: value };
      if (value === "template") {
        newParams.selectedColumns = allColumns.map((col) => col.id);
      }
      return newParams;
    });
  };

  const handleOrientationChange = (
    event: React.MouseEvent<HTMLElement>,
    newOrientation: "portrait" | "landscape"
  ) => {
    if (newOrientation !== null) {
      setReportParams((prev) => ({
        ...prev,
        pageOrientation: newOrientation,
      }));
    }
  };

  const toggleColumnSelection = (columnId: string) => {
    setReportParams((prev) => {
      const newSelectedColumns = prev.selectedColumns.includes(columnId)
        ? prev.selectedColumns.filter((id) => id !== columnId)
        : [...prev.selectedColumns, columnId];
      return {
        ...prev,
        selectedColumns: newSelectedColumns,
      };
    });
  };

  const toggleAllColumns = () => {
    setReportParams((prev) => {
      const allIds = allColumns.map((col) => col.id);
      const allSelected = prev.selectedColumns.length === allIds.length;
      return {
        ...prev,
        selectedColumns: allSelected ? [] : allIds,
      };
    });
  };

  const handleExport = async () => {
    if (reportParams.exportFormat === "pdf") {
      setLoading(true);
    }
    try {
      let exportData = { ...reportParams };
      const selectedColumnIds = reportParams.selectedColumns;

      // Create the mapping object (id -> header) to be used by exportTable
      const columnHeaderMap = allColumns.reduce((acc, col) => {
        if (selectedColumnIds.includes(col.id)) {
          acc[col.id] = col.header;
        }
        return acc;
      }, {} as Record<string, string>);

      // Assuming exportTable is updated to accept the columnHeaderMap
      const file = await exportTable(exportData, table, columnHeaderMap);

      const fileName = `${reportParams.reportTitle.replace(/\s+/g, "_")}.${
        reportParams.exportFormat === "template"
          ? "xlsx"
          : reportParams.exportFormat
      }`;
      if (file && typeof file !== "string") {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      if (reportParams.exportFormat === "pdf") {
        setLoading(false);
      }
    }
  };

  const filteredColumns = allColumns.filter((column) => {
    const headerToSearch = column.header || column.id || "";
    return headerToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isTemplateFormat = reportParams.exportFormat === "template";

  const isTableLoading =
    table.getState().isFetching || table.getState().isLoading;
  const hasNoData = table.getFilteredRowModel().rows.length === 0;
  const isExportDisabled = isTableLoading || hasNoData;

  const dialogStyle = {
    "& .MuiDialog-paper": {
      width: 800,
      maxWidth: "90vw",
      maxHeight: "90vh",
      bgcolor: "background.paper",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      borderRadius: 3,
      overflow: "hidden",
      backgroundImage: "linear-gradient(to bottom, #f9fafb, #ffffff)",
    },
  };

  const sectionHeaderStyle = {
    fontSize: "1.1rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    mb: 2,
  };

  const infoMessageStyle = {
    backgroundColor: "info.light",
    p: 2,
    borderRadius: 1,
  };

  return (
    <>
      <Tooltip
        title={
          isTableLoading
            ? "Loading data..."
            : hasNoData
            ? "No data to export"
            : "Export Report"
        }
        arrow
      >
        <span>
          <IconButton onClick={handleOpen} disabled={isExportDisabled}>
            <DownloadIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} sx={dialogStyle} maxWidth="lg">
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PdfIcon sx={{ mr: 1.5 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Export
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ overflow: "auto" }}>
          <Box sx={{ p: 3 }}>
            <Grid size={{ xs: 12 }} container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={reportParams.exportFormat}
                    label="Export Format"
                    onChange={(e) => handleFormatChange(e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    {exportFormatOptions.map((format) => (
                      <MenuItem
                        key={format}
                        value={format}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {formatIcons[format as keyof typeof formatIcons]}
                        {format.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ToggleButtonGroup
                  value={reportParams.pageOrientation}
                  exclusive
                  onChange={handleOrientationChange}
                  aria-label="page orientation"
                  disabled={reportParams.exportFormat !== "pdf"}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="portrait" aria-label="portrait">
                    <PortraitIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">Portrait</Typography>
                  </ToggleButton>
                  <ToggleButton value="landscape" aria-label="landscape">
                    <LandscapeIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">Landscape</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Report Title"
                  name="reportTitle"
                  value={reportParams.reportTitle}
                  onChange={(e) =>
                    handleInputChange("reportTitle", e.target.value)
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {!isTemplateFormat && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" sx={sectionHeaderStyle}>
                  <ColumnIcon sx={{ mr: 1, color: "primary.main" }} />
                  Select Columns to Export
                </Typography>

                <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TextField
                      placeholder="Search columns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <Tooltip
                      title={
                        reportParams.selectedColumns.length ===
                        allColumns.length
                          ? "Deselect all"
                          : "Select all"
                      }
                    >
                      <Button
                        onClick={toggleAllColumns}
                        startIcon={<SelectAllIcon />}
                        size="small"
                        sx={{ ml: 2, whiteSpace: "nowrap" }}
                      >
                        {reportParams.selectedColumns.length ===
                        allColumns.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </Tooltip>
                  </Box>

                  <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                    <List dense>
                      {filteredColumns.map((column) => (
                        <ListItem
                          key={column.id}
                          button
                          onClick={() => toggleColumnSelection(column.id)}
                          sx={{
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Checkbox
                              edge="start"
                              checked={reportParams.selectedColumns.includes(
                                column.id
                              )}
                              tabIndex={-1}
                              disableRipple
                              icon={<CheckboxEmptyIcon fontSize="small" />}
                              checkedIcon={
                                <CheckboxIcon
                                  color="primary"
                                  fontSize="small"
                                />
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {/* FIX: Only display the user-friendly header */}
                                {column.header}
                              </Typography>
                            }
                            sx={{
                              "& .MuiListItemText-primary": {
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              },
                            }}
                          />
                        </ListItem>
                      ))}

                      {filteredColumns.length === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="No columns found"
                            secondary="Try a different search term"
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      backgroundColor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {reportParams.selectedColumns.length} of{" "}
                      {allColumns.length} columns selected
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" sx={sectionHeaderStyle}>
                  <InfoIcon sx={{ mr: 1, color: "primary.main" }} />
                  Report Details
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid size={{ xs: 12 }} container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Department"
                        name="department"
                        value={reportParams.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        select
                      >
                        {departmentOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        options={confidentialityOptions}
                        value={reportParams.confidentiality}
                        onChange={(_, value) =>
                          handleInputChange("confidentiality", value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Confidentiality"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        options={approvalStatusOptions}
                        value={reportParams.approvalStatus}
                        onChange={(_, value) =>
                          handleInputChange("approvalStatus", value || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Approval Status"
                            variant="outlined"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Report Period"
                        name="reportPeriod"
                        value={reportParams.reportPeriod}
                        onChange={(e) =>
                          handleInputChange("reportPeriod", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: "primary.main",
                    justifyContent: "flex-start",
                    width: "100%",
                    py: 1,
                  }}
                  endIcon={
                    <ExpandIcon
                      sx={{
                        transition: "transform 0.3s",
                        transform: showAdvanced ? "rotate(180deg)" : "none",
                      }}
                    />
                  }
                >
                  {showAdvanced
                    ? "Hide Advanced Details"
                    : "Show Advanced Details"}
                </Button>

                <Collapse in={showAdvanced}>
                  <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Grid size={{ xs: 12 }} container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Recipient"
                          name="recipient"
                          value={reportParams.recipient}
                          onChange={(e) =>
                            handleInputChange("recipient", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Project Code"
                          name="projectCode"
                          value={reportParams.projectCode}
                          onChange={(e) =>
                            handleInputChange("projectCode", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Reference Number"
                          name="referenceNumber"
                          value={reportParams.referenceNumber}
                          onChange={(e) =>
                            handleInputChange("referenceNumber", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          label="Keywords"
                          name="keywords"
                          value={reportParams.keywords}
                          onChange={(e) =>
                            handleInputChange("keywords", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                          options={dataSourceOptions}
                          value={reportParams.dataSource}
                          onChange={(_, value) =>
                            handleInputChange("dataSource", value || "")
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Data Source"
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Disclaimer"
                          name="disclaimer"
                          value={reportParams.disclaimer}
                          onChange={(e) =>
                            handleInputChange("disclaimer", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          multiline
                          rows={2}
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Custom Note"
                          name="customNote"
                          value={reportParams.customNote}
                          onChange={(e) =>
                            handleInputChange("customNote", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                          multiline
                          rows={2}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Box>
            </>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, justifyContent: "flex-end" }}>
          <Button
            onClick={handleClose}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleExport}
            disabled={
              loading ||
              isTableLoading ||
              hasNoData ||
              !reportParams.reportTitle ||
              (!isTemplateFormat && reportParams.selectedColumns.length === 0)
            }
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DownloadIcon />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            {loading ? "Exporting..." : "Export Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableExportButton;
