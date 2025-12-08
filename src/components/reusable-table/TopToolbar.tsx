import React from "react";
import { Toolbar, TextField, Box } from "@mui/material";
import { Table } from "@tanstack/react-table";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { ManageFilters } from "./ManageFilters";
import { ViewModeToggle } from "./ViewModeToggle";
import { RefetchButton } from "./RefetchButton";
import ToggleTheme from "@/theme/toogle-theme";
import GlobalSearch from "../global-search/GlobalSearch";

interface TopToolbarProps {
  table: Table<any>;
  tableId: string;
  additionalToolbarActions?: React.ReactNode;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  table,
  tableId,
  additionalToolbarActions,
}) => {
  const [inputValue, setInputValue] = React.useState(
    table.getState().globalFilter ?? ""
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      table.setGlobalFilter(inputValue);
    }
  };

  return (
    <Toolbar
      disableGutters
      sx={{
        gap: 1,
        px: 1.5,
        border: "none",
        flexWrap: "wrap",
        justifyContent: "space-between",
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
      >
        <ViewModeToggle tableId={tableId} />
        <ManageFilters tableId={tableId} />
        <ClearFiltersButton tableId={tableId} />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            minWidth: 180,
            backgroundColor: "background.paper",
            "& input": {
              fontSize: "0.8rem",
              py: 1,
            },
          }}
        />
        <RefetchButton tableId={tableId} />
      </Box>
      {additionalToolbarActions && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {additionalToolbarActions}
        </Box>
      )}
    </Toolbar>
  );
};
