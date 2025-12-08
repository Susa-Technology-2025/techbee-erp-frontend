import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Control } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";
import { getZodMetadata } from "@/lib/zod-extensions";
import { AsyncObjectSelect } from "./async-object-select";

interface SchemaToFormFieldMapperProps {
  field: any;
  control: Control<any>;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
  error?: boolean;
  helperText?: string;
  nestedSchema?: z.ZodObject<any, any, any>;
  nestedQueryHook?: (arg?: any) => any;
  nestedCreateMutationHook?: () => any;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  valueIsObject?: boolean;
  nestedExternalSchemaHooks?: NestedSchemaHooks;
  isRequired?: boolean;
}

export function SchemaToFormFieldMapper(props: SchemaToFormFieldMapperProps) {
  const {
    field,
    control,
    name,
    label,
    type,
    placeholder,
    options,
    description,
    error,
    helperText,
    nestedSchema,
    nestedQueryHook,
    nestedCreateMutationHook,
    getOptionLabel,
    getOptionValue,
    valueIsObject = false,
    nestedExternalSchemaHooks,
    isRequired,
  } = props;

  const finalLabel = isRequired ? `${label} *` : label;

  switch (type) {
    case "string":
    case "textarea":
      return (
        <FormControl fullWidth margin="dense" error={error} variant="standard">
          <TextField
            {...field}
            label={finalLabel}
            value={field.value || ""}
            placeholder={placeholder}
            fullWidth
            variant="standard"
            multiline={type === "textarea"}
            rows={type === "textarea" ? 4 : 1}
            error={error}
            helperText={helperText}
            size="small"
          />
        </FormControl>
      );
    case "number":
      return (
        <FormControl fullWidth margin="dense" error={error} variant="standard">
          <TextField
            {...field}
            label={finalLabel}
            type="number"
            value={field.value || ""}
            placeholder={placeholder}
            fullWidth
            variant="standard"
            error={error}
            helperText={helperText}
            onChange={(e) => {
              field.onChange(parseFloat(e.target.value));
            }}
            size="small"
          />
        </FormControl>
      );
    case "boolean":
      return (
        <FormControl fullWidth margin="dense" error={error}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
                size="small"
              />
            }
            label={finalLabel}
            sx={{ fontSize: "0.875rem" }}
          />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );
    case "enum":
      return (
        <FormControl fullWidth margin="dense" error={error} variant="standard">
          <InputLabel size="small">{finalLabel}</InputLabel>
          <Select
            {...field}
            label={finalLabel}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
            size="small"
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );
    case "date":
      return (
        <FormControl fullWidth margin="dense" error={error} variant="standard">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={finalLabel}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date ? date.toDate() : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "standard",
                  error: error,
                  helperText: helperText,
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
        </FormControl>
      );
    case "radio":
      return (
        <FormControl
          component="fieldset"
          fullWidth
          margin="dense"
          error={error}
        >
          <FormLabel component="legend" sx={{ fontSize: "0.875rem" }}>
            {finalLabel}
          </FormLabel>
          <RadioGroup
            {...field}
            value={field.value || ""}
            onChange={(e) => field.onChange(e.target.value)}
          >
            {options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={option.label}
                sx={{ fontSize: "0.875rem" }}
              />
            ))}
          </RadioGroup>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );
    case "object":
      if (
        !nestedSchema ||
        !nestedQueryHook ||
        !nestedCreateMutationHook ||
        !getOptionLabel ||
        !getOptionValue
      ) {
        console.error(`Missing props for AsyncObjectSelect for field: ${name}`);
        return null;
      }
      return (
        <AsyncObjectSelect
          field={field}
          control={control}
          name={name}
          label={finalLabel}
          nestedSchema={nestedSchema}
          nestedQueryHook={nestedQueryHook}
          nestedCreateMutationHook={nestedCreateMutationHook}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          description={description}
          error={error}
          helperText={helperText}
          valueIsObject={valueIsObject}
          nestedExternalSchemaHooks={nestedExternalSchemaHooks}
        />
      );
    default:
      return null;
  }
}

function getCoreType(zodType: z.ZodTypeAny): z.ZodTypeAny {
  if (!zodType) return zodType;

  let currentType = zodType;
  while (true) {
    const typeName = currentType._def?.typeName;
    if (
      typeName === z.ZodFirstPartyTypeKind.ZodOptional ||
      typeName === z.ZodFirstPartyTypeKind.ZodNullable ||
      typeName === z.ZodFirstPartyTypeKind.ZodDefault
    ) {
      currentType = currentType._def.innerType;
    } else if (typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
      currentType = currentType._def.schema;
    } else if (typeName === z.ZodFirstPartyTypeKind.ZodUnion) {
      currentType = currentType._def.options[0];
    } else if (
      typeName === z.ZodFirstPartyTypeKind.ZodBranded ||
      typeName === z.ZodFirstPartyTypeKind.ZodCatch ||
      typeName === z.ZodFirstPartyTypeKind.ZodPipeline ||
      typeName === z.ZodFirstPartyTypeKind.ZodReadonly
    ) {
      currentType = currentType._def.innerType;
    } else {
      break;
    }
  }
  return currentType;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
  isRequired?: boolean;
  nestedSchema?: z.ZodObject<any, any, any>;
  nestedQueryHook?: (arg?: any) => any;
  nestedCreateMutationHook?: () => any;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  valueIsObject?: boolean;
  nestedExternalSchemaHooks?: NestedSchemaHooks;
}

export interface FormSectionConfig {
  title?: string;
  fields: FormFieldConfig[];
}

export interface NestedSchemaHooks {
  [key: string]: {
    schema: z.ZodObject<any, any, any>;
    queryHook: (arg?: any) => any;
    createMutationHook: () => any;
    getOptionLabel: (option: any) => string;
    getOptionValue: (option: any) => any;
    nestedExternalSchemaHooks?: NestedSchemaHooks;
  };
}

export function mapZodSchemaToFormFields(
  schema: z.ZodObject<any, any, any, any, any>,
  nestedSchemaHooks?: NestedSchemaHooks
): FormSectionConfig[] {
  const sections: { [key: string]: FormFieldConfig[] } = {};

  const excludedFields = ["createdAt", "updatedAt", "createdBy", "updatedBy"];

  for (const key in schema.shape) {
    if (excludedFields.includes(key) || key === "id") continue;

    const fieldSchema = schema.shape[key];
    const coreType = getCoreType(fieldSchema);
    const coreTypeName = coreType?._def?.typeName;
    const metadata = getZodMetadata(fieldSchema);

    const isRequired = !(
      fieldSchema.isOptional?.() || fieldSchema.isNullable?.()
    );

    let type = "string";
    let options: { label: string; value: string }[] | undefined;

    let nestedSchemaProps: Partial<FormFieldConfig> = {};

    if (
      metadata?.external &&
      (coreTypeName === "ZodObject" ||
        key === "userId" ||
        key === "organizationNodeId")
    ) {
      type = "object";
      if (nestedSchemaHooks && nestedSchemaHooks[key]) {
        nestedSchemaProps = {
          nestedSchema: nestedSchemaHooks[key].schema,
          nestedQueryHook: nestedSchemaHooks[key].queryHook,
          nestedCreateMutationHook: nestedSchemaHooks[key].createMutationHook,
          getOptionLabel: nestedSchemaHooks[key].getOptionLabel,
          getOptionValue: nestedSchemaHooks[key].getOptionValue,
          nestedExternalSchemaHooks:
            nestedSchemaHooks[key].nestedExternalSchemaHooks,
        };
      } else {
        console.warn(`Missing nested schema hooks for field: ${key}`);
        continue;
      }
    } else if (coreTypeName === "ZodString") {
      type = metadata?.textarea ? "textarea" : "string";
    } else if (coreTypeName === "ZodNumber") {
      type = "number";
    } else if (coreTypeName === "ZodBoolean") {
      type = "boolean";
    } else if (coreTypeName === "ZodEnum") {
      type = "enum";
      options = coreType._def.values.map((value: string) => ({
        label: value,
        value,
      }));
    } else if (coreTypeName === "ZodDate") {
      type = "date";
    } else if (coreTypeName === "ZodNativeEnum") {
      type = "enum";
      options = Object.keys(coreType._def.values).map((key) => ({
        label: key,
        value: coreType._def.values[key],
      }));
    } else if (coreTypeName === "ZodArray") {
      console.warn(`Skipping array field: ${key}`);
      continue;
    } else if (coreTypeName === "ZodObject") {
      console.warn(`Skipping nested ZodObject field: ${key}`);
      continue;
    }

    const fieldConfig: FormFieldConfig = {
      name: key,
      label: (fieldSchema._def.description || key)
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str: string) => str.toUpperCase()),
      type,
      placeholder: metadata?.placeholder,
      options,
      description: metadata?.description,
      isRequired,
      valueIsObject: !!metadata?.nested,
      ...nestedSchemaProps,
    };

    const sectionTitle = metadata?.section || "General";
    if (!sections[sectionTitle]) sections[sectionTitle] = [];
    sections[sectionTitle].push(fieldConfig);
  }

  return Object.keys(sections).map((title) => ({
    title: title === "General" ? undefined : title,
    fields: sections[title],
  }));
}
