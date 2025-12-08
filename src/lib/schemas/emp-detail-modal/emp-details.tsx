"use client";

import { Box, Typography, Grid } from "@mui/material";
const DetailItem = ({ label, value }: { label: string; value: any }) => {
  const getDisplayValue = (val: any) => {
    if (typeof val === "object" && val !== null) {
      if ("name" in val) {
        return val.name;
      }
      return "N/A";
    }
    return val || "N/A";
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{getDisplayValue(value)}</Typography>
    </Box>
  );
};
export const EmploymentDetailsTab = ({ row }: { row: any }) => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Employee Code" value={row.employeeCode} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="File Number" value={row.fileNumber} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Employment Term" value={row.employmentTerm} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem
        label="Hire Date"
        value={
          row.hireDate ? new Date(row.hireDate).toLocaleDateString() : "N/A"
        }
      />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem
        label="Probation End Date"
        value={
          row.probationEndDate
            ? new Date(row.probationEndDate).toLocaleDateString()
            : "N/A"
        }
      />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Position" value={row.position} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Title" value={row.title} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Work Place" value={row.workPlace} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Company Experience" value={row.companyExperience} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Previous Experience" value={row.previousExperience} />
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <DetailItem label="Status" value={row.status} />
    </Grid>
  </Grid>
);
