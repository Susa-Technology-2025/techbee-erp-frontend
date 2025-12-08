import ActiveLink from "@/app/(authenticated)/hr/_components/active-link";
import { Box } from "@mui/material";

const navItems = [
  { label: "training records", path: "/hr/hub/training-records" },
  { label: "benefit plans", path: "/hr/hub/benefit-plans" },
  { label: "displinary action", path: "/hr/hub/disp-action" },
  { label: "internal events", path: "/hr/hub/internal-events" },
];

export default function Navbar() {
  return (
    <Box component="nav">
      <Box
        sx={{
          display: "flex",
          gap: 2,
          py: 1,
          borderBottom: "1px solid #ddd",
          width: "100%",
          overflow: "scroll",
          scrollbarWidth: "none",
          backgroundColor: "backgroundSection.main",
        }}
      >
        {navItems.map(({ label, path }) => (
          <ActiveLink key={path} href={path}>
            {label}
          </ActiveLink>
        ))}
      </Box>
    </Box>
  );
}
