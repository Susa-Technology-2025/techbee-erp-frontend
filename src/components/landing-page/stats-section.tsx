import React from "react";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Link from "next/link";

const statsData = [
  { label: "Users Worldwide", value: "5k+" },
  { label: "Automated Tasks Daily", value: "100k+" },
  { label: "Countries Supported", value: "3" },
  { label: "Avg. Efficiency Gain", value: "40%" },
];

export default function SusaErpStats() {
  return (
    <>
      <style>{`
        section.susa-stats-section {
          border-top-left-radius: 100px;
          padding: 5rem 1rem 7rem 1rem;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .waterflow-shape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 140px;
          background: linear-gradient(to right, #1565c0, #4fc3f7);
          clip-path: ellipse(75% 100% at 50% 100%);
          z-index: -1;
        }
      `}</style>

      <Box
        component="section"
        className="susa-stats-section"
        sx={{
          backgroundColor: "section.main",
          color: "section.contrastText",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            Accelerate Business with Smart ERP
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 620,
              mx: "auto",
              opacity: 0.9,
              mb: 5,
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "section.contrastText",
            }}
          >
            TechBee ERP is a powerful, cloud-first platform designed to unify
            your operations, optimize workflows, and drive intelligent growth —
            from finance to field service.
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
            {statsData.map((stat, i) => (
              <Grid
                key={i}
                size={{ xs: 6, sm: 4, md: 2 }}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "section.contrastText",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    opacity: 0.85,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    color: "section.contrastText",
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            component={Link}
            href="/demo"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: "30px",
              backgroundColor: "section.dark",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(21,101,192,0.3)",
              color: "section.contrastText",
              "&:hover": {
                backgroundColor: "section.main",
              },
            }}
          >
            Request a Demo
          </Button>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 4, opacity: 0.85, color: "section.contrastText" }}
          >
            Trusted by global enterprises across finance, healthcare, logistics,
            and more.
          </Typography>

          <Box sx={{ mt: 8, textAlign: "left" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3, textAlign: "center", color: "section.contrastText" }}
            >
              Why Businesses Choose TechBee ERP
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "section.contrastText" }}
                >
                  Unified Platform
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, color: "section.contrastText" }}
                >
                  Integrate accounting, HR, inventory, CRM, and more in one
                  intelligent system.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "section.contrastText" }}
                >
                  Fast, Scalable Deployment
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, color: "section.contrastText" }}
                >
                  Launch in weeks, not months — and scale with confidence as
                  your business grows.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: "section.contrastText" }}
                >
                  AI-Driven Insights
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, color: "section.contrastText" }}
                >
                  Make data-driven decisions with built-in analytics and
                  predictive intelligence.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>

        <div className="waterflow-shape" />
      </Box>
    </>
  );
}
