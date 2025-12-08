import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { RHFAutocomplete } from "@/components/rhf-async-single-auto-complete";
import { Employee } from "@/app/(authenticated)/hr/_schemas/employees";
import { useGetPositionsQuery } from "@/app/(authenticated)/hr/_queries/positions";
import { useGetShiftsQuery } from "@/app/(authenticated)/hr/_queries/shifts";
import { useGetUsersQuery } from "@/app/users/_queries/users";
import { useGetOrganizationnodesQuery } from "@/app/dashboard/_queries/organizationNodes";
import { EmployeeNV } from "../../_schemas/employev2";

// Helper to format date string for input fields
function formatStringDateForInput(dateString: string | undefined): string {
  if (!dateString) return "";
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours())?.padStart(2, "0");
    const minutes = String(dateObj.getMinutes())?.padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    return "";
  }
}

export function renderEmployeeFormFields(methods: UseFormReturn<EmployeeNV>) {
  const { data: positions = [] } = useGetPositionsQuery();
  const { data: shifts = [] } = useGetShiftsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const { data: organizationNodes = [] } = useGetOrganizationnodesQuery();

  // Helper for 2-column layout using Box
  const TwoColBox = ({ children }: { children: React.ReactNode }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        "& > *": {
          flex: { xs: "1 1 100%", md: "1 1 calc(50% - 8px)" },
          minWidth: 0,
        },
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        py: "1rem",
      }}
    >
      {/* Personal Information Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: "8px" }}>
        <Typography variant="h6" gutterBottom color="primary">
          Personal Information
        </Typography>
        <TwoColBox>
          <TextField
            {...methods.register("firstName")}
            label="First Name *"
            margin="normal"
            fullWidth
            required
            error={!!methods.formState.errors.firstName}
            helperText={
              methods.formState.errors.firstName?.message ||
              "The employee's first name (required)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. John"
          />
          <TextField
            {...methods.register("lastName")}
            label="Last Name"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.lastName}
            helperText={
              methods.formState.errors.lastName?.message ||
              "The employee's last name (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Doe"
          />
          <TextField
            {...methods.register("grandFatherName")}
            label="Grandfather's Name (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.grandFatherName}
            helperText={
              methods.formState.errors.grandFatherName?.message ||
              "The employee's grandfather's name (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Smith"
          />
          <TextField
            {...methods.register("dateOfBirth")}
            label="Date of Birth (Optional)"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.dateOfBirth}
            helperText={
              methods.formState.errors.dateOfBirth?.message ||
              "The employee's birth date (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={formatStringDateForInput(methods.watch("dateOfBirth"))}
            onChange={(e) =>
              methods.setValue("dateOfBirth", e.target.value, {
                shouldValidate: true,
              })
            }
          />
          <TextField
            {...methods.register("gender")}
            label="Gender"
            margin="normal"
            fullWidth
            select
            error={!!methods.formState.errors.gender}
            helperText={
              methods.formState.errors.gender?.message ||
              "The employee's gender (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={methods.watch("gender") || ""}
            onChange={(e) =>
              methods.setValue("gender", e.target.value as "Male" | "Female", {
                shouldValidate: true,
              })
            }
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
          <TextField
            {...methods.register("maritalStatus")}
            label="Marital Status"
            margin="normal"
            fullWidth
            select
            error={!!methods.formState.errors.maritalStatus}
            helperText={
              methods.formState.errors.maritalStatus?.message ||
              "The employee's marital status (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={methods.watch("maritalStatus") || ""}
            onChange={(e) =>
              methods.setValue(
                "maritalStatus",
                e.target.value as "Single" | "Married" | "Divorced" | "Widowed",
                { shouldValidate: true }
              )
            }
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Married">Married</MenuItem>
            <MenuItem value="Divorced">Divorced</MenuItem>
            <MenuItem value="Widowed">Widowed</MenuItem>
          </TextField>
          <TextField
            {...methods.register("phoneNumber")}
            label="Phone Number"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.phoneNumber}
            helperText={
              methods.formState.errors.phoneNumber?.message ||
              "The employee's phone number (e.g., '+251900000000')."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. +251900000000"
          />
          <TextField
            {...methods.register("email")}
            label="Email (Optional)"
            margin="normal"
            fullWidth
            type="email"
            error={!!methods.formState.errors.email}
            helperText={
              methods.formState.errors.email?.message ||
              "The employee's email address (e.g., 'john.doe@example.com')."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. john.doe@example.com"
          />
          <TextField
            {...methods.register("language")}
            label="Language (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.language}
            helperText={
              methods.formState.errors.language?.message ||
              "The preferred language for the employee (e.g., 'EN', 'AM')."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. EN"
          />
          <TextField
            {...methods.register("nationalId")}
            label="National ID (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.nationalId}
            helperText={
              methods.formState.errors.nationalId?.message ||
              "The employee's National ID number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. NID-0012345"
          />
          <TextField
            {...methods.register("tinNumber")}
            label="TIN Number (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.tinNumber}
            helperText={
              methods.formState.errors.tinNumber?.message ||
              "The employee's Taxpayer Identification Number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. 123-456-789"
          />
          <TextField
            {...methods.register("pensionId")}
            label="Pension ID (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.pensionId}
            helperText={
              methods.formState.errors.pensionId?.message ||
              "The employee's Pension ID number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. PID-98765"
          />
        </TwoColBox>
      </Paper>

      {/* Employment Details Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: "8px" }}>
        <Typography variant="h6" gutterBottom color="primary">
          Employment Details
        </Typography>
        <TwoColBox>
          <TextField
            {...methods.register("employeeCode")}
            label="Employee Code"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.employeeCode}
            helperText={
              methods.formState.errors.employeeCode?.message ||
              "A unique identifier for the employee (e.g., 'EMP-001')."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. EMP-001"
          />
          <TextField
            {...methods.register("fileNumber")}
            label="File Number"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.fileNumber}
            helperText={
              methods.formState.errors.fileNumber?.message ||
              "The employee's file number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. FILE-001"
          />
          <TextField
            {...methods.register("jobTitle")}
            label="Job Title"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.jobTitle}
            helperText={
              methods.formState.errors.jobTitle?.message ||
              "The employee's job Title (e.g., 'Finance Officer')."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="Finance Officer"
          />
          <RHFAutocomplete<Employee, any>
            name="position.id"
            fetcher={useGetPositionsQuery}
            getOptionLabel={(option) => option.title || option.id}
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.position?.id?.message ||
              "The position assigned to the employee (optional)."
            }
            sx={{ marginY: "normal" }}
            label="Position"
            initialDisplayValue={
              methods.watch("position")?.id && positions.length
                ? positions.find(
                    (position) => position.id === methods.watch("position")?.id
                  )?.title
                : undefined
            }
          />
          <TextField
            {...methods.register("hireDate")}
            label="Hire Date"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.hireDate}
            helperText={
              methods.formState.errors.hireDate?.message ||
              "The date the employee was hired (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={formatStringDateForInput(methods.watch("hireDate"))}
            onChange={(e) =>
              methods.setValue("hireDate", e.target.value, {
                shouldValidate: true,
              })
            }
          />
          <TextField
            {...methods.register("probationEndDate")}
            label="Probation End Date (Optional)"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.probationEndDate}
            helperText={
              methods.formState.errors.probationEndDate?.message ||
              "The end date of the employee's probation period (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={
              methods.watch("probationEndDate")
                ? formatStringDateForInput(methods.watch("probationEndDate"))
                : ""
            }
            onChange={(e) =>
              methods.setValue("probationEndDate", e.target.value, {
                shouldValidate: true,
              })
            }
          />
          <TextField
            {...methods.register("employmentTerm")}
            label="Employment Term"
            margin="normal"
            fullWidth
            select
            error={!!methods.formState.errors.employmentTerm}
            helperText={
              methods.formState.errors.employmentTerm?.message ||
              "The employee's employment term (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={methods.watch("employmentTerm") || ""}
            onChange={(e) =>
              methods.setValue(
                "employmentTerm",
                e.target.value as
                  | "Permanent"
                  | "Contract"
                  | "Temporary"
                  | "Internship",
                { shouldValidate: true }
              )
            }
          >
            <MenuItem value="Permanent">Permanent</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Temporary">Temporary</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </TextField>
          <TextField
            {...methods.register("grade")}
            label="Grade"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.grade}
            helperText={
              methods.formState.errors.grade?.message ||
              "The employee's grade (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Grade 5"
          />
          <TextField
            {...methods.register("qualification")}
            label="Qualification"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.qualification}
            helperText={
              methods.formState.errors.qualification?.message ||
              "The employee's highest qualification (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Bachelor's Degree"
          />
          <TextField
            {...methods.register("companyExperience", { valueAsNumber: true })}
            label="Company Experience (Years)"
            margin="normal"
            fullWidth
            type="number"
            error={!!methods.formState.errors.companyExperience}
            helperText={
              methods.formState.errors.companyExperience?.message ||
              "Years of experience within the company (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. 5"
          />
          <TextField
            {...methods.register("previousExperience", { valueAsNumber: true })}
            label="Previous Experience (Years)"
            margin="normal"
            fullWidth
            type="number"
            error={!!methods.formState.errors.previousExperience}
            helperText={
              methods.formState.errors.previousExperience?.message ||
              "Years of experience prior to this company (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. 3"
          />
          <RHFAutocomplete<Employee, any>
            name="manager.id"
            fetcher={useGetUsersQuery}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.manager?.id?.message ||
              "The employee's direct manager (optional)."
            }
            sx={{ marginY: "normal" }}
            label="Manager (Optional)"
            initialDisplayValue={
              methods.watch("manager")?.id && users.length
                ? users.find((user) => user.id === methods.watch("manager")?.id)
                    ?.firstName +
                  " " +
                  users.find((user) => user.id === methods.watch("manager")?.id)
                    ?.lastName
                : undefined
            }
          />
          <RHFAutocomplete<Employee, any>
            name="organizationNodeId"
            fetcher={useGetOrganizationnodesQuery}
            getOptionLabel={(option) => option.name || option.id}
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.organizationNodeId?.message ||
              "The organization node the employee belongs to (optional)."
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
          <RHFAutocomplete<Employee, any>
            name="shift.id"
            fetcher={useGetShiftsQuery}
            getOptionLabel={(option) => option.name || option.id}
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.shift?.id?.message ||
              "The shift assigned to the employee (optional)."
            }
            sx={{ marginY: "normal" }}
            label="Shift"
            initialDisplayValue={
              methods.watch("shift")?.id && shifts.length
                ? shifts.find(
                    (shift) => shift.id === methods.watch("shift")?.id
                  )?.name
                : undefined
            }
          />
          <RHFAutocomplete<Employee, any>
            name="userId"
            fetcher={useGetUsersQuery}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            getOptionValue={(option) => option.id}
            helperText={
              methods.formState.errors.userId?.message ||
              "The user account associated with this employee (optional)."
            }
            sx={{ marginY: "normal" }}
            label="Associated User"
            initialDisplayValue={
              methods.watch("userId") && users.length
                ? users.find((user) => user.id === methods.watch("userId"))
                    ?.firstName +
                  " " +
                  users.find((user) => user.id === methods.watch("userId"))
                    ?.lastName
                : undefined
            }
          />
          <TextField
            {...methods.register("retirementStatus")}
            label="Retirement Status"
            margin="normal"
            fullWidth
            select
            error={!!methods.formState.errors.retirementStatus}
            helperText={
              methods.formState.errors.retirementStatus?.message ||
              "The employee's retirement status (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={methods.watch("retirementStatus") || ""}
            onChange={(e) =>
              methods.setValue(
                "retirementStatus",
                e.target.value as "Active" | "Retired",
                { shouldValidate: true }
              )
            }
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Retired">Retired</MenuItem>
          </TextField>
          <TextField
            {...methods.register("terminationDate")}
            label="Termination Date (Optional)"
            margin="normal"
            fullWidth
            type="datetime-local"
            error={!!methods.formState.errors.terminationDate}
            helperText={
              methods.formState.errors.terminationDate?.message ||
              "The employee's termination date (YYYY-MM-DDTHH:mm)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            value={
              methods.watch("terminationDate")
                ? formatStringDateForInput(methods.watch("terminationDate"))
                : ""
            }
            onChange={(e) =>
              methods.setValue("terminationDate", e.target.value, {
                shouldValidate: true,
              })
            }
          />
          <TextField
            {...methods.register("workPlace")}
            label="Work Place (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.workPlace}
            helperText={
              methods.formState.errors.workPlace?.message ||
              "The physical work location of the employee (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Main Office"
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...methods.register("isApprover")}
                  checked={methods.watch("isApprover")}
                />
              }
              label="Is Approver"
            />
            <FormControlLabel
              control={
                <Checkbox
                  {...methods.register("isHr")}
                  checked={methods.watch("isHr")}
                />
              }
              label="Is HR"
            />
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
        </TwoColBox>
      </Paper>

      {/* Other Details Section */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: "8px" }}>
        <Typography variant="h6" gutterBottom color="primary">
          Other Details
        </Typography>
        <TwoColBox>
          <TextField
            {...methods.register("plateNumber")}
            label="Plate Number (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.plateNumber}
            helperText={
              methods.formState.errors.plateNumber?.message ||
              "The employee's vehicle plate number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. ABC-123"
          />
          <TextField
            {...methods.register("poessaNumber")}
            label="POESSA Number (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.poessaNumber}
            helperText={
              methods.formState.errors.poessaNumber?.message ||
              "The employee's POESSA number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. POESSA-001"
          />
          <TextField
            {...methods.register("psssaNumber")}
            label="PSSSA Number (Optional)"
            margin="normal"
            fullWidth
            error={!!methods.formState.errors.psssaNumber}
            helperText={
              methods.formState.errors.psssaNumber?.message ||
              "The employee's PSSSA number (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. PSSSA-001"
          />
          <TextField
            {...methods.register("remark")}
            label="Remark (Optional)"
            margin="normal"
            fullWidth
            multiline
            rows={2}
            error={!!methods.formState.errors.remark}
            helperText={
              methods.formState.errors.remark?.message ||
              "Any additional remarks about the employee (optional)."
            }
            color="secondary"
            InputLabelProps={{ shrink: true }}
            placeholder="e.g. Special notes about the employee."
          />
        </TwoColBox>
      </Paper>
    </Box>
  );
}
