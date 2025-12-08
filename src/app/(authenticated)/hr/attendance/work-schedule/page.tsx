"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { workScheduleSchema } from "@/lib/schemas/leave/settings";

export default () => {
  return <MaterialTableWrapper schema={workScheduleSchema} />;
};
