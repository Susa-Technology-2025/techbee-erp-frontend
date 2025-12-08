"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import DashActions from "../dash-actions";
import DesktopNav from "./desktop-nav";
import {
  getCurrentModule,
  getCurrentEntity,
  getCurrentHub,
} from "./sidebar-utils";
interface SimpleNavObject {
  id: string;
  name: string;
  emojie: string;
  link: string;
}
type CurrentHub = SimpleNavObject;
type CurrentModule = SimpleNavObject;
type CurrentEntity = SimpleNavObject;
const ResponsiveNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const initialModule = getCurrentModule(pathname);
  const initialEntity = getCurrentEntity(pathname);
  const initialHub = getCurrentHub(initialModule);
  const [selectedHub, setSelectedHub] = useState<CurrentHub | null>(initialHub);
  const [selectedModule, setSelectedModule] = useState<CurrentModule | null>(
    initialModule
  );
  const [selectedEntity, setSelectedEntity] = useState<CurrentEntity | null>(
    initialEntity
  );
  useEffect(() => {
    const newModule = getCurrentModule(pathname);
    const newEntity = getCurrentEntity(pathname);
    const newHub = getCurrentHub(newModule);
    setSelectedHub(newHub);
    setSelectedModule(newModule);
    setSelectedEntity(newEntity);
  }, [pathname]);
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleHubSelect = (hub: CurrentHub) => {
    setSelectedHub(hub);
    setSelectedModule(null);
    setSelectedEntity(null);
    handleNavigation(hub.link);
  };
  const handleModuleSelect = (hub: CurrentHub, module: CurrentModule) => {
    setSelectedHub(hub);
    setSelectedModule(module);
    setSelectedEntity(null);
    handleNavigation(module.link);
  };
  const handleEntitySelect = (
    hub: CurrentHub,
    module: CurrentModule,
    entity: CurrentEntity
  ) => {
    setSelectedHub(hub);
    setSelectedModule(module);
    setSelectedEntity(entity);
    handleNavigation(entity.link);
  };
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) return null;
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "transparent",
        border: 0,
        p: 0,
        m: 0,
      }}
    >
      <Toolbar
        sx={{
          m: 0,
          p: 0,
        }}
      >
        <DesktopNav
          selectedHub={selectedHub}
          selectedModule={selectedModule}
          selectedEntity={selectedEntity}
          onSelectHub={handleHubSelect}
          onSelectModule={handleModuleSelect}
          onSelectEntity={handleEntitySelect}
          onNavigate={handleNavigation}
        />
        <DashActions />
      </Toolbar>
    </AppBar>
  );
};
export default ResponsiveNavbar;
