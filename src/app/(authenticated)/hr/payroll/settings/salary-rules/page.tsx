"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { salaryRuleSchema } from "@/lib/schemas/payroll/salary-rule";

export default () => {
  return <MaterialTableWrapper schema={salaryRuleSchema} />;
};
