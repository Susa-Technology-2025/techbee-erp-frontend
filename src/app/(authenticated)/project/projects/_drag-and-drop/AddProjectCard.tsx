"use client";
import React from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

interface AddProjectCardProps {
  onAddProject: () => void;
}

const AddProjectCard: React.FC<AddProjectCardProps> = ({ onAddProject }) => {
  const theme = useTheme();

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md border-2 border-dashed"
      onClick={onAddProject}
      sx={{
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.default,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-48">
        <Box className="text-center">
          <Box
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto"
            sx={{ backgroundColor: theme.palette.primary.light }}
          >
            <Add
              sx={{
                color: theme.palette.primary.main,
                fontSize: "1.5rem",
              }}
            />
          </Box>
          <Typography variant="subtitle1" className="font-semibold mb-1">
            Add New Project
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            Create a new project
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddProjectCard;
