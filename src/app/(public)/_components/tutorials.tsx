"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowOutward } from "@mui/icons-material";

interface TutorialCardProps {
  data: any[];
  loading: boolean;
}

const TutorialCard = ({
  tutorial,
  index,
}: {
  tutorial: any;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    whileHover={{ y: -2 }}
  >
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1rem",
              lineHeight: 1.4,
            }}
          >
            {tutorial.title}
          </Typography>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowOutward
              sx={{
                fontSize: 20,
                color: "text.secondary",
                flexShrink: 0,
              }}
            />
          </motion.div>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            Step {tutorial.sortOrder}
          </Typography>
          <Button
            href={tutorial.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: "primary.main",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
              px: 1,
              minWidth: "auto",
              "&:hover": {
                backgroundColor: alpha("#000", 0.04),
              },
            }}
          >
            View Guide
          </Button>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export const Tutorials: React.FC<TutorialCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          Loading tutorials...
        </Typography>
      </Box>
    );
  }

  // Sort tutorials by sortOrder and remove duplicates based on title
  const uniqueTutorials = Array.isArray(data)
    ? data
        .filter(
          (tutorial, index, self) =>
            index === self.findIndex((t) => t.title === tutorial.title)
        )
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {uniqueTutorials.map((tutorial, index) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
