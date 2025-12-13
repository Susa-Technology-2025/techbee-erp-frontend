import { MRT_ColumnDef } from "material-react-table";
export const columns: MRT_ColumnDef<any, any>[] = [
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "phoneNumber", header: "Phone Number" },
  { accessorKey: "tenantCode", header: "Tenant Code" },
  { accessorKey: "typeField", header: "Type Field" },
  { accessorKey: "signupSource", header: "Signup Source" },
  { accessorKey: "isActive", header: "Is Active",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "isVerified", header: "Is Verified",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "mustResetPassword", header: "Must Reset Password",
  Cell: ({ cell }) => cell.getValue() ? "✔" : "✘" },
  { accessorKey: "emailVerifiedAt", header: "Email Verified At",
  Cell: ({ cell }) => {
    const v = cell.getValue();
    return v ? new Date(v).toLocaleDateString() : "";
  } }
];