import { Box, Container, Typography } from "@mui/material";
import { Suspense } from "react";

const VideoSection = () => {
  return (
    <>
      <style>
        {`
          @keyframes floatUpDown {
            0% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0); }
          }

          .floating-sphere-1 {
            animation: floatUpDown 6s ease-in-out infinite;
          }

          .floating-sphere-2 {
            animation: floatUpDown 8s ease-in-out infinite;
            animation-delay: 1s;
          }
        `}
      </style>

      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "background.paper",
          py: { xs: 6, md: 10 },
        }}
      >
        {/* Floating Gradient Spheres */}
        <Box
          className="floating-sphere-1"
          sx={{
            position: "absolute",
            top: { xs: "-60px", md: "-80px" },
            left: { xs: "10%", md: "15%" },
            width: { xs: 100, md: 140 },
            height: { xs: 100, md: 140 },
            borderRadius: "50%",
            backgroundColor: "section.main",

            opacity: 0.85,
            zIndex: 1,
          }}
        />
        <Box
          className="floating-sphere-2"
          sx={{
            position: "absolute",
            bottom: { xs: "-60px", md: "-80px" },
            right: { xs: "10%", md: "15%" },
            width: { xs: 120, md: 160 },
            height: { xs: 120, md: 160 },
            borderRadius: "50%",
            backgroundColor: "section.main",
            opacity: 0.85,
            zIndex: 1,
          }}
        />

        {/* Soft Abstract Curve */}
        <Box
          sx={{
            position: "absolute",
            width: "300%",
            height: "200%",
            top: "-50%",
            left: "-100%",
            borderRadius: "50% 50% 40% 60% / 60% 40% 60% 50%",
            bgcolor: "background.default",
            opacity: 0.05,
            zIndex: 0,
            transform: "rotate(15deg)",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", mb: 4, color: "text.primary" }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              See How We Help Businesses Thrive
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real stories from clients who’ve transformed their business with
              our platform.
            </Typography>
          </Box>
          <Suspense fallback={"loading video ...."}>
            <VideoSectionn />
          </Suspense>
        </Container>
      </Box>
    </>
  );
};

export default VideoSection;

const VideoSectionn = async function () {
  const idd = await Promise.resolve(performance.now());

  return (
    <Box
      sx={{
        position: "relative",
        paddingTop: "56.25%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 18,
        // bgcolor: "background.default",
      }}
    >
      <video
        src={`/videos/clients.mp4?cacheBust=${idd}`} // ✅ Force reload on nav
        title="Client Success Story"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};
