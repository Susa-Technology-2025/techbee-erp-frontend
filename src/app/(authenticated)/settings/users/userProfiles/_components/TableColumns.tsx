import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "address", header: "Address" },
  { accessorKey: "avatarUrl", header: "Avatar Url" },
  { accessorKey: "bio", header: "Bio" },
  { accessorKey: "dateOfBirth", header: "Date Of Birth",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "locale", header: "Locale" },
  { accessorKey: "nationality", header: "Nationality" },
  { accessorKey: "timezone", header: "Timezone" },
  { accessorKey: "user.username", header: "Username" },
  { accessorKey: "user.email", header: "Email" },
  { accessorKey: "user.firstName", header: "First Name" },
  { accessorKey: "user.lastName", header: "Last Name" },
  { accessorKey: "user.phoneNumber", header: "Phone Number" }
];