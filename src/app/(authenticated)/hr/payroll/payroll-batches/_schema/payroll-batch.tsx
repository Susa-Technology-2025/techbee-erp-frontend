// payroll-batch-schema.ts
import { z } from "zod";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import {
  Chip,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  FileDownload as FileDownloadIcon,
  VerifiedOutlined,
  Payment,
  PostAddOutlined,
  RepeatRounded,
  Visibility as VisibilityIcon,
  CheckCircleOutline as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  FormatListBulleted as ListIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { PayrollBatchActionsCell } from "../_components/payrollBatchActionCell";
import { PayrollBatchCustomForm } from "../_components/payrollBatchForm";
import { PayrollPeriodSelector } from "../_components/payroll-period-selector";
import { payrollBatchRemover } from "../_components/globl-state-remover";

export const payrollBatchSchema = z
  .object({
    id,

    // Basic Information
    name: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Batch Name",
        placeholder: "e.g., November Payroll",
        description: "A descriptive name for the payroll batch",
        validationErrorMessage: "Batch name is required",
        section: "Basic Information",
        required: true,
      },
      tableRelated: {
        header: "Batch Name",
        accessorKey: "name",
        Cell: ({ cell }) => (
          <Box
            sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            <Typography variant="body2" fontWeight="bold">
              {cell.getValue()}
            </Typography>
          </Box>
        ),
      },
    } as FieldLevelMeta),

    description: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-area",
          label: "Description",
          placeholder: "e.g., Payroll for November 2025",
          description: "A brief description of the payroll batch",
          section: "Basic Information",
        },
        tableRelated: {
          header: "Description",
          accessorKey: "description",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() || "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    batchType: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Batch Type",
        description: "The type of payroll batch",
        validationErrorMessage: "Batch type is required",
        section: "Basic Information",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { label: "Monthly", value: "Monthly" },
            { label: "Bonus", value: "Bonus" },
            { label: "Off-Cycle", value: "OffCycle" },
            { label: "Termination", value: "Termination" },
            { label: "Custom", value: "Custom" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Batch Type",
        accessorKey: "batchType",
        Cell: ({ cell }) => {
          const type = cell.getValue();
          let color:
            | "default"
            | "primary"
            | "secondary"
            | "success"
            | "warning" = "default";

          switch (type) {
            case "Monthly":
              color = "primary";
              break;
            case "Bonus":
              color = "success";
              break;
            case "OffCycle":
              color = "warning";
              break;
            case "Termination":
              color = "error";
              break;
            default:
              color = "default";
          }

          return (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip label={type} size="small" color={color} />
            </Box>
          );
        },
      },
    } as FieldLevelMeta),

    //   period: z.object().optional().nullable().meta({
    //     formRelated: {
    //         inputType: "auto-complete",
    //         label: "Period",
    //         description: "The organization node associated with this payroll batch",
    //         section: "Period Information",
    //         autoComplete: {
    //             multiple: false,
    //             async: true,
    //             allowCreateNew: true,
    //             getEndpoint: "https://api.techbee.et/api/hr/payrollPeriods",
    //             getOptionsLabel: (opt) => opt.name,
    //             getOptionsValue: (opt) => opt.id,
    //         },
    //     }
    // } as FieldLevelMeta),
    // Period Information
    periodConfiguration: z
      .any()
      .optional()
      .meta({
        formRelated: {
          inputType: "custom",
          customComponent: PayrollPeriodSelector,
          section: "Period Information",
        },
      }),

    periodStart: preprocessedDate.meta({
      // formRelated: {
      //     inputType: "date-time",
      //     label: "Period Start",
      //     description: "The start date of the payroll period",
      //     validationErrorMessage: "Period start is required",
      //     section: "Period Information",
      //     required: true,
      //     date: {
      //         type: "date-and-time",
      //         min: undefined,
      //         max: undefined,
      //     },
      // },
      tableRelated: {
        header: "Period Start",
        accessorKey: "periodStart",
        Cell: ({ cell }) => (
          <Box
            sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {dateCell({ cell })}
          </Box>
        ),
      },
    } as FieldLevelMeta),

    periodEnd: preprocessedDate.meta({
      // formRelated: {
      //     inputType: "date-time",
      //     label: "Period End",
      //     description: "The end date of the payroll period",
      //     validationErrorMessage: "Period end is required",
      //     section: "Period Information",
      //     required: true,
      //     date: {
      //         type: "date-and-time",
      //         min: undefined,
      //         max: undefined,
      //     },
      // },
      tableRelated: {
        header: "Period End",
        accessorKey: "periodEnd",
        Cell: ({ cell }) => (
          <Box
            sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            {dateCell({ cell })}
          </Box>
        ),
      },
    } as FieldLevelMeta),

    // Status Information
    status: z
      .string()
      .default("Draft")
      .meta({
        tableRelated: {
          header: "Status",
          accessorKey: "status",
          Cell: ({ cell }) => {
            const status = cell.getValue();
            let color:
              | "default"
              | "primary"
              | "secondary"
              | "success"
              | "warning"
              | "error" = "default";
            let icon = null;

            switch (status) {
              case "Draft":
                color = "default";
                break;
              case "Generated":
                color = "primary";
                break;
              case "Verified":
                color = "success";
                icon = <CheckCircleIcon />;
                break;
              case "Paid":
                color = "secondary";
                break;
              case "Posted":
                color = "info";
                break;
              case "Done":
                color = "success";
                icon = <CheckCircleIcon />;
                break;
              default:
                color = "default";
            }

            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Chip label={status} size="small" color={color} icon={icon} />
              </Box>
            );
          },
        },
      } as FieldLevelMeta),
    filters: z
      .any()
      .optional()
      .meta({
        formRelated: {
          inputType: "custom",
          customComponent: PayrollBatchCustomForm,

          section: "🔍 Employee Filters", // This will be the tab name
        },
      }),
    approvalStatus: z
      .string()
      .optional()
      .nullable()
      .meta({
        tableRelated: {
          header: "Approval Status",
          accessorKey: "approvalStatus",
          Cell: ({ cell }) => {
            const status = cell.getValue();
            if (!status) return null;

            let color:
              | "default"
              | "primary"
              | "secondary"
              | "success"
              | "warning"
              | "error" = "default";

            switch (status) {
              case "Draft":
                color = "default";
                break;
              case "Pending":
                color = "warning";
                break;
              case "Approved":
                color = "success";
                break;
              case "Rejected":
                color = "error";
                break;
            }

            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Chip label={status} size="small" color={color} />
              </Box>
            );
          },
        },
      } as FieldLevelMeta),
    // filters: z.any().optional().meta({
    //     formRelated: {
    //         inputType: "custom",
    //         customComponent: PayrollBatchCustomForm,
    //     },
    // }),
    locked: z
      .boolean()
      .default(false)
      .meta({
        tableRelated: {
          header: "Locked",
          accessorKey: "locked",
          Cell: ({ cell }) => {
            const isLocked = cell.getValue();
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={isLocked ? "Locked" : "Unlocked"}>
                  <IconButton
                    color={isLocked ? "error" : "success"}
                    size="small"
                  >
                    {isLocked ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    // Organization
    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Organization Node",
          description:
            "The organization node associated with this payroll batch",
          section: "Organization",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            getEndpoint: "https://api.techbee.et/api/core/organizationNodes",
            getOptionsLabel: (opt) => opt.name,
            getOptionsValue: (opt) => opt.id,
          },
        },
        // tableRelated: {
        //     header: "Organization",
        //     accessorKey: "organizationNodeId",
        //     Cell: ({ cell, row }) => {
        //         const orgNodeId = cell.getValue();
        //         // You might want to fetch organization nodes and find the name
        //         return (
        //             <Box sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}>
        //                 <Typography variant="body2">
        //                     {orgNodeId ? `Org-${orgNodeId.slice(0, 8)}...` : "N/A"}
        //                 </Typography>
        //             </Box>
        //         );
        //     },
        // },
      } as FieldLevelMeta),

    // Summary Information (read-only in table)
    summary: z
      .object({
        totalNet: z.number().optional().nullable(),
        totalGross: z.number().optional().nullable(),
        totalDeductions: z.number().optional().nullable(),
        employerContributions: z.number().optional().nullable(),
        totalPayslipsGenerated: z.number().optional().nullable(),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Summary",
          accessorKey: "summary",
          Cell: ({ cell }) => {
            const summary = cell.getValue();
            if (!summary) return null;

            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Tooltip
                  title={`Gross: ${summary.totalGross || 0} | Net: ${
                    summary.totalNet || 0
                  }`}
                >
                  <Chip
                    label={`${summary.totalPayslipsGenerated || 0} payslips`}
                    size="small"
                    variant="outlined"
                  />
                </Tooltip>
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    // Actions column
    _actions: z.any().meta({
      formRelated: {
        inputType: "table-only",
      },
      tableRelated: {
        header: "Actions",
        accessorKey: "_actions",
        size: 800,
        minSize: 700,
        Cell: ({ row }) => (
          <PayrollBatchActionsCell
            key={`${row.original.id}-${row.original.status}-${row.original.updatedAt}`}
            row={row}
          />
        ),
      },
    } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Payroll Batches",
    apiEndPoint: "https://api.techbee.et/api/hr/payrollBatches",
    formName: "payrollBatch",
    sections: [
      "Basic Information",
      "Period Information",
      "Organization",
      "🔍 Employee Filters",
    ],
    createTitle: "Create Payroll Batch",
    editTitle: "Edit Payroll Batch",
    allowDelete: true,
    allowEdit: true,
    allowCreateNew: true,
    remover: payrollBatchRemover,
  } as SchemaMeta);

export type PayrollBatchSchema = z.infer<typeof payrollBatchSchema>;
