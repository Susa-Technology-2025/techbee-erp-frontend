import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
  Divider,
  Box,
  styled,
  useTheme,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/app/(authenticated)/hr/_queries/employees";
import { RHFAlert } from "@/components/form-components/RHFAlert";
import { Close, PersonAdd, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useGetPositionsQuery } from "@/app/(authenticated)/hr/_queries/positions";
import { useGetShiftsQuery } from "@/app/(authenticated)/hr/_queries/shifts";
import { useGetUsersQuery } from "@/app/users/_queries/users";
import { useGetOrganizationnodesQuery } from "@/app/dashboard/_queries/organizationNodes";
import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete";
import { useForm, FormProvider } from "react-hook-form";
// Import types for options
import { Position } from "@/app/(authenticated)/hr/_schemas/positions";
import { Shift } from "@/app/(authenticated)/hr/_schemas/shifts";
import { User } from "@/app/users/_schemas/users";
import { renderEmployeeFormFields } from "./renderEmployeeFormFields";
import { employeeNVSchema, EmployeeNV } from "../../_schemas/employev2";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    background: `linear-gradient(135deg, ${
      theme.palette.background.paper
    } 0%, ${theme.palette.backgroundSection?.light || "#e1efff"} 100%)`,
    boxShadow: `0 8px 32px rgba(${
      theme.palette.section?.main || "#11, 87, 159"
    }, 0.15)`,
    border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${
    theme.palette.backgroundSection?.main || "#f0f7ff"
  } 0%, ${theme.palette.backgroundSection?.light || "#e1efff"} 100%)`,
  borderBottom: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  position: "sticky",
  top: 0,
  zIndex: 10,
  boxShadow: `0 2px 8px rgba(11, 87, 159, 0.04)`,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
    theme.palette.backgroundSection?.light || "#e1efff"
  } 100%)`,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  background: `linear-gradient(135deg, ${
    theme.palette.backgroundSection?.main || "#f0f7ff"
  } 0%, ${theme.palette.backgroundSection?.light || "#e1efff"} 100%)`,
  borderTop: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  padding: theme.spacing(2, 3),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${
    theme.palette.backgroundSection?.light || "#e1efff"
  } 100%)`,
  border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
  borderRadius: 10,
  transition: "all 0.2s ease",
  "&:hover": {
    background: `linear-gradient(135deg, ${
      theme.palette.section?.light || "#64b5f6"
    } 0%, ${theme.palette.section?.main || "#0b579f"} 100%)`,
    color: theme.palette.section?.contrastText || "#ffffff",
    transform: "scale(1.05)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 14,
  px: 3,
  py: 1,
  transition: "all 0.2s ease",
  "&.cancel": {
    background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.grey[300]}`,
    "&:hover": {
      background: `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[300]} 100%)`,
      transform: "translateY(-1px)",
    },
  },
  "&.submit": {
    background: `linear-gradient(135deg, ${
      theme.palette.section?.main || "#0b579f"
    } 0%, ${theme.palette.section?.light || "#64b5f6"} 100%)`,
    color: theme.palette.section?.contrastText || "#ffffff",
    boxShadow: `0 4px 12px rgba(${
      theme.palette.section?.main || "#11, 87, 159"
    }, 0.25)`,
    "&:hover": {
      boxShadow: `0 6px 16px rgba(${
        theme.palette.section?.main || "#11, 87, 159"
      }, 0.35)`,
      transform: "translateY(-1px)",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    background: `linear-gradient(135deg, ${
      theme.palette.background.paper
    } 0%, ${theme.palette.backgroundSection?.light || "#e1efff"} 100%)`,
    border: `1px solid ${theme.palette.section?.light || "#64b5f6"}20`,
    transition: "all 0.2s ease",
    "&:hover": {
      border: `1px solid ${theme.palette.section?.light || "#64b5f6"}40`,
      boxShadow: `0 2px 8px rgba(${
        theme.palette.section?.main || "#11, 87, 159"
      }, 0.1)`,
    },
    "&.Mui-focused": {
      boxShadow: `0 4px 12px rgba(${
        theme.palette.section?.main || "#11, 87, 159"
      }, 0.15)`,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.section?.main || "#0b579f",
    fontWeight: 500,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.section?.main || "#0b579f",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.section?.main || "#0b579f",
  fontWeight: 700,
  fontSize: "1.1rem",
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderColor: `${theme.palette.section?.light || "#64b5f6"}30`,
  "&::before": {
    borderTop: `1px solid ${theme.palette.section?.light || "#64b5f6"}30`,
  },
}));

const employmentTerms = [
  "Permanent",
  "Contract",
  "Temporary",
  "Internship",
] as const;
const genders = ["Male", "Female"] as const;
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"] as const;
const retirementStatuses = ["Active", "Retired"] as const;

type EmploymentTerm = (typeof employmentTerms)[number];
type Gender = (typeof genders)[number];
type MaritalStatus = (typeof maritalStatuses)[number];
type RetirementStatus = (typeof retirementStatuses)[number];

// Update types: all string fields are string | undefined (never null)
interface FormState {
  employeeCode: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  hireDate: string;
  phoneNumber: string;
  companyExperience: number;
  employmentTerm: EmploymentTerm;
  fileNumber: string;
  gender: Gender;
  grade: string;
  maritalStatus: MaritalStatus;
  organizationNodeId: string;
  previousExperience: number;
  qualification: string;
  retirementStatus: RetirementStatus;
  grandFatherName?: string;
  dateOfBirth?: string;
  email?: string;
  language?: string;
  nationalId?: string;
  tinNumber?: string;
  pensionId?: string;
  probationEndDate?: string;
  terminationDate?: string;
  plateNumber?: string;
  poessaNumber?: string;
  psssaNumber?: string;
  remark?: string;
  workPlace?: string;
  shiftId?: string;
  positionId?: string;
  managerId?: string;
  userId?: string;
  isApprover: boolean;
  isHr: boolean;
  isActive: boolean;
}

type EmployeeFormAllFields = FormState & {
  grandFatherName?: string;
  dateOfBirth?: string;
  email?: string;
  language?: string;
  nationalId?: string;
  tinNumber?: string;
  pensionId?: string;
  probationEndDate?: string;
  terminationDate?: string;
  plateNumber?: string;
  poessaNumber?: string;
  psssaNumber?: string;
  remark?: string;
  workPlace?: string;
  shiftId?: string;
  positionId?: string;
  managerId?: string;
  userId?: string;
  isApprover: boolean;
  isHr: boolean;
  isActive: boolean;
};

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (response?: any) => void;
  mode?: "add" | "edit";
  employee?: Partial<EmployeeFormAllFields> & { id?: string };
}

interface FormErrors {
  [key: string]: string;
}

// Utility to clean the payload before sending to backend
function cleanEmployeePayload(data: EmployeeNV) {
  // Fields that should be excluded from the payload
  const excludedFields = [
    "id",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
    "contracts",
    "subordinates",
    "associatedUser",
    "manager",
    "position",
    "shift",
    "organizationNode",
  ];

  const cleaned: any = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip excluded fields
    if (excludedFields.includes(key)) {
      continue;
    }

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "object" &&
        value !== null &&
        "id" in value &&
        !value.id)
    ) {
      continue;
    }
    cleaned[key] = value;
  }

  // Handle nested objects properly
  if (cleaned.managerId && cleaned.managerId.id) {
    cleaned.manager = { id: cleaned.managerId.id };
    delete cleaned.managerId;
  }

  if (cleaned.positionId && cleaned.positionId.id) {
    cleaned.position = { id: cleaned.positionId.id };
    delete cleaned.positionId;
  }

  if (cleaned.shiftId && cleaned.shiftId.id) {
    cleaned.shift = { id: cleaned.shiftId.id };
    delete cleaned.shiftId;
  }

  if (cleaned.organizationNodeId && cleaned.organizationNodeId.id) {
    cleaned.organizationNode = { id: cleaned.organizationNodeId.id };
    delete cleaned.organizationNodeId;
  }

  // Remove nested objects with empty id
  if (cleaned.manager && !cleaned.manager.id) delete cleaned.manager;
  if (cleaned.position && !cleaned.position.id) delete cleaned.position;
  if (cleaned.shift && !cleaned.shift.id) delete cleaned.shift;
  if (cleaned.organizationNode && !cleaned.organizationNode.id)
    delete cleaned.organizationNode;

  return cleaned;
}

export function AddEmployeeModal({
  open,
  onClose,
  onSuccess,
  mode = "add",
  employee,
}: AddEmployeeModalProps) {
  const theme = useTheme();
  // Fetch options for autocompletes
  const { data: positions = [] } = useGetPositionsQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const { data: organizationNodes = [] } = useGetOrganizationnodesQuery();
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  // Setup react-hook-form
  const methods = useForm<EmployeeNV>({
    defaultValues: {
      firstName: "",
      // all other fields are optional, so you can omit or set to ''/undefined as needed
    },
    resolver: undefined, // You can add zodResolver(employeeNVSchema) if you want runtime validation
  });

  // Populate form for edit mode
  React.useEffect(() => {
    if (mode === "edit" && employee) {
      // The shared form handles string normalization, so we just reset the values
      methods.reset(employee);
    } else if (mode === "add" && open) {
      methods.reset();
    }
  }, [mode, employee, open]);

  // Helper to extract error message from RTK Query error
  const getErrorMessage = (err: unknown) => {
    if (!err) return null;
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null) {
      // RTK Query QueryError
      if ("data" in err && typeof (err as any).data === "object") {
        return (err as any).data?.message || JSON.stringify((err as any).data);
      }
      // SerializedError
      if ("message" in err) return (err as any).message;
    }
    return "Failed to add employee";
  };

  // Clear alert when modal closes
  React.useEffect(() => {
    if (!open) setAlert(null);
  }, [open]);

  const onSubmit = async (data: EmployeeNV) => {
    setAlert(null);
    try {
      const payload = cleanEmployeePayload(data);
      let response;
      if (mode === "edit" && employee?.id) {
        response = await updateEmployee({
          id: employee.id,
          data: payload,
        }).unwrap();
        setAlert({
          status: "success",
          message: "Employee updated successfully!",
        });
      } else {
        response = await createEmployee(payload).unwrap();
        setAlert({
          status: "success",
          message: "Employee added successfully!",
        });
      }
      onSuccess?.(response);
      setTimeout(() => {
        onClose();
        methods.reset();
      }, 1000);
    } catch (err) {
      setAlert({ status: "error", message: getErrorMessage(err) });
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <StyledDialogTitle>
            {mode === "edit" ? (
              <Save
                sx={{
                  color: theme.palette.section?.main || "#0b579f",
                  fontSize: 28,
                }}
              />
            ) : (
              <PersonAdd
                sx={{
                  color: theme.palette.section?.main || "#0b579f",
                  fontSize: 28,
                }}
              />
            )}
            <Box flex={1}>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: theme.palette.section?.main || "#0b579f" }}
              >
                {mode === "edit" ? "Edit Employee" : "Add New Employee"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mode === "edit"
                  ? "Update the employee information below"
                  : "Fill in the employee information below"}
              </Typography>
            </Box>
            <CloseButton onClick={onClose} size="small">
              <Close />
            </CloseButton>
          </StyledDialogTitle>
          <StyledDialogContent>
            {alert && (
              <RHFAlert status={alert.status} message={alert.message} />
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fields marked with{" "}
              <span style={{ color: theme.palette.error.main }}>*</span> are
              required.
            </Typography>
            {renderEmployeeFormFields(methods)}
          </StyledDialogContent>
          <StyledDialogActions>
            <ActionButton className="cancel" onClick={onClose}>
              Cancel
            </ActionButton>
            <ActionButton
              className="submit"
              type="submit"
              disabled={isCreating || isUpdating}
              startIcon={
                isCreating || isUpdating ? (
                  <CircularProgress size={18} />
                ) : (
                  <Save />
                )
              }
            >
              {isCreating || isUpdating
                ? mode === "edit"
                  ? "Saving..."
                  : "Adding..."
                : mode === "edit"
                ? "Save Changes"
                : "Add Employee"}
            </ActionButton>
          </StyledDialogActions>
        </form>
      </FormProvider>
    </StyledDialog>
  );
}
