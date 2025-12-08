"use client";

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import {
  performanceTemplateQuestionCreateInputSchema,
  performanceTemplateCreateInputSchema,
  ratingScaleCreateInputSchema,
  ratingScaleOptionCreateInputSchema,
} from "@/lib/schemas/performance/performance-template";

export default function PerformanceTabs() {
  const [value, setValue] = useState(0);

  const schemas = [
    {
      label: "Performance Template",
      schema: performanceTemplateCreateInputSchema,
    },
    {
      label: "Template Questions",
      schema: performanceTemplateQuestionCreateInputSchema,
    },
    { label: "Rating Scale", schema: ratingScaleCreateInputSchema },
    {
      label: "Rating Scale Options",
      schema: ratingScaleOptionCreateInputSchema,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1rem",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 2,
            backgroundColor: "primary.main",
          },
        }}
      >
        {schemas.map((s, i) => (
          <Tab key={i} label={s.label} />
        ))}
      </Tabs>

      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <MaterialTableWrapper schema={schemas[value].schema} />
      </Box>
    </Box>
  );
}
