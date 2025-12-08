import { ReactNode } from "react";
import SessioProvider from "@/lib/store/global-state/auth/session-provider";
import CustomShapeBackground from "@/components/shapes/main-shape";
import ResponsiveNavbar from "@/components/modulab/navbar";
import { Box } from "@mui/material";
import MiniSidebarDrawer from "@/components/modulab/sidebar";
export default function Page({ children }: { children: ReactNode }) {
  return (
    <SessioProvider>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          bgcolor: "backgroundSection.main",
        }}
      >
        <CustomShapeBackground />
        <MiniSidebarDrawer />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
            p: 0,
            m: 0,
          }}
        >
          <ResponsiveNavbar />
          <Box
            sx={{
              p: 2,
              overflow: "auto",
              position: "relative",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SessioProvider>
  );
}
