import React, { Suspense } from "react";
import { headers } from "next/headers";
import { Hero } from "./hero";
import { defaultData } from "./default";
import { Box, Skeleton } from "@mui/material";

export async function Loader() {
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

  return <Hero data={data} code={tenant} />;
}

export default function () {
  return (
    <Suspense
      fallback={
        <Box sx={{ height: "100vh", p: 2 }}>
          <Skeleton variant="rectangular" height="80%" />
        </Box>
      }
    >
      <Loader />
    </Suspense>
  );
}
