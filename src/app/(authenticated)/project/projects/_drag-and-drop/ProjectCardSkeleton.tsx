"use client";
import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

const ProjectCardSkeleton: React.FC = () => {
  return (
    <Card className="transition-all duration-200">
      <CardContent className="p-4">
        <Box className="flex justify-between items-start mb-2">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Box>

        <Skeleton variant="text" width="40%" height={20} className="mb-2" />
        <Skeleton variant="text" height={20} className="mb-3" />
        <Skeleton variant="text" height={20} className="mb-3" />

        <Box className="flex justify-between items-center mb-2">
          <Skeleton variant="text" width="30%" height={18} />
          <Skeleton variant="text" width="40%" height={18} />
        </Box>

        <Box className="flex justify-between items-center mb-2">
          <Skeleton variant="text" width="30%" height={18} />
          <Skeleton variant="text" width="40%" height={18} />
        </Box>

        <Box className="flex justify-between items-center">
          <Skeleton variant="text" width="30%" height={18} />
          <Box className="flex items-center space-x-2">
            <Skeleton variant="rectangular" width={48} height={6} />
            <Skeleton variant="text" width={20} height={18} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCardSkeleton;
