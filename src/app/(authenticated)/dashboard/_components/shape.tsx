import { Box } from "@mui/material";

export default function CustomShapeBackground() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: { xs: "150%", sm: "100%", md: "80%", lg: "60%" },
          height: { xs: "30%", sm: "40%", md: "50%", lg: "60%" },
          backgroundColor: "section.main",
          clipPath: "polygon(0 0, 100% 0, 75% 100%, 0% 70%)",
          transform: "rotate(-10deg) translate(-20%, -30%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: { xs: "150%", sm: "100%", md: "80%", lg: "60%" },
          height: { xs: "30%", sm: "40%", md: "50%", lg: "60%" },
          backgroundColor: "section.main",
          clipPath: "polygon(25% 0, 100% 30%, 100% 100%, 0% 100%)",
          transform: "rotate(10deg) translate(20%, 30%)",
          zIndex: 0,
        }}
      />
    </>
  );
}
