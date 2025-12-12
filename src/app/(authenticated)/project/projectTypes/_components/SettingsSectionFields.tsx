import { useDataMutation, useDataQuery } from "@/lib/tanstack/useDataQuery";
import AddIcon from "@mui/icons-material/Add";
import FileUploadWithPreview from "@/components/ReusableFormDrawer/file-upload";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { useState, useEffect, useMemo } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { Close } from "@mui/icons-material";

import DefaultWbsTemplateIdFieldForm from "../../wbsItems/_components/Form";
import DefaultBillingMethodFieldForm from "../../billingMethods/_components/Form";
import DefaultProjectStageSetFieldForm from "../../projectStageSets/_components/Form";
import DefaultTaskStageSetFieldForm from "../../taskStageSets/_components/Form";

export const DefaultWbsTemplateIdField = ({ index }: any) => {
  const { control: formControl } = useFormContext();

  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/wbsItems";

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
        name={`defaultWbsTemplateId`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {
          const isPrimitiveField =
            typeof controllerField.value === "string" ||
            typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find((o) => ((option) => option.id)(o) === val)
                  )
                  .filter(Boolean);
              } else {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find(
                      (o) =>
                        o === val ||
                        ((option) => option.id)(o) ===
                          ((option) => option.id)(val)
                    )
                  )
                  .filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return (
                  options.find(
                    (o) => ((option) => option.id)(o) === controllerField.value
                  ) || null
                );
              } else {
                return (
                  options.find(
                    (o) =>
                      o === controllerField.value ||
                      ((option) => option.id)(o) ===
                        ((option) => option.id)(controllerField.value)
                  ) || null
                );
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              {...controllerField}
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={(option) => option.title}
              getOptionKey={(option) => option.id}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField
                      ? (value ?? []).map((v: any) =>
                          ((option) => option.id)(v)
                        )
                      : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField
                      ? value
                        ? ((option) => option.id)(value)
                        : null
                      : value ?? null
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
                    inputLabel: { shrink: true },
                  }}
                  variant="standard"
                  label="Default Wbs Template Id"
                  placeholder="Select default WBS template"
                  helperText={
                    fieldState.error
                      ? "This field is required"
                      : "The ID of the default WBS template for projects of this type."
                  }
                  error={!!fieldState.error}
                  className=""
                  style={undefined}
                  sx={{ width: "100%", mb: 2 }}
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
                    {((option) => option.title)(option)}
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
              Create Default Wbs Template Id
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
          <DefaultWbsTemplateIdFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DefaultBillingMethodField = ({ index }: any) => {
  const { control: formControl } = useFormContext();

  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/billingMethods";

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
        name={`defaultBillingMethod`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {
          const isPrimitiveField =
            typeof controllerField.value === "string" ||
            typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find((o) => ((option) => option.id)(o) === val)
                  )
                  .filter(Boolean);
              } else {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find(
                      (o) =>
                        o === val ||
                        ((option) => option.id)(o) ===
                          ((option) => option.id)(val)
                    )
                  )
                  .filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return (
                  options.find(
                    (o) => ((option) => option.id)(o) === controllerField.value
                  ) || null
                );
              } else {
                return (
                  options.find(
                    (o) =>
                      o === controllerField.value ||
                      ((option) => option.id)(o) ===
                        ((option) => option.id)(controllerField.value)
                  ) || null
                );
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              {...controllerField}
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={(option) => option.method}
              getOptionKey={(option) => option.id}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField
                      ? (value ?? []).map((v: any) =>
                          ((option) => option.id)(v)
                        )
                      : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField
                      ? value
                        ? ((option) => option.id)(value)
                        : null
                      : value ?? null
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
                    inputLabel: { shrink: true },
                  }}
                  variant="standard"
                  label="Default Billing Method"
                  placeholder="Select default billing method"
                  helperText={
                    fieldState.error
                      ? "This field is required"
                      : "The default billing method for projects of this type."
                  }
                  error={!!fieldState.error}
                  className=""
                  style={undefined}
                  sx={{ width: "100%", mb: 2 }}
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
                    {((option) => option.method)(option)}
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
              Create Default Billing Method
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
          <DefaultBillingMethodFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DefaultProjectStageSetField = ({ index }: any) => {
  const { control: formControl } = useFormContext();

  const [options, setOptions] = useState([]);
  const endpoint = "https://api.techbee.et/api/project/projectStageSets";

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
        name={`defaultProjectStageSet`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {
          const isPrimitiveField =
            typeof controllerField.value === "string" ||
            typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find((o) => ((option) => option.id)(o) === val)
                  )
                  .filter(Boolean);
              } else {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find(
                      (o) =>
                        o === val ||
                        ((option) => option.id)(o) ===
                          ((option) => option.id)(val)
                    )
                  )
                  .filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return (
                  options.find(
                    (o) => ((option) => option.id)(o) === controllerField.value
                  ) || null
                );
              } else {
                return (
                  options.find(
                    (o) =>
                      o === controllerField.value ||
                      ((option) => option.id)(o) ===
                        ((option) => option.id)(controllerField.value)
                  ) || null
                );
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              {...controllerField}
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField
                      ? (value ?? []).map((v: any) =>
                          ((option) => option.id)(v)
                        )
                      : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField
                      ? value
                        ? ((option) => option.id)(value)
                        : null
                      : value ?? null
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
                    inputLabel: { shrink: true },
                  }}
                  variant="standard"
                  label="Default Project Stage Set"
                  placeholder="Select default project stage set"
                  helperText={
                    fieldState.error
                      ? "This field is required"
                      : "The default project stage set for projects of this type."
                  }
                  error={!!fieldState.error}
                  className=""
                  style={undefined}
                  sx={{ width: "100%", mb: 2 }}
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
                    {((option) => option.name)(option)}
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
              Create Default Project Stage Set
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
          <DefaultProjectStageSetFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DefaultTaskStageSetField = ({ index }: any) => {
  const { control: formControl } = useFormContext();

  const [options, setOptions] = useState([]);
  const endpoint =
    "https://api.techbee.et/api/project/taskStageSets?where[isSystem]=false";

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
        name={`defaultTaskStageSet`}
        control={formControl}
        rules={{ required: false }}
        render={({ field: controllerField, fieldState }) => {
          const isPrimitiveField =
            typeof controllerField.value === "string" ||
            typeof controllerField.value === "number";

          const mappedValue = useMemo(() => {
            if (!controllerField.value) return false ? [] : null;
            if (false) {
              if (isPrimitiveField) {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find((o) => ((option) => option.id)(o) === val)
                  )
                  .filter(Boolean);
              } else {
                return (controllerField.value ?? [])
                  .map((val) =>
                    options.find(
                      (o) =>
                        o === val ||
                        ((option) => option.id)(o) ===
                          ((option) => option.id)(val)
                    )
                  )
                  .filter(Boolean);
              }
            } else {
              if (isPrimitiveField) {
                return (
                  options.find(
                    (o) => ((option) => option.id)(o) === controllerField.value
                  ) || null
                );
              } else {
                return (
                  options.find(
                    (o) =>
                      o === controllerField.value ||
                      ((option) => option.id)(o) ===
                        ((option) => option.id)(controllerField.value)
                  ) || null
                );
              }
            }
          }, [controllerField.value, options]);

          return (
            <Autocomplete
              {...controllerField}
              loading={isLoading}
              options={options}
              sx={{ minWidth: 240, maxWidth: 360 }}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              value={mappedValue}
              onChange={(_, value) => {
                if (false) {
                  controllerField.onChange(
                    isPrimitiveField
                      ? (value ?? []).map((v: any) =>
                          ((option) => option.id)(v)
                        )
                      : value ?? []
                  );
                } else {
                  controllerField.onChange(
                    isPrimitiveField
                      ? value
                        ? ((option) => option.id)(value)
                        : null
                      : value ?? null
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
                    inputLabel: { shrink: true },
                  }}
                  variant="standard"
                  label="Default Task Stage Set"
                  placeholder="Select default task stage set"
                  helperText={
                    fieldState.error
                      ? "This field is required"
                      : "The default task stage set for tasks within projects of this type."
                  }
                  error={!!fieldState.error}
                  className=""
                  style={undefined}
                  sx={{ width: "100%", mb: 2 }}
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
                    {((option) => option.name)(option)}
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
              Create Default Task Stage Set
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
          <DefaultTaskStageSetFieldForm formMode="create" />
        </DialogContent>
      </Dialog>
    </>
  );
};
