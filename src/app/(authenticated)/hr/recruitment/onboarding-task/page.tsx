"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { OnboardingTaskAssignmentCreateSchema } from "@/lib/schemas/recruitment/onboard";

export default () => {
  return <MaterialTableWrapper schema={OnboardingTaskAssignmentCreateSchema} />;
};
