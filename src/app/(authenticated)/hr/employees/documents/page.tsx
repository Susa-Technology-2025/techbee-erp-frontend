"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { documentSchema } from "@/lib/schemas/documents";

export default () => {
  return <MaterialTableWrapper schema={documentSchema} />;
};
