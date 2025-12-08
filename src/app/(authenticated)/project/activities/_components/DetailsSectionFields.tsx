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

import  AssigneeEmployeeIdFieldForm  from "../../projectAssignments/_components/Form";


export const PercentCompleteField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`percentComplete`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Percent Complete"
          placeholder="Enter percentage complete"
          helperText={fieldState.error ? "This field is required" : "The percentage of the activity that is complete (0-100)."}
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



export const ActualCostField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`actualCost`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Actual Cost"
          placeholder="Enter actual cost"
          helperText={fieldState.error ? "This field is required" : "The actual cost incurred for the activity."}
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



export const DueDateField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`dueDate`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Due Date"
          placeholder="Select due date"
          helperText={fieldState.error ? "This field is required" : "The date when the activity is due."}
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



export const AssigneeEmployeeIdField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  
  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/projectAssignments"
  
  const { data, isLoading, isSuccess } = useDataQuery({
    apiEndPoint: endpoint,
    noFilter: true,
  });
  useEffect(() => {
    if (isSuccess) {
     setOptions(
        Array.isArray(data) ? data : Array.isArray(data?.data) ? data?.data : []
      );
    }
  }, [isSuccess, data]);
  
  

  return (
    <>
      <Controller
        name={`assigneeEmployeeId`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {

          const isPrimitiveField = typeof controllerField.value === "string" || typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => (option=>option.id)(o) === val)
                ).filter(Boolean);
              } else {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => o === val || (option=>option.id)(o) === (option=>option.id)(val))
                ).filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return options.find(o => (option=>option.id)(o) === controllerField.value) || null;
              } else {
                return options.find(o => o === controllerField.value || (option=>option.id)(o) === (option=>option.id)(controllerField.value)) || null;
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              
              {...controllerField}
              
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={option=>option.internalResourceName||option.externalResourceName}
              getOptionKey={option=>option.id}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField ? (value ?? []).map((v: any) => (option=>option.id)(v)) : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField ? (value ? (option=>option.id)(value) : null) : value ?? null
                  );
                }
              }}
              disabled={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  
                  variant="standard"
                  label="Assignee Employee "
                  placeholder="Enter assignee employee"
                  helperText={fieldState.error ? "This field is required" : "The ID of the employee assigned to the activity."}
                  error={!!fieldState.error}
                  className=""
                  style={undefined}
                  sx={{"width":"100%","mb":2}}
                />
              )}
              
  renderOption={(props, option, { selected }) => {
    const { key, ...otherProps } = props;
    return (
      <ListItem
        key={key}
        {...otherProps}
        sx={{
          p: 0,
          m: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Checkbox
          style={{ marginRight: 8 }}
          checked={selected}
          sx={{ m: 0, p: 0 }}
        />
        {(option=>option.internalResourceName||option.externalResourceName)(option)}
      </ListItem>
    );
  }}
  
            />
          );
        }}
      />
      
    </>
  );
};
