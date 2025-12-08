import React from "react";
import {
  Box,
  Typography,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelCircleIcon,
  AttachMoney as MoneyIcon,
  Calculate as CalculateIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Percent as PercentIcon,
  Schedule as ScheduleIcon,
  Tag as TagIcon,
} from "@mui/icons-material";
import { SalaryRule } from "@/app/(authenticated)/hr/payroll/settings/_components/salary-rules/salary-rules";
import EntityNameById from "@/components/EntityNameById";
import { useGetSalaryrulecategoriesByIdQuery } from "@/app/(authenticated)/hr/payroll/_queries/salaryRuleCategories";
import { useGetOrganizationnodesByIdQuery } from "@/app/dashboard/_queries/organizationNodes";
import GenericFieldRenderer from "@/components/smart-crud/GenericFieldRenderer";
import { salaryRuleFields } from "../../fields/salary-rule-fields";
import { useGetAvailableDictionariesQuery } from "../../../_queries/salaryRules";

// Type for SmartCrudModal compatibility
type SalaryRuleCardType = SalaryRule & {
  selected: boolean;
  editing: boolean;
};

interface SalaryRuleCardProps {
  card: SalaryRuleCardType;
  editingValues?: Record<string, Partial<SalaryRule>>;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDeleteRequest?: (card: SalaryRuleCardType) => void;
  onEditFieldChange?: (id: string, field: keyof SalaryRule, value: any) => void;
  onSave?: (id: string) => void;
  onCancel?: (id: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const SalaryRuleCard: React.FC<SalaryRuleCardProps> = ({
  card,
  editingValues,
  onSelect,
  onEdit,
  onDeleteRequest,
  onEditFieldChange,
  onSave,
  onCancel,
  isSaving = false,
  isDeleting = false,
}) => {
  const theme = useTheme();
  const rule = card;
  const cardId = card.id || "";

  const {
    data: dictionaries = [],
    isLoading,
    isFetching,
    isError,
  } = useGetAvailableDictionariesQuery();
  console.log("dictionaries", dictionaries);
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatAmount = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return "0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getCalculationTypeColor = (type: string | undefined) => {
    switch (type) {
      case "Fixed":
        return "#4caf50";
      case "Formula":
        return "#2196f3";
      case "PercentageOfCategory":
        return "#ff9800";
      case "SplitEqually":
        return "#9c27b0";
      default:
        return "#757575";
    }
  };

  const getCalculationTypeIcon = (type: string | undefined) => {
    switch (type) {
      case "Fixed":
        return <MoneyIcon />;
      case "Formula":
        return <CodeIcon />;
      case "PercentageOfCategory":
        return <PercentIcon />;
      case "SplitEqually":
        return <CalculateIcon />;
      default:
        return <CalculateIcon />;
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        cursor: "pointer",
        width: { xs: "100%", sm: 380 },
        maxWidth: 420,
        minHeight: 320,
        // '&:hover': {
        //   transform: 'translateY(-4px)',
        //   boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        //   borderColor: 'primary.main',
        // },
        "&:active": {
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
          }}
        >
          <input
            type="checkbox"
            checked={card.selected}
            onChange={() => onSelect(card.id || "")}
            style={{
              width: 18,
              height: 18,
              accentColor: theme.palette.primary.main,
              cursor: "pointer",
            }}
          />
        </Box>
      )}

      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #f8fafc, #eef2f7)",
          color: "#2d3748",
          p: 3,
          position: "relative",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Stack spacing={1}>
          {card.editing ? (
            <>
              <GenericFieldRenderer
                field={salaryRuleFields[0]}
                value={editingValues?.[cardId]?.name ?? rule.name}
                onChange={(val) => onEditFieldChange?.(cardId, "name", val)}
                editing={true}
                editProps={{
                  variant: "standard",
                  size: "small",
                  sx: {
                    mb: 1,
                    borderRadius: 0,
                    background: "transparent",
                    boxShadow: "none",
                    input: { color: "#2d3748", fontWeight: 700 },
                  },
                  InputProps: { disableUnderline: false },
                  fullWidth: true,
                }}
                viewProps={{
                  variant: "h6",
                  fontWeight: 700,
                  sx: { color: "#2d3748" },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TagIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                <GenericFieldRenderer
                  field={salaryRuleFields[1]}
                  value={editingValues?.[cardId]?.code ?? rule.code}
                  onChange={(val) => onEditFieldChange?.(cardId, "code", val)}
                  editing={true}
                  editProps={{
                    variant: "standard",
                    size: "small",
                    sx: {
                      borderRadius: 0,
                      background: "transparent",
                      boxShadow: "none",
                      input: {
                        color: "#4a5568",
                        fontWeight: 500,
                        fontFamily: "monospace",
                        fontSize: "0.875rem",
                      },
                    },
                    InputProps: { disableUnderline: false },
                    fullWidth: true,
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 500,
                    sx: {
                      opacity: 0.9,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "#4a5568",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GenericFieldRenderer
                  field={salaryRuleFields[5]} // sequence
                  value={editingValues?.[cardId]?.sequence ?? rule.sequence}
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "sequence", val)
                  }
                  editing={true}
                  editProps={{
                    variant: "standard",
                    size: "small",
                    sx: {
                      borderRadius: 0,
                      background: "transparent",
                      boxShadow: "none",
                      input: {
                        color: "#4a5568",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      },
                      height: 24,
                    },
                    InputProps: { disableUnderline: false },
                    fullWidth: false,
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 500,
                    sx: {
                      background: "rgba(0,0,0,0.1)",
                      color: "#4a5568",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    },
                  }}
                />

                <GenericFieldRenderer
                  field={salaryRuleFields[6]}
                  value={editingValues?.[cardId]?.isActive ?? rule.isActive}
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "isActive", val)
                  }
                  editing={true}
                  editProps={{
                    variant: "outlined",
                    size: "small",
                    sx: { mb: 1, borderRadius: 2 },
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 600,
                    sx: { color: "text.primary" },
                  }}
                />

                <GenericFieldRenderer
                  field={salaryRuleFields[14]}
                  value={
                    editingValues?.[cardId]?.isDeduction ?? rule.isDeduction
                  }
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "isDeduction", val)
                  }
                  editing={true}
                  editProps={{
                    variant: "outlined",
                    size: "small",
                    sx: { mb: 1, borderRadius: 2 },
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 600,
                    sx: { color: "text.primary" },
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  lineHeight: 1.2,
                  color: "#2d3748",
                  pr: onSelect ? 4 : 0,
                }}
              >
                {rule.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TagIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    opacity: 0.9,
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#4a5568",
                  }}
                >
                  {rule.code}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 1,
                  flexWrap: "wrap", // ensures wrapping if space is small
                }}
              >
                {/* Sequence */}
                <Chip
                  label={`Sequence: ${rule.sequence ?? "N/A"}`}
                  size="small"
                  sx={{
                    background: "rgba(0,0,0,0.1)",
                    color: "#4a5568",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                  clickable={false}
                />

                {/* Active Status */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: rule.isActive ? "#4caf50" : "#f44336",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "white",
                    }}
                  />
                  {rule.isActive ? "Active" : "Inactive"}
                </Box>

                {/* Deduction Status */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: rule.isDeduction ? "#4caf50" : "#f44336",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "white",
                    }}
                  />
                  {rule.isDeduction ? "Deduction" : "No Deduction"}
                </Box>
              </Box>
              <Divider />
            </>
          )}
        </Stack>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {card.editing ? (
            <>
              {/* Category - Required field */}
              <GenericFieldRenderer
                field={salaryRuleFields[12]} // category
                value={
                  editingValues?.[cardId]?.category?.id ??
                  rule.category?.id ??
                  ""
                }
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "category", { id: val })
                }
                editing={true}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />

              {/* Calculation Type */}
              <GenericFieldRenderer
                field={salaryRuleFields[2]}
                value={
                  editingValues?.[cardId]?.calculationType ??
                  rule.calculationType
                }
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "calculationType", val)
                }
                editing={true}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />

              {/* Percentage of Category - Conditional field */}
              {editingValues?.[cardId]?.calculationType ===
                "PercentageOfCategory" ||
              rule.calculationType === "PercentageOfCategory" ? (
                <GenericFieldRenderer
                  field={salaryRuleFields[13]} // percentageOfCategory
                  value={
                    editingValues?.[cardId]?.percentageOfCategory?.id ??
                    rule.percentageOfCategory?.id ??
                    ""
                  }
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "percentageOfCategory", {
                      id: val,
                    })
                  }
                  editing={true}
                  editProps={{
                    variant: "outlined",
                    size: "small",
                    sx: { mb: 1, borderRadius: 2, background: "white" },
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 600,
                    sx: { color: "text.primary" },
                  }}
                />
              ) : null}

              <GenericFieldRenderer
                field={salaryRuleFields[3]}
                value={editingValues?.[cardId]?.fixedAmount ?? rule.fixedAmount}
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "fixedAmount", val)
                }
                editing={true}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />
              <GenericFieldRenderer
                field={{
                  ...salaryRuleFields[4],
                  type: "formula",
                  dictionaries: dictionaries,
                }}
                value={editingValues?.[cardId]?.formula ?? rule.formula}
                onChange={(val) => onEditFieldChange?.(cardId, "formula", val)}
                editing={true}
                multiline={true}
                minRows={2}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />
              <GenericFieldRenderer
                field={salaryRuleFields[7]}
                value={
                  editingValues?.[cardId]?.externalCode ?? rule.externalCode
                }
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "externalCode", val)
                }
                editing={true}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />
              <GenericFieldRenderer
                field={salaryRuleFields[8]}
                value={
                  editingValues?.[cardId]?.organizationNodeId ??
                  rule.organizationNodeId
                }
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "organizationNodeId", val)
                }
                editing={true}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />
              <GenericFieldRenderer
                field={{
                  ...salaryRuleFields[9],
                  type: "formula",
                  dictionaries: dictionaries,
                }}
                value={
                  editingValues?.[cardId]?.conditionExpression ??
                  rule.conditionExpression
                }
                onChange={(val) =>
                  onEditFieldChange?.(cardId, "conditionExpression", val)
                }
                editing={true}
                multiline={true}
                minRows={2}
                editProps={{
                  variant: "outlined",
                  size: "small",
                  sx: { mb: 1, borderRadius: 2, background: "white" },
                }}
                viewProps={{
                  variant: "body2",
                  fontWeight: 600,
                  sx: { color: "text.primary" },
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <GenericFieldRenderer
                  field={salaryRuleFields[10]}
                  value={editingValues?.[cardId]?.activeFrom ?? rule.activeFrom}
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "activeFrom", val)
                  }
                  editing={true}
                  editProps={{
                    variant: "outlined",
                    size: "small",
                    sx: { borderRadius: 2, background: "white" },
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 600,
                    sx: { color: "text.primary" },
                  }}
                />
                <GenericFieldRenderer
                  field={salaryRuleFields[11]}
                  value={editingValues?.[cardId]?.activeTo ?? rule.activeTo}
                  onChange={(val) =>
                    onEditFieldChange?.(cardId, "activeTo", val)
                  }
                  editing={true}
                  editProps={{
                    variant: "outlined",
                    size: "small",
                    sx: { borderRadius: 2, background: "white" },
                  }}
                  viewProps={{
                    variant: "body2",
                    fontWeight: 600,
                    sx: { color: "text.primary" },
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              {/* Calculation Type */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: getCalculationTypeColor(rule.calculationType),
                      fontSize: "1rem",
                    }}
                  >
                    {getCalculationTypeIcon(rule.calculationType)}
                  </Avatar>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Calculation Type
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    alignContent: "baseline",
                    p: 1,
                  }}
                >
                  {
                    // rule.calculationType === 'Fixed' ? 'Fixed Amount' :
                    //  rule.calculationType === 'Formula' ? 'Formula Based' :
                    //  rule.calculationType === 'PercentageOfCategory' ? 'Percentage of Category' :
                    //  rule.calculationType === 'SplitEqually' ? 'Split Equally' :
                    rule.calculationType
                  }
                </Typography>
              </Box>

              <Divider />

              {/* Key Details Grid */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                {/* Fixed Amount */}
                <DetailItem
                  icon={<MoneyIcon />}
                  label="Fixed Amount"
                  value={formatAmount(rule.fixedAmount)}
                  color="#4caf50"
                />

                {/* Category */}
                <DetailItem
                  icon={<CategoryIcon />}
                  label="Category"
                  value={
                    <EntityNameById
                      id={rule.category?.name}
                      useQuery={useGetSalaryrulecategoriesByIdQuery}
                      field="name"
                      fallback={rule.category?.name || "Not assigned"}
                      queryOptions={{ skip: !rule.category?.id }}
                    />
                  }
                  color="#2196f3"
                />

                {/* Percentage Category */}
                {rule.calculationType === "PercentageOfCategory" && (
                  <DetailItem
                    icon={<PercentIcon />}
                    label="Percentage Of"
                    value={
                      rule.percentageOfCategory?.id ? (
                        <EntityNameById
                          id={rule.percentageOfCategory.id}
                          useQuery={useGetSalaryrulecategoriesByIdQuery}
                          field="name"
                          fallback="Not assigned"
                          queryOptions={{ skip: !rule.percentageOfCategory.id }}
                        />
                      ) : (
                        "Not assigned"
                      )
                    }
                    color="#ff9800"
                  />
                )}

                {/* Organization Node */}
                <DetailItem
                  icon={<BusinessIcon />}
                  label="Organization"
                  value={
                    <EntityNameById
                      id={rule.organizationNode?.id}
                      useQuery={useGetOrganizationnodesByIdQuery}
                      field="name"
                      fallback={rule.organizationNode?.id || "Not assigned"}
                      queryOptions={{ skip: !rule.organizationNode?.id }}
                    />
                  }
                  color="#9c27b0"
                />
              </Box>

              {/* Formula (if applicable) */}
              {rule.formula && (
                <>
                  <Divider />
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <CodeIcon sx={{ color: "#2196f3", fontSize: 20 }} />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        Formula
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        background: "#f5f5f5",
                        borderRadius: 2,
                        p: 1.5,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                          color: "#333",
                          wordBreak: "break-word",
                        }}
                      >
                        {rule.formula}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}

              {/* Condition Expression (if applicable) */}

              <>
                <Divider />
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <CalculateIcon sx={{ color: "#ff9800", fontSize: 20 }} />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Condition
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      background: "#fff3e0",
                      borderRadius: 2,
                      p: 1.5,
                      border: "1px solid #ffcc02",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.875rem",
                        color: "#e65100",
                        wordBreak: "break-word",
                      }}
                    >
                      {rule.conditionExpression
                        ? rule.conditionExpression
                        : "No condition expression"}
                    </Typography>
                  </Box>
                </Box>
              </>
            </>
          )}
        </Stack>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          background: "#fafafa",
          borderTop: "1px solid",
          borderColor: "divider",
          p: 2.5,
        }}
      >
        <Stack spacing={2}>
          {/* Date Range */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Active Period
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDate(rule.activeFrom)} - {formatDate(rule.activeTo)}
            </Typography>
          </Box>

          {/* External Code */}
          {rule.externalCode && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                External Code
              </Typography>
              <Chip
                label={rule.externalCode}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
                clickable={false}
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            {card.editing ? (
              <>
                <Tooltip title="Save changes">
                  <Button
                    onClick={() => onSave?.(card.id || "")}
                    disabled={isSaving}
                    size="small"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: "success.main",
                      color: "white",
                      minWidth: "auto",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { bgcolor: "success.dark" },
                      "&:disabled": { bgcolor: "action.disabled" },
                    }}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </Tooltip>

                <Tooltip title="Cancel editing">
                  <Button
                    onClick={() => onCancel?.(card.id || "")}
                    disabled={isSaving}
                    size="small"
                    variant="contained"
                    startIcon={<CancelIcon />}
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      minWidth: "auto",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { bgcolor: "error.dark" },
                      "&:disabled": { bgcolor: "action.disabled" },
                    }}
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit salary rule">
                  <Button
                    onClick={() => onEdit?.(card.id || "")}
                    disabled={isDeleting}
                    size="small"
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      minWidth: "auto",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { bgcolor: "primary.dark" },
                      "&:disabled": { bgcolor: "action.disabled" },
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Delete salary rule">
                  <Button
                    onClick={() => onDeleteRequest?.(card)}
                    disabled={isDeleting}
                    size="small"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      minWidth: "auto",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      "&:hover": { bgcolor: "error.dark" },
                      "&:disabled": { bgcolor: "action.disabled" },
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

// Detail Item Component
const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
      <Box sx={{ color, fontSize: 16 }}>{icon}</Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Typography
      variant="body2"
      sx={{
        fontWeight: 500,
        color: "text.primary",
        fontSize: "0.875rem",
        lineHeight: 1.3,
        wordBreak: "break-word",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default SalaryRuleCard;
