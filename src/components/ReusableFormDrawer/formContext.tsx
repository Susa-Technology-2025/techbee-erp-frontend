import React, { createContext, useContext, ReactNode } from "react";
import {
  useForm,
  FormProvider,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContextProps, ReusableFormDrawerProps } from "./types";
import { useNotification } from "./notifications";

const FormContext = createContext<FormContextProps<any> | undefined>(undefined);

export function useReusableFormContext<FormValues extends FieldValues>() {
  const context = useContext<FormContextProps<FormValues> | undefined>(
    FormContext
  );
  if (!context) {
    throw new Error(
      "useReusableFormContext must be used within a FormProviderWrapper"
    );
  }
  return context;
}

interface FormProviderWrapperProps<FormValues extends FieldValues> {
  children: ReactNode;
  props: ReusableFormDrawerProps<FormValues>;
}

export function FormProviderWrapper<FormValues extends FieldValues>({
  children,
  props,
}: FormProviderWrapperProps<FormValues>) {
  const { formMode, zodSchema, initialData } = props;
  const { notify } = useNotification();

  const defaultValues = formMode === "edit" ? initialData || {} : undefined;

  const methods =
    formMode !== "view"
      ? useForm<FormValues>({
          resolver: zodResolver(zodSchema),
          shouldFocusError: true,
          mode: "onSubmit",
          defaultValues,
        })
      : null;

  if (formMode === "view") {
    return <>{children}</>;
  }

  return (
    <FormContext.Provider value={{ methods: methods!, formMode, notify }}>
      <FormProvider {...methods!}>{children}</FormProvider>
    </FormContext.Provider>
  );
}
