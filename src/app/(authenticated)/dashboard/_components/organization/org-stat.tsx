import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

interface OrganizationStatsProps {
  total: number;
  active: number;
  saas: number;
  nonSaaS: number;
}

const CARD_WIDTH = 100;
const CARD_HEIGHT = 100;

const OrganizationStats: React.FC<OrganizationStatsProps> = ({
  total,
  active,
  saas,
  nonSaaS,
}) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ flexGrow: 1, maxWidth: { md: "calc(100% - 200px)" } }}
    >
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "primary.main", mb: 0.5 }}>
              {total}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Organizations
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "success.main", mb: 0.5 }}>
              {active}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Active
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "info.main", mb: 0.5 }}>
              {saas}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              SaaS
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "warning.main", mb: 0.5 }}>
              {nonSaaS}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Non-SaaS
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrganizationStats;
