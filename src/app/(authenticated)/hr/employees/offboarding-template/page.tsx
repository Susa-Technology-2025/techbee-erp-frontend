"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { offboardingTemplateSchema } from "@/lib/schemas/offboarding";

export default () => {
  return <MaterialTableWrapper schema={offboardingTemplateSchema} />;
};
