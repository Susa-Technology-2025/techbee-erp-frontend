"use client";

import {
  Box,
  Container,
  Grid,
  Skeleton,
  useTheme,
  keyframes,
} from "@mui/material";

// Create a subtle pulse animation
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export default function Loading() {
  const theme = useTheme();

  const skeletonStyle = {
    animation: `${pulse} 2s ease-in-out infinite`,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Animated Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{
            mb: 2,
            mx: "auto",
            ...skeletonStyle,
          }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={30}
          sx={{
            mb: 1,
            mx: "auto",
            ...skeletonStyle,
          }}
        />
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 4 }}>
            <Skeleton
              variant="text"
              height={40}
              sx={{ mb: 3, ...skeletonStyle }}
            />
            {[1, 2, 3, 4, 5].map((item) => (
              <Box
                key={item}
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 2, ...skeletonStyle }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={25}
                  sx={{ ...skeletonStyle }}
                />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          {/* Post Cards */}
          {[1, 2, 3].map((post) => (
            <Box
              key={post}
              sx={{
                mb: 4,
                p: 3,
                border: `1px solid ${theme.palette.grey[200]}`,
                borderRadius: 2,
                background: theme.palette.background.paper,
              }}
            >
              {/* Author */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2, ...skeletonStyle }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={20}
                    sx={{ mb: 0.5, ...skeletonStyle }}
                  />
                  <Skeleton
                    variant="text"
                    width="30%"
                    height={15}
                    sx={{ ...skeletonStyle }}
                  />
                </Box>
              </Box>

              {/* Content */}
              <Skeleton
                variant="text"
                height={25}
                sx={{ mb: 1, ...skeletonStyle }}
              />
              <Skeleton
                variant="text"
                height={20}
                width="90%"
                sx={{ mb: 1, ...skeletonStyle }}
              />
              <Skeleton
                variant="text"
                height={20}
                width="70%"
                sx={{ mb: 2, ...skeletonStyle }}
              />

              {/* Image */}
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{
                  borderRadius: 1,
                  mb: 2,
                  ...skeletonStyle,
                }}
              />

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={30}
                  sx={{ ...skeletonStyle }}
                />
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={30}
                  sx={{ ...skeletonStyle }}
                />
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={30}
                  sx={{ ...skeletonStyle }}
                />
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2,
              background: theme.palette.grey[50],
            }}
          >
            <Skeleton
              variant="text"
              height={30}
              sx={{ mb: 3, ...skeletonStyle }}
            />

            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ mb: 3 }}>
                <Skeleton
                  variant="text"
                  height={20}
                  sx={{ mb: 1, ...skeletonStyle }}
                />
                <Skeleton
                  variant="text"
                  height={15}
                  width="60%"
                  sx={{ ...skeletonStyle }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
