import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Typography,
  Button,
  Box,
  TextField,
  Autocomplete,
  Popper,
} from "@mui/material";
import { FilterList, Add, Remove, Done } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { setTableState, selectTableState } from "@/lib/store/tableSlice";
import { ClearFiltersButton } from "./ClearFiltersButton";

interface ManageFiltersProps {
  tableId: string;
}

export const ManageFilters: React.FC<ManageFiltersProps> = ({ tableId }) => {
  const dispatch: AppDispatch = useDispatch();
  const tableState = useSelector((state: RootState) =>
    selectTableState(state, tableId)
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localFilters, setLocalFilters] = useState(tableState?.filters || []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLocalFilters(tableState?.filters || []);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = () => {
    setLocalFilters([...localFilters, { id: "", value: "" }]);
  };

  const handleRemoveFilter = (index: number) => {
    const updated = [...localFilters];
    updated.splice(index, 1);
    setLocalFilters(updated);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const updated = [...localFilters];
    updated[index] = { ...updated[index], [field]: value };
    setLocalFilters(updated);
  };

  const handleApplyFilters = () => {
    dispatch(setTableState({ tableId, newState: { filters: localFilters } }));
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        localFilters[index]?.id?.trim() &&
        localFilters[index]?.value?.trim()
      ) {
        handleAddFilter();
      }
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "filters-popover" : undefined;

  return (
    <>
      <IconButton onClick={handleClick} size="small" color="primary">
        <FilterList />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              p: 1,
              borderRadius: 0,
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(200, 200, 200, 0.2)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
              minWidth: 360,
              maxWidth: 460,
            },
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "text.primary",
          }}
        >
          Filters
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {localFilters.map((filter, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Autocomplete
                options={tableState?.columns || []}
                getOptionLabel={(option) => option.name}
                value={
                  tableState?.columns.find(
                    (col) => col.accessorKey === filter.id
                  ) || null
                }
                onChange={(_, newValue) =>
                  handleFilterChange(
                    index,
                    "id",
                    newValue ? newValue.accessorKey : ""
                  )
                }
                slotProps={{
                  popper: {
                    placement: "bottom-start",
                    sx: {
                      width: 300,
                    },
                  },
                  paper: {
                    sx: {
                      fontSize: "0.7rem",
                      "& .MuiAutocomplete-option": {
                        fontSize: "0.7rem",
                        py: 0.7,
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Column"
                    size="small"
                    sx={{
                      minWidth: 160,
                      flex: 1,
                      "& .MuiInputBase-input": {
                        fontSize: "0.75rem",
                        py: 0.8,
                      },
                    }}
                  />
                )}
                sx={{
                  flex: 2,
                  "& .MuiAutocomplete-input": {
                    fontSize: "0.75rem",
                  },
                  "& .MuiAutocomplete-option": {
                    fontSize: "0.75rem",
                  },
                }}
              />
              <TextField
                size="small"
                placeholder="Value"
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                sx={{
                  minWidth: 120,
                  flex: 2,
                  "& input": {
                    fontSize: "0.75rem",
                    py: 0.8,
                  },
                }}
              />
              <IconButton
                onClick={() => handleRemoveFilter(index)}
                size="small"
                color="error"
              >
                <Remove fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <IconButton onClick={handleAddFilter} size="small" color="primary">
              <Add fontSize="small" />
            </IconButton>
            <ClearFiltersButton
              tableId={tableId}
              onClick={() => setLocalFilters([])}
            />
            <IconButton
              onClick={handleApplyFilters}
              size="small"
              color="success"
            >
              <Done fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
