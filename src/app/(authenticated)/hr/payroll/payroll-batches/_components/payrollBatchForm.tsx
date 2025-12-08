"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Avatar,
  Paper,
  Tooltip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Payments as PaymentsIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { UseFormReturn } from "react-hook-form";
import { RHFAutocomplete } from "@/components/rhf-async-auto-complete-new";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Virtuoso } from "react-virtuoso";
import { theme } from "@/theme";

// Import Redux actions and selectors
import {
  selectSelectedPositions,
  selectSelectedEmploymentTerms,
  selectSelectedOrganizationNodes,
  selectSelectedSalaryStructures,
  selectRoundingConfig,
  selectPools,
  selectFiltersApplied,
  initializeBatch,
  updateBatchConfig,
  clearAllFilters,
  removeFilter,
  removeBatch,
} from "@/lib/store/payroll-filter-slice";

interface PayrollBatchCustomFormProps {
  methods: UseFormReturn<any>;
  formMode: "create" | "edit";
  defaultValues?: any;
  isExtended?: boolean;
  batchId: string;
}

interface Employee {
  id: string;
  firstName?: string;
  fatherName?: string;
  position?: { id: string; title: string };
  jobTitle?: string;
  organizationNodeId?: string;
  employmentTerm?: string;
  contracts?: Array<{ salaryStructure: { id: string } }>;
}

interface Pool {
  salaryRuleId: string;
  amount: number;
  strategy: { type: string };
  inheritBatchFilters: boolean;
  eligibility: { salaryStructureIds: string[] };
}

interface SalaryRule {
  id: string;
  name: string;
  code?: string;
}

// Constants
const EMPLOYMENT_TERMS = [
  { id: "Permanent", name: "Permanent" },
  { id: "Contract", name: "Contract" },
  { id: "Temporary", name: "Temporary" },
  { id: "Internship", name: "Internship" },
] as const;

const ROUNDING_MODES = ["round", "floor", "ceil"] as const;
const STRATEGY_TYPES = [
  "EqualPerHead",
  "ProRataByBaseSalary",
  "ProRataByGross",
] as const;

// Helper function to safely extract data from API responses
const extractData = (response: any): any[] => {
  if (!response) return [];
  return (
    response.data || response.content || response.items || response.result || []
  );
};

// Employee list item component for virtualization
const EmployeeListItem = React.memo(({ employee }: { employee: Employee }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderBottom: "1px solid",
      borderColor: "divider",
      minHeight: "72px",
      "&:hover": {
        backgroundColor: "action.hover",
      },
    }}
  >
    <Avatar
      sx={{
        bgcolor: "primary.light",
        color: "primary.contrastText",
        marginRight: 2,
        width: 40,
        height: 40,
      }}
    >
      {employee.firstName?.[0] || ""}
      {employee.fatherName?.[0] || ""}
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body1" fontWeight={500} noWrap>
        {[employee.firstName, employee.fatherName].filter(Boolean).join(" ") ||
          "Unknown Employee"}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {employee.position?.title || employee.jobTitle || "N/A"}
      </Typography>
    </Box>
  </Box>
));

EmployeeListItem.displayName = "EmployeeListItem";

// Filter Chip Component
const FilterChip: React.FC<{
  label: string;
  onDelete: () => void;
  count?: number;
}> = ({ label, onDelete, count }) => (
  <Chip
    label={
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <span>{label}</span>
        {count !== undefined && (
          <Badge
            badgeContent={count}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.6rem",
                height: "16px",
                minWidth: "16px",
                transform: "scale(0.8)",
              },
            }}
          />
        )}
      </Box>
    }
    onDelete={onDelete}
    color="primary"
    variant="outlined"
    size="small"
    sx={{
      fontSize: "0.8125rem",
      "& .MuiChip-label": {
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    }}
  />
);

// Pool Item Component
const PoolItem: React.FC<{
  pool: Pool;
  index: number;
  salaryStructures: any[];
  salaryRules: SalaryRule[];
  isExtended?: boolean;
}> = ({ pool, index, salaryStructures, salaryRules, isExtended = true }) => {
  const eligibleStructures = salaryStructures.filter((s) =>
    pool.eligibility?.salaryStructureIds?.includes(s.id)
  );

  // Find the salary rule name
  const salaryRule = salaryRules.find((rule) => rule.id === pool.salaryRuleId);
  const salaryRuleName = salaryRule?.name || "Not selected";

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        backgroundColor: "background.default",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <PaymentsIcon color="primary" fontSize="small" />
            Pool {index + 1}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Salary Rule: {salaryRuleName}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Amount
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            ETB {pool.amount.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            Strategy
          </Typography>
          <Typography variant="body1">
            {pool.strategy?.type?.replace(/([A-Z])/g, " $1").trim() ||
              "Unknown"}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            color="text.secondary"
            gutterBottom
          >
            Eligible Salary Structures
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {eligibleStructures.length > 0 ? (
              eligibleStructures.map((structure) => (
                <Chip
                  key={structure.id}
                  label={structure.name}
                  size="small"
                  variant="filled"
                  color="secondary"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                {pool.inheritBatchFilters
                  ? "Inherits batch filters"
                  : "No specific eligibility"}
              </Typography>
            )}
          </Box>
        </Box>

        {pool.inheritBatchFilters && (
          <Chip
            label="Inherits Batch Filters"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
          />
        )}
      </Stack>
    </Card>
  );
};

// Main Configuration Modal Component
const ConfigurationModal: React.FC<{
  open: boolean;
  onClose: (filters?: any, pools?: any, rounding?: any) => void;
  selectedPositions: string[];
  selectedEmploymentTerms: string[];
  selectedOrganizationNodes: string[];
  selectedSalaryStructures: string[];
  rounding: any;
  pools: Pool[];
  positions: any[];
  organizationNodes: any[];
  salaryStructures: any[];
  salaryRules: SalaryRule[];
  allEmployees: Employee[];
  isMobile: boolean;
}> = ({
  open,
  onClose,
  selectedPositions: initialSelectedPositions,
  selectedEmploymentTerms: initialSelectedEmploymentTerms,
  selectedOrganizationNodes: initialSelectedOrganizationNodes,
  selectedSalaryStructures: initialSelectedSalaryStructures,
  rounding: initialRounding,
  pools: initialPools,
  positions,
  organizationNodes,
  salaryStructures,
  salaryRules,
  allEmployees,
  isMobile,
}) => {
  const [selectedPositions, setSelectedPositions] = useState<string[]>(
    initialSelectedPositions
  );
  const [selectedEmploymentTerms, setSelectedEmploymentTerms] = useState<
    string[]
  >(initialSelectedEmploymentTerms);
  const [selectedOrganizationNodes, setSelectedOrganizationNodes] = useState<
    string[]
  >(initialSelectedOrganizationNodes);
  const [selectedSalaryStructures, setSelectedSalaryStructures] = useState<
    string[]
  >(initialSelectedSalaryStructures);
  const [rounding, setRounding] = useState(initialRounding);
  const [pools, setPools] = useState<Pool[]>(initialPools);

  useEffect(() => {
    setSelectedPositions(initialSelectedPositions);
    setSelectedEmploymentTerms(initialSelectedEmploymentTerms);
    setSelectedOrganizationNodes(initialSelectedOrganizationNodes);
    setSelectedSalaryStructures(initialSelectedSalaryStructures);
    setRounding(initialRounding);
    setPools(initialPools);
  }, [
    initialSelectedPositions,
    initialSelectedEmploymentTerms,
    initialSelectedOrganizationNodes,
    initialSelectedSalaryStructures,
    initialRounding,
    initialPools,
  ]);

  const addPool = useCallback(() => {
    setPools((prev) => [
      {
        salaryRuleId: "",
        amount: 0,
        strategy: { type: "EqualPerHead" },
        inheritBatchFilters: false,
        eligibility: { salaryStructureIds: [] },
      },
      ...prev,
    ]);
  }, [setPools]);

  const removePool = useCallback(
    (index: number) => {
      setPools((prev) => prev.filter((_, i) => i !== index));
    },
    [setPools]
  );

  // Helper function for deep cloning
  const deepClone = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map((item) => deepClone(item));
    if (obj instanceof Object) {
      const clonedObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  };

  const updatePool = useCallback(
    (index: number, field: string, value: any) => {
      setPools((prev) => {
        if (index < 0 || index >= prev.length) return prev;

        const newPools = prev.map((pool) => deepClone(pool));
        const keys = field.split(".");
        let current: any = newPools[index];

        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }

        const finalKey = keys[keys.length - 1];

        // Handle value assignment
        if (finalKey === "amount") {
          current[finalKey] =
            value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
        } else if (finalKey === "salaryRuleId") {
          current[finalKey] = value || "";
        } else if (finalKey === "inheritBatchFilters") {
          current[finalKey] = Boolean(value);
        } else if (finalKey === "type" && keys.includes("strategy")) {
          current[finalKey] = value || "EqualPerHead";
        } else if (
          finalKey === "salaryStructureIds" &&
          keys.includes("eligibility")
        ) {
          current[finalKey] = Array.isArray(value) ? value : [];
        } else {
          current[finalKey] = value;
        }

        return newPools;
      });
    },
    [setPools]
  );

  const filteredEmployees = useMemo(() => {
    const hasFilters =
      selectedPositions.length > 0 ||
      selectedEmploymentTerms.length > 0 ||
      selectedOrganizationNodes.length > 0 ||
      selectedSalaryStructures.length > 0;

    if (!hasFilters) {
      return allEmployees;
    }

    const positionSet = new Set(selectedPositions);
    const employmentTermSet = new Set(selectedEmploymentTerms);
    const orgNodeSet = new Set(selectedOrganizationNodes);
    const salaryStructureSet = new Set(selectedSalaryStructures);

    return allEmployees.filter((employee: Employee) => {
      if (selectedPositions.length > 0) {
        if (!employee.position?.id || !positionSet.has(employee.position.id)) {
          return false;
        }
      }

      if (selectedEmploymentTerms.length > 0) {
        if (
          !employee.employmentTerm ||
          !employmentTermSet.has(employee.employmentTerm)
        ) {
          return false;
        }
      }

      if (selectedOrganizationNodes.length > 0) {
        if (
          !employee.organizationNodeId ||
          !orgNodeSet.has(employee.organizationNodeId)
        ) {
          return false;
        }
      }

      if (selectedSalaryStructures.length > 0) {
        if (
          !employee.contracts?.some(
            (c: any) =>
              c.salaryStructure?.id &&
              salaryStructureSet.has(c.salaryStructure.id)
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    allEmployees,
    selectedPositions,
    selectedEmploymentTerms,
    selectedOrganizationNodes,
    selectedSalaryStructures,
  ]);

  const handleApplyConfiguration = useCallback(() => {
    onClose({
      selectedPositions,
      selectedEmploymentTerms,
      selectedOrganizationNodes,
      selectedSalaryStructures,
      rounding,
      pools,
    });
  }, [
    onClose,
    selectedPositions,
    selectedEmploymentTerms,
    selectedOrganizationNodes,
    selectedSalaryStructures,
    rounding,
    pools,
  ]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          height: "90vh",
          maxHeight: "900px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Configure Payroll Batch
        </Typography>
        <IconButton onClick={handleCancel} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflow: "hidden",
          p: 0,
          height: "calc(100% - 64px)", // Subtract dialog title height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Left Column - Configuration Form */}
          <Box
            sx={{
              flex: isMobile ? "0 1 auto" : "0 0 45%",
              maxWidth: isMobile ? "100%" : "45%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              borderRight: isMobile ? "none" : 1,
              borderBottom: isMobile ? 1 : "none",
              borderColor: "divider",
            }}
          >
            {/* Fixed Header Section */}
            <Box
              sx={{
                flexShrink: 0,
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "1.1rem",
                }}
              >
                <FilterListIcon color="primary" />
                Employee Filters
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    "& > *": {
                      flex: 1,
                      minWidth: isMobile ? "100%" : "200px",
                    },
                  }}
                >
                  <Autocomplete
                    multiple
                    options={positions}
                    getOptionLabel={(option: any) => option.title || "Unknown"}
                    value={positions.filter((p: any) =>
                      selectedPositions.includes(p.id)
                    )}
                    onChange={(event, newValue) => {
                      setSelectedPositions(
                        newValue.map((item: any) => item.id)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Positions"
                        placeholder={
                          positions.length === 0
                            ? "No positions available"
                            : "Select positions..."
                        }
                        helperText={
                          positions.length === 0 ? "No positions found" : ""
                        }
                        size="small"
                      />
                    )}
                    disabled={positions.length === 0}
                    noOptionsText="No positions available"
                  />

                  <Autocomplete
                    multiple
                    options={EMPLOYMENT_TERMS}
                    getOptionLabel={(option: any) => option.name}
                    value={EMPLOYMENT_TERMS.filter((t: any) =>
                      selectedEmploymentTerms.includes(t.id)
                    )}
                    onChange={(event, newValue) => {
                      setSelectedEmploymentTerms(
                        newValue.map((item: any) => item.id)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employment Terms"
                        placeholder="Select employment terms..."
                        size="small"
                      />
                    )}
                    noOptionsText="No employment terms available"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    "& > *": {
                      flex: 1,
                      minWidth: isMobile ? "100%" : "200px",
                    },
                  }}
                >
                  <Autocomplete
                    multiple
                    options={organizationNodes}
                    getOptionLabel={(option: any) => option.name || "Unknown"}
                    value={organizationNodes.filter((n: any) =>
                      selectedOrganizationNodes.includes(n.id)
                    )}
                    onChange={(event, newValue) => {
                      setSelectedOrganizationNodes(
                        newValue.map((item: any) => item.id)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Organization Nodes"
                        placeholder={
                          organizationNodes.length === 0
                            ? "No organization nodes available"
                            : "Select organization nodes..."
                        }
                        helperText={
                          organizationNodes.length === 0
                            ? "No organization nodes found"
                            : ""
                        }
                        size="small"
                      />
                    )}
                    disabled={organizationNodes.length === 0}
                    noOptionsText="No organization nodes available"
                  />

                  <Autocomplete
                    multiple
                    options={salaryStructures}
                    getOptionLabel={(option: any) => option.name || "Unknown"}
                    value={salaryStructures.filter((s: any) =>
                      selectedSalaryStructures.includes(s.id)
                    )}
                    onChange={(event, newValue) => {
                      setSelectedSalaryStructures(
                        newValue.map((item: any) => item.id)
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Salary Structures"
                        placeholder={
                          salaryStructures.length === 0
                            ? "No salary structures available"
                            : "Select salary structures..."
                        }
                        helperText={
                          salaryStructures.length === 0
                            ? "No salary structures found"
                            : ""
                        }
                        size="small"
                      />
                    )}
                    disabled={salaryStructures.length === 0}
                    noOptionsText="No salary structures available"
                  />
                </Box>
              </Stack>
            </Box>

            {/* Scrollable Content Area */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                p: 2,
                gap: 2,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.action.hover,
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: theme.palette.action.selected,
                },
              }}
            >
              {/* Advanced Configuration */}
              <Card variant="outlined" sx={{ flexShrink: 0 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: "1.1rem" }}
                  >
                    <SettingsIcon
                      color="primary"
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    Advanced Configuration
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      gap: 2,
                      "& > *": {
                        flex: 1,
                        minWidth: isMobile ? "100%" : "150px",
                      },
                    }}
                  >
                    <FormControl size="small">
                      <InputLabel>Rounding Mode</InputLabel>
                      <Select
                        value={rounding.mode}
                        label="Rounding Mode"
                        onChange={(e) =>
                          setRounding((prev) => ({
                            ...prev,
                            mode: e.target
                              .value as (typeof ROUNDING_MODES)[number],
                          }))
                        }
                      >
                        {ROUNDING_MODES.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Rounding Step"
                      type="number"
                      value={rounding.step}
                      onChange={(e) =>
                        setRounding((prev) => ({
                          ...prev,
                          step: Math.max(
                            0.01,
                            parseFloat(e.target.value) || 0.01
                          ),
                        }))
                      }
                      inputProps={{ min: 0.01, step: 0.01 }}
                      helperText="Step size"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>

              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                  flexShrink: 0,
                  backgroundColor: theme.palette.background.paper,
                  border: 1,
                  borderRadius: 1,
                  borderColor: "divider",
                  py: 1,
                  gap: 1,
                  px: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "1rem",
                  }}
                >
                  Pools ({pools.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addPool}
                  size="small"
                >
                  Add Pool
                </Button>
              </Box>

              {pools.length > 0 ? (
                <Stack spacing={1.5}>
                  {pools.map((pool, index) => (
                    <Card key={index} variant="outlined" sx={{ p: 1.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          Pool {pools.length - index}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removePool(index)}
                          color="error"
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Stack spacing={1.5}>
                        <RHFAutocomplete<any, any>
                          apiEndPoint="https://api.techbee.et/api/hr/salaryRules"
                          getOptionLabel={(option) => option.name || option.id}
                          getOptionValue={(option) => option.id}
                          label="Salary Rule"
                          helperText="Select salary rule"
                          value={pool.salaryRuleId || ""}
                          onChange={(newValue) =>
                            updatePool(index, "salaryRuleId", newValue)
                          }
                          size="small"
                        />

                        <TextField
                          label="Amount"
                          type="number"
                          value={pool.amount}
                          onChange={(e) =>
                            updatePool(
                              index,
                              "amount",
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          inputProps={{ min: 0 }}
                          fullWidth
                          size="small"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={pool.inheritBatchFilters}
                              onChange={(e) =>
                                updatePool(
                                  index,
                                  "inheritBatchFilters",
                                  e.target.checked
                                )
                              }
                              size="small"
                            />
                          }
                          label="Inherit Batch Filters"
                        />

                        <FormControl fullWidth size="small">
                          <InputLabel>Distribution Strategy</InputLabel>
                          <Select
                            value={pool.strategy?.type || ""}
                            onChange={(e) =>
                              updatePool(index, "strategy.type", e.target.value)
                            }
                            label="Distribution Strategy"
                          >
                            {STRATEGY_TYPES.map((strategy) => (
                              <MenuItem key={strategy} value={strategy}>
                                {strategy.replace(/([A-Z])/g, " $1").trim()}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                          <InputLabel>Eligible Structures</InputLabel>
                          <Select
                            multiple
                            value={pool.eligibility?.salaryStructureIds || []}
                            onChange={(e) =>
                              updatePool(
                                index,
                                "eligibility.salaryStructureIds",
                                e.target.value
                              )
                            }
                            renderValue={(selected) => {
                              const selectedNames = (selected as string[]).map(
                                (id) => {
                                  const structure = salaryStructures.find(
                                    (s) => s.id === id
                                  );
                                  return structure ? structure.name : "";
                                }
                              );
                              const displayText =
                                selectedNames.filter(Boolean).join(", ") ||
                                "None selected";
                              return (
                                <Typography variant="body2" noWrap>
                                  {displayText}
                                </Typography>
                              );
                            }}
                            label="Eligible Structures"
                          >
                            {salaryStructures.length > 0 ? (
                              salaryStructures.map((structure) => (
                                <MenuItem
                                  key={structure.id}
                                  value={structure.id}
                                >
                                  <Typography variant="body2">
                                    {structure.name}
                                  </Typography>
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                <Typography variant="body2">
                                  No salary structures available
                                </Typography>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    No payment pools configured. Add pools to define special
                    payment rules.
                  </Typography>
                </Alert>
              )}
              {/* Pools Configuration */}
              {/* <Card variant="outlined" sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <CardContent sx={{
                                        p: 2,
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        '&:last-child': { pb: 2 }
                                    }}>


                                        <Box sx={{
                                            flex: 1,
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': {
                                                width: '4px',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                background: 'transparent',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                background: theme.palette.action.hover,
                                                borderRadius: '2px',
                                            },
                                        }}>

                                        </Box>
                                    </CardContent>
                                </Card> */}
            </Box>
          </Box>

          {/* Right Column - Employee List Preview */}
          <Box
            sx={{
              flex: isMobile ? "1 1 auto" : "1 1 55%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              p: 3,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <GroupsIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Matching Employees ({filteredEmployees.length})
                  </Typography>
                </Box>

                {filteredEmployees.length > 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                    }}
                  >
                    <Virtuoso
                      data={filteredEmployees}
                      itemContent={(index, employee) => (
                        <EmployeeListItem employee={employee} />
                      )}
                      overscan={10}
                      style={{
                        height: "100%",
                        flex: 1,
                      }}
                    />
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 200,
                    }}
                  >
                    <Alert
                      severity={allEmployees.length === 0 ? "error" : "warning"}
                      sx={{ textAlign: "center", width: "100%" }}
                    >
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {allEmployees.length === 0
                          ? "No Employees Found"
                          : "No Employees Match Current Filters"}
                      </Typography>
                      <Typography variant="body2">
                        {allEmployees.length === 0
                          ? "There are no employees in the system. Please add employees first before creating a payroll batch."
                          : selectedPositions.length > 0 ||
                            selectedEmploymentTerms.length > 0 ||
                            selectedOrganizationNodes.length > 0 ||
                            selectedSalaryStructures.length > 0
                          ? "No employees match the current filter criteria. Try adjusting your filters to see matching employees."
                          : "No filters applied. Configure filters using the form on the left to select specific employees for this payroll batch."}
                      </Typography>
                    </Alert>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleApplyConfiguration}
          disabled={filteredEmployees.length === 0}
          startIcon={<GroupsIcon />}
        >
          Apply Configuration ({filteredEmployees.length} Employees)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const PayrollBatchCustomForm: React.FC<PayrollBatchCustomFormProps> = ({
  methods,
  formMode,
  defaultValues,
  isExtended = false,
  batchId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const session = useSelector((state: RootState) => state.session);
  const dispatch = useDispatch();

  // Get configuration from Redux store
  const selectedPositions = useSelector((state: RootState) =>
    selectSelectedPositions(state, batchId)
  );
  const selectedEmploymentTerms = useSelector((state: RootState) =>
    selectSelectedEmploymentTerms(state, batchId)
  );
  const selectedOrganizationNodes = useSelector((state: RootState) =>
    selectSelectedOrganizationNodes(state, batchId)
  );
  const selectedSalaryStructures = useSelector((state: RootState) =>
    selectSelectedSalaryStructures(state, batchId)
  );
  const rounding = useSelector((state: RootState) =>
    selectRoundingConfig(state, batchId)
  );
  const pools = useSelector((state: RootState) => selectPools(state, batchId));
  const filtersApplied = useSelector((state: RootState) =>
    selectFiltersApplied(state, batchId)
  );

  // State for modal
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Initialize batch configuration when component mounts
  useEffect(() => {
    if (formMode === "create") {
      dispatch(
        initializeBatch({
          batchId,
          initialConfig: {
            selectedPositions: [],
            selectedEmploymentTerms: [],
            selectedOrganizationNodes: [],
            selectedSalaryStructures: [],
            rounding: { mode: "round", step: 0.01 },
            pools: [],
            filtersApplied: false,
            employeeCount: 0,
          },
        })
      );
    } else if (formMode === "edit" && defaultValues?.filters) {
      const filters = defaultValues.filters;
      dispatch(
        initializeBatch({
          batchId,
          initialConfig: {
            selectedPositions: filters.positionIds || [],
            selectedEmploymentTerms: filters.employmentTerms || [],
            selectedOrganizationNodes: filters.organizationNodeIds || [],
            selectedSalaryStructures: filters.salaryStructureIds || [],
            rounding: filters.rounding || { mode: "round", step: 0.01 },
            pools: filters.pools || [],
            filtersApplied: true,
            employeeCount: 0,
          },
        })
      );
    }
  }, [batchId, formMode, defaultValues, dispatch]);

  // Fetch data
  const {
    data: allEmployeesResponse,
    isLoading: employeesLoading,
    error: employeesError,
  } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/employees",
    enabled: !!session,
    noFilter: true,
  });

  const {
    data: organizationNodesResponse,
    isLoading: orgNodesLoading,
    error: orgNodesError,
  } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/core/organizationNodes",
    enabled: !!session,
    noFilter: true,
  });

  const {
    data: positionsResponse,
    isLoading: positionsLoading,
    error: positionsError,
  } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/positions",
    enabled: !!session,
    noFilter: true,
  });

  const {
    data: salaryStructuresResponse,
    isLoading: salaryStructuresLoading,
    error: salaryStructuresError,
  } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/salaryStructures",
    enabled: !!session,
    noFilter: true,
  });

  // NEW: Fetch salary rules
  const {
    data: salaryRulesResponse,
    isLoading: salaryRulesLoading,
    error: salaryRulesError,
  } = useDataQuery<any>({
    apiEndPoint: "https://api.techbee.et/api/hr/salaryRules",
    enabled: !!session,
    noFilter: true,
  });

  // Normalize data
  const allEmployees = useMemo((): Employee[] => {
    try {
      return extractData(allEmployeesResponse);
    } catch (error) {
      console.error("Error extracting employees data:", error);
      return [];
    }
  }, [allEmployeesResponse]);

  const organizationNodes = useMemo(
    () => extractData(organizationNodesResponse),
    [organizationNodesResponse]
  );
  const positions = useMemo(
    () => extractData(positionsResponse),
    [positionsResponse]
  );
  const salaryStructures = useMemo(
    () => extractData(salaryStructuresResponse),
    [salaryStructuresResponse]
  );
  const salaryRules = useMemo(
    () => extractData(salaryRulesResponse) || [],
    [salaryRulesResponse]
  );

  // Filter employees for main view
  const { filteredEmployees, filteredEmployeeCount } = useMemo(() => {
    const hasFilters =
      selectedPositions.length > 0 ||
      selectedEmploymentTerms.length > 0 ||
      selectedOrganizationNodes.length > 0 ||
      selectedSalaryStructures.length > 0;

    if (!hasFilters) {
      return {
        filteredEmployees: allEmployees,
        filteredEmployeeCount: allEmployees.length,
      };
    }

    const positionSet = new Set(selectedPositions);
    const employmentTermSet = new Set(selectedEmploymentTerms);
    const orgNodeSet = new Set(selectedOrganizationNodes);
    const salaryStructureSet = new Set(selectedSalaryStructures);

    const filtered = allEmployees.filter((employee: Employee) => {
      if (selectedPositions.length > 0) {
        if (!employee.position?.id || !positionSet.has(employee.position.id)) {
          return false;
        }
      }

      if (selectedEmploymentTerms.length > 0) {
        if (
          !employee.employmentTerm ||
          !employmentTermSet.has(employee.employmentTerm)
        ) {
          return false;
        }
      }

      if (selectedOrganizationNodes.length > 0) {
        if (
          !employee.organizationNodeId ||
          !orgNodeSet.has(employee.organizationNodeId)
        ) {
          return false;
        }
      }

      if (selectedSalaryStructures.length > 0) {
        if (
          !employee.contracts?.some(
            (c: any) =>
              c.salaryStructure?.id &&
              salaryStructureSet.has(c.salaryStructure.id)
          )
        ) {
          return false;
        }
      }

      return true;
    });

    return {
      filteredEmployees: filtered,
      filteredEmployeeCount: filtered.length,
    };
  }, [
    allEmployees,
    selectedPositions,
    selectedEmploymentTerms,
    selectedOrganizationNodes,
    selectedSalaryStructures,
  ]);

  // Handle filter removal
  const handleRemoveFilter = useCallback(
    (filterKey: string, value: string) => {
      const filterTypeMap = {
        positionIds: "positions" as const,
        employmentTerms: "employmentTerms" as const,
        organizationNodeIds: "organizationNodes" as const,
        salaryStructureIds: "salaryStructures" as const,
      };

      dispatch(
        removeFilter({
          batchId,
          filterType: filterTypeMap[filterKey as keyof typeof filterTypeMap],
          value,
        })
      );
    },
    [dispatch, batchId]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    dispatch(clearAllFilters({ batchId }));
  }, [dispatch, batchId]);

  // Store filters in form data - sync with react-hook-form
  useEffect(() => {
    const currentFilters = {
      positionIds: selectedPositions,
      employmentTerms: selectedEmploymentTerms,
      organizationNodeIds: selectedOrganizationNodes,
      salaryStructureIds: selectedSalaryStructures,
      rounding: rounding,
      pools: pools,
    };

    methods.setValue("filters", currentFilters);
  }, [
    selectedPositions,
    selectedEmploymentTerms,
    selectedOrganizationNodes,
    selectedSalaryStructures,
    rounding,
    pools,
    methods,
  ]);

  // Handle modal close with configuration updates
  const handleModalClose = useCallback(
    (newConfig?: any) => {
      if (newConfig) {
        dispatch(
          updateBatchConfig({
            batchId,
            updates: {
              selectedPositions: newConfig.selectedPositions || [],
              selectedEmploymentTerms: newConfig.selectedEmploymentTerms || [],
              selectedOrganizationNodes:
                newConfig.selectedOrganizationNodes || [],
              selectedSalaryStructures:
                newConfig.selectedSalaryStructures || [],
              rounding: newConfig.rounding || { mode: "round", step: 0.01 },
              pools: newConfig.pools || [],
              filtersApplied: true,
            },
          })
        );
      }
      setShowConfigModal(false);
    },
    [dispatch, batchId]
  );

  // Loading state
  const isLoading =
    employeesLoading ||
    orgNodesLoading ||
    positionsLoading ||
    salaryStructuresLoading ||
    salaryRulesLoading;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Configuration Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
          width: "100%",
        }}
      >
        <Typography>You can maximize the modal to view it in full.</Typography>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={() => setShowConfigModal(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            minWidth: "auto",
          }}
          size="large"
        >
          Configure Payroll Batch
        </Button>
      </Box>

      {/* Main Content - Single Column Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Filters Section */}
        <Card variant="outlined">
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <FilterListIcon color="primary" />
                Employee Filters
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" color="text.secondary">
                  {filteredEmployeeCount} employees match
                </Typography>
              </Box>
            </Box>

            {filtersApplied ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {selectedPositions.map((positionId) => {
                    const position = positions.find((p) => p.id === positionId);
                    const positionEmployees = allEmployees.filter(
                      (emp) => emp.position?.id === positionId
                    ).length;
                    return position ? (
                      <FilterChip
                        key={`position-${positionId}`}
                        label={`Position: ${position.title}`}
                        onDelete={() =>
                          handleRemoveFilter("positionIds", positionId)
                        }
                        // count={positionEmployees}
                      />
                    ) : null;
                  })}
                  {selectedEmploymentTerms.map((term) => {
                    const termEmployees = allEmployees.filter(
                      (emp) => emp.employmentTerm === term
                    ).length;
                    return (
                      <FilterChip
                        key={`employment-${term}`}
                        label={`Employment: ${term}`}
                        onDelete={() =>
                          handleRemoveFilter("employmentTerms", term)
                        }
                        // count={termEmployees}
                      />
                    );
                  })}
                  {selectedOrganizationNodes.map((nodeId) => {
                    const node = organizationNodes.find((n) => n.id === nodeId);
                    const nodeEmployees = allEmployees.filter(
                      (emp) => emp.organizationNodeId === nodeId
                    ).length;
                    return node ? (
                      <FilterChip
                        key={`org-${nodeId}`}
                        label={`Organization: ${node.name}`}
                        onDelete={() =>
                          handleRemoveFilter("organizationNodeIds", nodeId)
                        }
                        // count={nodeEmployees}
                      />
                    ) : null;
                  })}
                  {selectedSalaryStructures.map((structureId) => {
                    const structure = salaryStructures.find(
                      (s) => s.id === structureId
                    );
                    const structureEmployees = allEmployees.filter((emp) =>
                      emp.contracts?.some(
                        (c) => c.salaryStructure?.id === structureId
                      )
                    ).length;
                    return structure ? (
                      <FilterChip
                        key={`salary-${structureId}`}
                        label={`Salary Structure: ${structure.name}`}
                        onDelete={() =>
                          handleRemoveFilter("salaryStructureIds", structureId)
                        }
                        // count={structureEmployees}
                      />
                    ) : null;
                  })}
                </Box>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleClearAllFilters}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    fontSize: "0.875rem",
                    minWidth: "auto",
                    px: 1,
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <Alert severity="info">
                <Typography variant="body2">
                  No filters applied. Click 'Configure Payroll Batch' to set up
                  employee selection criteria.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Pools Section */}
        <Card variant="outlined">
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PaymentsIcon color="primary" />
                Payment Pools ({pools.length})
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total pools configured
              </Typography>
            </Box>

            {pools.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                {pools.map((pool, index) => (
                  <PoolItem
                    key={index}
                    pool={pool}
                    index={index}
                    salaryStructures={salaryStructures}
                    salaryRules={salaryRules}
                    isExtended={true}
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="info">
                <Typography variant="body2">
                  No payment pools configured. Add pools to define special
                  payment rules.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card variant="outlined">
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <SettingsIcon color="primary" />
              Configuration Summary
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "1fr 1fr 1fr 1fr",
                },
                gap: 3,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {filteredEmployeeCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="primary">
                  {pools.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payment Pools
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {rounding.mode.charAt(0).toUpperCase() +
                    rounding.mode.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rounding Mode
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={600}>
                  {rounding.step}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rounding Step
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Configuration Modal */}
      <ConfigurationModal
        open={showConfigModal}
        onClose={handleModalClose}
        selectedPositions={selectedPositions}
        selectedEmploymentTerms={selectedEmploymentTerms}
        selectedOrganizationNodes={selectedOrganizationNodes}
        selectedSalaryStructures={selectedSalaryStructures}
        rounding={rounding}
        pools={pools}
        positions={positions}
        organizationNodes={organizationNodes}
        salaryStructures={salaryStructures}
        salaryRules={salaryRules}
        allEmployees={allEmployees}
        isMobile={isMobile}
      />
    </Box>
  );
};
