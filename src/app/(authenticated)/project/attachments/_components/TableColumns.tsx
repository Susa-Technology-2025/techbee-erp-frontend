import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "fileName", header: "File Name" },
  { accessorKey: "url", header: "File Url" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "mimeType", header: "Mime Type" },
  { accessorKey: "sizeBytes", header: "Size Bytes" },
  { accessorKey: "version", header: "Version" },
  { accessorKey: "uploadedByEmployeeId", header: "Uploaded By Employee Id" },
  { accessorKey: "milestone.title", header: "Milestone" },
  { accessorKey: "wbsItem.title", header: "Wbs Item" }
];