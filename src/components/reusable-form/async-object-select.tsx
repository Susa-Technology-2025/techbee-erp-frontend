// AsyncObjectSelect.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Controller, Control } from "react-hook-form";
import { z } from "zod";
import { MRTAsyncAutoComplete } from "@/components/reusable-form/mrt-async-auto-complete";
import { ReusableFormModal } from "./form-modal";
import { useTheme } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import { NestedSchemaHooks } from "./schema-to-form-field-mapper";

interface AsyncObjectSelectProps {
  field: any;
  control: Control<any>;
  name: string;
  label: string;
  nestedSchema: z.ZodObject<any, any, any>;
  nestedQueryHook: (arg?: any) => any;
  nestedCreateMutationHook: () => any;
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => any;
  description?: string;
  error?: boolean;
  helperText?: string;
  valueIsObject?: boolean;
  nestedExternalSchemaHooks?: NestedSchemaHooks;
}

export function AsyncObjectSelect({
  field,
  control,
  name,
  label,
  nestedSchema,
  nestedQueryHook,
  nestedCreateMutationHook,
  getOptionLabel,
  getOptionValue,
  description,
  error,
  helperText,
  valueIsObject,
  nestedExternalSchemaHooks,
}: AsyncObjectSelectProps) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { data, isLoading } = nestedQueryHook(); // Fetch all data on mount, no search parameter
  const options = useMemo(() => data || [], [data]);

  const handleCreateNew = useCallback((value: string) => {
    setOpenCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setOpenCreateModal(false);
  }, []);

  const handleNewObjectCreated = useCallback(
    (newObject: any) => {
      field.onChange(getOptionValue(newObject));
      setOpenCreateModal(false);
      setInputValue("");
    },
    [field, getOptionValue]
  );

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <MRTAsyncAutoComplete
        value={field.value}
        onChange={(newValue) => {
          field.onChange(newValue);
          setInputValue("");
        }}
        onInputChange={(newInputValue) => setInputValue(newInputValue)}
        options={options} // Pass the full options array
        loading={isLoading}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        label={label}
        onCreate={handleCreateNew}
        currentInputValue={inputValue}
        error={error}
        helperText={helperText}
        valueIsObject={valueIsObject}
      />

      <ReusableFormModal
        isOpen={openCreateModal}
        onClose={handleCloseCreateModal}
        title={`Create New ${label}`}
        schema={nestedSchema}
        createMutationHook={nestedCreateMutationHook}
        onSuccess={handleNewObjectCreated}
        externalSchemaHooks={nestedExternalSchemaHooks}
      />
    </Box>
  );
}
