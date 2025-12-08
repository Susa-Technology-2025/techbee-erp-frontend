import React from "react";
import { ZodObject, ZodRawShape } from "zod";
import { FieldValues } from "react-hook-form";

interface ViewOnlyRendererProps<FormValues extends FieldValues> {
  viewComponent: React.ComponentType<{
    data: FormValues;
    loading: boolean;
    error?: any;
    schema: ZodObject<ZodRawShape>;
  }>;
  data: FormValues;
  loading?: boolean;
  error?: any;
  zodSchema: ZodObject<ZodRawShape>;
}

export function ViewOnlyRenderer<FormValues extends FieldValues>({
  viewComponent: ViewComponent,
  data,
  loading = false,
  error,
  zodSchema,
}: ViewOnlyRendererProps<FormValues>) {
  return (
    <ViewComponent
      data={data}
      loading={loading}
      error={error}
      schema={zodSchema}
    />
  );
}
