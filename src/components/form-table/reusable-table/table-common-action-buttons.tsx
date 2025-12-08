"use client";

import { useState, useCallback } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ReusableFormModal } from "../reusable-form/form-modal";
import { DeleteButtonWithDialog } from "./delete-button";
import TableExportButton from "./export";
import ImportButton from "./import";

export const TableCommonActions = ({
  table,
  schema,
  defaultValues,
  disabledValues,
}: any) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowCount = selectedRows.length;

  const {
    sections,
    createTitle,
    editTitle,
    apiEndPoint,
    allowDelete,
    DetailModal,
    allowCreateNew,
    allowEdit,
  } = schema.meta();
  const meta = schema.meta();

  const isSingleRow = selectedRowCount === 1 && allowEdit !== false;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Safe remover function with error handling
  const executeRemover = useCallback(() => {
    console.log("Executing schema remover...", meta.remover, "jsd:--->", typeof meta.remover);
    if (meta.remover && typeof meta.remover === 'function') {
      try {
        console.log('Executing schema remover...');
        meta.remover();
      } catch (error) {
        console.error('Error executing remover:', error);
      }
    }
  }, [meta.remover]);

  const handleCreateOpen = () => {
    console.log("Opening Create Modal");
    setIsCreateModalOpen(true);
  };

  const handleEditOpen = () => {
    console.log("Opening Edit Modal");
    setIsEditModalOpen(true);
  };

  const handleDetailOpen = () => {
    console.log("Opening Detail Modal");
    setIsDetailModalOpen(true);
  };

  const handleCreateClose = () => {
    console.log("Closing Create Modal");
    setIsCreateModalOpen(false);
    // Optionally call remover for create modal if needed
     executeRemover();
  };

  const handleEditClose = () => {
    console.log("Closing Edit Modal");
    setIsEditModalOpen(false);
    executeRemover();
  };

  const handleDetailClose = () => {
    console.log("Closing Detail Modal");
    setIsDetailModalOpen(false);
    executeRemover();
  };

  // Handle modal close with success callback (better approach)
  // const handleEditSuccess = () => {
  //   console.log("Edit operation completed successfully");
  //   handleEditClose();
  //   // You might want to refresh table data here
  //   table.resetRowSelection();
  // };

  // const handleCreateSuccess = () => {
  //   console.log("Create operation completed successfully");
  //   handleCreateClose();
  //   // Refresh table data
  // };

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start" gap={1}>
      {/* Create */}
      {(allowCreateNew !== false) && (
        <Tooltip title="Create New">
          <IconButton onClick={handleCreateOpen}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Edit */}
      {isSingleRow && (
        <Tooltip title="Edit Selected">
          <IconButton onClick={handleEditOpen}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* View (only if DetailModal is provided) */}
      {DetailModal && isSingleRow && (
        <Tooltip title="Details">
          <IconButton onClick={handleDetailOpen}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Delete */}
      {allowDelete && (
        <DeleteButtonWithDialog
          selectedRows={selectedRows}
          apiEndPoint={apiEndPoint}
          onClose={() => {
            table.resetRowSelection();
            executeRemover(); // Also call remover on delete
          }}
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <ReusableFormModal
          schema={schema}
          title={createTitle}
          formMode="create"
          sections={sections}
          onClose={handleCreateClose}
          open={isCreateModalOpen}
          defaultValues={defaultValues}
          disabledValues={disabledValues}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ReusableFormModal
          schema={schema}
          title={editTitle}
          formMode="edit"
          sections={sections}
          onClose={handleEditClose}
          open={isEditModalOpen}
          defaultValues={{ ...selectedRows[0]?.original, ...defaultValues }}
          disabledValues={disabledValues}
        />
      )}

      {/* Detail Modal */}
      {DetailModal && isDetailModalOpen && (
        <DetailModal
          row={selectedRows[0]?.original}
          handleClose={handleDetailClose}
          open={isDetailModalOpen}
        />
      )}
      
      <TableExportButton table={table} />
      <ImportButton />
    </Box>
  );
};