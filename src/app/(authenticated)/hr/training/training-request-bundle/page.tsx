"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingRequestBundleSchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingRequestBundleSchema} />;
};
