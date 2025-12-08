"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/ListRounded";
import { useFormContext, useController } from "react-hook-form";
import nerdamer from "nerdamer";
import "nerdamer/Solve";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

type ExpressionFieldProps = {
  name: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
  allowedVariablesEndpoint?: string;
  getVariables?: (data: any[]) => string[];
};

export function ExpressionField({
  name,
  label,
  helperText,
  disabled,
  allowedVariablesEndpoint,
  getVariables,
}: ExpressionFieldProps) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expressionError, setExpressionError] = useState("");

  const { data, isLoading, isError } = useDataQuery({
    apiEndPoint: allowedVariablesEndpoint || "",
    enabled: Boolean(allowedVariablesEndpoint),
  });

  const allowedVariables = getVariables && data ? getVariables(data) : [];

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const tokens = newValue.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    let validationMessage = "";

    for (const token of tokens) {
      if (!allowedVariables.includes(token)) {
        validationMessage = `Variable '${token}' is not allowed. click the icon to see allowed variables`;
        break;
      }
    }

    if (!validationMessage) {
      try {
        nerdamer.solveEquations(newValue);
      } catch (err: any) {
        validationMessage = err.message || "Invalid mathematical expression.";
      }
    }
    setExpressionError(validationMessage);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSearchTerm("");
  };

  const handleVariableSelect = (variable: string) => {
    const separator = value && !value.endsWith(" ") ? " " : "";
    const newExpression = (value ?? "") + separator + variable;
    onChange(newExpression);
    handleClosePopover();
  };

  const filteredVariables = allowedVariables.filter((variable) =>
    variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const open = Boolean(anchorEl);
  const id = open ? "variables-popover" : undefined;

  if (isLoading) return <Box sx={{ p: 2 }}>Loading variables...</Box>;
  if (isError)
    return <Box sx={{ p: 2, color: "red" }}>Error loading variables.</Box>;

  // Prioritize specific, local validation error over generic RHF error
  const currentHelperText = expressionError || error?.message || helperText;

  return (
    <Box>
      <TextField
        label={label}
        value={value ?? ""}
        onChange={handleExpressionChange}
        fullWidth
        // Show error if either local or RHF validation fails
        error={!!expressionError || !!error}
        helperText={currentHelperText}
        disabled={disabled}
        variant="standard"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  size="small"
                  onClick={handleOpenPopover}
                  sx={{ mr: 1 }}
                  disabled={disabled}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <TextField
            size="small"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            autoFocus
          />
          <List sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
            {filteredVariables.map((variable) => (
              <ListItem key={variable} disablePadding>
                <ListItemButton onClick={() => handleVariableSelect(variable)}>
                  <ListItemText primary={variable} />
                </ListItemButton>
              </ListItem>
            ))}
            {filteredVariables.length === 0 && (
              <ListItem>
                <ListItemText primary="No variables found" />
              </ListItem>
            )}
          </List>
        </Box>
      </Popover>
    </Box>
  );
}
