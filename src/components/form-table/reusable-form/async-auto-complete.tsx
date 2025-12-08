"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Paper,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  TextField,
  Tooltip,
  Zoom,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import { type FieldLevelMeta } from "@/lib/schemas/types";
import { ReusableFormModal } from "./form-modal";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { useDispatch } from "react-redux";
import { setPosition } from "@/lib/store/position";
import { isArray } from "mathjs";

import { List as VirtList } from "react-virtualized";
import { useFormContext } from "react-hook-form";

type AutocompleteFieldProps = {
  value: any;
  onChange: (val: any) => void;
  helperText: string | undefined;
  meta: FieldLevelMeta;
  error: boolean;
  label: string;
  required: boolean;
  disabled: boolean;
};

type ApiResponse = {
  data: any[];
  meta: {
    totalRowCount: number;
  };
};

type SelectionDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: any[]) => void;
  options: any[];
  selectedValues: any[];
  autoComplete: any;
  title: string;
  isLoading?: boolean;
  onCreateNew?: () => void;
};

const LIST_ROW_HEIGHT = 50;
const LIST_HEIGHT = 300;

function SelectionDialog({
  open,
  onClose,
  onConfirm,
  options,
  selectedValues,
  autoComplete,
  title,
  isLoading = false,
  onCreateNew,
}: SelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<any[]>(selectedValues);
  const [filteredOptions, setFilteredOptions] = useState<any[]>(options);

  useEffect(() => {
    if (open) {
      setTempSelected(selectedValues);
    }
  }, [open, selectedValues]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options.filter((opt) => !opt.__createNew));
    } else {
      const filtered = options.filter(
        (opt) =>
          !opt.__createNew &&
          autoComplete
            .getOptionsLabel(opt)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options, autoComplete]);

  const handleToggleSelection = (option: any) => {
    const optionValue = autoComplete.getOptionsValue(option);
    const isCurrentlySelected = tempSelected.some(
      (item) => autoComplete.getOptionsValue(item) === optionValue
    );

    if (isCurrentlySelected) {
      setTempSelected(
        tempSelected.filter(
          (item) => autoComplete.getOptionsValue(item) !== optionValue
        )
      );
    } else {
      setTempSelected([...tempSelected, option]);
    }
  };

  const handleSelectAll = () => {
    if (tempSelected.length === filteredOptions.length) {
      setTempSelected([]);
    } else {
      setTempSelected(filteredOptions);
    }
  };

  const isSelected = (option: any) => {
    const optionValue = autoComplete.getOptionsValue(option);
    return tempSelected.some(
      (item) => autoComplete.getOptionsValue(item) === optionValue
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  const selectedCount = tempSelected.length;
  const totalCount = filteredOptions.length;

  const handleCreateNewClick = () => {
    if (onCreateNew) {
      onCreateNew();
      onClose();
    }
  };

  const rowRenderer = ({ index, key, style }: any) => {
    const option = filteredOptions[index];
    const isItemSelected = isSelected(option);

    return (
      <div key={key} style={style}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleToggleSelection(option)}
            selected={isItemSelected}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              },
              borderBottom: "1px solid",
              borderBottomColor: "divider",
              height: LIST_ROW_HEIGHT,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Checkbox
                edge="start"
                checked={isItemSelected}
                tabIndex={-1}
                disableRipple
                color="primary"
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1">
                  {autoComplete.getOptionsLabel(option)}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "60vh",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Header with stats and search */}
        <Paper sx={{ p: 2, mb: 1, borderRadius: 0 }} elevation={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              {selectedCount} of {totalCount} selected
            </Typography>
            <Button
              onClick={handleSelectAll}
              variant="outlined"
              size="small"
              disabled={filteredOptions.length === 0}
            >
              {tempSelected.length === filteredOptions.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Paper>

        {/* Selected items preview */}
        {selectedCount > 0 && (
          <Paper sx={{ p: 2, mb: 1, borderRadius: 0 }} elevation={0}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              Selected Items:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {tempSelected.slice(0, 5).map((item) => (
                <Chip
                  key={autoComplete.getOptionsValue(item)}
                  label={autoComplete.getOptionsLabel(item)}
                  size="small"
                  onDelete={() => handleToggleSelection(item)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {selectedCount > 5 && (
                <Chip
                  label={`+${selectedCount - 5} more`}
                  size="small"
                  color="primary"
                />
              )}
            </Box>
          </Paper>
        )}

        {/* Options list: Using react-virtualized */}
        <Paper
          sx={{
            borderRadius: 0,
            flex: 1,
            maxHeight: LIST_HEIGHT,
            overflow: "hidden",
          }}
          elevation={0}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredOptions.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <Typography color="text.secondary">
                {searchTerm ? "No matches found" : "No options available"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: LIST_HEIGHT, width: "100%" }}>
              <VirtList
                width={560}
                height={LIST_HEIGHT}
                rowCount={filteredOptions.length}
                rowHeight={LIST_ROW_HEIGHT}
                rowRenderer={rowRenderer}
                style={{ outline: "none" }}
              />
            </Box>
          )}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "space-between" }}>
        {autoComplete.allowCreateNew && onCreateNew && (
          <Button
            onClick={handleCreateNewClick}
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
          >
            Create New
          </Button>
        )}
        <Box>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            sx={{
              ml: 1,
              background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
              fontWeight: "bold",
            }}
          >
            Confirm ({selectedCount})
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export function AsyncAutocomplete({
  value,
  onChange,
  meta,
  helperText,
  error,
  label,
  disabled,
  required,
}: AutocompleteFieldProps) {
  const { autoComplete } = meta.formRelated;
  const { watch } = useFormContext();
  const dependsOnValue = meta.formRelated.conditional?.dependsOn
    ? watch(meta.formRelated.conditional.dependsOn)
    : undefined;
  const endPoint = autoComplete?.dynamicGetEndPoint
    ? autoComplete?.dynamicGetEndPoint(dependsOnValue)
    : autoComplete?.getEndpoint;
  console.log("Dependent Endpoint------", endPoint);

  if (!autoComplete || !autoComplete.async || !autoComplete.getEndpoint) {
    return <Box />;
  }

  const { data, isLoading, isSuccess } = useDataQuery<ApiResponse>({
    apiEndPoint: endPoint!,
    enabled: Boolean(endPoint),
    noFilter: true,
  });

  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const options = useMemo(() => {
    if (data && Array.isArray(data.data ?? data)) {
      const baseOptions = data.data ?? data;
      const finalOptions = autoComplete.allowCreateNew
        ? [{ __createNew: true, label: "+ Create New" }, ...baseOptions]
        : baseOptions;

      return finalOptions;
    }
    return [];
  }, [data, autoComplete.allowCreateNew]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (meta.formRelated.autoComplete?.inputForStaticAsync) {
      dispatch(setPosition(data?.data.find((val) => val.id === value)));
    }
  }, [isSuccess, dispatch, data, value]);

  const schema = autoComplete?.createSchema;
  const { sections, createTitle } = (schema?.meta?.() as any) || {};

  const mappedValue = useMemo(() => {
    if (!value) return autoComplete.multiple ? [] : null;

    if (autoComplete.multiple && isArray(value)) {
      return (value as any[])
        .map((v) =>
          options.find(
            (o: any) => !o.__createNew && autoComplete.getOptionsValue(o) === v
          )
        )
        .filter(Boolean);
    } else {
      return (
        options.find(
          (o: any) =>
            !o.__createNew && autoComplete.getOptionsValue(o) === value
        ) || null
      );
    }
  }, [value, options, autoComplete]);

  const handleDialogSelection = (selectedOptions: any[]) => {
    const selectedValues = selectedOptions.map((opt) =>
      autoComplete.getOptionsValue(opt)
    );
    onChange(selectedValues);
  };

  const handleOpenSelectionDialog = () => {
    if (!disabled) {
      setIsSelectionDialogOpen(true);
    }
  };

  const handleCreateOpen = () => {
    setIsCreateModalOpen(true);
  };

  const selectedCount = autoComplete.multiple
    ? (mappedValue as any[]).length
    : 0;

  const isMultiple = autoComplete.multiple;

  const showCustomDisplay = isMultiple && !isLoading;

  const SelectedBadgeDisplay = (
    <Tooltip title="Open selection dialog">
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={handleOpenSelectionDialog}
      >
        <Chip
          label={`${selectedCount} selected`}
          size="small"
          color="primary"
          variant="filled"
          sx={{
            fontSize: "0.8rem",
            height: 24,
          }}
        />
      </Box>
    </Tooltip>
  );

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* If multiple, use the custom TextField structure to show the label, helper text, and error state. */}
        {showCustomDisplay ? (
          <TextField
            fullWidth
            onClick={handleOpenSelectionDialog}
            sx={{ cursor: "pointer" }}
            label={label}
            required={required}
            error={error}
            helperText={helperText}
            variant="standard"
            placeholder={meta.formRelated.placeholder}
            disabled={disabled}
            value={""}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {SelectedBadgeDisplay}
                  </InputAdornment>
                ),
              },
            }}
          />
        ) : (
          <Autocomplete
            multiple={isMultiple}
            options={options}
            disabled={disabled}
            loading={isLoading}
            getOptionLabel={(option: any) => {
              if (option.__createNew) {
                return option.label || "";
              }
              const label = autoComplete.getOptionsLabel(option);
              return label || "";
            }}
            isOptionEqualToValue={(option, val) =>
              option.__createNew
                ? false
                : autoComplete.getOptionsValue(option) ===
                  autoComplete.getOptionsValue(val)
            }
            value={mappedValue}
            onChange={(_, newValue) => {
              if (isMultiple) {
                if (newValue?.some((v: any) => v?.__createNew)) {
                  handleCreateOpen();
                }

                if (!newValue?.some((v: any) => v?.__createNew)) {
                  const newValues = (newValue as any[]).map((v) =>
                    autoComplete.getOptionsValue(v)
                  );
                  onChange(newValues);
                }
              } else {
                if (newValue?.__createNew) return handleCreateOpen();
                onChange(
                  newValue ? autoComplete.getOptionsValue(newValue) : null
                );
              }
            }}
            disableCloseOnSelect={isMultiple}
            renderTags={isMultiple ? () => [] : undefined}
            renderOption={(props, option, { selected }) => {
              if (option.__createNew) {
                return (
                  <li
                    {...props}
                    key="__createNew"
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateOpen();
                    }}
                  >
                    <Typography color="primary">{option.label}</Typography>
                  </li>
                );
              }

              return (
                <Box
                  component="li"
                  {...props}
                  key={autoComplete.getOptionsValue(option) + ""}
                  sx={{
                    "&:active": {
                      backgroundColor: (theme) => theme.palette.action.selected,
                    },
                    backgroundColor: (theme) =>
                      selected ? theme.palette.action.selected : "inherit",
                    fontWeight: selected ? "bold" : "normal",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ flexGrow: 1 }}>
                    {autoComplete.getOptionsLabel(option)}
                  </Typography>
                  {selected ? (
                    <CheckIcon color="primary" sx={{ fontSize: 16, ml: 1 }} />
                  ) : null}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                value={params.inputProps.value}
                label={label}
                required={required}
                placeholder={meta.formRelated.placeholder}
                helperText={helperText}
                error={error}
                variant="standard"
                InputProps={{
                  ...params.InputProps,

                  endAdornment: (
                    <>
                      {isLoading && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps?.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        )}
      </Box>

      {/* Beautiful Selection Dialog */}
      {isMultiple && (
        <SelectionDialog
          open={isSelectionDialogOpen}
          onClose={() => setIsSelectionDialogOpen(false)}
          onConfirm={handleDialogSelection}
          options={options.filter((opt: any) => !opt.__createNew)}
          selectedValues={(mappedValue as any[]) || []}
          autoComplete={autoComplete}
          title={`Select ${label}`}
          isLoading={isLoading}
          onCreateNew={
            autoComplete.allowCreateNew ? handleCreateOpen : undefined
          }
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && schema && (
        <ReusableFormModal
          schema={schema}
          title={createTitle}
          formMode="create"
          sections={sections}
          onClose={() => setIsCreateModalOpen(false)}
          open={isCreateModalOpen}
        />
      )}

      {/* Helper function for create modal */}
      {
        function handleCreateOpen() {
          setIsCreateModalOpen(true);
        } as any
      }
    </>
  );
}
