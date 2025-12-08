"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { salaryRuleCategorySchema } from "@/lib/schemas/payroll/salary-rule-categories";

export default () => {
  return <MaterialTableWrapper schema={salaryRuleCategorySchema} />;
};
