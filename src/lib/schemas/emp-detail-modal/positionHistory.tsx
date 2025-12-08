"use client";

import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";

import { useDataQuery } from "@/lib/tanstack/useDataQuery";

export const PositionHistoryDetailsTab = ({ row }) => {
  const { data, isPending, isSuccess, isError } = useDataQuery({
    apiEndPoint: `https://api.techbee.et/api/hr/employees/${row.id}/positionHistories`,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="body2" color="error" align="center">
        Failed to load position history.
      </Typography>
    );
  }

  const positionData = data?.data;
  const hasHistory = positionData && positionData.length > 0;
  const latestPosition = hasHistory
    ? positionData.find((item) => item.isCurrent) || positionData[0]
    : null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Position History
      </Typography>

      {!hasHistory ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          No position history available.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="position history table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Level</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positionData.map((history, index) => (
                <TableRow
                  key={history.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: history.isCurrent
                      ? "action.hover"
                      : "inherit",
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {history?.position?.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {history?.position?.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{history?.position?.level}</TableCell>
                  <TableCell>{formatDate(history?.startDate)}</TableCell>
                  <TableCell>{formatDate(history?.endDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={history.isCurrent ? "Current" : "Previous"}
                      size="small"
                      color={history.isCurrent ? "primary" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {latestPosition && (
        <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
            Position Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Position Title
              </Typography>
              <Typography variant="body2">
                {latestPosition.position.title}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Position Code
              </Typography>
              <Typography variant="body2">
                {latestPosition.position.code}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Level
              </Typography>
              <Typography variant="body2">
                {latestPosition.position.level}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body2">
                {formatDate(latestPosition.startDate)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body2">
                {latestPosition.position.isActive ? "Active" : "Inactive"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};
