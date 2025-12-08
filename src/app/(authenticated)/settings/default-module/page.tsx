import { Typography, Box } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import Link from "next/link";

export default function () {
  return (
    <Box>
          <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: "6px 42px",
        borderRadius: 1.5,
        gap: 1,
        width: "100%",
        height: "50vh",
        mb: 3,
        }}
      >
      <ConstructionIcon sx={{ fontSize: 96, color: "#f59e0b" }} />
      <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
        Page Under Construction
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#9ca3af", mt: 1, maxWidth: 400 }}
      >
        We're currently working on this page to bring you something awesome.
        Stay tuned!
      </Typography>
    </Box>
    </Box>
  );
}
