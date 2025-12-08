"use client";

import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { OnboardingTemplateCreateInputSchema } from "@/lib/schemas/recruitment/onboarding-templates";

export default () => {
  return <MaterialTableWrapper schema={OnboardingTemplateCreateInputSchema} />;
};
