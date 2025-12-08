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




export const NotifyBudgetExceededField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyBudgetExceeded`}
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
            label="Notify Budget Exceeded"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify budget exceeded is required" : "Notify users when project budget is exceeded."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyChangeRequestSubmittedField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyChangeRequestSubmitted`}
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
            label="Notify Change Request Submitted"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify change request submitted is required" : "Notify users when a change request is submitted."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyMilestoneDeadlineUpcomingField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyMilestoneDeadlineUpcoming`}
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
            label="Notify Milestone Deadline Upcoming"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify milestone deadline upcoming is required" : "Notify users when a milestone deadline is upcoming."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyMilestoneOverdueField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyMilestoneOverdue`}
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
            label="Notify Milestone Overdue"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify milestone overdue is required" : "Notify users when a milestone is overdue."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyProjectDeadlineUpcomingField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyProjectDeadlineUpcoming`}
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
            label="Notify Project Deadline Upcoming"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify project deadline upcoming is required" : "Notify users when a project deadline is upcoming."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyTaskDeadlineUpcomingField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyTaskDeadlineUpcoming`}
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
            label="Notify Task Deadline Upcoming"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify task deadline upcoming is required" : "Notify users when a task deadline is upcoming."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyTaskDueSoonField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyTaskDueSoon`}
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
            label="Notify Task Due Soon"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify task due soon is required" : "Notify users when a task is due soon."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyTaskOverdueField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyTaskOverdue`}
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
            label="Notify Task Overdue"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify task overdue is required" : "Notify users when a task is overdue."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};
