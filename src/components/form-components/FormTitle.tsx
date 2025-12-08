"use client";

import { Typography } from "@mui/material";

export const FormTitle = ({ title }: { title: string }) => (
  <Typography variant="h4" component="h1" gutterBottom>
    {title}
  </Typography>
);
