"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { employeeBankAccountSchema } from "@/lib/schemas/employee-bank-account";

export const BankAccounts = ({ row }: any) => {
  return (
    <MaterialTableWrapper
      endpoint={`https://api.techbee.et/api/hr/employees/${row.id}/employeeBankAccounts`}
      schema={employeeBankAccountSchema}
      disabledValues={{ "employee.id": true }}
      defaultValues={{ employee: { id: row.id } }}
    />
  );
};
