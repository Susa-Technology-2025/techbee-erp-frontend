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





export const StageNameField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.name`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Name"
          placeholder="Enter stage name"
          helperText={fieldState.error ? "Task Stage name is required" : "The name of the task stage."}
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



export const StageCodeField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.code`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Code"
          placeholder="Enter stage code"
          helperText={fieldState.error ? "Code is required" : "The unique code for the task stage."}
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



export const SequenceField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.sequence`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Sequence"
          placeholder="Enter sequence number"
          helperText={fieldState.error ? "Sequence number is required" : "The sequence number for stage order."}
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



export const StageActiveField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.active`}
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
            label="Active"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Active status is required" : "Indicates if the stage is active."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const TriggersNotificationField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.triggersNotification`}
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
            label="Triggers Notification"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Triggers notification status is required" : "If the stage triggers a notification on entry/exit."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const StageColorField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.color`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Color"
          placeholder="Enter stage color"
          helperText={fieldState.error ? "Color is optional" : "The color associated with the task stage (optional)."}
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



export const StageDescriptionField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.description`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Description"
          placeholder="Enter description"
          helperText={fieldState.error ? "Description is optional" : "A detailed description of the task stage (optional)."}
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



export const StageNotesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`stages.${index}.notes`}
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
          helperText={fieldState.error ? "Notes are optional" : "Internal notes about the task stage (optional)."}
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


export const StagesField = ({index}: any) => {
  const { control: formControl,getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: "stages",
    keyName: "rhfKey"
  });
const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
      const [selectedItem, setSelectedItem] = useState<{
        id: string;
        index: number;
      } | null>(null);
      const [deleteMode, setDeleteMode] = useState<{
        mode: "delete" | "disconnect";
        id: string;
        index: number;
      } | null>(null);
    
      const { mutate, isPending } = useDataMutation({
        apiEndPoint: deleteMode?.id
          ? deleteMode.mode === "delete" ?"https://api.techbee.et/api/project/taskStages/" + deleteMode?.id: "https://api.techbee.et/api/project/taskStages/disconnect/" + getValues("id") + "/stages"
          : "",
        method: "DELETE",
          invalidateQueryKey: [
      "data",
      "https://api.techbee.et/api/project/taskStages",
      "https://api.techbee.et/api/project/taskStages/disconnect",
    ],
        onSuccess: (message) => {
          toast.success(message?.message ?? "SUCCESS");
          // Remove the item from the form only if delete operation was successful
          if (deleteMode?.mode === "delete" && deleteMode.index !== undefined) {
            remove(deleteMode.index);
          }
          handleClosePopover();
          setDeleteMode(null);
        },
         getBody: (vars) => {
      return JSON.stringify([{ id: deleteMode?.id }]);
    },
        onError: (error) => {
          toast.error(error?.message ?? "FAILED");
          setDeleteMode(null);
        },
      });
    
   const handleDeleteClick = (
  event: React.MouseEvent<HTMLElement>,
  item: any,
  index: number
) => {
  if (item.id) {
    setPopoverAnchor(event.currentTarget);
    setSelectedItem({ id: item.id, index });
  } else {
     remove(index);
  }
};
    
      const handleClosePopover = () => {
        setPopoverAnchor(null);
        setSelectedItem(null);
      };
    
      const handleDeleteOrDisconnect = (mode: "delete" | "disconnect") => {
        if (!selectedItem) return;
    
        setDeleteMode({
          mode,
          id: selectedItem.id,
          index: selectedItem.index,
        });
    
   const data =
      mode === "disconnect"
        ? [
            {
              id: selectedItem.id,
            },
          ]
        : undefined;    
        mutate(data);
      };
      const open = Boolean(popoverAnchor);
      const popoverId = open ? "delete-popover" : undefined;
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
          Stages
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
              <StageNameField index={index} />
        <StageCodeField index={index} />
        <SequenceField index={index} />
        <StageActiveField index={index} />
        <TriggersNotificationField index={index} />
        <StageColorField index={index} />
        <StageDescriptionField index={index} />
        <StageNotesField index={index} />
            <IconButton 
              color="error" 
              onClick={(event) => handleDeleteClick(event, item, index)}
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
    <Popover
        id={popoverId}
        open={open}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List sx={{ minWidth: 120 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDeleteOrDisconnect("disconnect")}
              disabled={isPending && deleteMode?.mode === "disconnect"}
            >
              {isPending && deleteMode?.mode === "disconnect" ? (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              ) : null}
              <ListItemText primary="Disconnect" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleDeleteOrDisconnect("delete")}
              disabled={isPending && deleteMode?.mode === "delete"}
              sx={{ color: "error.main" }}
            >
              {isPending && deleteMode?.mode === "delete" ? (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              ) : null}
              <ListItemText primary="Delete" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};
