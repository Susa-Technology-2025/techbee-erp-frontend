"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableInstance,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Portal,
  CircularProgress,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import {
  Add,
  Add as AddIcon,
  Create,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import TableModal from "@/components/form-components/table-modal";
import TableForm, {
  TableFormHandle,
} from "@/components/form-components/table-form";

import DeleteConfirmationModal from "@/components/form-components/delete-confirmation-modal";

import TableExportButtons from "@/components/form-components/table-export-buttons/index";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type ReusableTableProps<T extends z.ZodTypeAny> = {
  data: z.infer<T>[];

  columns: MRT_ColumnDef<z.infer<T>, any>[];
  schema: T;

  renderFormFields?: (methods: UseFormReturn<z.infer<T>>) => React.ReactNode;
  onCreate?: (
    values: z.infer<T>
  ) => Promise<{ success: boolean; message: string }>;
  onUpdate?: (
    values: z.infer<T>
  ) => Promise<{ success: boolean; message: string }>;
  onDelete?: (id: string) => Promise<{ success: boolean; message: string }>;

  getId: (row: z.infer<T>) => string;
  tableTitle: string;
  createButtonText: string;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  readOnlyForm?: boolean;
  showExportButton?: boolean;
  ReadOnlyData?: ReactNode;
  onRowClick?: (row: { original: z.infer<T> }) => void;
  importMutation?: any;

  renderTopToolbarCustomActions?: (props: {
    table: MRT_TableInstance<z.infer<T>>;
  }) => React.ReactNode;
};

export const ReusableTable = <T extends z.ZodTypeAny>({
  data,
  columns,
  schema,
  renderFormFields,
  onCreate,
  onUpdate,
  onDelete,
  getId,
  tableTitle,
  createButtonText,
  isLoading,
  isFetching,
  isError,
  readOnlyForm,
  ReadOnlyData,
  onRowClick,
  showExportButton,
  renderTopToolbarCustomActions: customToolbarRenderer,
  importMutation,
}: ReusableTableProps<T>) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<z.infer<T> | null>(null);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [isDeletingRow, setIsDeletingRow] = useState(false);

  const createFormRef = useRef<TableFormHandle<T> | null>(null);
  const editFormRef = useRef<TableFormHandle<T> | null>(null);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  const handleCreateNewRow = useCallback(() => {
    setSelectedRow(null);
    setOpenSnackbar(false);
    setCreateModalOpen(true);
  }, []);

  const handleEditRowClick = useCallback(
    (row: z.infer<T>) => {
      setSelectedRow(row);
      setOpenSnackbar(false);
      setEditModalOpen(true);
      if (onRowClick) {
        onRowClick({ original: row });
      }
    },
    [onRowClick]
  );

  const handleCloseCreateModal = useCallback(() => {
    setCreateModalOpen(false);
    createFormRef.current?.resetForm();
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    editFormRef.current?.resetForm();
  }, []);

  const handleOpenDeleteConfirmModal = useCallback((rowId: string) => {
    setIdToDelete(rowId);
    setOpenSnackbar(false);
    setDeleteConfirmModalOpen(true);
  }, []);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setDeleteConfirmModalOpen(false);
    setIdToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!idToDelete) return;
    setIsDeletingRow(true);
    setOpenSnackbar(false);

    try {
      const result = await onDelete!(idToDelete);
      if (result.success) {
        setSnackbarSeverity("success");
        setSnackbarMessage(result.message);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(result.message);
      }
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsDeletingRow(false);
      handleCloseDeleteConfirmModal();
      setOpenSnackbar(true);
    }
  }, [idToDelete, onDelete, handleCloseDeleteConfirmModal]);

  const handleCreateSubmit = useCallback(
    async (values: z.infer<T>) => {
      setIsSubmittingCreate(true);
      setOpenSnackbar(false);
      try {
        const result = await onCreate!(values);
        if (result.success) {
          setSnackbarSeverity("success");
          setSnackbarMessage(result.message);
          setOpenSnackbar(true);
          handleCloseCreateModal(); // Close only on success
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage(result.message);
          setOpenSnackbar(true);
          // Do not close modal on failure, let user correct
        }
      } catch (error: any) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || "An unexpected error occurred.");
        setOpenSnackbar(true);
        // Do not close modal on error, let user correct
      } finally {
        setIsSubmittingCreate(false);
      }
    },
    [onCreate, handleCloseCreateModal]
  );

  const handleUpdateSubmit = useCallback(
    async (values: z.infer<T>) => {
      setIsSubmittingUpdate(true);
      setOpenSnackbar(false);
      try {
        const result = await onUpdate!(values);
        if (result.success) {
          setSnackbarSeverity("success");
          setSnackbarMessage(result.message);
          setOpenSnackbar(true);
          handleCloseEditModal(); // Close only on success
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage(result.message);
          setOpenSnackbar(true);
          // Do not close modal on failure, let user correct
        }
      } catch (error: any) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || "An unexpected error occurred.");
        setOpenSnackbar(true);
        // Do not close modal on error, let user correct
      } finally {
        setIsSubmittingUpdate(false);
      }
    },
    [onUpdate, handleCloseEditModal]
  );

  const defaultTopToolbarActions = useMemo(() => {
    return ({
      table: currentTable,
    }: {
      table: MRT_TableInstance<z.infer<T>>;
    }) => (
      <>
        {!readOnlyForm && (
          <Tooltip title={createButtonText}>
            <IconButton onClick={handleCreateNewRow}>
              <Add sx={{ fontWeight: "bolder" }} />
            </IconButton>
          </Tooltip>
        )}
        {!showExportButton && (
          <TableExportButtons
            table={currentTable}
            columns={columns}
            tableTitle={tableTitle}
            schema={schema}
            mutation={importMutation}
          />
        )}
      </>
    );
  }, [handleCreateNewRow, createButtonText, columns, tableTitle, readOnlyForm]);

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading: isLoading,
      isSaving: isFetching,
      showAlertBanner: isError,
      showProgressBars: false,
    },
    enableRowActions: !readOnlyForm,
    enableRowSelection: true,
    enableColumnPinning: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",

    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (event.target instanceof Element && event.target.closest("button")) {
          return;
        }
        handleEditRowClick(row.original);
      },
      sx: {
        cursor: "pointer",
      },
    }),
    renderTopToolbarCustomActions: ({ table: currentTable }) => (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexGrow: 1,
          justifyContent: "space-between",
          m: 0,
          p: 0,
        }}
      >
        {customToolbarRenderer &&
          customToolbarRenderer({ table: currentTable })}
        <Box sx={{ m: 0, mr: -1, p: 0 }}>
          {defaultTopToolbarActions({ table: currentTable })}
        </Box>
      </Box>
    ),
    renderRowActions: ({ row }) => {
      return (
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={(event) => {
              event.stopPropagation();
              handleOpenDeleteConfirmModal(getId(row.original));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      );
    },
    getRowId: getId,
    initialState: {
      columnPinning: { left: ["mrt-row-actions"] },
      density: "compact",
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20, 50, 100],
      showFirstButton: true,
      showLastButton: true,
    },
    muiTableContainerProps: {
      sx: {
        flex: "1 1 auto",
        maxHeight: "70vh",
      },
    },

    renderEmptyRowsFallback: ({ table: currentTable }) => {
      if (
        currentTable.getState().isLoading ||
        currentTable.getState().isSaving
      ) {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              minHeight: "150px",
            }}
          >
            <CircularProgress />
          </Box>
        );
      }
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          No data available
        </Box>
      );
    },
  });

  return (
    <>
      {createModalOpen && (
        <TableModal
          title={
            readOnlyForm ? `${tableTitle} Details` : `Create ${tableTitle}`
          }
          open={createModalOpen}
          onClose={handleCloseCreateModal}
          actions={
            <>
              <Button
                onClick={handleCloseCreateModal}
                disabled={isSubmittingCreate}
              >
                Cancel
              </Button>
              {!readOnlyForm && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => createFormRef.current?.triggerSubmit()}
                  disabled={isSubmittingCreate}
                  startIcon={
                    isSubmittingCreate ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  Create
                </Button>
              )}
            </>
          }
        >
          {readOnlyForm ? (
            ReadOnlyData
          ) : (
            <TableForm
              ref={createFormRef}
              schema={schema}
              onSubmit={handleCreateSubmit}
            >
              {renderFormFields}
            </TableForm>
          )}
        </TableModal>
      )}

      {editModalOpen && (
        <TableModal
          title={readOnlyForm ? `${tableTitle} Details` : `Edit ${tableTitle}`}
          open={editModalOpen}
          onClose={handleCloseEditModal}
          actions={
            <>
              <Button
                onClick={handleCloseEditModal}
                disabled={isSubmittingUpdate}
              >
                Cancel
              </Button>
              {!readOnlyForm && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => editFormRef.current?.triggerSubmit()}
                  disabled={isSubmittingUpdate}
                  startIcon={
                    isSubmittingUpdate ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  Update
                </Button>
              )}
            </>
          }
        >
          {readOnlyForm ? (
            ReadOnlyData
          ) : (
            <TableForm
              ref={editFormRef}
              schema={schema}
              onSubmit={handleUpdateSubmit}
              defaultValues={selectedRow || undefined}
            >
              {renderFormFields}
            </TableForm>
          )}
        </TableModal>
      )}

      {deleteConfirmModalOpen && (
        <DeleteConfirmationModal
          open={deleteConfirmModalOpen}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeletingRow}
          itemDescription={`this ${tableTitle}`}
        />
      )}

      {table.getState().isFullScreen ? (
        <Portal>
          <MaterialReactTable table={table} />
        </Portal>
      ) : (
        <MaterialReactTable table={table} />
      )}

      <Portal>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ zIndex: 2000 }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};
