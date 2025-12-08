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

import  AuthorEmployeeIdFieldForm  from "../../projectAssignments/_components/Form";


export const BodyField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`body`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <Box
          data-color-mode="light"
          sx={{
            
            gridColumn: "1 / -1",
            ...{"width":"100%","mb":2}
          }}
          className=""
          style={undefined}
        >
          <InputLabel shrink>Body</InputLabel>
          <MDEditor
            value={controllerField.value ?? ""}
            onChange={controllerField.onChange}
            contentEditable={false}
            preview="live"
            hideToolbar={false}
            style={{ width: "100%" }}
          />
          {fieldState.error ? (
            <p
              style={{
                color: "red",
                fontSize: "0.75rem",
                marginTop: "4px",
              }}
            >
              This field is required
            </p>
          ) : (
            
            <p
              style={{
                color: "gray",
                fontSize: "0.75rem",
                marginTop: "4px",
              }}
            >
              The main content or text of the comment.
            </p>
            
          )}
        </Box>
      )}
    />
  );
};



export const IsInternalField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`isInternal`}
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
            label="Is Internal"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "This field is required" : "Indicates if the comment is for internal viewing only."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const AuthorEmployeeIdField = ({ index }: any) => {
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
        name={`authorEmployeeId`}
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
                  label="Author Employee "
                  placeholder="Enter author employee "
                  helperText={fieldState.error ? "This field is required" : "The employee who authored the comment."}
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
