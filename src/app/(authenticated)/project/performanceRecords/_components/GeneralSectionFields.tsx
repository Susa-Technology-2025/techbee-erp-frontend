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

import  WbsItemFieldForm  from "../../wbsItems/_components/Form";


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
          placeholder="Enter performance record name"
          helperText={fieldState.error ? "Name is required" : "The name of the performance record."}
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
          placeholder="Enter performance record code"
          helperText={fieldState.error ? "Code is required" : "The unique code for the performance record."}
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
          placeholder="Enter status"
          helperText={fieldState.error ? "This field is required" : "The current status of the performance record."}
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



export const ResourceNameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`resourceName`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Resource Name"
          placeholder="Enter resource name"
          helperText={fieldState.error ? "This field is required" : "The name of the resource involved."}
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



export const TaskNameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`taskName`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Task Name"
          placeholder="Enter task name"
          helperText={fieldState.error ? "This field is required" : "The name of the related task."}
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



export const CompanyField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`company`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Company"
          placeholder="Enter company name"
          helperText={fieldState.error ? "This field is required" : "The associated company."}
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



export const OwnerField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`owner`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Owner"
          placeholder="Enter owner name"
          helperText={fieldState.error ? "This field is required" : "The owner of the performance record."}
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



export const WbsItemField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  
  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/wbsItems"
  
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
        name={`wbsItem`}
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
              getOptionLabel={option=>option.title}
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
                  label="Wbs Item"
                  placeholder="Select WBS item"
                  helperText={fieldState.error ? "This field is required" : "The associated Work Breakdown Structure (WBS) item."}
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
        {(option=>option.title)(option)}
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
