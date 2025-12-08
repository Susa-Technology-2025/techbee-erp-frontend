// src/components/profile/ProfileSummarySkeleton.tsx
import React from "react";
import { Box, Paper, Skeleton, Grid, Divider } from "@mui/material";

export function ProfileSummarySkeleton() {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Skeleton variant="circular" width={120} height={120} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="50%" height={30} />
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Skeleton variant="text" width="40%" height={25} sx={{ mb: 2 }} />
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 4 }} />
      <Skeleton variant="text" width="30%" height={25} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
    </Paper>
  );
}
