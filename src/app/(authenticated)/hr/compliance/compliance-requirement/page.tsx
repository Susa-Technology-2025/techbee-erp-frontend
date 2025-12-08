"use client";
import {
  Box,
  Dialog,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import ComplianceForm from "@/app/(authenticated)/hr/compliance/compliance-requirement/compliance-requirement-form";
import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useState, useMemo } from "react";
export default () => {
  const {
    data: compliances,
    isLoading,
    isError,
    isSuccess,
  } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/hr/complianceRequirements",
    noFilter: true,
  });
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState();
  const { mutate: deleteRequirement, isPending: deleteLoading } =
    useDataMutation({
      method: "DELETE",
      apiEndPoint:
        "https://api.techbee.et/api/hr/complianceRequirements" +
        `/${selectedRequirement?.id}`,
      onSuccess: (message) => {
        setOpenDeleteDialog(false);
        setSelectedRequirement(undefined);
        console.log("Requirement deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting requirement:", error);
      },
    });
  const handleCreate = () => {
    setFormMode("create");
    setSelectedRequirement(undefined);
    setOpen(true);
  };
  const handleEdit = () => {
    if (selectedRequirement) {
      setFormMode("edit");
      setOpen(true);
    }
  };
  const handleOpenDeleteDialog = () => {
    if (selectedRequirement) {
      setOpenDeleteDialog(true);
    }
  };
  const handleConfirmDelete = () => {
    if (selectedRequirement) {
      deleteRequirement();
    }
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        size: 120,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
      },
      {
        accessorKey: "compliance.name",
        header: "Compliance",
        size: 200,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 300,
      },
      {
        accessorKey: "entityType",
        header: "Entity Type",
        size: 120,
      },
      {
        accessorKey: "severity",
        header: "Severity",
        size: 100,
      },
      {
        accessorKey: "autoRemediate",
        header: "Auto Remediate",
        size: 120,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
      {
        accessorKey: "tasks.length",
        header: "Tasks",
        size: 80,
        Cell: ({ cell }) => cell.getValue() || 0,
      },
      {
        accessorKey: "audits.length",
        header: "Audits",
        size: 80,
        Cell: ({ cell }) => cell.getValue() || 0,
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data: compliances?.data || [],
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: (updater) => {
      const newSelection =
        updater instanceof Function
          ? updater(table.getState().rowSelection)
          : updater;
      const selectedRowId = Object.keys(newSelection).find(
        (key) => newSelection[key]
      );
      const selectedRow = compliances?.data?.find(
        (row) => row.id === selectedRowId
      );
      setSelectedRequirement(selectedRow);
    },
    getRowId: (row) => row.id,
    state: {
      rowSelection: selectedRequirement
        ? { [selectedRequirement.id]: true }
        : {},
      isLoading,
    },
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Create Requirement">
          <IconButton onClick={handleCreate}>
            <Add />
          </IconButton>
        </Tooltip>
        {selectedRequirement && (
          <>
            <Tooltip title="Edit Requirement">
              <IconButton onClick={handleEdit}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Requirement">
              <IconButton
                onClick={handleOpenDeleteDialog}
                disabled={deleteLoading}
                color="error"
              >
                {}
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    ),
    muiTablePaperProps: {
      sx: { width: "100%" },
    },
  });
  if (isError) {
    return (
      <Alert severity="error">Error loading compliance requirements</Alert>
    );
  }
  return (
    <>
      <MaterialReactTable table={table} />
      {}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl">
        <ComplianceForm formMode={formMode} initialData={selectedRequirement} />
      </Dialog>
      {}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
      >
        <DialogTitle color="error">
          <Delete sx={{ mr: 1 }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete the requirement:{" "}
            <Typography component="span" fontWeight="bold">
              {selectedRequirement?.name} ({selectedRequirement?.code})
            </Typography>
            ?
          </Typography>
          <Typography color="textSecondary" variant="body2" mt={1}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={deleteLoading}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            color="error"
            variant="contained"
          >
            {deleteLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
