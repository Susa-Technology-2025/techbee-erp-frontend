import { Box, Grid, Skeleton } from "@mui/material";

export default () => {
  return (
    <Box
      sx={{
        position: "relative",
        mb: { xs: 3, md: 4 },
        mx: "auto",
        width: "80%",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mr: 2 }}
            />
            <Skeleton width={120} height={24} />
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Skeleton variant="rectangular" width={80} height={36} />
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Skeleton variant="rounded" width={90} height={36} />
          <Skeleton variant="rounded" width={110} height={36} />
        </Grid>
      </Grid>
    </Box>
  );
};
