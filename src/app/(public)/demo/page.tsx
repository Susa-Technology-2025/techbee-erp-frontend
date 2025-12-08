"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  IconButton,
  Container,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  PlayArrow,
  Close,
  LocationOn,
  Phone,
  Email,
  Download,
  Schedule,
} from "@mui/icons-material";

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  category: string;
}

export default function DemoPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos: Video[] = [
    {
      id: 1,
      title: "TechBee ERP System",
      description:
        "Comprehensive enterprise resource planning solution that integrates all business processes including finance, HR, inventory, and supply chain management. Streamline your operations with our intelligent ERP platform.",
      videoUrl: "/videos/erp-demo.mp4",
      thumbnail: "https://picsum.photos/400/225?random=1",
      duration: "2:45",
      category: "ERP",
    },
    {
      id: 2,
      title: "Campus Management System",
      description:
        "Complete educational institution management platform featuring student information system, course management, attendance tracking, fee management, and parent-teacher communication portal.",
      videoUrl: "/videos/campus-demo.mp4",
      thumbnail: "https://picsum.photos/400/225?random=2",
      duration: "3:20",
      category: "Education",
    },
    {
      id: 3,
      title: "Pharmacy Management System",
      description:
        "Advanced pharmacy management solution with inventory control, prescription management, billing, patient records, and regulatory compliance features tailored for modern pharmacies.",
      videoUrl: "/videos/pharmacy-demo.mp4",
      thumbnail: "https://picsum.photos/400/225?random=3",
      duration: "2:15",
      category: "Healthcare",
    },
  ];

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ERP":
        return theme.palette.primary.main;
      case "Education":
        return theme.palette.secondary.main;
      case "Healthcare":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.1
        )} 0%, ${alpha(theme.palette.background.default, 0.8)} 50%, ${alpha(
          theme.palette.secondary.light,
          0.1
        )} 100%)`,
        py: 8,
        px: 2,
      }}
    >
      {/* Header */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            pt: 8,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
              p: 3,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <PlayArrow fontSize="large" />
            </Box>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                [theme.breakpoints.down("md")]: {
                  fontSize: "2.5rem",
                },
              }}
            >
              TechBee{" "}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                ERP
              </Box>
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "800px",
              mx: "auto",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Discover how our innovative solutions can transform your business
            operations. Watch our product demos to see the power of TechBee in
            action.
          </Typography>

          <Box
            sx={{
              width: 80,
              height: 4,
              backgroundColor: theme.palette.primary.main,
              mx: "auto",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Video Grid */}
        <Grid container spacing={4}>
          {videos.map((video) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={video.id}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                    "& .play-overlay": {
                      opacity: 1,
                    },
                    "& .video-title": {
                      color: theme.palette.primary.main,
                    },
                  },
                  borderRadius: 4,
                  overflow: "hidden",
                }}
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <Box
                    className="play-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: alpha(theme.palette.common.black, 0.3),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        transform: "scale(0.9)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    >
                      <PlayArrow fontSize="large" />
                    </Box>
                  </Box>
                  <Chip
                    label={video.duration}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: alpha(theme.palette.common.black, 0.8),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                  <Chip
                    label={video.category}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: getCategoryColor(video.category),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography
                    className="video-title"
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      transition: "color 0.3s ease-in-out",
                      minHeight: "64px",
                    }}
                  >
                    {video.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {video.description}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrow />}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}
                  >
                    Watch Demo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Video Dialog */}
      <Dialog
        open={!!selectedVideo}
        onClose={() => {
          setSelectedVideo(null);
          setIsPlaying(false);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >
        {selectedVideo && (
          <>
            {/* Dialog Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {selectedVideo.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedVideo.description}
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setSelectedVideo(null);
                  setIsPlaying(false);
                }}
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.text.secondary, 0.1),
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Video Player */}
            <Box sx={{ position: "relative", backgroundColor: "black" }}>
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: isMobile ? "300px" : "500px",
                  objectFit: "contain",
                }}
                controls
                poster={selectedVideo.thumbnail}
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Play Button Overlay */}
              {!isPlaying && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                    cursor: "pointer",
                  }}
                  onClick={handleVideoPlay}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <PlayArrow fontSize="large" />
                  </Box>
                </Box>
              )}
            </Box>

            {/* Dialog Footer */}
            <Box
              sx={{
                p: 3,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    TechBee ERP Solutions - Product Demo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {selectedVideo.duration}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    sx={{ borderRadius: 3 }}
                  >
                    Brochure
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Schedule />}
                    sx={{ borderRadius: 3 }}
                  >
                    Contact Sales
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Dialog>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: 4,
            p: 6,
            color: "white",
            boxShadow: theme.shadows[8],
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Get a personalized demo of our solutions tailored to your specific
            needs.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "white",
                color: theme.palette.primary.main,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.9),
                },
              }}
            >
              Schedule Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Box>

        {/* Contact Information */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <LocationOn color="primary" />
                <Typography variant="body1" color="text.secondary">
                  3rd Floor, Elilta Real Estate,
                  <br />
                  Sarbet, Addis Ababa, Ethiopia
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Phone color="primary" />
                <Typography variant="body1" color="text.secondary">
                  +251 964 792 216
                  <br />
                  +251 93 981 1170
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Email color="primary" />
                <Typography variant="body1" color="text.secondary">
                  thechbee@gmail.com
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
