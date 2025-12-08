import { FC } from "react";
import { Box } from "@mui/material";

interface ShapeProps {
  width: string;
  height: string | any;
  clipPath: string;
  backgroundColor: string;
  zIndex?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

const ReusableShape: FC<ShapeProps> = ({
  width,
  height,
  clipPath,
  backgroundColor,
  zIndex = 0,
  right,
  bottom,
  top,
  left,
}) => {
  return (
    <>
      <style>{/*css only floating animations */}</style>
      <Box
        sx={{
          position: "absolute",
          width,
          height,
          backgroundColor,
          clipPath,
          zIndex,
          pointerEvents: "none",
          right,
          bottom,
          top,
          left,
        }}
      />
    </>
  );
};

export default ReusableShape;
