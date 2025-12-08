import { Box, Typography, Chip, Button } from "@mui/material";
import {
  PlayCircleOutline,
  Description,
  Star,
  School,
} from "@mui/icons-material";

const TutorialSection = () => {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        mb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <School fontSize="large" color="primary" />
          TechBee ERP Learning Hub
        </Typography>
        <Button variant="outlined" size="small">
          View All Resources
        </Button>
      </Box>

      {/* Quick Launch Pads */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          🚀 Quick Launch Pads
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            py: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {[
            { title: "Getting Started Guide", icon: "📘", progress: 100 },
            { title: "Inventory Mastery", icon: "📦", progress: 75 },
            { title: "Financial Reporting", icon: "💰", progress: 40 },
            { title: "CRM Setup", icon: "👥", progress: 0 },
            { title: "Advanced Analytics", icon: "📊", progress: 20 },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                minWidth: 180,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                boxShadow: 1,
                borderLeft: `4px solid ${
                  item.progress === 100
                    ? "#4CAF50"
                    : item.progress > 0
                    ? "#2196F3"
                    : "#9E9E9E"
                }`,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 3,
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <span style={{ fontSize: "1.5em" }}>{item.icon}</span>
                {item.title}
              </Typography>
              {item.progress > 0 ? (
                <Box
                  sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      bgcolor: "divider",
                      borderRadius: 4,
                      height: 6,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${item.progress}%`,
                        height: 6,
                        bgcolor:
                          item.progress === 100
                            ? "success.main"
                            : "primary.main",
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.progress}%
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Not started
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Video Tutorials */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PlayCircleOutline color="primary" /> Video Tutorials
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {[
            {
              title: "Dashboard Walkthrough",
              duration: "5:23",
              views: "12K",
              isNew: true,
            },
            {
              title: "Sales Order Processing",
              duration: "8:45",
              views: "7.5K",
              isFeatured: true,
            },
            {
              title: "Custom Reports in 5 Min",
              duration: "4:12",
              views: "9.1K",
            },
            {
              title: "User Permissions Setup",
              duration: "6:30",
              views: "3.2K",
            },
          ].map((video, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "100%", sm: 280 },
                p: 0,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.default",
                boxShadow: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  height: 160,
                  bgcolor: "grey.200",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayCircleOutline
                  sx={{
                    fontSize: 48,
                    color: "primary.main",
                    opacity: 0.8,
                    transition: "all 0.3s",
                    "&:hover": { opacity: 1, transform: "scale(1.1)" },
                  }}
                />
                {video.isNew && (
                  <Chip
                    label="NEW"
                    color="success"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontWeight: "bold",
                    }}
                  />
                )}
                {video.isFeatured && (
                  <Chip
                    label="FEATURED"
                    color="warning"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      fontWeight: "bold",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  {video.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    ⏱️ {video.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    👁️ {video.views}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Documentation */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Description color="primary" /> User Manuals & Documentation
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {[
            {
              title: "TechBee ERP Full User Manual (PDF)",
              category: "General",
            },
            { title: "Financial Module Handbook", category: "Finance" },
            { title: "Inventory Management Guide", category: "Operations" },
            { title: "CRM & Sales Playbook", category: "Sales" },
          ].map((doc, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: index % 2 === 0 ? "background.default" : "grey.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Description sx={{ color: "primary.main" }} />
                <Typography variant="body1">{doc.title}</Typography>
              </Box>
              <Chip
                label={doc.category}
                size="small"
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  fontWeight: 500,
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button variant="contained" startIcon={<Star />}>
          Featured Tutorials
        </Button>
        <Button variant="outlined" startIcon={<Description />}>
          Download All Manuals
        </Button>
      </Box>
    </Box>
  );
};

export default TutorialSection;
