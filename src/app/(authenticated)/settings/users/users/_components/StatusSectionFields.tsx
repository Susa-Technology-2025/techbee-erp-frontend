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

import  UserRolesFieldForm  from "../../roles/_components/Form";


export const IsActiveField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`isActive`}
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
            label="Is Active"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Is active status is required" : "Indicates if the user account is currently active."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const IsVerifiedField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`isVerified`}
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
            label="Is Verified"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Is verified status is required" : "Indicates if the user's identity has been verified."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const MustResetPasswordField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`mustResetPassword`}
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
            label="Must Reset Password"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Must reset password status is required" : "Forces the user to reset their password on next login."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const EmailVerifiedAtField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`emailVerifiedAt`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Email Verified At"
          placeholder="Select verification date"
          helperText={fieldState.error ? "Invalid date format" : "The date and time when the user's email was verified."}
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



export const UserRolesField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  
  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/auth/roles"
  
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
        name={`userRoles`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {

          const isPrimitiveField = typeof controllerField.value === "string" || typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return true ? [] : null;
            if (true) {
              if (isPrimitiveField) {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => (option=>option.id||option.role?.name)(o) === val)
                ).filter(Boolean);
              } else {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => o === val || (option=>option.id||option.role?.name)(o) === (option=>option.id||option.role?.name)(val))
                ).filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return options.find(o => (option=>option.id||option.role?.name)(o) === controllerField.value) || null;
              } else {
                return options.find(o => o === controllerField.value || (option=>option.id||option.role?.name)(o) === (option=>option.id||option.role?.name)(controllerField.value)) || null;
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              multiple
              {...controllerField}
              disableCloseOnSelect
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={option=>option.name||option.role?.name}
              getOptionKey={option=>option.id||option.role?.name}
              value={mappedValue}
              onChange={(_, value) => {
                if (true) {
                  controllerField.onChange(
                    isPrimitiveField ? (value ?? []).map((v: any) => (option=>option.id||option.role?.name)(v)) : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField ? (value ? (option=>option.id||option.role?.name)(value) : null) : value ?? null
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
                  label="User Roles"
                  placeholder="Select user roles"
                  helperText={fieldState.error ? "Invalid user role assignment" : "The roles assigned to the user."}
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
        {(option=>option.name||option.role?.name)(option)}
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
            Create User Roles
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
           <UserRolesFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};
