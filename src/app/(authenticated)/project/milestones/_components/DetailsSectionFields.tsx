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




export const DescriptionField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`description`}
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
          <InputLabel shrink>Description</InputLabel>
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
              Enter a valid description
            </p>
          ) : (
            
            <p
              style={{
                color: "gray",
                fontSize: "0.75rem",
                marginTop: "4px",
              }}
            >
              Detailed description of the milestone and its scope.
            </p>
            
          )}
        </Box>
      )}
    />
  );
};



export const NotesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notes`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Notes"
          placeholder="Enter notes"
          helperText={fieldState.error ? "Enter valid notes" : "Any additional internal notes or remarks about the milestone."}
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



export const DeliverablesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`deliverables`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={10}
          type="text" 
          variant="standard"
          label="Deliverables"
          placeholder="Enter deliverables details"
          helperText={fieldState.error ? "Enter valid deliverables info" : "Details about the deliverables of the milestone."}
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



export const NotificationsPolicyField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notificationsPolicy`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={10}
          type="text" 
          variant="standard"
          label="Notifications Policy"
          placeholder="Enter notification policy details"
          helperText={fieldState.error ? "Enter valid notification policy info" : "The policy governing notifications for this milestone."}
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




export const CommentItemField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`comments.${index}.comment`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={10}
          type="text" 
          variant="standard"
          label="Comment"
          placeholder="Type your comment"
          helperText={fieldState.error ? "Enter a comment" : "A comment on the milestone."}
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


export const CommentsField = ({index}: any) => {
  const { control: formControl,getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: "comments",
    keyName: "rhfKey"
  });

  return (
  <>
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        border: 1, 
        borderColor: 'grey.200',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        width: 1
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Comments
        </Typography>
        <IconButton 
          color="primary" 
          onClick={() => append({})}
          sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      
      <Stack spacing={1.5}>
        {fields.map((item, index) => (
          <Box 
            key={item.id}
            sx={{ 
              display: 'flex', 
              alignItems: 'start', 
              gap: 2,
              p: 1.5,
              border: 1,
              borderColor: 'grey.100',
              borderRadius: 1,
              flexWrap: "wrap",
              position: "relative",
               bgcolor: "backgroundSection.main",
                color: "backgroundSection.contrastText",
            }}
          >
              <CommentItemField index={index} />
            <IconButton 
              color="error" 
              onClick={() => remove(index)}
              size="small"
              sx={{ 
                backgroundColor: 'error.light',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.main',
                },
                  position: "absolute",
                  top: -2,
                  right: -2,
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Paper>
    
    </>
  );
};
