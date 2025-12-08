"use client";
import Link from "next/link";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AutoAwesome, Rocket, Security, TrendingUp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export function Hero({ code, data }) {
  const theme = useTheme();
  const subscribedTenants = ["minda", "vamdas"];

  const isTechBeeOrERP = !subscribedTenants.includes(code);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "1200px",
          height: "1200px",
          background: theme.palette.primary.light,
          borderRadius: "55% 45% 60% 40% / 50% 60% 40% 50%",
          opacity: 0.18,
          filter: "blur(80px)",
          transform: "translate(-50%, -50%)",
          animation: "slowFloat 22s ease-in-out infinite",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: "100vw",
          height: "100vh",
          background: theme.palette.section.main,
          clipPath:
            "polygon(0 0, 100% 0, 100% 51%, 43% 100%, 25% 100%, 0 100%)",
          // opacity: 0.55,
          // animation: "slowFloat 18s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "160px",
          height: "160px",
          background: theme.palette.secondary.light,
          borderRadius: "50%",
          opacity: 0.25,
          animation: "slowFloat 16s ease-in-out infinite 1s",
        }}
      />

      <Box
        component={Paper}
        elevation={2}
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: { xs: "90%", md: "75%", lg: "950px" },
          textAlign: "center",
          px: { xs: 2, md: 4 },
          p: 2,
          borderRadius: "4px 4px 5px 6px",
        }}
      >
        {isTechBeeOrERP ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                mb: 3,
              }}
            >
              <AutoAwesome
                sx={{
                  fontSize: { xs: 46, md: 62 },
                  color: "primary.main",
                }}
              />
              <Typography
                variant="h1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "3rem", md: "4.5rem", lg: "5.2rem" },
                  color: theme.palette.text.primary,
                }}
              >
                TechBee
              </Typography>
            </Box>

            <Typography
              variant="h2"
              fontWeight={500}
              sx={{
                fontSize: { xs: "1.8rem", md: "2.8rem", lg: "3.2rem" },
                mb: 4,
                color: theme.palette.text.secondary,
              }}
            >
              Enterprise Solutions
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 4,
                justifyContent: "center",
                flexWrap: "wrap",
                mb: 5,
                color: theme.palette.text.primary,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Rocket sx={{ fontSize: 30, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={500}>
                  AI-Powered
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Security sx={{ fontSize: 30, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={500}>
                  Secure
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <TrendingUp sx={{ fontSize: 30, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={500}>
                  Scalable
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                maxWidth: "850px",
                mx: "auto",
                mb: 6,
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
              }}
            >
              Transform operations and drive growth with our streamlined ERP
              platform. Simple, compliant, and built for scale.
            </Typography>
          </>
        ) : (
          <>
            <Typography
              variant="h1"
              fontWeight={700}
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4.5rem" },
                mb: 3,
                color: theme.palette.text.primary,
              }}
            >
              Welcome to {code.toUpperCase()} ERP
            </Typography>

            <Typography
              variant="h3"
              fontWeight={500}
              sx={{
                fontSize: { xs: "1.4rem", md: "2.2rem" },
                mb: 5,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.3,
                color: theme.palette.text.secondary,
              }}
            >
              Streamlined operations through intelligent technology
            </Typography>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/dashboard"
            size="large"
            sx={{
              minWidth: 210,
              height: 56,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.04)",
              },
            }}
          >
            Enter Workspace
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            href={isTechBeeOrERP ? "/demo" : "/tutorial"}
            size="large"
            sx={{
              minWidth: 170,
              height: 56,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.04)",
              },
            }}
          >
            {isTechBeeOrERP ? "View Demo" : "View Guides"}
          </Button>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes slowFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Box>
  );
}
