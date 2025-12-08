"use client";

import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import {
  type MRT_TableInstance,
  type MRT_ColumnDef,
} from "material-react-table";
import { z, ZodSchema } from "zod";
import ExportDialog from "./export-dialogue";
import DataImporter from "./import-data/DataImporter";

type TableExportButtonsProps<T extends z.ZodTypeAny> = {
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  tableTitle: string;
  schema: ZodSchema<z.infer<T>>;
  columnsToInclude?: (keyof z.infer<T>)[];
  mutation?: any;
};

const TableExportButtons = <T extends z.ZodTypeAny>({
  table,
  columns,
  tableTitle,
  schema,
  columnsToInclude,
  mutation,
}: TableExportButtonsProps<T>) => {
  const [openExportDialog, setOpenExportDialog] = useState(false);

  const handleOpenExportDialog = () => {
    setOpenExportDialog(true);
  };

  const handleCloseExportDialog = () => {
    setOpenExportDialog(false);
  };

  if (!columns || columns.length === 0) {
    return null;
  }

  return (
    <>
      <Tooltip title={"Export Data"}>
        <IconButton onClick={handleOpenExportDialog}>
          <FileDownloadIcon />
        </IconButton>
      </Tooltip>

      {mutation && (
        <DataImporter
          table={table}
          columns={columns}
          schema={schema}
          mutation={mutation}
        />
      )}

      <ExportDialog
        open={openExportDialog}
        onClose={handleCloseExportDialog}
        table={table}
        columns={columns}
        tableTitle={tableTitle}
      />
    </>
  );
};

export default TableExportButtons;
