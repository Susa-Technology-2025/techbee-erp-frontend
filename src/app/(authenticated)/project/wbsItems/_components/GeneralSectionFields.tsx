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

import  ResponsibleRoleOrNameFieldForm  from "../../projectAssignments/_components/Form";


export const TitleField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`title`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text" 
          variant="standard"
          label="Title"
          placeholder="Enter title"
          helperText={fieldState.error ? "Title is required" : "The title of the WBS item."}
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
          placeholder="Enter code"
          helperText={fieldState.error ? "Code is required" : "The code for the WBS item."}
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



export const TypeField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  const options = ["Phase","Task","Subtask"];
  const isLoading = false;
  

  return (
    <>
      <Controller
        name={`type`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {

          const isPrimitiveField = typeof controllerField.value === "string" || typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => (option=>option)(o) === val)
                ).filter(Boolean);
              } else {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => o === val || (option=>option)(o) === (option=>option)(val))
                ).filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return options.find(o => (option=>option)(o) === controllerField.value) || null;
              } else {
                return options.find(o => o === controllerField.value || (option=>option)(o) === (option=>option)(controllerField.value)) || null;
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              
              {...controllerField}
              
              
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={option=>option}
              getOptionKey={option=>option}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField ? (value ?? []).map((v: any) => (option=>option)(v)) : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField ? (value ? (option=>option)(value) : null) : value ?? null
                  );
                }
              }}
              disabled={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  
                  variant="standard"
                  label="Type"
                  placeholder="Select type"
                  helperText={fieldState.error ? "Type is required" : "The type of the WBS item (Phase, Task, or Subtask)."}
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
        {(option=>option)(option)}
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



export const SlaStateField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  const options = ["Ok","Warning","Breached"];
  const isLoading = false;
  

  return (
    <>
      <Controller
        name={`slaState`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {

          const isPrimitiveField = typeof controllerField.value === "string" || typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => (option=>option)(o) === val)
                ).filter(Boolean);
              } else {
                return (controllerField.value ?? []).map(val =>
                  options.find(o => o === val || (option=>option)(o) === (option=>option)(val))
                ).filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return options.find(o => (option=>option)(o) === controllerField.value) || null;
              } else {
                return options.find(o => o === controllerField.value || (option=>option)(o) === (option=>option)(controllerField.value)) || null;
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              
              {...controllerField}
              
              
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={option=>option}
              getOptionKey={option=>option}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField ? (value ?? []).map((v: any) => (option=>option)(v)) : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField ? (value ? (option=>option)(value) : null) : value ?? null
                  );
                }
              }}
              disabled={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  
                  variant="standard"
                  label="Sla State"
                  placeholder="Select SLA state"
                  helperText={fieldState.error ? "Sla state is required" : "The service level agreement state of the WBS item."}
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
        {(option=>option)(option)}
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



export const ApprovalRequiredField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`approvalRequired`}
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
            label="Approval Required"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Approval required is required" : "Indicates if approval is required for this WBS item."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const NotifyTaskAssignmentChangedField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`notifyTaskAssignmentChanged`}
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
            label="Notify Task Assignment Changed"
            style={undefined}
            sx={{}}
          />
          <FormHelperText error={!!fieldState.error}>
            {fieldState.error ? "Notify task assignment changed is required" : "Indicates if task assignment changes should trigger a notification."}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};



export const OrderField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`order`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number" 
          variant="standard"
          label="Order"
          placeholder="Enter order number"
          helperText={fieldState.error ? "Order is required" : "The display order of the WBS item."}
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



export const DescriptionField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`description`}
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
          helperText={fieldState.error ? "Description is required" : "A detailed description of the WBS item."}
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
          helperText={fieldState.error ? "Notes are required" : "Additional notes for the WBS item."}
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



export const ResponsibleRoleOrNameField = ({ index }: any) => {
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
        name={`responsibleRoleOrName`}
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
                  label="Responsible Role Or Name"
                  placeholder="Select responsible user"
                  helperText={fieldState.error ? "Responsible role or name is required" : "The role or name of the person responsible for the WBS item."}
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



export const RiskOrIssuesField = ({index}: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`riskOrIssues`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          multiline
          maxRows={4}
          type="text" 
          variant="standard"
          label="Risk Or Issues"
          placeholder="Enter risks or issues"
          helperText={fieldState.error ? "Risk or issues is required" : "Any identified risks or issues for the WBS item."}
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
        <Box
          data-color-mode="light"
          sx={{
            
            gridColumn: "1 / -1",
            ...{"width":"100%","mb":2}
          }}
          className=""
          style={undefined}
        >
          <InputLabel shrink>Deliverables</InputLabel>
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
              Deliverables is required
            </p>
          ) : (
            
            <p
              style={{
                color: "gray",
                fontSize: "0.75rem",
                marginTop: "4px",
              }}
            >
              Details of the expected deliverables.
            </p>
            
          )}
        </Box>
      )}
    />
  );
};
