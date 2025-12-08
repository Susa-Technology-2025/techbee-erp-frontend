"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { documentSchema } from "../documents";

export const DocumentsTab = ({ row }: any) => {
  return (
    <MaterialTableWrapper
      endpoint={`https://api.techbee.et/api/hr/employees/${row.id}/documents`}
      schema={documentSchema}
      disabledValues={{ "employee.id": true }}
      defaultValues={{ employee: { id: row.id } }}
    />
  );
};
