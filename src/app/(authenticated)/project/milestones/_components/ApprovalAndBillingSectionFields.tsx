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




export const ApprovalRequiredField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`approvalRequired`}
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
            label="Approval Required"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Approval required is required" : "Indicates if official approval is required for this milestone."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const BillableField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`billable`}
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
            label="Billable"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Billable is required" : "Indicates if the milestone is billable to the client."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



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
          placeholder="Enter billing amount"
          helperText={fieldState.error ? "Enter a valid billing amount" : "The amount to be billed for this milestone."}
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



export const BillingScheduleField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`billingSchedule`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Billing Schedule"
          placeholder="Enter billing schedule"
          helperText={fieldState.error ? "Enter a valid billing schedule" : "The schedule according to which billing will occur."}
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
