import { Box } from "@mui/material";

export default function HubShapeBackground() {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "section.main",

          clipPath: "polygon(0 0, 52% 16%, 100% 60%, 100% 99%, 0 99%, 0 81%)",
          zIndex: 0,
        }}
      />
    </>
  );
}
