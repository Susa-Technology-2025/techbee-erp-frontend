// pages/index.tsx
"use client";
import {
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
  useMemo,
} from "react";
import { Virtuoso } from "react-virtuoso";
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  AppBar,
  Toolbar,
  InputAdornment,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  capitalize,
  CircularProgress,
  Tooltip,
  Stack,
  Portal,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccountCircle as EmployeeIcon,
  Settings as SettingsIcon,
  Visibility as PreviewIcon,
  Download as DownloadIcon,
  RestartAlt as ResetIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon,
  Money,
} from "@mui/icons-material";
import PayrollPreviewModal from "../payroll-batches/_components/preview-card";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";

// Define TypeScript interfaces
interface SalaryStructure {
  id: string;
  name: string;
  code: string;
}

interface Contract {
  id: string;
  status: string;
  baseSalary: number;
  startDate: string;
  endDate: string;
  salaryStructure?: SalaryStructure;
}

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  fatherName: string;
  department?: string;
  position?: { title: string };
  jobTitle?: string;
  email?: string;
  status?: "active" | "inactive";
  contracts?: Contract[];
}

interface PayslipData {
  employee: { id: string };
  contract?: { id: string };
  batchId?: string;
  periodStart: string;
  periodEnd: string;
  currency?: string;
  preview: boolean;
  replaceExisting: boolean;
  organizationNodeId?: string;
}

interface ApiResponse<T> {
  data?: T[];
  content?: T[];
  items?: T[];
  result?: T[];
  message?: string;
}

// Helper function to extract data from API responses
function extractData<T>(response: ApiResponse<T> | undefined): T[] {
  return (
    response?.data ||
    response?.content ||
    response?.items ||
    response?.result ||
    []
  );
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const currencyOptions = [
  { value: "ETB", label: "ETB - Ethiopian Birr" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
];

const departmentOptions = [
  { value: "", label: "All Departments" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "Information Technology" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

export default function PayslipGenerator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Replace RTK Query mutations with custom hooks
  const generateSinglePaySlipMutation = useDataMutation({
    apiEndPoint:
      "https://api.techbee.et/api/hr/paySlips/generate-single-payslip",
    method: "POST",
  });

  // Fix mutation hook usage
  const generateSinglePaySlip = generateSinglePaySlipMutation.mutateAsync;

  // Extract data from response objects with proper typing
  const {
    data: employeesResponse = {},
    isLoading,
    error: employeesError,
  } = useDataQuery<ApiResponse<Employee>>({
    apiEndPoint: "https://api.techbee.et/api/hr/employees",
    pagination: { pageIndex: 0, pageSize: 5000 },
  });

  const employees = useMemo(
    () => extractData<Employee>(employeesResponse),
    [employeesResponse]
  );

  const { data: organizationNodesResponse = {} } = useDataQuery<
    ApiResponse<any>
  >({
    apiEndPoint: "https://api.techbee.et/api/core/organizationNodes",
  });

  const organizationNodes = useMemo(
    () => extractData<any>(organizationNodesResponse),
    [organizationNodesResponse]
  );

  const { data: positionsResponse = {} } = useDataQuery<ApiResponse<any>>({
    apiEndPoint: "https://api.techbee.et/api/hr/positions",
  });

  const positions = useMemo(
    () => extractData<any>(positionsResponse),
    [positionsResponse]
  );

  const { data: payrollBatchResponse = {} } = useDataQuery<ApiResponse<any>>({
    apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches",
  });

  const payrollBatch = useMemo(
    () => extractData<any>(payrollBatchResponse),
    [payrollBatchResponse]
  );

  const { data: PayrollPeriodsResponse = {}, isLoading: PeriodsLoading } =
    useDataQuery<ApiResponse<any>>({
      apiEndPoint: "https://api.techbee.et/api/hr/payrollPeriods",
    });

  const PayrollPeriods = useMemo(
    () => extractData<any>(PayrollPeriodsResponse),
    [PayrollPeriodsResponse]
  );

  // Add this function near your existing formatDate function
  function formatDateForInput(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    // Convert to YYYY-MM-DDTHH:mm format for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // State for form data
  const [payslipData, setPayslipData] = useState<PayslipData>({
    employee: { id: "" },
    batchId: "",
    periodStart: "",
    periodEnd: "",
    currency: "ETB",
    preview: true,
    replaceExisting: false,
  });

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showNotification, setShowNotification] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [highlightEmployeeList, setHighlightEmployeeList] = useState(false);

  // Filter employees based on search and department
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee: Employee) => {
      const matchesSearch =
        employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === "" ||
        employee.department?.toLowerCase().includes(departmentFilter);
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, departmentFilter, employees]);

  const handleCloseSnackbar = (
    event: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Handle form field changes
  const handleInputChange = (field: keyof PayslipData, value: any) => {
    setPayslipData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee.id);
    setPayslipData((prev) => ({
      ...prev,
      employee: { id: employee.id },
      contract: undefined,
    }));
    setHighlightEmployeeList(false);
  };

  useEffect(() => {
    if (highlightEmployeeList) {
      const timer = setTimeout(() => setHighlightEmployeeList(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [highlightEmployeeList]);

  // Form validation
  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!selectedEmployee) errors.push("Employee selection is required");
    if (!payslipData.periodStart) errors.push("Period start date is required");
    if (!payslipData.periodEnd) errors.push("Period end date is required");

    return errors;
  };

  // Handle form submission
  const handleGeneratePayslip = async () => {
    // Prevent double submission
    if (generateSinglePaySlipMutation.isPending) {
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      setSnackbarMessage(errors.join(", "));
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = { ...payslipData };
      if (!payload.batchId || payload.batchId === "") delete payload.batchId;
      if (!payload.contract || payload.contract.id === "")
        delete payload.contract;

      if (payslipData.preview) {
        // Request preview from backend then show modal
        const response = await generateSinglePaySlip({
          ...payload,
          preview: true,
        });
        if (response.message) {
          setSnackbarMessage(response.message);
          setSnackbarSeverity("info");
          setSnackbarOpen(true);
        }
        setPreviewModalOpen(true);
      } else {
        // Directly generate without preview
        const response = await generateSinglePaySlip({
          ...payload,
          preview: false,
        });
        setSnackbarMessage(
          `Payslip generated. Batch: ${response.payrollBatchId || "N/A"}. ${
            response.message || ""
          }`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(
        (error as any)?.message || "Failed to process payslip."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSingleConfirm = async () => {
    if (!selectedEmployee) return;
    setPreviewModalOpen(false);

    try {
      const response = await generateSinglePaySlip({
        ...payslipData,
        preview: false,
      });
      setSnackbarMessage(
        `Payslip generation initiated successfully for batch ID: ${response.payrollBatchId}. ` +
          `${response.message || ""} (Generated: ${
            response.totalPayslipsGenerated || 0
          } payslips).`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        (error as any)?.message || "Failed to generate payslip."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Employee list item component for Virtuoso
  const EmployeeListItem = useCallback(
    ({ employee }: { employee: Employee }) => {
      const isSelected = selectedEmployeeId === employee.id;
      const hasContract = employee.contracts && employee.contracts.length > 0;

      return (
        <Tooltip
          title={
            !hasContract
              ? "This employee has no contract, so you cannot generate a payslip for them."
              : ""
          }
          arrow
          placement="right"
        >
          <ListItem
            divider
            secondaryAction={
              <Checkbox
                edge="end"
                checked={isSelected}
                disabled={!hasContract}
                onChange={() => hasContract && handleEmployeeSelect(employee)}
                sx={{
                  cursor: hasContract ? "pointer" : "not-allowed",
                  opacity: hasContract ? 1 : 0.6,
                }}
              />
            }
            onClick={() => hasContract && handleEmployeeSelect(employee)}
            sx={{
              cursor: hasContract ? "pointer" : "not-allowed",
              height: 72,
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
              >
                {employee.firstName?.[0].toUpperCase()}
                {employee.fatherName?.[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${capitalize(employee.firstName ?? "")} ${capitalize(
                employee.fatherName ?? ""
              )}`}
              secondary={
                hasContract
                  ? employee.position?.title || employee.jobTitle || "N/A"
                  : "No Contract Assigned"
              }
              primaryTypographyProps={{ fontWeight: 500 }}
              secondaryTypographyProps={{
                color: hasContract ? "text.secondary" : "error.main",
              }}
            />
          </ListItem>
        </Tooltip>
      );
    },
    [selectedEmployeeId]
  );

  return (
    <Box sx={{ position: "relative", pb: 4 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Money sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Payslip Generator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        {showNotification && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Payslip generated successfully!
          </Alert>
        )}

        {employeesError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load employees:{" "}
            {(employeesError as any)?.message || "Unknown error"}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 3,
            flex: 1,
          }}
        >
          {/* Left Column - Configuration */}
          <Box
            sx={{
              width: isMobile ? "100%" : "40%",
              minWidth: isMobile ? "100%" : "400px",
            }}
          >
            <Card sx={{ borderRadius: 2, boxShadow: 3, height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SettingsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Payslip Configuration
                  </Typography>
                </Box>

                <Box
                  sx={{ mb: 3 }}
                  onClick={() => setHighlightEmployeeList(true)}
                >
                  <TextField
                    label="Employee"
                    placeholder="Select employee from the list..."
                    value={
                      selectedEmployee
                        ? `${selectedEmployee.firstName} ${selectedEmployee?.fatherName}`
                        : ""
                    }
                    sx={{ width: "100%", mb: 1 }}
                    InputProps={{ readOnly: true }}
                    helperText="Select employee from the list in the right ➡️"
                    onClick={() => setHighlightEmployeeList(true)}
                  />
                  {selectedEmployee && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ ml: 1 }}
                    >
                      ID: {selectedEmployee.employeeCode} |{" "}
                      {selectedEmployee.department || "N/A"} |{" "}
                      {selectedEmployee.position?.title ||
                        selectedEmployee.jobTitle ||
                        "N/A"}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    select
                    label="Contract (Optional)"
                    value={payslipData.contract?.id || ""}
                    onChange={(e) =>
                      handleInputChange("contract", { id: e.target.value })
                    }
                    fullWidth
                    disabled={
                      !selectedEmployee ||
                      !(
                        selectedEmployee.contracts &&
                        selectedEmployee.contracts.length
                      )
                    }
                    helperText={
                      !selectedEmployee ||
                      !(
                        selectedEmployee.contracts &&
                        selectedEmployee.contracts.length
                      )
                        ? "No contract"
                        : "Select an employee to choose a contract"
                    }
                  >
                    <MenuItem value="">
                      <em>— No Value —</em>
                    </MenuItem>
                    {(selectedEmployee?.contracts || []).map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <ListItemText
                          primary={`${formatDate(c.startDate)} - ${formatDate(
                            c.endDate
                          )}`}
                          secondary={c.salaryStructure?.name || ""}
                        />
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Payroll Batch (Optional)"
                    value={payslipData.batchId || ""}
                    onChange={(e) =>
                      handleInputChange("batchId", e.target.value)
                    }
                    fullWidth
                    disabled={payrollBatch.length === 0}
                    helperText={
                      !selectedEmployee
                        ? "Select an employee to choose a payroll batch"
                        : payrollBatch.length === 0
                        ? "There is no Payroll Batch in the database!"
                        : "Select a payroll batch"
                    }
                  >
                    <MenuItem value="">
                      <em>— No Value —</em>
                    </MenuItem>
                    {(payrollBatch || []).map((p: any) => (
                      <MenuItem key={p.id} value={p.id}>
                        <ListItemText
                          primary={p.name}
                          secondary={p.batchType}
                        />
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Stack direction="column" spacing={1}>
                    {/* Payroll Period Selector */}
                    <Box>
                      <TextField
                        select
                        label="Payroll Period"
                        value={selectedName}
                        onChange={(e) => {
                          const selected = PayrollPeriods?.find(
                            (p: any) => p.name === e.target.value
                          );
                          if (selected) {
                            setSelectedName(selected.name);
                            setPayslipData((prev) => ({
                              ...prev,
                              periodStart: selected.startDate,
                              periodEnd: selected.endDate,
                            }));
                          }
                        }}
                        sx={{ width: "100%", mb: 1 }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        helperText="Select the payroll period"
                      >
                        {PeriodsLoading ? (
                          <MenuItem disabled>Loading...</MenuItem>
                        ) : (
                          PayrollPeriods?.map((period: any) => (
                            <MenuItem key={period.id} value={period.name}>
                              {period.name} (
                              {new Date(period.startDate).toLocaleDateString()}{" "}
                              – {new Date(period.endDate).toLocaleDateString()})
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </Box>
                    {/* Editable period fields */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <TextField
                        label="Period Start"
                        type="datetime-local"
                        value={formatDateForInput(payslipData.periodStart)}
                        onChange={(e) =>
                          handleInputChange("periodStart", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                      <TextField
                        label="Period End"
                        type="datetime-local"
                        value={formatDateForInput(payslipData.periodEnd)}
                        onChange={(e) =>
                          handleInputChange("periodEnd", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Box>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    select
                    label="Currency"
                    value={payslipData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    fullWidth
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Organization Node ID (Optional)"
                    value={payslipData.organizationNodeId || ""}
                    onChange={(e) =>
                      handleInputChange("organizationNodeId", e.target.value)
                    }
                    fullWidth
                  >
                    {(organizationNodes || []).map((o: any) => (
                      <MenuItem key={o.id} value={o.id}>
                        <ListItemText
                          primary={o.name}
                          secondary={o?.code || ""}
                        />
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={payslipData.preview}
                        onChange={(e) =>
                          handleInputChange("preview", e.target.checked)
                        }
                      />
                    }
                    label="Preview payslip before saving"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={payslipData.replaceExisting}
                        onChange={(e) =>
                          handleInputChange("replaceExisting", e.target.checked)
                        }
                      />
                    }
                    label="Replace existing payslip if any"
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleGeneratePayslip}
                    disabled={generateSinglePaySlipMutation.isPending}
                    startIcon={
                      generateSinglePaySlipMutation.isPending ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PreviewIcon />
                      )
                    }
                    sx={{
                      backgroundColor: "#4361ee",
                      "&:hover": { backgroundColor: "#3f37c9" },
                    }}
                  >
                    {generateSinglePaySlipMutation.isPending
                      ? "Generating..."
                      : "Generate Payslip"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ResetIcon />}
                    onClick={() => {
                      setSelectedEmployee(null);
                      setSelectedEmployeeId("");
                      setPayslipData({
                        employee: { id: "" },
                        periodStart: "",
                        periodEnd: "",
                        currency: "ETB",
                        preview: true,
                        replaceExisting: false,
                      });
                      setSelectedName("");
                    }}
                  >
                    Reset Form
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Employee List */}
          <Box sx={{ width: isMobile ? "100%" : "60%" }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: highlightEmployeeList ? 8 : 3,
                height: "100%",
                border: highlightEmployeeList ? "2px solid" : "1px solid",
                borderColor: highlightEmployeeList ? "primary.main" : "divider",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmployeeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Employee List
                  </Typography>
                  {highlightEmployeeList && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ ml: 2, fontWeight: 500 }}
                    >
                      👉 Select an employee from here
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <TextField
                    label="Search Employees"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Showing {filteredEmployees.length} of {employees.length}{" "}
                  employees
                  {isLoading && " (Loading...)"}
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    height: 450,
                    overflow: "hidden",
                    flex: 1,
                  }}
                >
                  {isLoading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <CircularProgress />
                    </Box>
                  ) : filteredEmployees.length === 0 ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <Typography color="textSecondary">
                        {searchTerm
                          ? "No employees found matching your search."
                          : "No employees available."}
                      </Typography>
                    </Box>
                  ) : (
                    <Virtuoso
                      data={filteredEmployees}
                      totalCount={filteredEmployees.length}
                      itemContent={(index, employee) => (
                        <EmployeeListItem employee={employee} />
                      )}
                      style={{ height: "100%" }}
                      overscan={10}
                    />
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      <Portal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Portal>

      {payslipData.preview && (
        <PayrollPreviewModal
          type="single"
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          onConfirm={handleSingleConfirm}
          payslipData={payslipData}
        />
      )}
    </Box>
  );
}
