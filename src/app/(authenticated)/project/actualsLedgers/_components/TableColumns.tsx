import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "currency", header: "Currency" },
  { accessorKey: "date", header: "Date",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "isBillable", header: "Is Billable",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "isInvoiced", header: "Is Invoiced",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "sourceId", header: "Source Id" },
  { accessorKey: "sourceType", header: "Source Type" },
  { accessorKey: "wbsItem.id", header: "Wbs Item" }
];