"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { OnboardingTemplateTaskCreateInputSchema } from "@/lib/schemas/recruitment/onboarding-template-tasks";

export default () => {
  return (
    <MaterialTableWrapper schema={OnboardingTemplateTaskCreateInputSchema} />
  );
};
