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




export const AddressField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`address`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Address"
          placeholder="Enter address"
          helperText={fieldState.error ? "Address is invalid" : "The physical address of the user."}
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



export const AvatarUrlField = ({index}: any) => {
  return (
    <FileUploadWithPreview
      folder="userprofile"
      fileName="id"
      watchField={"avatarUrl"}
      acceptedFileTypes={["image/*"]}
      maxSize={1}
      label="Avatar Url"
    />
  );
};



export const BioField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`bio`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Bio"
          placeholder="Enter a brief bio"
          helperText={fieldState.error ? "Bio is too long" : "A short biography about the user."}
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



export const DateOfBirthField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`dateOfBirth`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="date" 
          variant="standard"
          label="Date Of Birth"
          placeholder="Select date of birth"
          helperText={fieldState.error ? "Invalid date of birth" : "The user's date of birth."}
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



export const GenderField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`gender`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Gender"
          placeholder="Enter gender"
          helperText={fieldState.error ? "Gender is required" : "The user's gender."}
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



export const LocaleField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`locale`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Locale"
          placeholder="Enter locale (e.g., en-US)"
          helperText={fieldState.error ? "Locale is required" : "The user's locale setting."}
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



export const NationalityField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`nationality`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Nationality"
          placeholder="Enter nationality"
          helperText={fieldState.error ? "Nationality is required" : "The user's nationality."}
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



export const TimezoneField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`timezone`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Timezone"
          placeholder="Enter timezone (e.g., Africa/Addis_Ababa)"
          helperText={fieldState.error ? "Timezone is required" : "The user's preferred timezone."}
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
