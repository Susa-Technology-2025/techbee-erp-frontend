"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { workEntrySchema } from "@/lib/schemas/attendance/work-entry";

export default () => {
  return <MaterialTableWrapper schema={workEntrySchema} />;
};
