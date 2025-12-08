"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ShieldIcon from "@mui/icons-material/Shield";
import Link from "next/link";
import { Paper } from "@mui/material";
import DashActions from "@/components/dash-actions";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "section.main",
        p: 4,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Reassuring Header */}
      <DashActions />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "800px",
          mb: 6,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            mb: 3,
            p: "12px 20px",
            borderRadius: "50px",
            border: "1px solid rgba(25, 118, 210, 0.2)",
          }}
        >
          <ShieldIcon
            sx={{
              mr: 1,
              color: "primary.main",
              fontSize: "1.2rem",
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            TechBee System Protection Active
          </Typography>
        </Box>

        <Typography
          variant="h4"
          component={motion.h3}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "white",
            letterSpacing: "0.5px",
          }}
        >
          We've Hit a Small Snag
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            maxWidth: "600px",
            mb: 3,
            opacity: 0.9,
            lineHeight: 1.7,
          }}
        >
          Don't worry - this minor issue has been automatically reported to our
          team. While we work on it, you can try refreshing or contact support
          below.
        </Typography>
      </Box>

      {/* Visual Indicator */}
      <Box
        sx={{
          position: "relative",
          mb: 5,
          "& > div": {
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "2px dashed rgba(25, 118, 210, 0.3)",
            animation: "spin 20s linear infinite",
            "@keyframes spin": { "100%": { transform: "rotate(360deg)" } },
          },
        }}
      >
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 48,
              color: "primary.main",
              "& path": {
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.8 },
                  "50%": { opacity: 1 },
                },
              },
            }}
          />
        </Box>
      </Box>

      <Paper>{JSON.stringify(error)}</Paper>

      {/* Recovery Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "700px",
          mb: 5,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Auto Fix Card */}
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              p: 3,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <AutoFixHighIcon
              sx={{
                fontSize: 40,
                color: "primary.light",
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Automatic Repair
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Our systems are already working to resolve this
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={reset}
                sx={{
                  background:
                    "linear-gradient(45deg, #1976D2 0%, #2196F3 100%)",
                  color: "white",
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                Reload
              </Button>
              <Button
                variant="contained"
                component={Link}
                href={"/"}
                sx={{
                  background:
                    "linear-gradient(45deg, #1976D2 0%, #2196F3 100%)",
                  color: "white",
                  borderRadius: "8px",
                  width: "100%",
                }}
              >
                Go Home
              </Button>
            </Box>
          </Box>

          {/* Support Card */}
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              p: 3,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                p: "10px",
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                borderRadius: "50%",
                mb: 2,
              }}
            >
              <PhoneIcon
                sx={{
                  fontSize: 24,
                  color: "primary.light",
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Our support team is standing by
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                textAlign: "left",
                p: 2,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="body2">+251964792216</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1, fontSize: "1rem" }} />
                <Typography variant="body2">support@susa.sa</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Status Footer */}
      <Box
        sx={{
          mt: 3,
          textAlign: "center",
          opacity: 0.7,
          fontSize: "0.9rem",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          Incident ID: {error.digest || "N/A"} • {new Date().toLocaleString()}
        </Typography>
        <Typography variant="body2">
          TechBee Technology Solutions • Automated Monitoring Active
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
