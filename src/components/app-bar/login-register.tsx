import Link from "next/link";
import { Button, Stack } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function LoginRegister() {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        component={Link}
        href="/auth"
        variant="outlined"
        size="small"
        startIcon={<LoginIcon fontSize="small" />}
        sx={{
          fontWeight: 600,
          px: 2.5,
          textTransform: "none",
          color: "text.primary", // Ensure this resolves to high contrast in your theme
          borderColor: "grey.700", // Higher contrast than "divider"
          "&:hover": {
            borderColor: "primary.main",
            color: "primary.main",
            backgroundColor: "action.hover",
          },
        }}
      >
        sign in
      </Button>

      <Button
        component={Link}
        href="/auth"
        variant="contained"
        size="small"
        startIcon={<PersonAddIcon fontSize="small" />}
        sx={{
          fontWeight: 600,
          px: 2.5,
          textTransform: "none",
          boxShadow: "none",
          backgroundColor: "section.main",
          color: "section.contrastText",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "primary.dark",
          },
        }}
      >
        sign up
      </Button>
    </Stack>
  );
}
