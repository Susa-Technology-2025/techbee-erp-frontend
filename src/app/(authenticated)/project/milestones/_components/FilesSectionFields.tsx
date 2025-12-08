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





export const AttachmentItemField = ({index}: any) => {
  return (
    <FileUploadWithPreview
      folder="Milestone"
      fileName="id"
      watchField={"attachments.${index}.attachment"}
      acceptedFileTypes={["image/*","application/pdf"]}
      maxSize={1}
      label="Attachment"
    />
  );
};


export const AttachmentsField = ({index}: any) => {
  const { control: formControl,getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: "attachments",
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
          Attachments
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
              <AttachmentItemField index={index} />
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
