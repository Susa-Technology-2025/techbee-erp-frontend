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




export const NameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`name`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Name"
          placeholder="Enter task stage set name"
          helperText={fieldState.error ? "Task Stage Set name is required" : "The name of the task stage set."}
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



export const CodeField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`code`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Code"
          placeholder="Enter code"
          helperText={fieldState.error ? "Code is required" : "The unique code for the task stage set."}
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



export const ActiveField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`active`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <FormControl component="fieldset" className="">
          <FormControlLabel
            control={
              <Checkbox
                {...controllerField}
                checked={controllerField.value || false}
                disabled={false}
                color="primary"
              />
            }
            label="Active"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Active status is required" : "Indicates if the task stage set is active."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const ColorField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`color`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Color"
          placeholder="Enter color code or name"
          helperText={fieldState.error ? "Color is optional" : "The color associated with the task stage set (optional)."}
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



export const NotesField = ({index}: any) => {
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
          placeholder="Enter notes"
          helperText={fieldState.error ? "Notes are optional" : "Internal notes about the task stage set (optional)."}
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
