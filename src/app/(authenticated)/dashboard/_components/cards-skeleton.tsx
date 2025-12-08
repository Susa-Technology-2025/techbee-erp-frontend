import { Box, Paper, Skeleton } from "@mui/material";

export default function ModuleCardsSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: { xs: "12px", sm: "16px", md: "24px" },
        my: { xs: 2, md: 4 },
        justifyContent: "center",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: { xs: "auto", sm: "150px", md: "170px", lg: "190px" },
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 1.5, sm: 1.5, md: 2 },
              minHeight: { xs: "90px", sm: "100px", md: "110px", lg: "120px" },
              borderRadius: { xs: "10px", md: "16px" },
              width: "100%",
              maxWidth: { xs: "90%", sm: "160px", md: "180px", lg: "200px" },
            }}
          >
            <Skeleton variant="circular" width={38} height={38} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="90%" height={16} sx={{ mt: 0.5 }} />
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
