import { useEffect, forwardRef, useImperativeHandle, ReactNode } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box } from "@mui/material";

export type TableFormHandle<T extends z.ZodTypeAny> = {
  getFormMethods: () => UseFormReturn<z.infer<T>>;
  triggerSubmit: () => void;
  resetForm: (values?: z.infer<T>) => void;
};

type TableFormProps<T extends z.ZodTypeAny> = {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  defaultValues?: z.infer<T>;
  children?: (methods: UseFormReturn<z.infer<T>>) => ReactNode;
};

const TableForm = Object.assign(
  forwardRef(function TableFormInner<T extends z.ZodTypeAny>(
    { schema, onSubmit, defaultValues, children }: TableFormProps<T>,
    ref: React.Ref<TableFormHandle<T>>
  ) {
    const methods = useForm<z.infer<T>>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues as any,
    });

    const {
      handleSubmit,
      reset,
      formState: { errors },
    } = methods;
    console.log(errors);
    useEffect(() => {
      if (defaultValues) {
        reset(defaultValues as any);
      } else {
        reset({} as any);
      }
    }, [defaultValues, reset]);

    useImperativeHandle(ref, () => ({
      getFormMethods: () => methods,
      triggerSubmit: () => methods.handleSubmit(onSubmit)(),
      resetForm: (values?: z.infer<T>) => reset(values as any),
    }));

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              flex: "1",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {children && children(methods)}
          </Box>
        </FormProvider>
      </Box>
    );
  }),
  { displayName: "TableForm" }
) as <T extends z.ZodTypeAny>(
  props: TableFormProps<T> & { ref?: React.Ref<TableFormHandle<T>> }
) => React.ReactElement | null;

export default TableForm;
