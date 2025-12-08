"use client";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import CardModal from "./card-modal";

export default function DetailButton({ packageData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        className="detail-button-wrapper"
        sx={{
          position: "absolute",
          bottom: 8,
          opacity: 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          sx={{
            fontSize: "0.6rem",
            py: 0.5,
            px: 1,
            pointerEvents: "auto",
          }}
        >
          Details
        </Button>
      </Box>
      <CardModal
        open={open}
        onClose={() => setOpen(false)}
        title={packageData.title}
        icon={packageData.icon}
        active={packageData.active}
        color={packageData.color}
        description={packageData.description}
        features={packageData.features}
        category={packageData.category}
        onTrial={packageData.onTrial}
        // Since we removed session logic from ModuleCard,
        // we'll default these to non-restrictive values here
        hasAccess={true}
        href={packageData.href}
      />
    </>
  );
}
