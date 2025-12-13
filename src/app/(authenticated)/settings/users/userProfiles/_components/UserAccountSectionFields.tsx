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





export const UsernameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`user.username`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Username"
          placeholder="Enter username"
          helperText={fieldState.error ? "Username is required" : "The unique username for the account."}
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



export const EmailField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`user.email`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="email" 
          variant="standard"
          label="Email"
          placeholder="Enter email"
          helperText={fieldState.error ? "Invalid email address" : "The user's primary email address."}
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



export const FirstNameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`user.firstName`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="First Name"
          placeholder="Enter first name"
          helperText={fieldState.error ? "First name is required" : "The user's first name."}
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



export const LastNameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`user.lastName`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Last Name"
          placeholder="Enter last name"
          helperText={fieldState.error ? "Last name is required" : "The user's last name."}
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



export const PhoneNumberField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`user.phoneNumber`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="tel" 
          variant="standard"
          label="Phone Number"
          placeholder="Enter phone number"
          helperText={fieldState.error ? "Invalid phone number" : "The user's phone number."}
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


export const UserField = ({index}: any) => {
   return (
    <Grid container spacing={2}>
      <UsernameField />
      <EmailField />
      <FirstNameField />
      <LastNameField />
      <PhoneNumberField />
    </Grid>
  );
};
