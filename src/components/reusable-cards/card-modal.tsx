import {
  Modal,
  Box,
  Typography,
  Avatar,
  Grid,
  IconButton,
  useTheme,
  Chip, // <-- Added Chip import
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NextLink from "next/link";
import { motion } from "framer-motion";
import Link from "next/link";
import { NavItem } from "@/components/nav-items/nav-items-utils";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "70%", md: "60%", lg: "50%" },
  maxWidth: 750,
  maxHeight: "60vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  outline: "none",
  overflow: "hidden",
};
interface HubModalProps {
  open: boolean;
  onClose: () => void;
  modules: NavItem[];
  hub: NavItem;
}
export default function HubModal({
  open,
  onClose,
  modules,
  hub,
}: HubModalProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const scrollableMaxHeight = "calc(60vh - 180px)";
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {}
        <Box
          sx={{
            p: 4,
            pb: 2,
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.paper",
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton
            onClick={onClose}
            aria-label={`Close ${hub.name} details`}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              component={Link}
              href={hub.link}
              sx={{
                bgcolor: primaryColor,
                color: theme.palette.getContrastText(primaryColor),
                width: 48,
                height: 48,
                fontSize: "1.5rem",
                mr: 2,
              }}
            >
              {hub.emojie}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {hub.name}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            component={Link}
            href={hub.link}
            color="text.secondary"
            sx={{ pl: "64px" }}
          >
            {hub.description}
          </Typography>
        </Box>
        {}
        <Box
          sx={{
            p: 4,
            pt: 2,
            maxHeight: scrollableMaxHeight,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ mb: 1.5, display: "block" }}
            >
              Available Modules ({modules.length})
            </Typography>
            <Grid container spacing={1}>
              {modules.map((moduleItem: NavItem) => {
                const descriptionText =
                  moduleItem.description || "No description available.";
                const isDisabled = !moduleItem.active;
                return (
                  <Grid size={{ xs: 12 }} key={moduleItem.link}>
                    <Box
                      component={isDisabled ? "div" : NextLink}
                      href={isDisabled ? "#" : moduleItem.link}
                      onClick={isDisabled ? undefined : onClose}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        p: 2,
                        borderRadius: 1,
                        transition: "all 0.2s ease",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        "&:hover": isDisabled
                          ? {}
                          : {
                              bgcolor: theme.palette.action.hover,
                              boxShadow: theme.shadows[1],
                              transform: "translateY(-1px)",
                            },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          mr: 2,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[800]
                              : theme.palette.grey[200],
                          color: "text.primary",
                          fontSize: "1.2rem",
                        }}
                      >
                        {moduleItem.emojie}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                          >
                            {moduleItem.name}
                          </Typography>
                          {isDisabled && (
                            <Chip
                              label="Premium"
                              size="small"
                              color="warning"
                              variant="outlined"
                              sx={{
                                height: 20,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                ".MuiChip-label": {
                                  px: 1,
                                },
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {descriptionText}
                        </Typography>
                      </Box>
                      <ArrowForwardIosIcon
                        sx={{ color: "text.disabled", fontSize: 16, ml: 2 }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </Modal>
  );
}
