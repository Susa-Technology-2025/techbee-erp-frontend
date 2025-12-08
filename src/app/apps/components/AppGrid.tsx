"use client";
import React from "react";
import { Grid, Grow, Box, Typography } from "@mui/material";
import AppCard from "./AppCard";
import { mainDashCards as apps } from "@/lib/store/constants/dash-cards/main-dash-cards";

type Package = (typeof apps)[0];

interface AppGridProps {
  filteredApps: Package[];
  favorites: string[];
  toggleFavorite: (title: string) => void;
  handleFeatureClick: (app: Package, feature: any) => void;
  handleSubscribeClick: (app: Package) => void;
}

const AppGrid: React.FC<AppGridProps> = ({
  filteredApps,
  favorites,
  toggleFavorite,
  handleFeatureClick,
  handleSubscribeClick,
}) => {
  return (
    <Grid container spacing={3}>
      {filteredApps.map((app, index) => (
        <Grow in={true} timeout={200 * (index % 6)} key={app.title}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AppCard
              app={app}
              isFavorite={favorites.includes(app.title)}
              toggleFavorite={toggleFavorite}
              handleFeatureClick={handleFeatureClick}
              handleSubscribeClick={handleSubscribeClick}
              index={index}
            />
          </Grid>
        </Grow>
      ))}
      {filteredApps.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            borderRadius: 4,
            width: "100%",
          }}
        ></Box>
      )}
    </Grid>
  );
};

export default AppGrid;
