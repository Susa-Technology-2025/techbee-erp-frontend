"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  Link,
  Chip,
  Skeleton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  OpenInNew,
  CalendarToday,
  Whatshot,
  Insights as InsightsIcon,
} from "@mui/icons-material";

interface InsightsItem {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface InsightsSectionProps {
  data: InsightsItem[];
  loading: boolean;
}

export const Insights: React.FC<InsightsSectionProps> = ({ data, loading }) => {
  const theme = useTheme();

  const getPriorityIcon = (sortOrder: number) => {
    switch (sortOrder) {
      case 1:
        return {
          icon: <Whatshot sx={{ fontSize: 14 }} />,
          label: "New",
          color: theme.palette.success.main,
        };
      case 2:
        return {
          icon: <InsightsIcon sx={{ fontSize: 14 }} />,
          label: "Update",
          color: theme.palette.info.main,
        };
      default:
        return {
          icon: <InsightsIcon sx={{ fontSize: 14 }} />,
          label: "Insight",
          color: theme.palette.primary.main,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Shapes - Different from Announcements */}
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 350,
            height: 350,
            bgcolor: "primary.main",
            clipPath: "ellipse(25% 40% at 70% 30%)",
            zIndex: 0,
            opacity: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 280,
            height: 280,
            bgcolor: "info.main",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            zIndex: 0,
            opacity: 1,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            Product Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Latest features and updates
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          {[1, 2, 3, 4].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                flex: "1 1 300px",
                maxWidth: 300,
                height: 160,
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  flex: 1,
                  borderRadius: 2,
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 6,
        px: 3,
        mx: "auto",
        position: "relative",
        overflow: "hidden",
        width: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "90%",
          height: "80%",
          bgcolor: "backgroundSection.main",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          zIndex: 0,
          opacity: 1,
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Product Insights
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem" }}
        >
          Latest features and updates
        </Typography>
      </Box>

      {/* Insights Container */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "stretch",
          position: "relative",
          zIndex: 1,
        }}
      >
        {data.map((insight) => {
          const priorityInfo = getPriorityIcon(insight.sortOrder);

          return (
            <Box
              key={insight.id}
              sx={{
                display: "flex",
                flex: "1 1 300px",
                maxWidth: 300,
                height: 160,
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: theme.palette.background.paper,
                  boxShadow: `0 2px 12px ${alpha(
                    theme.palette.common.black,
                    0.08
                  )}`,
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "visible",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 24px ${alpha(
                      theme.palette.common.black,
                      0.12
                    )}`,
                    border: `1px solid ${alpha(priorityInfo.color, 0.3)}`,
                  },
                }}
              >
                {/* Priority Indicator Bar */}
                <Box
                  sx={{
                    display: "flex",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 3,
                    background: `linear-gradient(90deg, ${
                      priorityInfo.color
                    }, ${alpha(priorityInfo.color, 0.7)})`,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />

                <Link
                  href={insight.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    flex: 1,
                    textDecoration: "none",
                    color: "inherit",
                    p: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header Row */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Chip
                        icon={priorityInfo.icon}
                        label={priorityInfo.label}
                        size="small"
                        sx={{
                          display: "flex",
                          bgcolor: alpha(priorityInfo.color, 0.1),
                          color: priorityInfo.color,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 22,
                          "& .MuiChip-icon": {
                            color: `${priorityInfo.color} !important`,
                            marginLeft: "4px !important",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarToday
                          sx={{
                            display: "flex",
                            fontSize: 12,
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            color: "text.secondary",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(insight.updatedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Content Area */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Title */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          display: "-webkit-box",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          lineHeight: 1.3,
                          fontSize: "0.95rem",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1,
                        }}
                      >
                        {insight.title}
                      </Typography>

                      {/* Message Preview */}
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          lineHeight: 1.3,
                          color: theme.palette.text.secondary,
                          fontSize: "0.8rem",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          opacity: 0.8,
                          mb: 1,
                        }}
                      >
                        {insight.message}
                      </Typography>

                      {/* CTA Link */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: priorityInfo.color,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          {insight.ctaText}
                        </Typography>
                        <OpenInNew
                          sx={{
                            fontSize: 12,
                            color: priorityInfo.color,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
