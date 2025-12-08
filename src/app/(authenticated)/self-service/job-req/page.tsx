"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { session } from "@/lib/auth/session";
import { useEffect, useState } from "react";
import { JobRequisitionCreateInputSchema } from "@/lib/schemas/recruitment/job-req";
import { Skeleton, Box } from "@mui/material";

export default function LeaveManagementDashboard() {
  const [userId, setUserId] = useState<string>("");
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    session()
      .then((user) => {
        setUserId(user.id);
      })
      .catch(() => {
        setError("Failed to load session data.");
      })
      .finally(() => {
        setSessionLoaded(true);
      });
  }, []);

  // Show skeleton while session is loading
  if (!sessionLoaded) {
    return (
      <Box sx={{ width: "100%" }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={60}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  // Show error message if session loading failed
  if (error) {
    return <Box sx={{ p: 2, color: "error.main" }}>{error}</Box>;
  }

  // Only render the table when session is loaded and we have a userId
  return (
    <MaterialTableWrapper
      endpoint={`https://api.techbee.et/api/hr/jobRequisitions?where[createdByUserId]=${userId}`}
      schema={JobRequisitionCreateInputSchema}
    />
  );
}
