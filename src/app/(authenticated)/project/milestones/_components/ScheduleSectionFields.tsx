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




export const PlannedStartDateField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`plannedStartDate`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Planned Start Date"
          placeholder="Select planned start date"
          helperText={fieldState.error ? "Enter a valid date" : "The planned start date for the milestone."}
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



export const PlannedEndDateField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`plannedEndDate`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Planned End Date"
          placeholder="Select planned end date"
          helperText={fieldState.error ? "Enter a valid date" : "The planned end date for the milestone."}
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



export const PredecessorsField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`predecessors`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={10}
          type="text" 
          variant="standard"
          label="Predecessors"
          placeholder="Enter predecessors details"
          helperText={fieldState.error ? "Enter valid predecessors info" : "Milestones that must be completed before this one can start."}
          error={!!fieldState.error}
          disabled={false}
          className=""
          style={undefined}
          sx={{}}
        />
      )}
    />
  );
};
