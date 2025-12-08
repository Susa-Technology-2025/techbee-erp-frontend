"use client";

import { useEffect, useState } from "react";
import { Alert, AlertProps } from "@mui/material";

export const RHFAlert = ({
  status,
  message,
}: {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}) => {
  const [open, setOpen] = useState(!!message);
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);
  if (!open || !message) return null;

  const mapStatusToSeverity = (
    status: "idle" | "loading" | "success" | "error"
  ): AlertProps["severity"] | undefined => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "loading":
        return "info";
      default:
        return undefined;
    }
  };

  const severity = mapStatusToSeverity(status);

  if (!severity) return null;

  return (
    <Alert severity={severity} variant="filled" onClose={() => setOpen(false)}>
      {message}
    </Alert>
  );
};
