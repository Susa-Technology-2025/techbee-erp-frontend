import { AppBar, Toolbar, Stack, Box, Grid, Skeleton } from "@mui/material";

export default function DesktopNavbarSkeleton() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "background.paper",
        display: { xs: "none", lg: "block" },
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          mx: "auto",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px",
        }}
      >
        <Skeleton variant="rounded" width={120} height={30} />

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <Box key={item}>
              <Skeleton variant="text" width={60} height={30} />
            </Box>
          ))}
        </Stack>

        <Grid
          container
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ width: "auto" }}
        >
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="rounded" width={80} height={30} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
