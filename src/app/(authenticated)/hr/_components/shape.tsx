import { Box } from "@mui/material";

export default function HRShapeBackground() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: { xs: "120%", md: "90%", lg: "70%" },
          height: { xs: "80%", md: "90%", lg: "100%" },
          backgroundColor: "section.main",
          clipPath: "polygon(0 0, 60% 0, 30% 100%, 0% 100%)",
          zIndex: 0,
        }}
      />
    </>
  );
}
