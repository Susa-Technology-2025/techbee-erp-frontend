"use client";
import { LandingPageSchema } from "@/lib/schemas/core/landing-page";
import React, { useState, lazy, Suspense, useMemo } from "react";
import {
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { z } from "zod";
import { ReusableFormDrawer } from "@/components/ReusableFormDrawer";
import { useDataQuery, useDataMutation } from "@/lib/tanstack/useDataQuery";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
const LazyLandingPageFields = lazy(() =>
  import("./LandingPageFields").then((module) => ({
    default: module.LandingPageFields,
  }))
);
const LazyLandingPageView = lazy(() =>
  import("./LandingPageView").then((module) => ({
    default: module.LandingPageView,
  }))
);
export type LandingPageFormValues = z.infer<typeof LandingPageSchema> & {
  id?: string | number;
};
export const LANDING_PAGE_API_ENDPOINT =
  "https://api.techbee.et/api/core/landingPages";
export default function LandingPagesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [selectedPage, setSelectedPage] = useState<
    LandingPageFormValues | undefined
  >();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<
    LandingPageFormValues | undefined
  >();
  const {
    data: landingPagesQuery,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useDataQuery({
    apiEndPoint: LANDING_PAGE_API_ENDPOINT,
    noFilter: true,
    fetchWithoutRefresh: true,
  });
  const {
    mutate: deleteLandingPage,
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    error: deleteError,
  } = useDataMutation({
    method: "DELETE",
    apiEndPoint: `${LANDING_PAGE_API_ENDPOINT}/${pageToDelete?.id || ""}`,
    tenantCode: pageToDelete?.code,
    fetchWithoutRefresh: true,
    onSuccess: () => {
      refetch();
    },
    onError: () => {},
  });
  const landingPages: LandingPageFormValues[] = landingPagesQuery?.data || [];
  const handlePageAction = (
    page: LandingPageFormValues,
    actionMode: "edit" | "view"
  ) => {
    const initialData: LandingPageFormValues = {
      ...page,
      announcements: page.announcements || [],
      insights: page.insights || [],
      media: page.media || [],
      tutorials: page.tutorials || [],
    };
    setSelectedPage(initialData);
    setMode(actionMode);
    setDrawerOpen(true);
  };
  const handleCreateNew = () => {
    const newPageDefault: LandingPageFormValues = {
      name: "",
      code: "",
      priority: 0,
      isPublished: false,
      headline: "",
      description: "",
      logo: "",

      id: undefined,
    };
    setSelectedPage(newPageDefault);
    setMode("create");
    setDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPage(undefined);
  };
  const handleDeleteOpen = (page: LandingPageFormValues) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
    setPageToDelete(undefined);
  };
  const handleDeleteConfirm = () => {
    if (pageToDelete?.id) {
      deleteLandingPage({});
    }
  };
  const fallback = (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
  const columns = useMemo<MRT_ColumnDef<LandingPageFormValues>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Page Name",
        size: 200,
        Cell: ({ cell, row }) => (
          <Box>
            <Typography variant="body1" fontWeight="600">
              {cell.getValue<string>()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.code}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "isPublished",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => {
          const isPublished = cell.getValue<boolean>();
          return (
            <Chip
              label={isPublished ? "Published" : "Draft"}
              size="small"
              color={isPublished ? "success" : "default"}
              variant={isPublished ? "filled" : "outlined"}
            />
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 80,
      },
    ],
    []
  );
  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mt: 4,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <MaterialReactTable
            columns={columns}
            data={landingPages}
            state={{
              isLoading: isLoading,
              showAlertBanner: isError,
              isSaving: isDeleting,
            }}
            renderTopToolbarCustomActions={({ table }) => (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                  boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4)",
                  },
                }}
              >
                Create New Page
              </Button>
            )}
            renderRowActions={({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <IconButton
                  onClick={() => handlePageAction(row.original, "view")}
                  sx={{ color: "info.main" }}
                  title="View"
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlePageAction(row.original, "edit")}
                  sx={{ color: "secondary.main" }}
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteOpen(row.original)}
                  disabled={isDeleting}
                  sx={{ color: "error.main" }}
                  title="Delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            renderToolbarAlertBanner={({ isError, error }) =>
              isError ? (
                <Alert
                  severity="error"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  }
                >
                  Failed to load landing pages: {(error as Error).message}
                </Alert>
              ) : null
            }
            renderEmptyRowsFallback={() => (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No landing pages found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get started by creating your first landing page
                </Typography>
              </Box>
            )}
            enableRowActions
            positionActionsColumn="last"
            enableColumnOrdering
            initialState={{ density: "compact" }}
            muiTablePaperProps={{ elevation: 0 }}
            muiTableContainerProps={{ sx: { borderRadius: 2 } }}
          />
        </CardContent>
      </Card>
      {}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {isDeleteSuccess ? "Deletion Complete" : "Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          {isDeleteSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Landing page **{pageToDelete?.name}** deleted successfully!
            </Alert>
          )}
          {isDeleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to delete landing page:{" "}
              {(deleteError as Error)?.message || "An unknown error occurred."}
            </Alert>
          )}
          {!(isDeleteSuccess || isDeleteError) && (
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete the landing page: **
              {pageToDelete?.name}**? This action cannot be undone.
            </DialogContentText>
          )}
          {isDeleting && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Deleting...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            color="primary"
            disabled={isDeleting}
          >
            {isDeleteSuccess || isDeleteError ? "Close" : "Cancel"}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting || isDeleteSuccess || isDeleteError}
            startIcon={isDeleting ? null : <DeleteIcon />}
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Suspense fallback={fallback}>
        <ReusableFormDrawer<LandingPageFormValues>
          open={drawerOpen}
          onClose={handleCloseDrawer}
          formMode={mode}
          apiEndPoint={LANDING_PAGE_API_ENDPOINT}
          zodSchema={LandingPageSchema}
          fieldsComponent={<LazyLandingPageFields />}
          createButtonName="Save New Page"
          updateButtonName="Update Page"
          viewComponent={LazyLandingPageView}
          initialData={selectedPage}
          viewData={selectedPage}
        />
      </Suspense>
    </Box>
  );
}
