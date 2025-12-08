"use client";

import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { Box, InputLabel, TextField, Autocomplete } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setAdditionalQuestions } from "@/lib/store/question-slice";
import { useEffect } from "react";

type TemplateFieldProps = {
  label: string;
  apiEndPoint: string;
  value: any;
  onChange: (value: any) => void;
};

export default function TemplateField({
  label,
  apiEndPoint,
  value,
  onChange,
}: TemplateFieldProps) {
  const { data: { data: templates } = [], isLoading } = useDataQuery<any>({
    apiEndPoint,
  });

  const { reset } = useFormContext();
  const dispatch = useDispatch();

  const selectedTemplate = templates?.find((t) => t.id === value) || null;
  const isEditMode = !!value;

  useEffect(() => {
    if (isEditMode && selectedTemplate) {
      dispatch(setAdditionalQuestions(selectedTemplate.questions));
    }
  }, [isEditMode, selectedTemplate, dispatch]);

  return (
    <Box data-color-mode="light">
      <InputLabel shrink>{label}</InputLabel>
      <Autocomplete
        options={templates}
        loading={isLoading}
        getOptionLabel={(option: any) => option.title}
        value={selectedTemplate}
        isOptionEqualToValue={(option, selectedValue) =>
          selectedValue === null || option.id === selectedValue.id
        }
        onChange={(_, newValue) => {
          onChange(newValue ? newValue.id : "");

          if (newValue) {
            dispatch(setAdditionalQuestions(newValue.questions));
          } else {
            dispatch(setAdditionalQuestions([]));
            reset();
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Choose a template..."
            variant="standard"
          />
        )}
        sx={{ mb: 2 }}
      />
    </Box>
  );
}
