import { AnimatePresence, motion } from "framer-motion";
import { useTheme, alpha } from "@mui/material/styles";
import type { JSX } from "react";
import { styled } from "@mui/system";
import { Tab } from "@mui/material";

export const SectionPanel = ({
  children,
  active,
}: {
  children: JSX.Element;
  active: boolean;
}) => {
  const theme = useTheme();

  const initialBg = alpha(theme.palette.background.paper, 0.7);

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20, backgroundColor: initialBg }}
          animate={{
            opacity: 1,
            y: 0,
            backgroundColor: theme.palette.background.paper,
          }}
          exit={{ opacity: 0, y: -20, backgroundColor: initialBg }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ElegantTab = styled(Tab)(({ theme }) => ({
  position: "relative",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  letterSpacing: "0.25px",
  minHeight: 48,
  padding: theme.spacing(0, 3),
  color: alpha(theme.palette.text.primary, 0.8),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },

  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "transparent",
    transform: "scaleX(0)",
    transformOrigin: "center",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:focus": { outline: "none", borderRadius: 0 },

  "&.Mui-selected::after": {
    backgroundColor: theme.palette.primary.main,
    transform: "scaleX(1)",
  },
}));
