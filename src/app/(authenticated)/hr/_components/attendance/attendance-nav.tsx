import ActiveLink from "@/app/(authenticated)/hr/_components/active-link";
import { Box } from "@mui/material";

const navItems = [
  { label: "Attendance", path: "/hr/attendance" },
  { label: "Leave Requests", path: "/hr/attendance/leave-requests" },
  { label: "Leave Types", path: "/hr/attendance/leave-types" },
  { label: "Time Off Types", path: "/hr/attendance/time-off-types" },
  { label: "Exits", path: "/hr/attendance/exits" },
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
        }}
      >
        {navItems.map(({ label, path }) => (
          <ActiveLink key={label} href={path}>
            {label}
          </ActiveLink>
        ))}
      </Box>
    </Box>
  );
}
