"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ScoreIcon from "@mui/icons-material/Score";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

const AppraisalEvaluationsTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const {
    data: { data } = [],
    isLoading,
    isSuccess,
  } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/hr/appraisalEvaluations",
  });

  const handleOpen = (row) => {
    setSelectedRow(row.original);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 150,
      },
      {
        accessorFn: (row) =>
          `${row.evaluatorEmployee.firstName} ${row.evaluatorEmployee.fatherName}`,
        header: "Evaluator Name",
        size: 200,
      },
      {
        accessorFn: (row) => row.evaluatorEmployee.position.title,
        header: "Position",
        size: 150,
      },
      {
        accessorKey: "evaluationType",
        header: "Type",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
      },
      {
        accessorKey: "finalScore",
        header: "Final Score",
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue() !== null ? cell.getValue() : "N/A",
      },
      {
        accessorKey: "result",
        header: "Result",
        size: 150,
        Cell: ({ cell }) => cell.getValue() || "N/A",
      },
      {
        accessorFn: (row) => new Date(row.createdAt).toLocaleDateString(),
        header: "Created At",
        size: 120,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: {
      isLoading,
    },
    initialState: {
      columnVisibility: {
        id: false,
      },
      density: "compact",
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleOpen(row),
      sx: {
        cursor: "pointer",
      },
    }),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isSuccess || !data) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
        No data available.
      </Box>
    );
  }

  return (
    <>
      <MaterialReactTable table={table} />
      {selectedRow && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              Evaluation Details
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" gutterBottom>
              Evaluation Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Evaluator:
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {`${selectedRow.evaluatorEmployee.firstName} ${selectedRow.evaluatorEmployee.fatherName}`}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <HourglassTopIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Status:
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {selectedRow.status}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <ScoreIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Final Score:
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {selectedRow.finalScore !== null
                      ? selectedRow.finalScore
                      : "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Result:
                  </Typography>
                  <Typography variant="body1" ml={1}>
                    {selectedRow.result || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom mt={3}>
              Plan Information
            </Typography>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarMonthIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Plan Name:
                </Typography>
                <Typography variant="body1" ml={1}>
                  {selectedRow.plan?.name || "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Period:
                </Typography>
                <Typography variant="body1" ml={1}>
                  {selectedRow.plan?.periodStart && selectedRow.plan?.periodEnd
                    ? `${new Date(
                        selectedRow.plan.periodStart
                      ).toLocaleDateString()} - ${new Date(
                        selectedRow.plan.periodEnd
                      ).toLocaleDateString()}`
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Comments:
                </Typography>
                <Typography variant="body1" ml={1}>
                  {selectedRow.comments || "No comments."}
                </Typography>
              </Box>
            </Grid>
          </DialogContent>
          <DialogActions>
            <IconButton onClick={handleClose} color="primary">
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AppraisalEvaluationsTable;
