"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingRequestTnaSchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingRequestTnaSchema} />;
};
