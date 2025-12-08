import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import { PermissionCard } from "./PermissionCard";

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
}

interface PermissionListProps {
  permissions: Permission[];
  selectedPermissions: Record<string, boolean>;
  onTogglePermission: (permissionId: string) => void;
  activeModule: string | null;
  activeEntity: string | null;
}

export const PermissionList: React.FC<PermissionListProps> = ({
  permissions,
  selectedPermissions,
  onTogglePermission,
  activeModule,
  activeEntity,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const categorizePermissions = (permissions: Permission[]) => {
    const categorized: Record<string, Permission[]> = {};
    const ungroupedKey = "ungrouped";

    permissions.forEach((permission) => {
      const parts = permission.code.split("_");
      if (parts.length > 2) {
        const category = parts[2];
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(permission);
      } else {
        if (!categorized[ungroupedKey]) {
          categorized[ungroupedKey] = [];
        }
        categorized[ungroupedKey].push(permission);
      }
    });

    // Ensure 'ungrouped' is at the end if it exists, for consistent ordering
    const sortedCategories = Object.keys(categorized).sort((a, b) => {
      if (a === ungroupedKey) return 1;
      if (b === ungroupedKey) return -1;
      return a.localeCompare(b);
    });

    const sortedCategorized: Record<string, Permission[]> = {};
    sortedCategories.forEach((category) => {
      sortedCategorized[category] = categorized[category];
    });

    return sortedCategorized;
  };

  const categorizedPermissions = categorizePermissions(permissions);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        p: 3,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.8
        )} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
        borderRadius: "12px",
      }}
    >
      <AnimatePresence mode="popLayout">
        {permissions.length > 0 ? (
          <Box>
            {Object.entries(categorizedPermissions).map(([category, perms]) => (
              <Accordion
                key={category}
                expanded={expanded === category}
                onChange={handleChange(category)}
                sx={{
                  mt: 2,
                  "&:first-of-type": { mt: 0 },
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      textTransform:
                        category === "ungrouped" ? "capitalize" : "none",
                    }}
                  >
                    {category} Permissions
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "start",
                      gap: 2,
                    }}
                  >
                    {perms.map((permission, index) => (
                      <motion.div
                        key={permission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <PermissionCard
                          permission={permission}
                          isSelected={!!selectedPermissions[permission.id]}
                          onToggle={onTogglePermission}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 6,
                borderRadius: "12px",
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 15V17M12 7V13M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Box>

              <Typography
                variant="h6"
                fontWeight="500"
                color="text.primary"
                gutterBottom
              >
                {activeModule && !activeEntity
                  ? "Select an Entity"
                  : "Select a Module"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: "400px" }}
              >
                {activeModule && !activeEntity
                  ? `Choose an entity from the ${activeModule} module to view available permissions.`
                  : "Select a module and entity from the sidebar to view and manage permissions."}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
