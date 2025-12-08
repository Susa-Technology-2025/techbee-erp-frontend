import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import AddIcon from "@mui/icons-material/Add"
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Autocomplete,
  TextField,
  Grid,
  Button,
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
  ListItemText,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControlLabel,
  FormHelperText,
  FormControl,
  AppBar,
  Toolbar,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect,useMemo } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { Close } from "@mui/icons-material";




export const PercentCompletionField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`percentCompletion`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Percent Completion"
          placeholder="Enter percent completion"
          helperText={fieldState.error ? "Percent completion is required" : "The percentage of completion for the WBS item."}
          error={!!fieldState.error}
          disabled={false}
          className=""
           slotProps={{
            inputLabel: { shrink: true },
          }}
          style={undefined}
          sx={{}}
          false
          value={
            controllerField.value
              ? Number(controllerField.value)
              : ""
          }
        />
      )}
    />
  );
};



export const WeightPercentField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`weightPercent`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Weight Percent"
          placeholder="Enter weight percentage"
          helperText={fieldState.error ? "Weight percent is required" : "The weight percentage of the WBS item towards the parent."}
          error={!!fieldState.error}
          disabled={false}
          className=""
           slotProps={{
            inputLabel: { shrink: true },
          }}
          style={undefined}
          sx={{}}
          false
          value={
            controllerField.value
              ? Number(controllerField.value)
              : ""
          }
        />
      )}
    />
  );
};



export const StatusLabelField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`statusLabel`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Status Label"
          placeholder="Enter status label"
          helperText={fieldState.error ? "Status label is required" : "The current status label of the WBS item."}
          error={!!fieldState.error}
          disabled={false}
          className=""
           slotProps={{
            inputLabel: { shrink: true },
          }}
          style={undefined}
          sx={{}}
          false
          false
        />
      )}
    />
  );
};
