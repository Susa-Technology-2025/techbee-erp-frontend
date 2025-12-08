"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { leaveRequestSchema } from "@/lib/schemas/leave/main";
import { session } from "@/lib/auth/session";
import { useEffect, useState } from "react";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";
import {
  EventAvailable,
  EventBusy,
  PendingActions,
  BeachAccess,
  Refresh,
} from "@mui/icons-material";

interface LeaveBalance {
  leaveType: string;
  carryForwardDays: number;
  currentBalance: number;
  daysTaken: number;
  openingBalance: number;
  periodYear: number;
  active: boolean;
  notes?: string;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  daysRequested: number;
}

export default function LeaveManagementDashboard() {
  const [userId, setUserId] = useState<string>("");
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: leaveBalances = [],
    isLoading: balancesLoading,
    isError: balancesError,
    refetch: refetchBalances,
  } = useDataQuery<LeaveBalance[]>({
    apiEndPoint: userId
      ? `https://api.techbee.et/api/hr/employees/${userId}/leaveBalances`
      : "",
  });

  useEffect(() => {
    session()
      .then((user) => {
        if (user && user.employeeId) {
          setUserId(user.employeeId);
        } else {
          setError("Please link an active employee to this user");
        }
      })
      .catch(() => {
        setError("Failed to load session data.");
      })
      .finally(() => {
        setSessionLoaded(true);
      });
  }, []);

  const getLeaveIcon = (leaveType: string) => {
    switch (leaveType.toLowerCase()) {
      case "annual":
        return <BeachAccess />;
      case "sick":
        return <EventBusy />;
      case "maternity":
        return <EventAvailable />;
      default:
        return <PendingActions />;
    }
  };

  const getLeaveColor = (leaveType: string) => {
    switch (leaveType.toLowerCase()) {
      case "annual":
        return "#4caf50";
      case "sick":
        return "#ff9800";
      case "maternity":
        return "#e91e63";
      default:
        return "#9c27b0";
    }
  };

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!sessionLoaded) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Skeleton variant="rectangular" height={300} sx={{ mt: 5 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
        Your Leave Balances
      </Typography>

      {balancesError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load leave balances.{" "}
          <Button onClick={() => refetchBalances()}>Try again</Button>
        </Alert>
      ) : null}

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {balancesLoading ? (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          </>
        ) : leaveBalances.length > 0 ? (
          leaveBalances.map((balance, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  borderLeft: `4px solid ${getLeaveColor(balance.leaveType)}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                      color: getLeaveColor(balance.leaveType),
                    }}
                  >
                    {getLeaveIcon(balance.leaveType)}
                  </Box>

                  <Typography variant="h6" component="h3" gutterBottom>
                    {balance.leaveType} Leave
                  </Typography>

                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      color:
                        balance.currentBalance > 0
                          ? "success.main"
                          : "error.main",
                      my: 1,
                    }}
                  >
                    {balance.currentBalance}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Days Available
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">
                      Opening: {balance.openingBalance}
                    </Typography>
                    <Typography variant="body2">
                      Used: {balance.daysTaken}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      width: "100%",
                      bgcolor: "grey.200",
                      borderRadius: 5,
                    }}
                  >
                    <Box
                      sx={{
                        height: 8,
                        bgcolor: getLeaveColor(balance.leaveType),
                        borderRadius: 5,
                        width: `${
                          (balance.daysTaken / balance.openingBalance) * 100
                        }%`,
                        transition: "width 0.5s ease-in-out",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">No leave balances found.</Alert>
          </Grid>
        )}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        {userId ? (
          <MaterialTableWrapper
            endpoint={`https://api.techbee.et/api/hr/employees/${userId}/leaveRequests`}
            schema={leaveRequestSchema}
            defaultValues={{ employee: { id: userId } }}
            disabledValues={{ "employee.id": true }}
            CustomTopToolbarActions={() => (
              <Box>
                <Typography variant="h6">Request History</Typography>
              </Box>
            )}
          />
        ) : (
          <Alert severity="error">
            Unable to load leave requests. Please ensure your employee profile
            is properly linked.
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
