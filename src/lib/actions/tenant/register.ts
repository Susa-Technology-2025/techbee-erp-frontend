import { tenantSchema, Tenant } from "@/app/dashboard/_schemas/tenant.schema";
import { fetcher } from "@/lib/fetch";

export async function registerTenant(data: Tenant) {
  const parsed = tenantSchema.safeParse(data);

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.flatten());
    throw new Error("Invalid tenant data");
  }
  console.log(parsed.data);
  return fetcher({
    method: "POST",
    endpoint: "/tenants",
    body: parsed.data,
    tenantCode: "default",
    tags: ["organization"],
  });
}
