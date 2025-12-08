"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import {
  z,
  ZodObject,
  ZodTypeAny,
  ZodEnum,
  ZodNativeEnum,
  ZodOptional,
  ZodNullable,
} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, Path } from "react-hook-form";

export type FormStatusProps = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
};

import { DefaultValues } from "react-hook-form";

type DynamicFormProps<T extends ZodObject<any>> = {
  schema: T;
  onSubmit: (values: z.infer<T>) => Promise<void> | void;
  formStatus: FormStatusProps;
  setFormStatus: (status: FormStatusProps) => void;
  submitButtonText?: string;
  submittingButtonText?: string;
  extraInputs?: React.ReactNode[];
  defaultValues?: DefaultValues<z.infer<T>>;
  formTitle?: string;
  formDescription?: string;
};

function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function DynamicForm<T extends ZodObject<any>>({
  schema,
  onSubmit,
  formStatus,
  setFormStatus,
  submitButtonText = "Submit",
  submittingButtonText = "Submitting...",
  extraInputs = [],
  defaultValues,
  formTitle,
  formDescription,
}: DynamicFormProps<T>) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: (defaultValues ||
      getDefaultValuesFromSchema(schema)) as DefaultValues<z.infer<T>>,
    mode: "all",
  });

  const fields = Object.entries(schema.shape);

  function getLabel(name: string) {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  const submitHandler = async (
    data: z.infer<T>,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    setFormStatus({ status: "loading", message: "Submitting..." });
    try {
      await onSubmit(data);
    } catch (error) {}
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
        maxWidth: "800px",
        mx: "auto",
        my: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(submitHandler)}
        method="post"
        noValidate
        sx={{ width: "100%" }}
      >
        {formTitle && (
          <Typography variant="h4" component="h1" gutterBottom>
            {formTitle}
          </Typography>
        )}

        {formDescription && (
          <Typography variant="body1" gutterBottom>
            {formDescription}
          </Typography>
        )}

        <Grid container spacing={3}>
          {fields.map(([name, field]) => {
            const key = name as keyof z.infer<T>;
            const safeName = name as Path<z.infer<T>>;

            const isOptional =
              field instanceof ZodOptional || field instanceof ZodNullable;
            let innerType = field;
            if (isOptional) {
              innerType = (field as any)._def.innerType || field;
            }
            const innerTypeName = (innerType as ZodTypeAny)._def.typeName;

            if (innerTypeName === "ZodString") {
              return (
                <Grid key={name} size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={safeName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        margin="normal"
                        label={getLabel(name)}
                        error={!!errors[key]}
                        helperText={errors[key]?.message?.toString() || ""}
                        fullWidth
                        variant="outlined"
                        size="medium"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
              );
            }

            if (innerTypeName === "ZodNumber") {
              return (
                <Grid key={name} size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={safeName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        margin="normal"
                        label={getLabel(name)}
                        error={!!errors[key]}
                        helperText={errors[key]?.message?.toString() || ""}
                        fullWidth
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
              );
            }

            if (innerTypeName === "ZodBoolean") {
              return (
                <Grid key={name} size={{ xs: 12 }}>
                  <Controller
                    name={safeName}
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body1">
                            {getLabel(name)}
                          </Typography>
                        }
                        sx={{
                          mt: 1,
                          alignItems: "flex-start",
                        }}
                      />
                    )}
                  />
                </Grid>
              );
            }

            if (innerTypeName === "ZodDate") {
              return (
                <Grid key={name} size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={safeName}
                    control={control}
                    render={({ field }) => {
                      const value = isValidDate(field.value)
                        ? field.value.toISOString().substring(0, 10)
                        : "";

                      return (
                        <TextField
                          name={field.name}
                          onBlur={field.onBlur}
                          error={!!errors[key]}
                          helperText={errors[key]?.message?.toString() || ""}
                          label={getLabel(name)}
                          margin="normal"
                          type="date"
                          value={value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val ? new Date(val) : null);
                          }}
                          inputRef={field.ref}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          variant="outlined"
                        />
                      );
                    }}
                  />
                </Grid>
              );
            }

            if (
              innerType instanceof ZodEnum ||
              innerType instanceof ZodNativeEnum
            ) {
              const enumValues =
                innerType instanceof ZodEnum
                  ? innerType.options
                  : Object.values(innerType._def.values).filter(
                      (v) => typeof v === "string" || typeof v === "number"
                    );

              return (
                <Grid key={name} size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name={safeName}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        margin="normal"
                        label={getLabel(name)}
                        error={!!errors[key]}
                        helperText={errors[key]?.message?.toString() || ""}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      >
                        {enumValues.map((val: any) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              );
            }

            return null;
          })}

          {extraInputs.map((component, idx) => (
            <Grid key={`extra-input-${idx}`} size={{ xs: 12 }}>
              {component}
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={formStatus.status === "loading"}
            startIcon={
              formStatus.status === "loading" ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {formStatus.status === "loading"
              ? submittingButtonText
              : submitButtonText}
          </Button>
        </Box>
      </Box>

      {formStatus.status !== "idle" &&
        formStatus.status !== "loading" &&
        formStatus.message && (
          <Box mt={3}>
            <Alert
              severity={
                formStatus.status === "error"
                  ? "error"
                  : formStatus.status === "success"
                  ? "success"
                  : "info"
              }
              variant="filled"
              sx={{
                overflow: "visible",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                display: "inline-block",
                width: "90%",
                minHeight: "auto",
              }}
            >
              {formStatus.message}
            </Alert>
          </Box>
        )}
    </Paper>
  );
}

export function getDefaultValuesFromSchema<T extends ZodObject<any>>(
  schema: T
): Partial<z.infer<T>> {
  const shape = schema.shape;
  const defaults: any = {};

  for (const key in shape) {
    const field = shape[key];

    const type = field._def.typeName;

    switch (type) {
      case "ZodString":
        defaults[key] = "";
        break;
      case "ZodNumber":
        defaults[key] = undefined;
        break;
      case "ZodBoolean":
        defaults[key] = false;
        break;
      case "ZodDate":
        defaults[key] = undefined;
        break;
      case "ZodEnum":
        defaults[key] = field._def.values[0];
        break;
      case "ZodOptional":
      case "ZodNullable":
        defaults[key] = undefined;
        break;
      default:
        defaults[key] = undefined;
    }
  }

  return defaults;
}
