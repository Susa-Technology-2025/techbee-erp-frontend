"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { contractSchema } from "@/lib/schemas/contracts";

export const ContractsTab = ({ row }: any) => {
  return (
    <MaterialTableWrapper
      endpoint={`https://api.techbee.et/api/hr/employees/${row.id}/contracts`}
      schema={contractSchema}
      disabledValues={{ "employee.id": true }}
      defaultValues={{ employee: { id: row.id } }}
    />
  );
};
