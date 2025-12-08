"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { WorkedDaysEntryCreateSchema } from "@/lib/schemas/payroll/work-day-entries";

export default () => {
  return <MaterialTableWrapper schema={WorkedDaysEntryCreateSchema} />;
};
