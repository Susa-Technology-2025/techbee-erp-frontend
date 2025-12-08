import { z } from "zod";
import type { FieldLevelMeta, SchemaMeta } from "./types";
import { dateTime, id } from "./common-schemas";
import { gradeSchema } from "./grade";
import { minimalEmployeeSchema } from "./manager-employee";
import { positionSchema } from "./position";
import { shiftSchema } from "./shift";
import { organizationSchema } from "./organization-node";
import { dateCell, preprocessedDate } from "@/lib/schemas/time-parser";
import { userSchema } from "./users";
import {
  Chip,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BadgeIcon from "@mui/icons-material/Badge";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { EmployeeDetailModal } from "./emp-detail-modal";
import { titleSchema } from "./title";

export const employeeSchema = z
  .object({
    id,

    // Personal Information
    firstName: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "First Name",
        placeholder: "Enter first name",
        description: "The employee's legal first name.",
        validationErrorMessage: "First name is required.",
        section: "Personal Information",
        required: true,
      },
      tableRelated: {
        header: "First Name",
        accessorKey: "firstName",
        Cell: ({ row }) => (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ minHeight: "40px" }}
          >
            <Avatar
              src={`https://picsum.photos/seed/${row.original.id}/200/300`}
            >
              <PersonIcon />
            </Avatar>
            <Typography variant="body2" fontWeight="bold">
              {row.original.firstName}
            </Typography>
          </Stack>
        ),
      },
    } as FieldLevelMeta),
    fatherName: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Father Name",
          placeholder: "Enter father name",
          description: "The employee's legal father name.",
          validationErrorMessage: "father name is required.",
          section: "Personal Information",
          required: true,
        },
        tableRelated: {
          header: "Father Name",
          accessorKey: "fatherName",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" fontStyle="italic">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),
    grandFatherName: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Grandfather's Name",
          placeholder: "Enter grandfather's name",
          description: "The employee's grandfather's name.",
          validationErrorMessage: "Grandfather's name is required.",
          section: "Personal Information",
          required: true,
        },
        tableRelated: {
          header: "Grandfather's Name",
          accessorKey: "grandFatherName",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    gender: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Gender",
          placeholder: "Enter gender",
          description: "The employee's gender.",
          validationErrorMessage: "Gender is required.",
          section: "Personal Information",
          required: true,
          autoComplete: {
            options: ["Male", "Female"],
            getOptionsLabel: (opt) => opt,
            getOptionsValue: (opt) => opt,
          },
        },
        tableRelated: {
          header: "Gender",
          accessorKey: "gender",
          Cell: ({ cell }) => {
            const gender = cell.getValue();
            if (!gender) {
              return (
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">-</Typography>
                </Box>
              );
            }
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Chip
                  label={gender}
                  size="small"
                  icon={
                    gender === "Male" ? (
                      <ManIcon />
                    ) : gender === "Female" ? (
                      <WomanIcon />
                    ) : null
                  }
                  color={
                    gender === "Male"
                      ? "info"
                      : gender === "Female"
                      ? "secondary"
                      : "default"
                  }
                  variant="outlined"
                />
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    dateOfBirth: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Date of Birth",
          placeholder: "Select date of birth",
          description: "The employee's date of birth.",
          validationErrorMessage: "Date of birth is required.",
          section: "Personal Information",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Date of Birth",
          accessorKey: "dateOfBirth",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              {dateCell({ cell })}
            </Box>
          ),
        },
      } as FieldLevelMeta),

    maritalStatus: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Marital Status",
          description: "The employee's marital status.",
          validationErrorMessage: "Marital status is required.",
          section: "Personal Information",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
              { label: "Divorced", value: "Divorced" },
              { label: "Widowed", value: "Widowed" },
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value.label,
            getOptionsValue: (value) => value.value,
          },
        },
        tableRelated: {
          header: "Marital Status",
          accessorKey: "maritalStatus",
          Cell: ({ cell }) => {
            const status = cell.getValue();
            if (!status) {
              return (
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">-</Typography>
                </Box>
              );
            }
            let color = "default";
            switch (status) {
              case "Married":
                color = "success";
                break;
              case "Single":
                color = "primary";
                break;
              case "Divorced":
                color = "warning";
                break;
              case "Widowed":
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

    nationalId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Fayda No",
          placeholder: "Enter national ID",
          description: "The employee's national identification number.",
          validationErrorMessage: "National ID is required.",
          section: "Personal Information",
          required: true,
        },
        tableRelated: {
          header: "Fayda ID",
          accessorKey: "nationalId",
          Cell: ({ cell }) => (
            <Box
              sx={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <BadgeIcon color="primary" />
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    // Contact Information
    email: z
      .email()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Email",
          placeholder: "Enter employee's email",
          description: "The employee's professional email address.",
          validationErrorMessage: "A valid email is required.",
          section: "Contact Information",
          required: true,
        },
        tableRelated: {
          header: "Email",
          accessorKey: "email",
          Cell: ({ cell }) => (
            <Box
              sx={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <EmailIcon color="action" />
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Phone Number",
          placeholder: "Enter phone number",
          description: "The employee's contact phone number.",
          validationErrorMessage: "Phone number is required.",
          section: "Contact Information",
          required: true,
        },
        tableRelated: {
          header: "Phone Number",
          accessorKey: "phoneNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PhoneIcon color="action" />
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    country: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Country",
          placeholder: "Enter country",
          description: "The country of residence.",
          validationErrorMessage: "Country is required.",
          section: "Contact Information",
          required: true,
        },
        tableRelated: {
          header: "Country",
          accessorKey: "country",
          Cell: ({ cell }) => (
            <Box
              sx={{
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocationOnIcon color="info" />
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    city: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "City",
          placeholder: "Enter city",
          description: "The city of residence.",
          validationErrorMessage: "City is required.",
          section: "Contact Information",
          required: true,
        },
        tableRelated: {
          header: "City",
          accessorKey: "city",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    subCity: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Sub-City",
          placeholder: "Enter sub-city",
          description: "The sub-city or district of residence.",
          validationErrorMessage: "Sub-city is required.",
          section: "Contact Information",
          required: true,
        },
        tableRelated: {
          header: "Sub-City",
          accessorKey: "subCity",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    // Employment Details
    employeeCode: z.string().meta({
      formRelated: {
        inputType: "text-field",
        label: "Employee Code",
        placeholder: "Enter employee code",
        description: "The employee's unique company code.",
        validationErrorMessage: "Employee code is required.",
        section: "Employment Details",
        required: true,
      },
      tableRelated: {
        header: "Employee Code",
        accessorKey: "employeeCode",
        Cell: ({ cell }) => (
          <Box
            sx={{
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BusinessCenterIcon color="primary" />
            <Typography variant="body2" fontWeight="bold">
              {cell.getValue()}
            </Typography>
          </Box>
        ),
      },
    } as FieldLevelMeta),

    fileNumber: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "File Number",
          placeholder: "Enter file number",
          description: "Internal file number for the employee.",
          validationErrorMessage: "File number is required.",
          section: "Employment Details",
          required: true,
        },
        tableRelated: {
          header: "File Number",
          accessorKey: "fileNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" fontStyle="italic">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    employmentTerm: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Employment Term",
          description: "The term of employment.",
          validationErrorMessage: "Employment term is required.",
          section: "Employment Details",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { label: "Permanent", value: "Permanent" },
              { label: "Contract", value: "Contract" },
              { label: "Temporary", value: "Temporary" },
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value.label,
            getOptionsValue: (value) => value.value,
          },
        },
        tableRelated: {
          header: "Employment Term",
          accessorKey: "employmentTerm",
          Cell: ({ cell }) => {
            const term = cell.getValue();
            if (!term) {
              return (
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">-</Typography>
                </Box>
              );
            }
            let color = "default";
            switch (term) {
              case "Permanent":
                color = "success";
                break;
              case "Contract":
                color = "primary";
                break;
              case "Temporary":
                color = "warning";
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
                <Chip label={term} size="small" color={color} />
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    hireDate: preprocessedDate
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Hire Date",
          placeholder: "Select hire date",
          description: "The employee's start date with the company.",
          validationErrorMessage: "Hire date is required.",
          section: "Employment Details",
          required: true,
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Hire Date",
          accessorKey: "hireDate",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              {dateCell({ cell })}
            </Box>
          ),
        },
      } as FieldLevelMeta),

    probationEndDate: preprocessedDate
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Probation End Date",
          placeholder: "Select probation end date",
          description: "The end date of the employee's probation period.",
          section: "Employment Details",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Probation End Date",
          accessorKey: "probationEndDate",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              {dateCell({ cell })}
            </Box>
          ),
        },
      } as FieldLevelMeta),

    terminationDate: preprocessedDate
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "date-time",
          label: "Termination Date",
          placeholder: "Select termination date",
          description: "The date the employee's employment was terminated.",
          section: "Employment Details",
          date: {
            type: "date-only",
            min: undefined,
            max: undefined,
          },
        },
        tableRelated: {
          header: "Termination Date",
          accessorKey: "terminationDate",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              {dateCell({ cell })}
            </Box>
          ),
        },
      } as FieldLevelMeta),

    status: z.string().meta({
      formRelated: {
        inputType: "auto-complete",
        label: "Status",
        description: "The employee's current employment status.",
        validationErrorMessage: "Status is required.",
        section: "Employment Details",
        required: true,
        autoComplete: {
          multiple: false,
          async: false,
          options: [
            { label: "Onboarding", value: "Onboarding" },
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
            { label: "Terminated", value: "Terminated" },
          ],
          allowCreateNew: false,
          getOptionsLabel: (value) => value.label,
          getOptionsValue: (value) => value.value,
        },
      },
      tableRelated: {
        header: "Status",
        accessorKey: "status",
        Cell: ({ cell }) => {
          const status = cell.getValue();
          if (!status) {
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">-</Typography>
              </Box>
            );
          }
          let color = "default";
          switch (status) {
            case "Onboarding":
              color = "warning";
              break;
            case "Active":
              color = "success";
              break;
            case "Inactive":
              color = "info";
              break;
            case "Terminated":
              color = "error";
              break;
          }
          return (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip label={status} size="small" color={color} />
            </Box>
          );
        },
      },
    } as FieldLevelMeta),

    retirementStatus: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Retirement Status",
          description: "The employee's retirement status.",
          validationErrorMessage: "Retirement status is required.",
          section: "Employment Details",
          required: true,
          autoComplete: {
            multiple: false,
            async: false,
            options: [
              { label: "Active", value: "Active" },
              { label: "Retired", value: "Retired" },
            ],
            allowCreateNew: false,
            getOptionsLabel: (value) => value.label,
            getOptionsValue: (value) => value.value,
          },
        },
        tableRelated: {
          header: "Retirement Status",
          accessorKey: "retirementStatus",
          Cell: ({ cell }) => {
            const status = cell.getValue();
            if (!status) {
              return (
                <Box
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2">-</Typography>
                </Box>
              );
            }
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Chip
                  label={status}
                  size="small"
                  color={status === "Retired" ? "warning" : "success"}
                />
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    // Roles and References

    gradeRef: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Grade",
              placeholder: "Select employee grade",
              description: "Reference to the employee's grade.",
              validationErrorMessage: "Grade is required.",
              section: "Roles & References",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: gradeSchema,
                getEndpoint: "https://api.techbee.et/api/hr/grades",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Grade",
          accessorKey: "gradeRef.name",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "N/A"}
                size="small"
                color="default"
                variant="outlined"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),

    title: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Title",
              placeholder: "Select title",
              description: "The employee's formal title (e.g., Mr., Mrs.).",
              validationErrorMessage: "Title is required.",
              section: "Roles & References",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: titleSchema,
                getEndpoint: "https://api.techbee.et/api/hr/titles",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Title",
          accessorKey: "title.name",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" fontStyle="italic">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    position: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Position",
              placeholder: "Select position",
              description: "The employee's job position.",
              validationErrorMessage: "Position is required.",
              section: "Roles & References",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: positionSchema,
                getEndpoint: "https://hr.api.techbee.et/api/positions",
                getOptionsLabel: (value) => value.title,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Position",
          accessorKey: "position.title",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "N/A"}
                size="small"
                color="primary"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),

    shift: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Shift",
              placeholder: "Select shift",
              description: "The employee's assigned work shift.",
              validationErrorMessage: "Shift is required.",
              section: "Roles & References",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: shiftSchema,
                getEndpoint: "https://hr.api.techbee.et/api/shifts",
                getOptionsLabel: (value) => value.name,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Shift",
          accessorKey: "shift.name",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "N/A"}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),
    manager: z
      .object({
        id: z
          .string()
          .optional()
          .nullable()
          .meta({
            formRelated: {
              inputType: "auto-complete",
              label: "Manager",
              placeholder: "Select manager",
              description: "Employees Manager.",
              validationErrorMessage: "Manager is required.",
              section: "Roles & References",
              required: true,
              autoComplete: {
                multiple: false,
                async: true,
                options: undefined,
                allowCreateNew: true,
                createSchema: minimalEmployeeSchema,
                getEndpoint: "https://hr.api.techbee.et/api/employees",
                getOptionsLabel: (value) =>
                  value.firstName + " " + value.fatherName,
                getOptionsValue: (value) => value.id,
              },
            },
          } as FieldLevelMeta),
      })
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "object",
        },
        tableRelated: {
          header: "Manager",
          accessorKey: "manager.id",
          Cell: ({ row }) =>
            (row.original?.manager?.firstName || "") +
            " " +
            (row.original?.manager?.lastName || ""),
        },
      } as FieldLevelMeta),

    isApprover: z
      .boolean()
      .nullable()
      .optional()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Approver",
          description: "Indicates if the employee is an approver.",
          section: "Boolean Flags",
        },
        tableRelated: {
          header: "Approver",
          accessorKey: "isApprover",
          Cell: ({ cell }) => {
            const isApprover = cell.getValue();
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={isApprover ? "Approver" : "Not an Approver"}>
                  <IconButton color={isApprover ? "success" : "error"}>
                    {isApprover ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <HighlightOffIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    isHr: z
      .boolean()
      .nullable()
      .optional()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is HR",
          description: "Indicates if the employee has HR privileges.",
          section: "Boolean Flags",
        },
        tableRelated: {
          header: "HR",
          accessorKey: "isHr",
          Cell: ({ cell }) => {
            const isHr = cell.getValue();
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={isHr ? "HR" : "Not HR"}>
                  <IconButton color={isHr ? "success" : "error"}>
                    {isHr ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    isManager: z
      .boolean()
      .default(false)
      .meta({
        formRelated: {
          inputType: "boolean-field",
          label: "Is Manager",
          description: "Indicates if the employee is a manager.",
          section: "Boolean Flags",
        },
        tableRelated: {
          header: "Manager",
          accessorKey: "isManager",
          Cell: ({ cell }) => {
            const isManager = cell.getValue();
            return (
              <Box
                sx={{
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={isManager ? "Manager" : "Not a Manager"}>
                  <IconButton color={isManager ? "success" : "error"}>
                    {isManager ? (
                      <CheckCircleOutlineIcon />
                    ) : (
                      <HighlightOffIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            );
          },
        },
      } as FieldLevelMeta),

    // Other Details
    companyExperience: z
      .number()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "number-field",
          label: "Company Experience (Years)",
          placeholder: "Enter years of experience",
          description: "The employee's years of experience within the company.",
          validationErrorMessage: "Experience must be a number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "Company Experience",
          accessorKey: "companyExperience",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    previousExperience: z
      .number()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "number-field",
          label: "Previous Experience (Years)",
          placeholder: "Enter previous years of experience",
          description:
            "The employee's years of experience before joining the company.",
          validationErrorMessage: "Previous experience must be a number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "Previous Experience",
          accessorKey: "previousExperience",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    language: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Language",
          placeholder: "Enter preferred language",
          description: "The employee's preferred language.",
          validationErrorMessage: "Language is required.",
          section: "Other Details",
          required: true,
        },
        tableRelated: {
          header: "Language",
          accessorKey: "language",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "-"}
                size="small"
                variant="outlined"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),

    organizationNodeId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "Organization Node",
          placeholder: "Enter organization node ",
          description: "organization node the employee belongs to.",
          validationErrorMessage: "organization node is required.",
          section: "Other Details",
          autoComplete: {
            multiple: false,
            async: true,
            allowCreateNew: true,
            createSchema: organizationSchema,
            getEndpoint: "https://core.api.techbee.et/api/organizationNodes",
            getOptionsLabel: (opt) => opt.name + " " + opt.code,
            getOptionsValue: (opt) => opt.id,
          },
        },
        tableRelated: {
          header: "Parent Node",
          accessorKey: "parentNode.id",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    pensionId: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Pension ID",
          placeholder: "Enter pension ID",
          description: "The employee's pension identification number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "Pension ID",
          accessorKey: "pensionId",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    plateNumber: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Plate Number",
          placeholder: "Enter vehicle plate number",
          description: "The employee's vehicle plate number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "Plate Number",
          accessorKey: "plateNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    poessaNumber: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "POESSA Number",
          placeholder: "Enter POESSA number",
          description: "The employee's POESSA number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "POESSA Number",
          accessorKey: "poessaNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    psssaNumber: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "PSSSA Number",
          placeholder: "Enter PSSSA number",
          description: "The employee's PSSSA number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "PSSSA Number",
          accessorKey: "psssaNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2">{cell.getValue() ?? "-"}</Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    remark: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-area",
          label: "Remark",
          placeholder: "Enter any remarks",
          description: "Additional notes or remarks about the employee.",
          section: "Other Details",
        },
        tableRelated: {
          header: "Remark",
          accessorKey: "remark",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    tinNumber: z
      .string()
      .nullable()
      .optional()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "TIN Number",
          placeholder: "Enter TIN number",
          description: "The employee's Tax Identification Number.",
          section: "Other Details",
        },
        tableRelated: {
          header: "TIN Number",
          accessorKey: "tinNumber",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "N/A"}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),

    userId: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "auto-complete",
          label: "User ID",
          placeholder: "Enter user ID",
          description: "The user ID associated with the employee.",
          validationErrorMessage: "User ID is required.",
          section: "Other Details",
          required: true,
          autoComplete: {
            async: true,
            allowCreateNew: true,
            getOptionsLabel: (opt) => opt.firstName + " " + opt.lastName,
            getOptionsValue: (opt) => opt.id,
            createSchema: userSchema,
            getEndpoint: "https://auth.api.techbee.et/api/users",
          },
        },
        tableRelated: {
          header: "User ID",
          accessorKey: "userId",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="body2" color="text.secondary">
                {cell.getValue() ?? "-"}
              </Typography>
            </Box>
          ),
        },
      } as FieldLevelMeta),

    workPlace: z
      .string()
      .optional()
      .nullable()
      .meta({
        formRelated: {
          inputType: "text-field",
          label: "Workplace",
          placeholder: "Enter workplace",
          description: "The employee's primary workplace.",
          validationErrorMessage: "Workplace is required.",
          section: "Other Details",
          required: true,
        },
        tableRelated: {
          header: "Workplace",
          accessorKey: "workPlace",
          Cell: ({ cell }) => (
            <Box
              sx={{ minHeight: "40px", display: "flex", alignItems: "center" }}
            >
              <Chip
                label={cell.getValue() ?? "-"}
                size="small"
                color="default"
                variant="outlined"
              />
            </Box>
          ),
        },
      } as FieldLevelMeta),

    ...dateTime,
  })
  .meta({
    tableName: "Employees",
    apiEndPoint: "https://api.techbee.et/api/hr/employees",
    formName: "employee",
    sections: [
      "Personal Information",
      "Contact Information",
      "Employment Details",
      "Roles & References",
      "Boolean Flags",
      "Other Details",
    ],
    createTitle: "Create Employee",
    editTitle: "Edit Employee",
    // allowDelete: true,
    DetailModal: EmployeeDetailModal,
  } as SchemaMeta);

export type EmployeeSchema = z.infer<typeof employeeSchema>;
