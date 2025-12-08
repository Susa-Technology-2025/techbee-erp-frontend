import {
  type MRT_TableInstance,
  type MRT_ColumnDef,
} from "material-react-table";
import { z } from "zod";

export type Session = {
  id: string;
  loggedIn: boolean;
  organizationId: string;
  profilePicture: string;
  role: string[];
  username: string;
  xTenantCode: string;
};

export type ExportType =
  | "pdf-all"
  | "pdf-page"
  | "pdf-selected"
  | "xlsx-all"
  | "xlsx-page"
  | "xlsx-selected";

export type TableHeader = {
  text: string;
  style: string;
};

export type ExportDialogProps<T extends z.ZodTypeAny> = {
  open: boolean;
  onClose: () => void;
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  tableTitle: string;
};

export type ReportDetailsSectionProps = {
  companyName: string;
  setCompanyName: (value: string) => void;
  reportTitle: string;
  setReportTitle: (value: string) => void;
  preparedBy: string;
  setPreparedBy: (value: string) => void;
  reportDate: string;
  setReportDate: (value: string) => void;
  reportVersion: string;
  setReportVersion: (value: string) => void;
  confidentiality: string;
  setConfidentiality: (value: string) => void;
  reportPeriod: string;
  setReportPeriod: (value: string) => void;
  approvalStatus: string;
  setApprovalStatus: (value: string) => void;
  recipient: string;
  setRecipient: (value: string) => void;
  projectCode: string;
  setProjectCode: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  referenceNumber: string;
  setReferenceNumber: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  disclaimer: string;
  setDisclaimer: (value: string) => void;
  dataSource: string;
  setDataSource: (value: string) => void;
  customNote: string;
  setCustomNote: (value: string) => void;
};

export type ExportConfigurationSectionProps<T extends z.ZodTypeAny> = {
  exportType: ExportType;
  setExportType: (type: ExportType) => void;
  pdfPassword: string;
  setPdfPassword: (password: string) => void;
  table: MRT_TableInstance<z.infer<T>>;
  columns: MRT_ColumnDef<z.infer<T>>[];
  selectedColumns: string[];
  handleToggleColumn: (columnId: string) => void;
};

export type ColumnSelectionProps<T extends z.ZodTypeAny> = {
  columns: MRT_ColumnDef<z.infer<T>>[];
  selectedColumns: string[];
  handleToggleColumn: (columnId: string) => void;
};

export type ExportDialogActionsProps = {
  onClose: () => void;
  handleExport: () => void;
  isGenerating: boolean;
};
