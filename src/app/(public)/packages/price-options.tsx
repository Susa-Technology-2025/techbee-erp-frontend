"use client";

import { useState } from "react";
import { Tabs, Tab, Chip, Box, Grid } from "@mui/material";
import PackageCard from "./package-card";

export default function TabsClient({ packages }: any) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Billing cycle tabs"
          sx={{
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          <Tab
            label="Monthly Billing"
            sx={{ px: 4, fontWeight: 600, color: "section.contrastText" }}
          />
          <Tab
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "section.contrastText",
                }}
              >
                Yearly Billing
                <Chip
                  label="Save 15%"
                  size="small"
                  color="primary"
                  sx={{ ml: 1, fontWeight: 700 }}
                />
              </Box>
            }
            sx={{ px: 4, fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        {packages.map((pkg: any) => (
          <Grid key={pkg.name} size={{ xs: 12, md: 6, lg: 3 }}>
            <PackageCard
              pkg={pkg}
              price={tabIndex === 0 ? pkg.prices.monthly : pkg.prices.yearly}
              billingCycle={tabIndex === 0 ? "monthly" : "yearly"}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
