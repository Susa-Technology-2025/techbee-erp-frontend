"use client";

import React from "react";
import ComplianceDashboard from "./components/dashboard";
import { Box, Typography } from "@mui/material";
import { useGetComplienceDashboardQuery } from "./_queries/complience";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

export default function Home() {
  const { data, isLoading, error } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/hr/compliances/dashboard`,
  });

  // console.log("Dashboard data:", { data, isLoading, error });

  if (isLoading) {
    return <Box sx={{ position: "relative" }}>Loading...</Box>;
  }

  // Only show error if the query actually errored
  if (error) {
    return (
      <Typography sx={{ position: "relative" }} color="error">
        Failed to load dashboard data
      </Typography>
    );
  }

  // If data is undefined (but no error), show a placeholder or loading
  if (!data) {
    return <Box sx={{ position: "relative" }}>Loading dashboard...</Box>;
  }

  return <ComplianceDashboard data={data} />;
}
