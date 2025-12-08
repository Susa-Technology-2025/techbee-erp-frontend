import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "type", header: "Type" },
  { accessorKey: "lagDays", header: "Lag Days" },
  { accessorKey: "fromField", header: "From Field" },
  { accessorKey: "to", header: "To" }
];