"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { exitSurveyResponseSchema } from "@/lib/schemas/offboarding";

export default () => {
  return <MaterialTableWrapper schema={exitSurveyResponseSchema} />;
};
