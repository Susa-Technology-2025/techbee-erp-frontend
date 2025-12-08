"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { employeeSchema } from "@/lib/schemas/employees";

export default () => {
  return <MaterialTableWrapper schema={employeeSchema} />;
};
