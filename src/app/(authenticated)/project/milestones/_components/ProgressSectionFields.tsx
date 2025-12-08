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
          placeholder="Enter percentage completion"
          helperText={fieldState.error ? "Enter a valid percentage" : "The percentage of completion for the milestone."}
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



export const ActualCompletionDateField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`actualCompletionDate`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Actual Completion Date"
          placeholder="Select actual completion date"
          helperText={fieldState.error ? "Enter a valid date" : "The actual date the milestone was completed."}
          error={!!fieldState.error}
          disabled={false}
          className=""
           slotProps={{
            inputLabel: { shrink: true },
          }}
          style={undefined}
          sx={{}}
          value={
            controllerField.value
              ? new Date(controllerField.value).toISOString().split("T")[0]
              : ""
          }
          false
        />
      )}
    />
  );
};



export const StatusField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`status`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Status"
          placeholder="Enter current status"
          helperText={fieldState.error ? "Enter a valid status" : "Current status of the milestone."}
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
