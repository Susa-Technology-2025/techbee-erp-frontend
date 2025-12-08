"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingRequestTargetEmployeeSchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingRequestTargetEmployeeSchema} />;
};
