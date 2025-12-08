import { ReactNode } from "react";
import { ZodObject, ZodRawShape } from "zod";
import { UseFormReturn, FieldValues } from "react-hook-form";

export type FormMode = "create" | "edit" | "view";

export type NotificationType = "success" | "error" | "loading";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string | ReactNode;
  duration?: number;
}

export type NotifyFunction = (notification: Omit<Notification, "id">) => void;

export interface AdditionalButtonProps<FormValues extends FieldValues> {
  formData: FormValues;
}

export type AdditionalButtonRenderer<FormValues extends FieldValues> = (
  props: AdditionalButtonProps<FormValues>
) => ReactNode;

export interface ReusableFormDrawerProps<FormValues extends FieldValues> {
  open: boolean;
  onClose: () => void;
  headerTitle?: string;
  queryKeys?: string[];
  headerDescription?: string;
  additionalData?: any;
  createButtonName?: string;
  updateButtonName?: string;
  formMode: FormMode;
  apiEndPoint: string;
  zodSchema: ZodObject<ZodRawShape>;
  fieldsComponent: ReactNode;
  additionalButtons?: AdditionalButtonRenderer<FormValues>;
  notify?: NotifyFunction;
  viewComponent?: React.ComponentType<{
    data: FormValues;
    loading: boolean;
    error?: any;
    schema: ZodObject<ZodRawShape>;
  }>;
  viewData?: FormValues;
  initialData?: FormValues;
}

export interface FormContextProps<FormValues extends FieldValues> {
  methods: UseFormReturn<FormValues>;
  formMode: FormMode;
  notify?: NotifyFunction;
}

export interface SubmitHandlerParams<FormValues extends FieldValues> {
  formData: FormValues;
  apiEndPoint: string;
  id?: string;
  notify?: NotifyFunction;
}

export interface ViewOnlyProps<FormValues extends FieldValues> {
  data: FormValues;
  apiEndPoint: string;
  zodSchema: ZodObject<ZodRawShape>;
}
