// import { headers } from "next/headers";
import "@fontsource/ubuntu/300.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CustomThemeProvider } from "@/theme";
import { ReactNode } from "react";
// import { getThemeFromCookie } from "@/theme/theme-cookie";
import { Providers } from "@/lib/store/provider";
import "./globals.css";

// export async function generateMetadata() {
//   const headerList = await headers();
//   const host =
//     headerList.get("x-forwarded-host") ||
//     headerList.get("host") ||
//     "erp.techbee.et";
//   const subscribedTenants = ["minda", "vamdas"];

//   const tenant = subscribedTenants.includes(host.split(".")[0])
//     ? host.split(".")[0]
//     : "techbee";

//   const baseUrl = `https://${tenant}.techbee.et`;

//   return {
//     metadataBase: new URL(baseUrl),
//     title: `${tenant.toUpperCase()} | ERP`,
//     description: `AI-powered ERP platform customized for ${tenant}, enabling secure digital transformation and operational efficiency.`,
//     keywords: [
//       `${tenant} ERP`,
//       "TechBee ERP",
//       "ERP Ethiopia",
//       "AI ERP",
//       "Government Compliant ERP",
//       "Digital Transformation",
//       "Operational Efficiency",
//     ],
//     alternates: { canonical: baseUrl },
//     openGraph: {
//       title: `${tenant.toUpperCase()} | AI-Integrated ERP for Ethiopia`,
//       description: `AI-Integrated, compliant ERP powering scalable digital transformation for ${tenant}.`,
//       url: baseUrl,
//       type: "website",
//       images: [{ url: "/images/TechBee.png", width: 1200, height: 630 }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: `${tenant.toUpperCase()} | TechBee ERP`,
//       description: `AI-Integrated ERP platform empowering ${tenant}.`,
//       images: ["/images/TechBee.png"],
//     },
//   };
// }

export default function Page({ children }: { children: ReactNode }) {
  // const themeName = await getThemeFromCookie();

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <html lang="en">
        <body
          style={{
            padding: 0,
            margin: 0,
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }}
        >
          <CustomThemeProvider initialTheme={"red"}>
            <Providers>{children}</Providers>
          </CustomThemeProvider>
        </body>
      </html>
    </AppRouterCacheProvider>
  );
}
