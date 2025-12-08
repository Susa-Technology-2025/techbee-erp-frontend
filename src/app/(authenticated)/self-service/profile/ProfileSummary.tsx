// src/components/profile/ProfileSummary.tsx
import React from "react";
import { Box, Paper, Typography, Avatar, Grid, Divider } from "@mui/material";
import dayjs from "dayjs";

function FieldItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Grid>
  );
}

export function ProfileSummary({ data }: any) {
  if (!data) return null;

  return (
    <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Avatar
          src={data.avatarUrl}
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: "4px solid",
            borderColor: "primary.main",
          }}
          alt="Profile Avatar"
        >
          {!data.avatarUrl && "U"}
        </Avatar>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Profile Details
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" gutterBottom color="primary.main">
        Personal Information
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data.dateOfBirth && (
          <FieldItem
            label="Date of Birth"
            value={dayjs(data.dateOfBirth).format("MMMM D, YYYY")}
          />
        )}
        {data.gender && <FieldItem label="Gender" value={data.gender} />}
        {data.nationality && (
          <FieldItem label="Nationality" value={data.nationality} />
        )}
        {data.phoneNumber && (
          <FieldItem label="Phone Number" value={data.phoneNumber} />
        )}
      </Grid>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" gutterBottom color="primary.main">
        Location & Time
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data.address && (
          <Grid size={{ xs: 12 }}>
            <FieldItem label="Address" value={data.address} />
          </Grid>
        )}
        {data.timezone && <FieldItem label="Timezone" value={data.timezone} />}
      </Grid>

      {data.bio && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h6" gutterBottom color="primary.main">
            About Me
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {data.bio}
          </Typography>
        </>
      )}
    </Paper>
  );
}
