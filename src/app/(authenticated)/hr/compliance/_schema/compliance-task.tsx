// Update your compliance-task-schema.tsx
import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "@/lib/schemas/types";
import { id, dateTime } from "@/lib/schemas/common-schemas";
import { dateCell, preprocessedDateTime } from "@/lib/schemas/time-parser";
import { employeeSchema } from "@/lib/schemas/emp-for-contract";
import { complianceRequirementSchema } from "./compliance-requirement";

// Import the modal and UI components
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { ComplianceTaskDetailModal } from "../components/compliance-task-detail-modal"; // Adjust path

// --- Field Definitions for Relations ---

// Inner schema for Employee relation
const employeeUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Assignment",
      label: "Assigned Employee",
      placeholder: "Select the assigned employee",
      description: "The employee responsible for completing this task.",
      validationErrorMessage: "Employee is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/employees",
        getOptionsLabel: (value) => `${value.firstName} ${value.fatherName}`,
        getOptionsValue: (value) => value.id,
        createSchema: employeeSchema,
        allowCreateNew: true,
      },
    },
    tableRelated: {
      header: "Employee ID",
      accessorKey: "id",
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// Inner schema for Compliance Requirement relation
const requirementUniqueInputSchema = z.object({
  id: id.meta({
    formRelated: {
      inputType: "auto-complete",
      section: "Task Details",
      label: "Compliance Requirement",
      placeholder: "Select the parent requirement",
      description: "The compliance requirement this task fulfills.",
      validationErrorMessage: "Compliance Requirement is required.",
      required: true,
      autoComplete: {
        multiple: false,
        async: true,
        getEndpoint: "https://hr.api.techbee.et/api/complianceRequirements",
        getOptionsLabel: (value) => value.name,
        getOptionsValue: (value) => value.id,
      },
    },
    tableRelated: {
      header: "Requirement ID",
      accessorKey: "id",
      enableHiding: true,
    },
  } as FieldLevelMeta),
});

// --- Main Schema ---

export const complianceTaskSchema = z
  .object({
    id,
    ...dateTime,

    // Scalar Fields
    entityId: z
      .string()
      .min(1, "Entity ID cannot be empty.")
      .meta({
        formRelated: {
          section: "Task Details",
          inputType: "text-field",
          label: "Entity ID",
          placeholder: "Enter ID of the entity",
          description:
            "The unique ID of the entity (e.g., a specific employee, asset) the task applies to.",
          validationErrorMessage: "Entity ID is required.",
          required: true,
        },
        tableRelated: {
          header: "Entity ID",
          accessorKey: "entityId",
        },
      } as FieldLevelMeta),

    entityType: z
      .string()
      .min(1, "Entity Type cannot be empty.")
      .meta({
        formRelated: {
          section: "Task Details",
          inputType: "text-field",
          label: "Entity Type",
          placeholder: "e.g., Employee, Asset",
          description: "The type of entity this task is for.",
          validationErrorMessage: "Entity Type is required.",
          required: true,
        },
        tableRelated: {
          header: "Entity Type",
          accessorKey: "entityType",
        },
      } as FieldLevelMeta),

    assignedToRole: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Assignment",
          inputType: "text-field",
          label: "Assigned Role",
          placeholder: "e.g., Safety Officer",
          description:
            "The role responsible for completing this task (if not assigned to a specific employee).",
          validationErrorMessage: "Assigned Role is optional.",
        },
        tableRelated: {
          header: "Assigned Role",
          accessorKey: "assignedToRole",
        },
      } as FieldLevelMeta),

    notes: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          section: "Task Details",
          inputType: "text-area",
          label: "Notes",
          placeholder: "Add any relevant notes or instructions.",
          description: "Any additional notes or details about the task.",
          validationErrorMessage: "Notes is optional.",
        },
        tableRelated: {
          header: "Notes",
          accessorKey: "notes",
          enableHiding: true,
        },
      } as FieldLevelMeta),

    // Enum Field
    status: z
      .enum(["Pending", "Completed", "Overdue"])
      .default("Pending")
      .meta({
        formRelated: {
          section: "Task Details",
          inputType: "auto-complete",
          label: "Status",
          placeholder: "Select task status",
          description: "The current completion status of the task.",
          validationErrorMessage: "Status is required.",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: ["Pending", "Completed", "Overdue"],
            allowCreateNew: false,
            getOptionsLabel: (value) => value,
            getOptionsValue: (value) => value,
          },
        },
        tableRelated: {
          header: "Status",
          accessorKey: "status",
          Cell: ({ cell }) => {
            const status = cell.getValue();
            let color = "default";
            switch (status) {
              case "Completed":
                color = "success";
                break;
              case "Pending":
                color = "warning";
                break;
              case "Overdue":
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

    // Date Fields
    dueDate: preprocessedDateTime.meta({
      formRelated: {
        section: "Task Details",
        inputType: "date-time",
        label: "Due Date",
        placeholder: "Select the task deadline",
        description: "The deadline for task completion.",
        validationErrorMessage: "Due Date is required.",
        required: true,
        date: {
          type: "date-and-time",
          min: undefined,
          max: undefined,
        },
      },
      tableRelated: {
        header: "Due Date",
        accessorKey: "dueDate",
        Cell: ({ cell }) => dateCell({ cell, time: true }),
      },
    } as FieldLevelMeta),

    completedAt: preprocessedDateTime
      .optional()
      .nullable()
      .meta({
        formRelated: {
          section: "Task Details",
          inputType: "date-time",
          label: "Completed At",
          placeholder: "Select completion date/time",
          description: "The date and time the task was completed.",
          validationErrorMessage: "Completed At should be a valid date/time.",
          date: {
            type: "date-and-time",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Completed At",
          accessorKey: "completedAt",
          Cell: ({ cell }) =>
            cell.getValue() ? dateCell({ cell, time: true }) : "-",
        },
      } as FieldLevelMeta),

    // Object Relations
    employee: employeeUniqueInputSchema
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
          section: "Assignment",
        },
        tableRelated: {
          header: "Assigned Employee",
          accessorKey: "employee",
          Cell: ({ row }) => {
            const employee = row.original.employee;
            if (!employee) {
              return (
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Not assigned
                  </Typography>
                </Box>
              );
            }

            return (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ minHeight: "40px" }}
              >
                <Avatar
                  src={`https://picsum.photos/seed/${employee.id}/200/300`}
                  sx={{ width: 32, height: 32 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {employee.firstName} {employee.fatherName}
                  </Typography>
                  {employee.employeeCode && (
                    <Typography variant="caption" color="text.secondary">
                      {employee.employeeCode}
                    </Typography>
                  )}
                </Box>
              </Stack>
            );
          },
        },
      } as FieldLevelMeta),

    requirement: requirementUniqueInputSchema.meta({
      formRelated: {
        inputType: "object",
        section: "Task Details",
      },
      tableRelated: {
        header: "Requirement",
        accessorKey: "requirement.name",
        Cell: ({ cell }) => (
          <Box
            sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
          >
            <Typography variant="body2" fontWeight="medium">
              {cell.getValue() ?? "N/A"}
            </Typography>
          </Box>
        ),
      },
    } as FieldLevelMeta),
  })
  .meta({
    tableName: "Compliance Tasks",
    apiEndPoint: "https://hr.api.techbee.et/api/complianceTasks",
    formName: "complianceTask",
    allowDelete: true,
    createTitle: "Create New Compliance Task",
    sections: ["Task Details", "Assignment"],
    editTitle: "Edit Compliance Task",
    DetailModal: ComplianceTaskDetailModal, // Add the detail modal here
  } as SchemaMeta);

export type ComplianceTaskSchema = z.infer<typeof complianceTaskSchema>;
