import { Grid } from "@mui/material";
import { headers } from "next/headers";
import { defaultData } from "./_components/default";
import { ResponsiveNavigation } from "@/components/public-navbar";
import { Suspense } from "react";
import { TechBeeLandingPage } from "./_components/main-landing";

type Params = {
  children: React.ReactNode;
};
async function PublicNavBar() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";

  const tenant = host.split(".")[0] || "";
  let data = null;
  try {
    const API_ENDPOINT = `https://api.techbee.et/api/core/landingPages?where[code]=${tenant}`;
    const res = await fetch(API_ENDPOINT, {
      headers: {
        "Content-Type": "application/json",
        "x-tenant-code": tenant,
      },
    });

    const json = await res.json();
    data = json?.data?.[0] || null;
  } catch (error) {
    data = defaultData;
  }

  return <ResponsiveNavigation logo={data?.logo} code={data?.code} />;
}
export default async function RootLayout({ children }: Params) {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const subscribedTenants = ["minda", "vamdas"];

  const tenant = host.split(".")[0] || "";
  if (!subscribedTenants.includes(tenant)) return <TechBeeLandingPage />;
  return (
    <Grid
      direction="column"
      position={"relative"}
      gap={1}
      sx={{
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none",
        bgcolor: "background.paper",
      }}
    >
      <Suspense>
        <PublicNavBar />
      </Suspense>
      <Grid>{children}</Grid>
    </Grid>
  );
}
