import React from "react";
import { useReusableFormContext } from "./formContext";
import { FieldValues } from "react-hook-form";

interface RendererProps<FormValues extends FieldValues> {
  fieldsComponent: React.ReactNode;
}

export function Renderer<FormValues extends FieldValues>({
  fieldsComponent,
}: RendererProps<FormValues>) {
  const { formMode } = useReusableFormContext<FormValues>();

  if (formMode === "view") {
    return null; // In view mode, renderer does not render form fields
  }

  return <>{fieldsComponent}</>;
}
