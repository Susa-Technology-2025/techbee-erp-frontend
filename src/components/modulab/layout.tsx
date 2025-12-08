import ResponsiveNavbar from "@/components/modulab/navbar";
import { Box } from "@mui/material";
import MiniSidebarDrawer from "@/components/modulab/sidebar";

export default function MainLayout({ children }: any) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
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
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
