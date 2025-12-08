"use client";

import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

type RHFSubmitButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export const RHFSubmitButton = ({
  loading = false,
  children,
  sx = {},
}: RHFSubmitButtonProps) => (
  <Button
    type="submit"
    variant="contained"
    size="large"
    disabled={loading}
    loading={loading}
    sx={{
      px: 4,
      py: 1.5,
      fontWeight: 600,
      textTransform: "none",
      boxShadow: "none",
      ...sx,
    }}
  >
    {children}
  </Button>
);
