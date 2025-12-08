"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { holidaySchema } from "@/lib/schemas/leave/settings";

export default () => {
  return <MaterialTableWrapper schema={holidaySchema} />;
};
