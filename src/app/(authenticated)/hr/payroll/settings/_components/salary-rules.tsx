"use client";

import { useMemo, useState } from "react";
import {
  useGetSalaryrulesQuery,
  useCreateSalaryrulesMutation,
  useUpdateSalaryrulesMutation,
  useDeleteSalaryrulesMutation,
} from "../../_queries/salaryRules";

import { MRT_ColumnDef } from "material-react-table";
import { UseFormReturn } from "react-hook-form";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { SalaryRule, salaryRuleSchema } from "./salary-rules/salary-rules";
import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete-new";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalaryRuleCard } from "@/app/(authenticated)/hr/payroll/settings/_components/salary-rules/index";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

export default () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SalaryRule | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const {
    data: fetchedSalaryRules = [],
    isLoading,
    isFetching,
    isError,
  } = useGetSalaryrulesQuery();
  const [createSalaryrule] = useCreateSalaryrulesMutation();
  const [updateSalaryrule] = useUpdateSalaryrulesMutation();
  const [deleteSalaryrule] = useDeleteSalaryrulesMutation();

  const { data: salaryRuleCategories = [] } = useDataQuery<any[]>({
    apiEndPoint: "https://api.techbee.et/api/hr/salaryrulecategories", // Replace with your actual endpoint
    enabled: true,
  });

  const { data: organizationNodes = [] } = useDataQuery<any[]>({
    apiEndPoint: "https://api.techbee.et/api/core/organizationnodes", // Replace with your actual endpoint
    enabled: true,
  });
  const formatDateToSchemaString = (
    dateValue: string | Date | undefined
  ): string => {
    if (!dateValue) return "";

    let dateObj: Date;
    if (typeof dateValue === "string") {
      dateObj = new Date(dateValue);
    } else {
      dateObj = dateValue;
    }

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const normalizedSalaryRules = useMemo(() => {
    return fetchedSalaryRules.map((rule) => ({
      ...rule,
      category: rule.category?.id ? { id: rule.category.id } : { id: "" },
      percentageOfCategory: rule.percentageOfCategory?.id
        ? { id: rule.percentageOfCategory.id }
        : undefined,
      formula: rule.formula || "",
      fixedAmount: rule.fixedAmount ?? 0,
      sequence: rule.sequence ?? undefined,
      isActive: rule.isActive ?? true,
      externalCode: rule.externalCode || "",
      organizationNodeId: rule.organizationNodeId || "",
      conditionExpression: rule.conditionExpression || null,
      activeFrom: rule.activeFrom
        ? formatDateToSchemaString(rule.activeFrom)
        : "",
      activeTo: rule.activeTo ? formatDateToSchemaString(rule.activeTo) : "",
    }));
  }, [fetchedSalaryRules]);

  const renderSalaryRuleFormFields = (methods: UseFormReturn<SalaryRule>) => {
    const formatStringDateForInput = (
      dateString: string | undefined
    ): string => {
      if (!dateString) return "";
      try {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return "";

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch (e) {
        console.error("Error parsing date string for input:", dateString, e);
        return "";
      }
    };

    const calculationType = methods.watch("calculationType");

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          py: "1rem",
        }}
      >
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("name")}
              label="Name"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.name}
              helperText={
                methods.formState.errors.name?.message ||
                "The name of the salary rule."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. Base Salary"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("code")}
              label="Code"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.code}
              helperText={
                methods.formState.errors.code?.message ||
                "A unique code for the salary rule (e.g., 'BASE')."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. BASE"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <RHFAutocomplete<SalaryRule, any>
              name="category.id"
              apiEndPoint="https://api.techbee.et/api/hr/salaryrulecategories"
              getOptionLabel={(option) => option.name || option.id}
              getOptionValue={(option) => option.id}
              helperText={
                methods.formState.errors.category?.id?.message ||
                "The category this salary rule belongs to."
              }
              sx={{ marginY: "normal" }}
              label="Category"
              initialDisplayValue={
                methods.watch("category")?.id && salaryRuleCategories.length
                  ? salaryRuleCategories.find(
                      (cat) => cat.id === methods.watch("category")?.id
                    )?.name
                  : undefined
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!methods.formState.errors.calculationType}
            >
              <InputLabel shrink color="secondary">
                Calculation Type
              </InputLabel>
              <Controller
                name="calculationType"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Calculation Type"
                    displayEmpty
                    color="secondary"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Fixed">Fixed</MenuItem>
                    <MenuItem value="Formula">Formula</MenuItem>
                    <MenuItem value="PercentageOfCategory">
                      PercentageOfCategory
                    </MenuItem>
                    <MenuItem value="SplitEqually">SplitEqually</MenuItem>
                  </Select>
                )}
              />
              {methods.formState.errors.calculationType && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5 }}>
                  {methods.formState.errors.calculationType.message}
                </Box>
              )}
            </FormControl>
          </Box>

          {(calculationType === "Fixed" ||
            calculationType === "SplitEqually") && (
            <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <TextField
                {...methods.register("fixedAmount", { valueAsNumber: true })}
                label="Fixed Amount"
                margin="normal"
                fullWidth
                type="number"
                error={!!methods.formState.errors.fixedAmount}
                helperText={
                  methods.formState.errors.fixedAmount?.message ||
                  "The fixed amount for this salary rule."
                }
                color="secondary"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="e.g. 1000"
              />
            </Box>
          )}

          {calculationType === "Formula" && (
            <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <TextField
                {...methods.register("formula")}
                label="Formula"
                margin="normal"
                fullWidth
                error={!!methods.formState.errors.formula}
                helperText={
                  methods.formState.errors.formula?.message ||
                  "The formula used for calculation (e.g., 'gross * 0.1')."
                }
                color="secondary"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="e.g. overtime_hours * overtime_rate"
              />
            </Box>
          )}

          {calculationType === "PercentageOfCategory" && (
            <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <RHFAutocomplete<SalaryRule, any>
                name="percentageOfCategory.id"
                fetcher={useGetSalaryrulecategoriesQuery}
                getOptionLabel={(option) => option.name || option.id}
                getOptionValue={(option) => option.id}
                helperText={
                  methods.formState.errors.percentageOfCategory?.id?.message ||
                  "The category to calculate percentage from."
                }
                sx={{ marginY: "normal" }}
                label="Percentage Of Category"
                initialDisplayValue={
                  methods.watch("percentageOfCategory")?.id &&
                  salaryRuleCategories.length
                    ? salaryRuleCategories.find(
                        (cat) =>
                          cat.id === methods.watch("percentageOfCategory")?.id
                      )?.name
                    : undefined
                }
              />
            </Box>
          )}
          {calculationType === "PercentageOfCategory" && (
            <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
              <TextField
                {...methods.register("fixedAmount", { valueAsNumber: true })}
                label="Percentage Value"
                margin="normal"
                fullWidth
                type="number"
                error={!!methods.formState.errors.fixedAmount}
                helperText={
                  methods.formState.errors.fixedAmount?.message ||
                  "The percentage value (e.g., 7 for 7%)."
                }
                color="secondary"
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder="e.g. 7"
              />
            </Box>
          )}

          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("sequence", { valueAsNumber: true })}
              label="Sequence (Optional)"
              margin="normal"
              fullWidth
              type="number"
              error={!!methods.formState.errors.sequence}
              helperText={
                methods.formState.errors.sequence?.message ||
                "The order in which this rule is processed."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. 1"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("externalCode")}
              label="External Code (Optional)"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.externalCode}
              helperText={
                methods.formState.errors.externalCode?.message ||
                "An external identifier for this rule."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. BASE001"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <RHFAutocomplete<SalaryRule, any>
              name="organizationNodeId"
              fetcher={useGetOrganizationnodesQuery}
              getOptionLabel={(option) => option.name || option.id}
              getOptionValue={(option) => option.id}
              helperText={
                methods.formState.errors.organizationNodeId?.message ||
                "The organization node this rule applies to."
              }
              sx={{ marginY: "normal" }}
              label="Organization Node"
              initialDisplayValue={
                methods.watch("organizationNodeId") && organizationNodes.length
                  ? organizationNodes.find(
                      (node) => node.id === methods.watch("organizationNodeId")
                    )?.name
                  : undefined
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("conditionExpression")}
              label="Condition Expression (Optional)"
              margin="normal"
              fullWidth
              error={!!methods.formState.errors.conditionExpression}
              helperText={
                methods.formState.errors.conditionExpression?.message ||
                "A conditional expression for applying this rule."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              placeholder="e.g. employee.salary > 5000"
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("activeFrom")}
              label="Active From (Optional)"
              margin="normal"
              fullWidth
              type="datetime-local"
              error={!!methods.formState.errors.activeFrom}
              helperText={
                methods.formState.errors.activeFrom?.message ||
                "The date from which this rule is active (YYYY-MM-DDTHH:mm)."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formatStringDateForInput(methods.watch("activeFrom"))}
              onChange={(e) =>
                methods.setValue("activeFrom", e.target.value, {
                  shouldValidate: true,
                })
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <TextField
              {...methods.register("activeTo")}
              label="Active To (Optional)"
              margin="normal"
              fullWidth
              type="datetime-local"
              error={!!methods.formState.errors.activeTo}
              helperText={
                methods.formState.errors.activeTo?.message ||
                "The date until which this rule is active (YYYY-MM-DDTHH:mm)."
              }
              color="secondary"
              slotProps={{ inputLabel: { shrink: true } }}
              value={
                methods.watch("activeTo")
                  ? formatStringDateForInput(methods.watch("activeTo"))
                  : ""
              }
              onChange={(e) =>
                methods.setValue("activeTo", e.target.value, {
                  shouldValidate: true,
                })
              }
            />
          </Box>
          <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...methods.register("isActive")}
                  checked={methods.watch("isActive")}
                />
              }
              label="Is Active"
            />
          </Box>
        </Stack>
      </Box>
    );
  };

  const handleCreateSalaryRule = async (values: SalaryRule) => {
    try {
      const {
        id,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        ...restOfValues
      } = values;

      const payload: Partial<
        Omit<
          SalaryRule,
          "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
        >
      > = {
        ...restOfValues,
        category: values.category?.id ? { id: values.category.id } : undefined,
        percentageOfCategory: values.percentageOfCategory?.id
          ? { id: values.percentageOfCategory.id }
          : undefined,
        fixedAmount:
          values.fixedAmount === 0 ? 0 : values.fixedAmount || undefined, // Ensure 0 is sent if explicitly set
        formula: values.formula || undefined,
        sequence: values.sequence || undefined,
        isActive: values.isActive ?? undefined,
        externalCode: values.externalCode || undefined,
        organizationNodeId: values.organizationNodeId || undefined,
        conditionExpression:
          values.conditionExpression === null
            ? null
            : values.conditionExpression || undefined,
        activeFrom: values.activeFrom || undefined,
        activeTo: values.activeTo || undefined,
      };

      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === "" ||
          payload[key as keyof typeof payload] === undefined
        ) {
          if (key !== "conditionExpression") {
            // Allow null for conditionExpression
            delete payload[key as keyof typeof payload];
          }
        }
      }
      const response = await createSalaryrule(payload).unwrap();
      return {
        success: true,
        message: "Salary Rule created successfully!",
      };
    } catch (error) {
      console.error("Failed to create salary rule:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to create salary rule.",
      };
    }
  };

  const handleUpdateSalaryRule = async (values: SalaryRule) => {
    try {
      if (!values.id) {
        throw new Error("Cannot update: Salary Rule ID is missing.");
      }

      const { createdAt, updatedAt, createdBy, updatedBy, ...restOfValues } =
        values;

      const payload: Partial<
        Omit<
          SalaryRule,
          "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
        >
      > = {
        ...restOfValues,
        category: values.category?.id ? { id: values.category.id } : undefined,
        percentageOfCategory: values.percentageOfCategory?.id
          ? { id: values.percentageOfCategory.id }
          : undefined,
        fixedAmount:
          values.fixedAmount === 0 ? 0 : values.fixedAmount || undefined,
        formula: values.formula || undefined,
        sequence: values.sequence || undefined,
        isActive: values.isActive ?? undefined,
        externalCode: values.externalCode || undefined,
        organizationNodeId: values.organizationNodeId || undefined,
        conditionExpression:
          values.conditionExpression === null
            ? null
            : values.conditionExpression || undefined,
        activeFrom: values.activeFrom || undefined,
        activeTo: values.activeTo || undefined,
      };

      for (const key in payload) {
        if (
          payload[key as keyof typeof payload] === "" ||
          payload[key as keyof typeof payload] === undefined
        ) {
          if (key !== "conditionExpression") {
            // Allow null for conditionExpression
            delete payload[key as keyof typeof payload];
          }
        }
      }
      const response = await updateSalaryrule({
        id: values.id,
        data: payload,
      }).unwrap();
      return {
        success: true,
        message: "Salary Rule updated successfully!",
      };
    } catch (error) {
      console.error("Failed to update salary rule:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to update salary rule.",
      };
    }
  };

  const handleDeleteSalaryRule = async (id: string) => {
    try {
      const response = await deleteSalaryrule(id).unwrap();
      return {
        success: true,
        message: "Salary Rule deleted successfully!",
      };
    } catch (error) {
      console.error("Failed to delete salary rule:", error);
      return {
        success: false,
        message:
          (error as any)?.data?.message ||
          (error as any)?.message ||
          "Failed to delete salary rule.",
      };
    }
  };

  const handleEdit = (rule: SalaryRule) => {
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const handleDelete = async (rule: SalaryRule) => {
    try {
      if (!rule.id) {
        setNotification({
          open: true,
          message: "Cannot delete: Salary Rule ID is missing",
          severity: "error",
        });
        return;
      }
      const result = await handleDeleteSalaryRule(rule.id);
      if (result.success) {
        setNotification({
          open: true,
          message: result.message,
          severity: "success",
        });
      } else {
        setNotification({
          open: true,
          message: result.message,
          severity: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to delete salary rule",
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRule(null);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={40} />
        <Typography sx={{ ml: 2 }}>Loading salary rules...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error" variant="h6">
          Error loading salary rules
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          background: "linear-gradient(135deg, #2c3e50, #4a6491)",
          p: 3,
          borderRadius: 2,
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Salary Rules
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
            "&:hover": { background: "rgba(255,255,255,0.3)" },
          }}
        >
          New Salary Rule
        </Button>
      </Box>

      {/* Cards Grid */}
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{
          "& > *": {
            flex: "1 1 300px",
            minWidth: "300px",
            maxWidth: {
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(33.333% - 16px)",
              lg: "calc(25% - 18px)",
            },
          },
        }}
      >
        {normalizedSalaryRules.map((rule) => (
          <Box key={rule.id}>
            <SalaryRuleCard
              card={{
                ...rule,
                selected: false,
                editing: false,
              }}
              onEdit={(id) => {
                const ruleToEdit = normalizedSalaryRules.find(
                  (r) => r.id === id
                );
                if (ruleToEdit) handleEdit(ruleToEdit);
              }}
              onDeleteRequest={(card) => {
                const ruleToDelete = normalizedSalaryRules.find(
                  (r) => r.id === card.id
                );
                if (ruleToDelete) handleDelete(ruleToDelete);
              }}
            />
          </Box>
        ))}
      </Stack>

      {/* Empty State */}
      {normalizedSalaryRules.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            background: "#f8fafc",
            borderRadius: 3,
            mt: 3,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: "#4a5568" }}>
            No salary rules found
          </Typography>
          <Typography sx={{ fontSize: 18, color: "#718096" }}>
            Create your first salary rule to get started
          </Typography>
        </Box>
      )}

      {/* Edit/Create Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #2c3e50, #4a6491)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingRule ? "Edit Salary Rule" : "Create New Salary Rule"}
          <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {editingRule
              ? "Update the salary rule details below."
              : "Fill in the details to create a new salary rule."}
          </Typography>
          {/* Form will be implemented here */}
          <Typography variant="body2" color="text.secondary">
            Form implementation coming soon...
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" disabled>
            {editingRule ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
