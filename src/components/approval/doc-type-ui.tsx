import { Box, Typography, Alert, Grid } from "@mui/material";
import { format } from "date-fns";

// --- Payslip Generation UI Component ---

export const PayslipGenerationUI = ({ document }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Pay Period:
      </Typography>
      <Typography>{document?.payPeriod || "N/A"}</Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Start Date:
      </Typography>
      <Typography>
        {document?.startDate
          ? format(new Date(document.startDate), "PPP")
          : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        End Date:
      </Typography>
      <Typography>
        {document?.endDate ? format(new Date(document.endDate), "PPP") : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Total Employees:
      </Typography>
      <Typography>{document?.employeeCount || 0}</Typography>
    </Grid>
    <Grid size={{ xs: 12 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Notes:
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {document?.notes || "None"}
      </Typography>
    </Grid>
  </Grid>
);

// --- Attendance Correction UI Component ---

export const AttendanceCorrectionUI = ({ document }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Date:
      </Typography>
      <Typography>
        {document?.date ? format(new Date(document.date), "PPP") : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Check In:
      </Typography>
      <Typography>
        {document?.checkIn ? format(new Date(document.checkIn), "p") : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Check Out:
      </Typography>
      <Typography>
        {document?.checkOut ? format(new Date(document.checkOut), "p") : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Reason:
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {document?.reason || "Not provided"}
      </Typography>
    </Grid>
  </Grid>
);

// --- Leave Request UI Component ---

export const LeaveRequestUI = ({ document }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Leave Type:
      </Typography>
      <Typography>{document?.leaveType?.name || "N/A"}</Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Duration:
      </Typography>
      <Typography>
        {document?.duration ? `${document.duration} day(s)` : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Start Date:
      </Typography>
      <Typography>
        {document?.startDate
          ? format(new Date(document.startDate), "PPP")
          : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        End Date:
      </Typography>
      <Typography>
        {document?.endDate ? format(new Date(document.endDate), "PPP") : "N/A"}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Reason:
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {document?.reason || "Not provided"}
      </Typography>
    </Grid>
  </Grid>
);

// --- Offer Letter UI Component ---

export const OfferLetterUI = ({ document }) => {
  const candidate = document?.application?.candidate;
  const fullName = candidate
    ? `${candidate.firstName || ""} ${candidate.fatherName || ""}`.trim()
    : "N/A";

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Candidate Name:
        </Typography>
        <Typography>{fullName}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Base Salary:
        </Typography>
        <Typography>
          {document?.baseSalary?.toLocaleString() || "N/A"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Approval Status:
        </Typography>
        <Typography>{document?.approvalStatus || "N/A"}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Document Status:
        </Typography>
        <Typography>{document?.status || "N/A"}</Typography>
      </Grid>
    </Grid>
  );
};

// --- Training Plan UI Component ---

export const TrainingPlanUI = ({ document }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Plan Name:
      </Typography>
      <Typography>{document?.name || "N/A"}</Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Approval Status:
      </Typography>
      <Typography>{document?.approvalStatus || "N/A"}</Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: "bold" }}
      >
        Source Request Title:
      </Typography>
      <Typography>{document?.sourceRequest?.title || "N/A"}</Typography>
    </Grid>
  </Grid>
);

// --- Fallback UI Component ---

export const FallbackUI = ({ task }) => (
  <Box>
    <Alert severity="warning" sx={{ mb: 2 }}>
      No specific UI is available for document type: **{task.documentType}**.
      Displaying raw content.
    </Alert>
    <Typography
      variant="body2"
      component="pre"
      sx={{
        bgcolor: "grey.100",
        p: 2,
        borderRadius: 1,
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {JSON.stringify(task, null, 2)}
    </Typography>
  </Box>
);

// --- Document UI Map ---

export const documentUIMap = {
  AttendanceCorrection: AttendanceCorrectionUI,
  LeaveRequest: LeaveRequestUI,
  PayslipGeneration: PayslipGenerationUI,
  OfferLetter: OfferLetterUI,
  TrainingPlan: TrainingPlanUI,
};
