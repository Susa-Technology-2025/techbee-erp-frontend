// src/styles/styled.ts
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Card,
  Button,
  Tabs,
  Tab,
  CardContent,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

export const GlassPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  overflow: "hidden",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
  backdropFilter: "blur(5px)",
  borderRadius: "12px",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 28px 0 rgba(0, 0, 0, 0.1)",
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: "50px",
  color: "white",
  padding: "8px 20px",
  fontWeight: 600,
  boxShadow: "0 4px 15px 0 rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 8px 25px 0 rgba(0, 0, 0, 0.2)",
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: "3px",
    borderRadius: "2px",
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.8rem",
  textTransform: "none",
  minHeight: "50px",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

export const AnimatedListItem = styled(motion.div)(() => ({
  width: "100%",
}));

export const StyledPermissionCard = styled(StyledCard)(({ theme }) => ({
  padding: theme.spacing(1),
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const PermissionCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  "&:last-child": {
    paddingBottom: theme.spacing(1),
  },
}));

export const PermissionContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  background: "transparent",
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px 0 rgba(0,0,0,0.15)",
  },
}));
