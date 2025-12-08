"use client";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { trainingNeedSurveySchema } from "@/lib/schemas/training";
// import { tnaSurveySchema } from "@/lib/schemas/training";

export default () => {
  return <MaterialTableWrapper schema={trainingNeedSurveySchema} />;
};
