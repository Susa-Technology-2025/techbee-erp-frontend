"use client";
import React, { useState } from "react";
import { Box, Grow } from "@mui/material";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import AppGrid from "./components/AppGrid";
import CTA from "./components/CTA";
import FeaturesDialog from "./components/FeaturesDialog";
import SubscribeDialog from "./components/SubscribeDialog";
import { mainDashCards as apps } from "@/lib/store/constants/dash-cards/main-dash-cards";
import {
  BackgroundSection,
  Navigation,
} from "../(public)/_components/main-landing";

type Package = (typeof apps)[0];

const TechBeeAppsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Package | null>(null);
  const [showFeaturesDialog, setShowFeaturesDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const toggleFavorite = (title: string) => {
    if (favorites.includes(title)) {
      setFavorites(favorites.filter((fav) => fav !== title));
    } else {
      setFavorites([...favorites, title]);
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "favorites")
      return matchesSearch && favorites.includes(app.title);
    return matchesSearch && app.category === activeFilter;
  });

  const handleFeatureClick = (app: Package, feature: any) => {
    setSelectedApp(app);
    setSelectedFeature(feature);
    setShowFeaturesDialog(true);
  };

  const handleSubscribeClick = (app: Package) => {
    setSelectedApp(app);
    setShowSubscribeDialog(true);
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        // bgcolor: "background.paper",
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none",
        color: "section.contrastText",
        px: 2,
        pb: 4,
      }}
    >
      <BackgroundSection />
      <Navigation />
      <Header />
      <Grow in={true} timeout={1200}>
        <div>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
      </Grow>
      <AppGrid
        filteredApps={filteredApps}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        handleFeatureClick={handleFeatureClick}
        handleSubscribeClick={handleSubscribeClick}
      />
      <CTA />
      <FeaturesDialog
        open={showFeaturesDialog}
        onClose={() => setShowFeaturesDialog(false)}
        selectedApp={selectedApp}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        handleSubscribeClick={handleSubscribeClick}
      />
      <SubscribeDialog
        open={showSubscribeDialog}
        onClose={() => setShowSubscribeDialog(false)}
        selectedApp={selectedApp}
      />
    </Box>
  );
};

export default TechBeeAppsPage;
