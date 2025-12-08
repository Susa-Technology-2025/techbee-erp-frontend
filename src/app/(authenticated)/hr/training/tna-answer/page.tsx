"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingNeedAnswerSchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingNeedAnswerSchema} />;
};
