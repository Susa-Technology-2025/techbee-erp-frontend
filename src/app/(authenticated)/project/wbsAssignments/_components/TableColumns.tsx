import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "internalResourceName", header: "Name" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "allocationPercent", header: "Allocation Percent" },
  {
    accessorKey: "startDate",
    header: "Start Date",
    Cell: ({ cell }) => {
      const v = cell.getValue();
      return v ? new Date(v).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    Cell: ({ cell }) => {
      const v = cell.getValue();
      return v ? new Date(v).toLocaleDateString() : "";
    },
  },
];
