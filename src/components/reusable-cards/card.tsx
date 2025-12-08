"use client";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Fade,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import HubModal from "./card-modal";
import { NavItem } from "@/components/nav-items/nav-items-utils";
export default function HubCard({
  hub,
  modules,
}: {
  hub: NavItem;
  modules: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) return null;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Fade in timeout={800}>
        <Card
          className={`card-${hub.link}`}
          sx={{
            width: 120,
            height: 120,
            p: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s ease",
            bgcolor: "background.paper",
            boxShadow: `0 3px 8px rgba(0,0,0,0.15)`,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: `0 6px 12px rgba(0,0,0,0.15)`,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, #1976d2, #9c27b0)`,
              opacity: 0.7,
              transition: "opacity 0.2s ease",
            },
          }}
        >
          <CardActionArea
            component="button"
            aria-label={hub.name}
            onClick={handleOpen}
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 1.5,
              "&:hover": {
                "& .MuiBox-root": {
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  border: `1.5px solid rgba(25, 118, 210, 0.3)`,
                  "& svg": { color: "#1976d2" },
                },
                "& .MuiTypography-subtitle2": {
                  color: "#1976d2",
                },
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                p: 0.5,
                mb: 0.5,
                backgroundColor: "transparent",
                transition: "all 0.2s ease",
                border: `1.5px solid rgba(25, 118, 210, 0.1)`,
                "& svg": {
                  transition: "all 0.2s ease",
                  color: "text.primary",
                  fontSize: "1.4rem",
                },
              }}
            >
              {hub.emojie}
            </Box>
            <CardContent sx={{ textAlign: "center", p: 0 }}>
              <Typography
                variant="subtitle2"
                className="MuiTypography-subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: "center",
                  color: "text.primary",
                  mb: 0,
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                  lineHeight: 1.2,
                }}
              >
                {hub.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Fade>
      {}
      <HubModal open={open} onClose={handleClose} modules={modules} hub={hub} />
    </>
  );
}
