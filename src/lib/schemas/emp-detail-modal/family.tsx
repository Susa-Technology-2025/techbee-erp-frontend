"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { dependentSchema } from "../employee/emp-dependents";

export const FamilyTab = ({ row }: any) => {
  return (
    <MaterialTableWrapper
      endpoint={`https://api.techbee.et/api/hr/employees/${row.id}/dependents`}
      schema={dependentSchema}
      disabledValues={{ "employee.id": true }}
      defaultValues={{ employee: { id: row.id } }}
    />
  );
};
