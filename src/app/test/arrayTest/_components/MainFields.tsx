import { useDataMutation } from "@/lib/tanstack/useDataQuery";
import AddIcon from "@mui/icons-material/Add";
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
} from "@mui/material";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

export const TagField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`tags.${index}.tag`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text"
          variant="outlined"
          label="Tag"
          placeholder="e.g., sports"
          helperText={fieldState.error ? "Tag required" : "Enter a tag"}
          error={!!fieldState.error}
          disabled={false}
          className=""
          style={undefined}
          sx={{ width: "100%", mb: 2 }}
        />
      )}
    />
  );
};

export const TagsArray = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: "tags",
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderColor: "grey.200",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h3">
          Tags
        </Typography>
        <IconButton
          color="primary"
          onClick={() => append({})}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
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
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              border: 1,
              borderColor: "grey.100",
              borderRadius: 1,
              backgroundColor: "grey.50",
            }}
          >
            <Box sx={{ flexGrow: 1, maxWidth: "300px" }}>
              <TagField index={index} />
            </Box>
            <IconButton
              color="error"
              onClick={() => remove(index)}
              size="small"
              sx={{
                backgroundColor: "error.light",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.main",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export const PersonNameField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`persons.${index}.name`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="text"
          variant="outlined"
          label="Name"
          placeholder="John Doe"
          helperText={fieldState.error ? "Name required" : "Person's name"}
          error={!!fieldState.error}
          disabled={false}
          className=""
          style={undefined}
          sx={{ width: "100%", mb: 2 }}
        />
      )}
    />
  );
};

export const PersonAgeField = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  return (
    <Controller
      name={`persons.${index}.age`}
      control={formControl}
      rules={{ required: false }}
      render={({ field: controllerField, fieldState }) => (
        <TextField
          {...controllerField}
          type="number"
          variant="outlined"
          label="Age"
          placeholder="30"
          helperText={fieldState.error ? "Age required" : "Person's age"}
          error={!!fieldState.error}
          disabled={false}
          className=""
          style={undefined}
          sx={{ width: "100%", mb: 2 }}
        />
      )}
    />
  );
};

export const PersonsArray = ({ index }: any) => {
  const { control: formControl } = useFormContext();
  const { mutate, isPending } = useDataMutation({
    apiEndPoint: "https://api.techbee.et/api/users/",
  });
  // const handleDeleteOrDisconnect = ()
  const { fields, append, remove } = useFieldArray({
    control: formControl,
    name: "persons",
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderColor: "grey.200",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h3">
          Persons
        </Typography>
        <IconButton
          color="primary"
          onClick={() => append({})}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
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
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              border: 1,
              borderColor: "grey.100",
              borderRadius: 1,
              backgroundColor: "grey.50",
            }}
          >
            <Box sx={{ flexGrow: 1, maxWidth: "300px" }}>
              <PersonNameField index={index} />
              <PersonAgeField index={index} />
            </Box>
            <IconButton
              color="error"
              onClick={() => remove(index)}
              size="small"
              sx={{
                backgroundColor: "error.light",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.main",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
