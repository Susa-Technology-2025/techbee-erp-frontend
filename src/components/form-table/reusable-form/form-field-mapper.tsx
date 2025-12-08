import { type ZodType } from "zod";
import type { FieldLevelMeta, FormFieldType } from "@/lib/schemas/types";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { DatePicker, TimePicker, DateTimePicker } from "@mui/x-date-pickers";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Fragment, type JSX, useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import AutocompleteField from "./auto-complete";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChipsField from "./chips-filed";
import InputLabel from "@mui/material/InputLabel";
import MarkdownField from "./markdown-filed";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { unwrap } from "./mapper-functions";
import Typography from "@mui/material/Typography";
import TemplateField from "./template-field";
import { ExpressionField } from "./expression-field";
import FileField from "./file-input"; // Import the new component

type MapperProps = {
  field: ZodType;
  name: string;
  value?: any;
  onChange?: (value: any) => void;
  meta: FieldLevelMeta;
  disabled?: boolean;
  disabledValues?: any;
};

export function FormFieldMapper({
  field,
  name,
  value,
  onChange,
  meta,
  disabled,
  disabledValues,
}: MapperProps): JSX.Element {
  const { formRelated } = meta;
  const [showPassword, setShowPassword] = useState(false);
  const effectiveDisabled =
    disabled || formRelated.disabled || disabledValues?.[name] === true;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const methods = (() => {
    try {
      return useFormContext();
    } catch {
      return null;
    }
  })();

  if (!methods) {
    return <Fragment />;
  }

  const { setValue, watch } = methods;

  const dependentValue = formRelated.conditional
    ? watch(formRelated.conditional.dependsOn)
    : undefined;

  const shouldHide =
    formRelated.conditional &&
    ((formRelated.conditional.hideIf !== undefined &&
      dependentValue === formRelated.conditional.hideIf) ||
      (formRelated.conditional.showIf !== undefined &&
        dependentValue !== formRelated.conditional.showIf));

  useEffect(() => {
    if (shouldHide) {
      setValue(name, null);
    }
  }, [shouldHide, name, setValue]);

  if (shouldHide) {
    return <Fragment />;
  }

  const renderInput = (
    controlledValue: any,
    controlledOnChange: (val: any) => void,
    error?: boolean
  ): JSX.Element => {
    const helperText = error
      ? formRelated.validationErrorMessage
      : formRelated.description;

    function isZodFieldRequired(field: ZodType): boolean {
      const isOptional = field.safeParse(undefined).success;
      return !isOptional;
    }

    const isRequired = isZodFieldRequired(field);
    const templateEndpoint =
      formRelated.templateEndpoint ??
      "https://api.techbee.et/api/hr/onboardingTemplates";
    const labelWithAsterisk = isRequired
      ? `${formRelated.label ?? name}`
      : formRelated.label ?? name;

    const toDayjs = (val?: Date | null) => (val ? dayjs(val) : null);
    const handleDateChange = (val: Dayjs | null) =>
      controlledOnChange(val?.toDate() ?? undefined);

    switch (formRelated.inputType as FormFieldType) {
      case "text-field":
        return (
          <TextField
            label={labelWithAsterisk}
            placeholder={formRelated.placeholder}
            disabled={effectiveDisabled}
            required={isRequired}
            value={controlledValue ?? ""}
            onChange={(e) => controlledOnChange(e.target.value)}
            helperText={helperText}
            variant="standard"
            error={Boolean(error)}
            fullWidth
          />
        );

      case "number-field":
        return (
          <TextField
            type="number"
            label={labelWithAsterisk}
            placeholder={formRelated.placeholder}
            disabled={effectiveDisabled}
            required={isRequired}
            value={controlledValue ?? ""}
            onChange={(e) =>
              controlledOnChange((e.target as HTMLInputElement).valueAsNumber)
            }
            helperText={helperText}
            variant="standard"
            error={Boolean(error)}
            fullWidth
          />
        );

      case "password-field":
        return (
          <TextField
            label={labelWithAsterisk}
            type={showPassword ? "text" : "password"}
            placeholder={formRelated.placeholder}
            disabled={effectiveDisabled}
            required={isRequired}
            value={controlledValue ?? ""}
            onChange={(e) => controlledOnChange(e.target.value)}
            helperText={helperText}
            variant="standard"
            error={Boolean(error)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );

      case "boolean-field":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(controlledValue)}
                onChange={(e) => controlledOnChange(e.target.checked)}
                disabled={effectiveDisabled}
              />
            }
            label={labelWithAsterisk}
          />
        );

      case "text-area":
        return (
          <Box>
            <TextField
              placeholder={formRelated.placeholder}
              error={Boolean(error)}
              multiline
              helperText={helperText}
              variant="standard"
              disabled={effectiveDisabled}
              value={controlledValue ?? ""}
              onChange={(e) => controlledOnChange(e.target.value)}
              fullWidth
              label={labelWithAsterisk}
              required={isRequired}
            />
          </Box>
        );

      case "date-time":
        if (formRelated.date?.type === "date-only") {
          return (
            <DatePicker
              label={labelWithAsterisk}
              value={toDayjs(controlledValue)}
              onChange={handleDateChange}
              minDate={
                formRelated.date?.min ? dayjs(formRelated.date.min) : undefined
              }
              maxDate={
                formRelated.date?.max ? dayjs(formRelated.date.max) : undefined
              }
              slotProps={{
                textField: {
                  helperText,
                  error: Boolean(error),
                  variant: "standard",
                  required: isRequired,
                },
              }}
            />
          );
        }

        if (formRelated.date?.type === "time-only") {
          return (
            <TimePicker
              label={labelWithAsterisk}
              value={toDayjs(controlledValue)}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  helperText,
                  error: Boolean(error),
                  variant: "standard",
                  required: isRequired,
                },
              }}
            />
          );
        }

        if (formRelated.date?.type === "date-and-time") {
          return (
            <DateTimePicker
              label={labelWithAsterisk}
              value={toDayjs(controlledValue)}
              onChange={handleDateChange}
              minDateTime={
                formRelated.date?.min ? dayjs(formRelated.date.min) : undefined
              }
              maxDateTime={
                formRelated.date?.max ? dayjs(formRelated.date.max) : undefined
              }
              slotProps={{
                textField: {
                  helperText,
                  error: Boolean(error),
                  variant: "standard",
                },
              }}
            />
          );
        }

        return (
          <DateTimePicker
            label={labelWithAsterisk}
            value={toDayjs(controlledValue)}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                helperText,
                error: Boolean(error),
                variant: "standard",
                required: isRequired,
              },
            }}
          />
        );

      case "auto-complete":
        return (
          <AutocompleteField
            value={controlledValue}
            label={labelWithAsterisk}
            onChange={controlledOnChange}
            meta={meta}
            helperText={helperText}
            error={Boolean(error)}
            required={isRequired}
            disabled={effectiveDisabled}
          />
        );
      case "chips":
        return (
          <ChipsField
            label={labelWithAsterisk}
            value={controlledValue ?? []}
            onChange={controlledOnChange}
            placeholder={formRelated.placeholder}
            disabled={effectiveDisabled}
            error={Boolean(error)}
            helperText={helperText}
            required={isRequired}
            meta={meta}
          />
        );
      case "markdown":
        return (
          <MarkdownField
            label={labelWithAsterisk}
            value={controlledValue}
            onChange={controlledOnChange}
            helperText={helperText}
            error={Boolean(error)}
            disabled={effectiveDisabled}
          />
        );
      case "question-template":
        return (
          <TemplateField
            label={labelWithAsterisk}
            apiEndPoint={templateEndpoint}
            value={controlledValue}
            onChange={controlledOnChange}
          />
        );

      case "file":
        if (!formRelated.file) return <Fragment />;
        return (
          <FileField
            label={labelWithAsterisk}
            helperText={helperText}
            error={Boolean(error)}
            disabled={effectiveDisabled}
            value={controlledValue}
            onChange={controlledOnChange}
            allowedFileTypes={formRelated.file.allowedFileTypes}
            minSize={formRelated.file.min}
            maxSize={formRelated.file.max}
          />
        );
      case "primitive-array":
        if (!methods) return <Fragment />;

        const {
          fields: primitiveFields,
          append: appendPrimitive,
          remove: removePrimitive,
        } = useFieldArray({
          control: methods.control,
          name: name,
        });

        return (
          <Box>
            <Typography variant="subtitle1">{labelWithAsterisk}</Typography>
            <Grid size={{ xs: 12 }} container spacing={2} sx={{ mt: 1 }}>
              {primitiveFields.map((item, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      label={`${formRelated.label} #${index + 1}`}
                      variant="standard"
                      fullWidth
                      {...methods.register(`${name}.${index}`)}
                      disabled={effectiveDisabled}
                    />
                    <IconButton
                      onClick={() => removePrimitive(index)}
                      disabled={effectiveDisabled}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <IconButton
              onClick={() => appendPrimitive("")}
              disabled={effectiveDisabled}
            >
              <AddIcon />
            </IconButton>
          </Box>
        );

      case "object-array":
        if (!methods) return <Fragment />;

        const {
          fields: objectFields,
          append: appendObject,
          remove: removeObject,
        } = useFieldArray({
          control: methods.control,
          name: name,
        });
        const objectSchema = unwrap(field)._def.element;
        const objectShape = unwrap(objectSchema).shape;

        return (
          <Box>
            <Typography variant="subtitle1">{labelWithAsterisk}</Typography>
            <Grid size={{ xs: 12 }} container spacing={2} sx={{ mt: 1 }}>
              {objectFields.map((item, index) => (
                <Grid size={{ xs: 12 }} key={item.id}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      p: 2,
                      borderRadius: 1,
                      position: "relative",
                    }}
                  >
                    <IconButton
                      onClick={() => removeObject(index)}
                      sx={{ position: "absolute", top: 8, right: 8, zIndex: 7 }}
                      disabled={effectiveDisabled}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Grid size={{ xs: 12 }} container spacing={2}>
                      {Object.entries(objectShape).map(([subKey, subField]) => {
                        if (
                          subKey === "id" ||
                          subKey === "createdAt" ||
                          subKey === "updatedAt"
                        )
                          return null;
                        return (
                          <Grid size={{ xs: 12, md: 6 }} key={subKey}>
                            <FormFieldMapper
                              name={`${name}.${index}.${subKey}`}
                              field={subField as ZodType}
                              meta={(subField as any).meta()}
                              disabledValues={disabledValues}
                              disabled={effectiveDisabled}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <IconButton
              onClick={() => appendObject({})}
              disabled={effectiveDisabled}
            >
              <AddIcon />
            </IconButton>
          </Box>
        );
      case "expression-field":
        return (
          <ExpressionField
            name={name}
            label={labelWithAsterisk}
            helperText={helperText}
            error={Boolean(error)}
            disabled={effectiveDisabled}
            allowedVariablesEndpoint={
              formRelated.expression?.allowedVariablesEndpoint
            }
            getVariables={formRelated.expression?.getVariables}
          />
        );

      default:
        return <Fragment />;
    }
  };

  if (methods) {
    return (
      <Controller
        name={name}
        control={methods.control}
        render={({ field: rhfField, fieldState }) =>
          renderInput(
            rhfField.value,
            rhfField.onChange,
            Boolean(fieldState.error)
          )
        }
      />
    );
  }

  return renderInput(value, (val) => onChange?.(val), false);
}
