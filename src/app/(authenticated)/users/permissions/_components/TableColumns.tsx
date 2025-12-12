import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "hub", header: "Hub" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "moduleField", header: "Module Field" },
  { accessorKey: "entity", header: "Entity" },
  { accessorKey: "backendEndpoint", header: "Backend Endpoint" },
  { accessorKey: "frontendEndpoint", header: "Frontend Endpoint" },
  { accessorKey: "service", header: "Service" },
  { accessorKey: "isActive", header: "Is Active",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "lastSyncedAt", header: "Last Synced At",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } }
];