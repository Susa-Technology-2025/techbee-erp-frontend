"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Fade,
  Chip,
} from "@mui/material";

const tips = [
  {
    title: "Organize Your Workspace",
    description: "Keep your dashboard tidy by grouping related modules.",
    tag: "Productivity",
    image: "https://picsum.photos/seed/tip1/600/300",
  },
  {
    title: "Master User Roles",
    description: "Assign roles carefully to control access across the system.",
    tag: "Administration",
    image: "https://picsum.photos/seed/tip2/600/300",
  },
  {
    title: "Customize Settings",
    description:
      "Tailor the interface to your preferences using dashboard settings.",
    tag: "Customization",
    image: "https://picsum.photos/seed/tip3/600/300",
  },
  {
    title: "Use Keyboard Shortcuts",
    description: "Boost efficiency by learning dashboard shortcuts.",
    tag: "Efficiency",
    image: "https://picsum.photos/seed/tip4/600/300",
  },
];

export default function QuickTips() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[index];

  return (
    <Box
      sx={{
        mt: 6,
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "text.primary",
        }}
      >
        Quick Tip
      </Typography>

      <Fade in timeout={600} key={index}>
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            mx: "auto",
            transition: "all 0.4s ease-in-out",
          }}
        >
          <CardMedia
            component="img"
            image={currentTip.image}
            alt={currentTip.title}
            sx={{ height: 200, objectFit: "cover" }}
          />
          <CardContent sx={{ px: 3, py: 2.5 }}>
            <Chip
              label={currentTip.tag}
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "text.primary",
              }}
            >
              {currentTip.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              {currentTip.description}
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
