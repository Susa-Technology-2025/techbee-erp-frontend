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




export const TaskStageColorField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`color`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="color" 
          variant="standard"
          label="Color"
          placeholder="Enter color code"
          helperText={fieldState.error ? "This field is required" : "An optional color code for the task stage (e.g., hex code)."}
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



export const TaskStageDescriptionField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`description`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Description"
          placeholder="Enter description"
          helperText={fieldState.error ? "This field is required" : "A detailed description of the task stage."}
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



export const TaskStageNotesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notes`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Notes"
          placeholder="Enter internal notes"
          helperText={fieldState.error ? "This field is required" : "Internal notes about the task stage."}
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
