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
import  SchedulingTypeFieldForm  from "../../schedulingTypes/_components/Form";


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
  
  
  const [openDialog, setOpenDialog] = useState(false);
  

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
                  
  slotProps={{
    input: {
      ...params.InputProps,
      startAdornment: (
        <>
          <InputAdornment position="start">
            <IconButton
              loading={isLoading}
              onClick={() => setOpenDialog(true)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
          {params.InputProps.startAdornment}
        </>
      ),
    },
    inputLabel: {shrink: true}
  }}
  
                  variant="standard"
                  label="Wbs Item"
                  placeholder="Select WBS item"
                  helperText={fieldState.error ? "This field is required" : "The Work Breakdown Structure item associated with the activity."}
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <AppBar
          position="static"
          elevation={1}
          sx={{ bgcolor: "section.main" }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create Wbs Item
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpenDialog(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, m: 0 }}>
           <WbsItemFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};



export const SchedulingTypeField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  
  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/schedulingTypes"
  
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
  
  
  const [openDialog, setOpenDialog] = useState(false);
  

  return (
    <>
      <Controller
        name={`schedulingType`}
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
              getOptionLabel={option=>"option.name"}
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
                  
  slotProps={{
    input: {
      ...params.InputProps,
      startAdornment: (
        <>
          <InputAdornment position="start">
            <IconButton
              loading={isLoading}
              onClick={() => setOpenDialog(true)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
          {params.InputProps.startAdornment}
        </>
      ),
    },
    inputLabel: {shrink: true}
  }}
  
                  variant="standard"
                  label="Scheduling Type"
                  placeholder="Select scheduling type"
                  helperText={fieldState.error ? "This field is required" : "The type of scheduling for the activity."}
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
        {(option=>"option.name")(option)}
      </ListItem>
    );
  }}
  
            />
          );
        }}
      />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <AppBar
          position="static"
          elevation={1}
          sx={{ bgcolor: "section.main" }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create Scheduling Type
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpenDialog(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, m: 0 }}>
           <SchedulingTypeFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};
