import { Box } from "@mui/material";
import HubCard from "./card";
import { navItems as filteredNavItems } from "@/components/nav-items/nav-links-index";
import { NavItem } from "@/components/nav-items/nav-items-utils";
export function HubCardGrid() {
  const navItems =filteredNavItems
  const hubs = navItems.filter(
    (module: NavItem) => module.hub && !module.module && !module.entity
  );
  const hubModules = (currentHub: string) =>
    navItems.filter(
      (module: NavItem) =>
        module.hub === currentHub && module.module && !module.entity
    );
  return (
    <Box sx={{ mb: 4, width: "85%", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        {hubs.map((hub: NavItem) => (
          <HubCard key={hub.link} hub={hub} modules={hubModules(hub.hub)} />
        ))}
      </Box>
    </Box>
  );
}
