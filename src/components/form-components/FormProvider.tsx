"use client";

import { Box, Paper, SxProps, Theme } from "@mui/material";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodObject } from "zod";
import { FormTitle, FormDescription } from "@/components/form-components";
import { useEffect } from "react";

type FormProviderWrapperProps<T extends ZodObject<any>> = {
  schema: T;
  onSubmit: (data: any) => Promise<void> | void;
  children: React.ReactNode;
  defaultValues?: any;
  formTitle?: string;
  formDescription?: string;
  paperSx?: SxProps<Theme>;
  resetForm?: (reset: (values?: any) => void) => void;
  onFormMethodsReady?: (methods: UseFormReturn<any>) => void;
};

export const FormProviderWrapper = <T extends ZodObject<any>>({
  schema,
  onSubmit,
  children,
  defaultValues,
  formTitle,
  formDescription,
  paperSx,
  resetForm,
  onFormMethodsReady,
}: FormProviderWrapperProps<T>) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "all",
  });

  useEffect(() => {
    if (resetForm) resetForm(methods.reset);
  }, [resetForm, methods.reset]);

  useEffect(() => {
    if (onFormMethodsReady) {
      onFormMethodsReady(methods);
    }
  }, [methods, onFormMethodsReady]);

  const submitHandler = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Paper elevation={3} sx={paperSx}>
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(submitHandler)}
          noValidate
        >
          {formTitle && <FormTitle title={formTitle} />}
          {formDescription && <FormDescription text={formDescription} />}
          {children}
        </Box>
      </FormProvider>
    </Paper>
  );
};
