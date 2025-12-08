import React from "react";
import {
  Typography,
  Checkbox,
  Box,
  useTheme,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

interface PermissionCardProps {
  permission: Permission;
  isSelected: boolean;
  onToggle: (permissionId: string) => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  permission,
  isSelected,
  onToggle,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      style={{ width: "250px" }}
    >
      <Card
        variant="outlined"
        onClick={() => onToggle(permission.id)}
        sx={{
          cursor: "pointer",

          border: `1px solid ${
            isSelected
              ? alpha(theme.palette.primary.main, 0.3)
              : theme.palette.divider
          }`,
          backgroundColor: isSelected
            ? alpha(theme.palette.primary.light, 0.08)
            : theme.palette.background.paper,
          boxShadow: isSelected
            ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.12)}`
            : "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
          overflow: "visible",
          position: "relative",
          borderLeft: 4,
          borderLeftColor: "primary.main",
          "&:hover": {
            borderColor: isSelected
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            boxShadow: isSelected
              ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
              : "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      >
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 2.5 } }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              color: isSelected
                ? theme.palette.primary.dark
                : theme.palette.text.primary,
              transition: "color 0.2s ease",
              lineHeight: 1.3,
              mb: 1,
              pr: 3,
            }}
          >
            {permission.name}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              transform: isSelected ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            <Checkbox
              checked={isSelected}
              color="primary"
              size="small"
              sx={{
                p: 0.5,
                color: isSelected
                  ? theme.palette.primary.main
                  : theme.palette.grey[400],
                "&.Mui-checked": {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Box>

          {/* Content */}
          <Box>
            {permission.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {permission.description}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
