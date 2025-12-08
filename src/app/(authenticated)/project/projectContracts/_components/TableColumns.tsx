import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "notes", header: "Notes" },
  { accessorKey: "linkedInvoiceRef", header: "Linked Invoice Ref" },
  { accessorKey: "currency", header: "Currency" },
  { accessorKey: "defaultRate", header: "Default Rate" },
  { accessorKey: "billingMethod.id", header: "Billing Method" },
  { accessorKey: "project.id", header: "Project" }
];