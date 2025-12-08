import { z, ZodSchema } from "zod";
import { MRT_ColumnDef, MRT_TableInstance } from "material-react-table";

export interface DataImporterProps<T extends ZodSchema<any>> {
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  schema: T;
  mutation: any;
}

export interface DataTableProps<T extends ZodSchema<any>> {
  data: any[];
  headers: string[];
  setData: (data: any[]) => void;
  setHeaders: (headers: string[]) => void;
  schema: T;
  expectedColumns: MRT_ColumnDef<z.infer<T>>[];
  mutation: any;
  fileName: string;
  onClose: () => void;
  showSnackbar: (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export type SnackbarSeverity =
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;
