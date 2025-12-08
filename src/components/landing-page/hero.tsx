"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  Stack,
  Divider,
  useTheme,
  Link,
  Skeleton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PlayArrow as PlayIcon,
  Announcement as AnnouncementIcon,
  Insights as InsightsIcon,
  ContactSupport as ContactIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import ToggleTheme from "@/theme/toogle-theme";
interface Tutorial {
  id: string;
  title: string;
  url: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
interface Insight {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
interface Announcement {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
interface MediaObject {
  id: string;
  typeField: string;
  url: string;
  alt: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
interface ClientData {
  code: string;
  name: string;
  logo: string;
  headline: string;
  description: string;
  tutorials: Tutorial[];
  insights: Insight[];
  announcements: Announcement[];
  media: MediaObject[];
}
const BackgroundSlideshow: React.FC<{ media?: MediaObject[] }> = ({
  media,
}) => {
  const images = useMemo(
    () => media?.filter((item) => item.typeField === "Image") || [],
    [media]
  );
  const [currentImage, setCurrentImage] = useState(images[0]?.url || "");
  const intervalTime = 5000;
  useEffect(() => {
    if (images.length === 0) return;
    setCurrentImage(images[0].url);
    if (images.length <= 1) return;
    let index = 0;
    const timer = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index].url);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [images]);
  if (images.length === 0) {
    return (
      <Card elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Skeleton variant="rectangular" height={400} />
      </Card>
    );
  }
  return (
    <Card elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          height: 400,
          borderRadius: 2,
          backgroundImage: `url(${currentImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      />
    </Card>
  );
};
const ClientLanding: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCode, setPageCode] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const parts = hostname.split(".");
      const code =
        parts[0] === "localhost" || parts[0].includes(":")
          ? "default"
          : parts[0];
      setPageCode(code);
    }
  }, []);
  useEffect(() => {
    if (!pageCode) return;
    const API_ENDPOINT = `https://api.techbee.et/api/core/landingPages?where[code]=${pageCode}`;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-code": pageCode,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: { data: ClientData[] } = await response.json();
        if (
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setData(result.data[0]);
        } else {
          setError(`No landing page found for code: ${pageCode}`);
          setData(null);
        }
      } catch (e) {
        console.error("Fetching error:", e);
        setError("Failed to load content. Please try again.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageCode]);
  const currentYear = new Date().getFullYear();
  const PlaceholderSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "80%" }} />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.5rem", width: "90%", mb: 4 }}
          />
          <Stack direction="row" spacing={2}>
            <Skeleton
              variant="rectangular"
              width={180}
              height={50}
              sx={{ borderRadius: 25 }}
            />
            <Skeleton
              variant="rectangular"
              width={150}
              height={50}
              sx={{ borderRadius: 25 }}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Skeleton
            variant="rectangular"
            height={250}
            sx={{ borderRadius: 2, mt: 4 }}
          />
        </Grid>
      </Grid>
    </Container>
  );
  if (loading || !pageCode) {
    return (
      <Box
        sx={{
          height: "100vh",
          overflow: "auto",
          bgcolor: theme.palette.background.default,
        }}
      >
        <PlaceholderSkeleton />
      </Box>
    );
  }
  if (error || !data) {
    return (
      <Container maxWidth="md" sx={{ py: 20, textAlign: "center" }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error Loading Page Content
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error ||
            `The landing page for code '${pageCode}' could not be loaded or is unavailable.`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 4 }}
        >
          Try Reloading
        </Button>
      </Container>
    );
  }
  const clientData: ClientData = data;

  const platformName = `${clientData.name} ERP`;
  const tutorials = clientData.tutorials || [];
  const announcements = clientData.announcements || [];
  const insights = clientData.insights || [];
  const media = clientData.media || [];
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "auto",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pt: 8,
          pb: 8,
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                Welcome to {platformName} ERP
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: "text.primary" }}>
                {clientData.description}
              </Typography>
              <Button
                variant="contained"
                size="large"
                color="primary"
                href="/auth"
                startIcon={<DashboardIcon />}
                sx={{ px: 4, py: 1.5, mr: 2, fontWeight: 600 }}
              >
                Enter the Workspace
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                href="#tutorials"
                sx={{ px: 4, py: 1.5, fontWeight: 600 }}
              >
                View Guides
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <BackgroundSlideshow media={media} />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" sx={{ py: 4 }} id="tutorials">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={4}
              sx={{ borderLeft: `5px solid ${theme.palette.primary.main}` }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <PlayIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
                  <Typography variant="h5" component="h2" fontWeight={700}>
                    Quick Start Tutorials
                  </Typography>
                </Box>
                {tutorials.length > 0 ? (
                  <Stack spacing={2}>
                    {tutorials.map((tutorial, index) => (
                      <Button
                        key={tutorial.id || index}
                        variant="text"
                        color="primary"
                        fullWidth
                        href={tutorial.url}
                        endIcon={<PlayIcon />}
                        sx={{
                          justifyContent: "space-between",
                          py: 1.5,
                          px: 2,
                          bgcolor: theme.palette.primary.light + "10",
                          "&:hover": {
                            bgcolor: theme.palette.primary.light + "20",
                          },
                        }}
                      >
                        {tutorial.title}
                      </Button>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No tutorials available at this time.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={4}
              sx={{ borderLeft: `5px solid ${theme.palette.error.main}` }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <AnnouncementIcon
                    color="error"
                    sx={{ mr: 1, fontSize: 32 }}
                  />
                  <Typography variant="h5" component="h2" fontWeight={700}>
                    Latest Platform Updates
                  </Typography>
                </Box>
                {announcements.length > 0 ? (
                  <Stack spacing={3}>
                    {announcements.map((announcement, index) => (
                      <Box key={announcement.id || index}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight={600}
                        >
                          {announcement.title}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {announcement.message}
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          color="error"
                          href={announcement.ctaLink}
                        >
                          {announcement.ctaText}
                        </Button>
                        {index < announcements.length - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No announcements at this time.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
            <Card
              elevation={4}
              sx={{ borderLeft: `5px solid ${theme.palette.secondary.main}` }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <InsightsIcon
                    color="secondary"
                    sx={{ mr: 1, fontSize: 32 }}
                  />
                  <Typography variant="h5" component="h2" fontWeight={700}>
                    Actionable Insights for {clientData.name}
                  </Typography>
                </Box>
                {insights.length > 0 ? (
                  <Grid container spacing={3}>
                    {insights.map((insight, index) => (
                      <Grid size={{ xs: 12, md: 6 }} key={insight.id || index}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 3,
                            height: "100%",
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            fontWeight={700}
                            color="secondary.main"
                          >
                            {insight.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            paragraph
                            sx={{ minHeight: 40 }}
                          >
                            {insight.message}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            href={insight.ctaLink}
                          >
                            {insight.ctaText}
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">
                    No insights available at this time.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default ClientLanding;
