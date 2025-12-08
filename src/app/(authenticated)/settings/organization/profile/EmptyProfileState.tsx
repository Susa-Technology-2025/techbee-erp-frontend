// src/components/profile/EmptyProfileState.tsx
import React from "react";
import { Box, Paper, Typography, Button, Avatar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

export function EmptyProfileState({ onCreate }: { onCreate: () => void }) {
  return (
    <Paper
      elevation={3}
      sx={{ p: { xs: 4, md: 6 }, textAlign: "center", mb: 3, borderRadius: 2 }}
    >
      <Avatar
        sx={{
          width: 90,
          height: 90,
          margin: "0 auto 24px",
          bgcolor: "primary.light",
        }}
      >
        <PersonAdd sx={{ fontSize: 50, color: "primary.dark" }} />
      </Avatar>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Set Up Your Profile
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 400, margin: "0 auto 24px" }}
      >
        It looks like you haven't created a profile yet. Personalize your
        experience by setting up your details now.
      </Typography>
      <Button
        variant="contained"
        startIcon={<PersonAdd />}
        onClick={onCreate}
        size="large"
      >
        Create Profile
      </Button>
    </Paper>
  );
}
