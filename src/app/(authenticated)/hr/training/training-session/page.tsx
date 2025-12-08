"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingSessionSchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingSessionSchema} />;
};
