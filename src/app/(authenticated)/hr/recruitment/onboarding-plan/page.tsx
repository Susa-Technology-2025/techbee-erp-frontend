"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { OnboardingPlanCreateSchema } from "@/lib/schemas/recruitment/onboard";

export default () => {
  return <MaterialTableWrapper schema={OnboardingPlanCreateSchema} />;
};
