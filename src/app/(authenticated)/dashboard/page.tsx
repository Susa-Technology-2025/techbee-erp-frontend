import { Box } from "@mui/material";
import { HubCardGrid } from "@/components/reusable-cards/cards-container";
import Greet from "./greetings";
import { DashLogo } from "./logo";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box
        sx={{
          width: "80%",
          mx: "auto",
          display: " flex",
          justifyContent: "space-between",
        }}
      >
        <DashLogo />
        <Greet />
      </Box>
      <HubCardGrid />
    </Box>
  );
}
