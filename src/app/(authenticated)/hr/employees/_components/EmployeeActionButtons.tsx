"use client";

import React from "react";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { 
  Delete, 
  Edit, 
  Visibility, 
  Block, 
  CheckCircle,
  Download,
  Upload
} from "@mui/icons-material";

interface EmployeeActionButtonsProps {
  selectedItems: string[];
  tableId: string;
}

export function EmployeeActionButtons({ selectedItems, tableId }: EmployeeActionButtonsProps) {
  const hasSelectedItems = selectedItems.length > 0;

  const handleView = () => {
    console.log("View selected items:", selectedItems);
    // Add your view logic here
  };

  const handleEdit = () => {
    console.log("Edit selected items:", selectedItems);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log("Delete selected items:", selectedItems);
    // Add your delete logic here
  };

  const handleActivate = () => {
    console.log("Activate selected items:", selectedItems);
    // Add your activate logic here
  };

  const handleDeactivate = () => {
    console.log("Deactivate selected items:", selectedItems);
    // Add your deactivate logic here
  };

  const handleExport = () => {
    console.log("Export selected items:", selectedItems);
    // Add your export logic here
  };

  const handleImport = () => {
    console.log("Import items");
    // Add your import logic here
  };

  return (
    <ButtonGroup variant="outlined" size="small">
      <Tooltip title="View Selected">
        <Button
          startIcon={<Visibility />}
          onClick={handleView}
          disabled={!hasSelectedItems}
        >
          View
        </Button>
      </Tooltip>
      
      <Tooltip title="Edit Selected">
        <Button
          startIcon={<Edit />}
          onClick={handleEdit}
          disabled={!hasSelectedItems}
        >
          Edit
        </Button>
      </Tooltip>
      
      <Tooltip title="Activate Selected">
        <Button
          startIcon={<CheckCircle />}
          onClick={handleActivate}
          disabled={!hasSelectedItems}
          color="success"
        >
          Activate
        </Button>
      </Tooltip>
      
      <Tooltip title="Deactivate Selected">
        <Button
          startIcon={<Block />}
          onClick={handleDeactivate}
          disabled={!hasSelectedItems}
          color="warning"
        >
          Deactivate
        </Button>
      </Tooltip>
      
      <Tooltip title="Delete Selected">
        <Button
          startIcon={<Delete />}
          onClick={handleDelete}
          disabled={!hasSelectedItems}
          color="error"
        >
          Delete
        </Button>
      </Tooltip>
      
      <Tooltip title="Export Selected">
        <Button
          startIcon={<Download />}
          onClick={handleExport}
          disabled={!hasSelectedItems}
        >
          Export
        </Button>
      </Tooltip>
      
      <Tooltip title="Import">
        <Button
          startIcon={<Upload />}
          onClick={handleImport}
        >
          Import
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
} 