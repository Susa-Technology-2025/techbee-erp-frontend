import Link from "next/link";
import { Button, Stack } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TFunction } from "i18next";

export default function LoginRegister() {
  return (
    <Stack
      direction={{ lg: "row", xs: "column" }}
      spacing={2}
      alignItems="center"
    >
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
          color: "text.primary",
          borderColor: "divider",
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
          "&:hover": {
            boxShadow: "none",
            backgroundColor: "primary.dark",
          },
        }}
      >
        register
      </Button>
    </Stack>
  );
}
