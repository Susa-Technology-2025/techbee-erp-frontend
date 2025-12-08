import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useReusableFormContext } from "./formContext";
import { ReusableFormDrawerProps } from "./types";
import { FieldValues } from "react-hook-form";

interface HeaderProps<FormValues extends FieldValues> {
  props: ReusableFormDrawerProps<FormValues>;
}

export function Header<FormValues extends FieldValues>({
  props,
}: HeaderProps<FormValues>) {
  const { formMode } = props;
  if (formMode === "view") {
    return;
  }

  let methods, notify;
  if (formMode !== "view") {
    const context = useReusableFormContext<FormValues>();
    methods = context.methods;
    notify = context.notify;
  }

  return (
    <Box mb={2}>
      {props.headerTitle && (
        <Typography variant="h6" gutterBottom>
          {props.headerTitle}
        </Typography>
      )}
      {props.headerDescription && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {props.headerDescription}
        </Typography>
      )}

      {formMode !== "view" && props.additionalButtons && (
        <Stack direction="row" spacing={1} mt={2}>
          {props.additionalButtons({ formData: methods!.getValues() })}
        </Stack>
      )}
    </Box>
  );
}
