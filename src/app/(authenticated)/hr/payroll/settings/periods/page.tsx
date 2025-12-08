"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { PayrollPeriodSchema } from "@/lib/schemas/payroll/payroll-period";

export default () => {
  return <MaterialTableWrapper schema={PayrollPeriodSchema} />;
};
