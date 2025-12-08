import { Box } from "@mui/material";

export const clipPaths = {
  diagonalBottom: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
  diagonalTop: "polygon(0 20%, 100% 0, 100% 100%, 0 100%)",
  diagonalLeft: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
  diagonalRight: "polygon(0 0, 80% 0, 100% 100%, 0 100%)",
  diagonalZigzag: "polygon(0 0, 100% 10%, 100% 90%, 0 100%)",
  diagonalSlice: "polygon(0 0, 100% 15%, 100% 85%, 0 100%)",
  steepDiagonal: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
  shallowDiagonal: "polygon(0 0, 100% 0, 100% 90%, 0 95%)",
  splitDiagonal: "polygon(0 0, 100% 10%, 100% 90%, 0 100%)",
  diagonalDoubleCut: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
  invertedDiagonalBottom: "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
  invertedDiagonalTop: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)",
  sideDiagonalLeft: "polygon(0 0, 100% 10%, 100% 100%, 0 90%)",
  sideDiagonalRight: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
  diagonalStaggered: "polygon(0 0, 100% 5%, 100% 95%, 0 100%)",
  sharpDiagonalBottom: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
  sharpDiagonalTop: "polygon(0 15%, 100% 0, 100% 100%, 0 100%)",
  longDiagonalCut: "polygon(0 0, 100% 25%, 100% 75%, 0 100%)",
  thinDiagonalBand: "polygon(0 40%, 100% 30%, 100% 70%, 0 60%)",
  diagonalStripe: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
  waveBottom: 'path("M0,0 L100%,0 L100%,90 Q50,100 0,90 Z")',
  curveInward: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
  notchTop: "polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 100%, 0 100%)",
  triangleBottom: "polygon(0 0, 100% 0, 50% 100%)",
  triangleTop: "polygon(50% 0, 100% 100%, 0 100%)",
  trapezoid: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
  ellipse: "ellipse(50% 50% at 50% 50%)",
  rhombus: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
  curvedCircleLarge: "ellipse(60% 60% at 50% 50%)",
  curvedCircleSmall: "ellipse(30% 30% at 50% 50%)",
  curvedCircleTopLeft: "ellipse(40% 40% at 25% 25%)",
  curvedCircleBottomRight: "ellipse(40% 40% at 75% 75%)",
  customOne: "polygon(0 0, 100% 0, 100% 23%, 75% 46%, 30% 65%, 0 72%)",
  customTwo: "polygon(100% 100%, 100% 41%, 64% 50%, 22% 71%, 0 85%, 0 100%)",
  customThree: "polygon(100% 100%, 100% 81%, 81% 71%, 21% 73%, 0 85%, 0 100%)",
} as const;

export type ClipPathKey = keyof typeof clipPaths;

export const ReusableBG = () => {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        backgroundColor: "section.main",
        clipPath:
          "polygon(64% 8%, 100% 0, 100% 100%, 78% 100%, 60% 93%, 31% 91%, 0 100%, 0 0, 38% 0)",
      }}
    >
      <path
        fill="currentColor"
        fillOpacity="0.08"
        d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,138.7C840,117,960,107,1080,128C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      />
    </Box>
  );
};
