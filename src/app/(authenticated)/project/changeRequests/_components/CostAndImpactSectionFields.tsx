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




export const BillingAmountField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`billingAmount`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Billing Amount"
          placeholder="Enter the billing amount"
          helperText={fieldState.error ? "This field is required" : "The amount to be billed for the change."}
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



export const ImpactCostField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`impactCost`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Impact Cost"
          placeholder="Enter the impact cost"
          helperText={fieldState.error ? "This field is required" : "The estimated cost of the impact."}
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



export const ImpactTimeDaysField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`impactTimeDays`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Impact Time Days"
          placeholder="Enter the impact time in days"
          helperText={fieldState.error ? "This field is required" : "The estimated time impact in days."}
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



export const ImpactResourcesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`impactResources`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Impact Resources"
          placeholder="Enter details about impacted resources"
          helperText={fieldState.error ? "This field is required" : "Information about the resources impacted by the change."}
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
