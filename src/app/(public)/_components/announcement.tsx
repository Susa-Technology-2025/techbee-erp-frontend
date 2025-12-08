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
import { OpenInNew, CalendarToday, Whatshot } from "@mui/icons-material";

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementCardProps {
  data: AnnouncementItem[];
  loading: boolean;
}

export const Announcements: React.FC<AnnouncementCardProps> = ({
  data,
  loading,
}) => {
  const theme = useTheme();

  const getPriorityIcon = (sortOrder: number) => {
    switch (sortOrder) {
      case 1:
        return {
          icon: <Whatshot sx={{ fontSize: 14 }} />,
          label: "Urgent",
          color: theme.palette.error.main,
        };
      case 2:
        return {
          icon: <Whatshot sx={{ fontSize: 14 }} />,
          label: "Important",
          color: theme.palette.warning.main,
        };
      default:
        return {
          icon: null,
          label: "Update",
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
        {/* Background Shapes */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            bgcolor: "section.main",
            clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
            zIndex: 0,
            opacity: 0.1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            bgcolor: "section.main",
            clipPath: "circle(40% at 30% 70%)",
            zIndex: 0,
            opacity: 0.08,
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
            Company Updates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Latest news and announcements
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
                flex: "1 1 280px",
                maxWidth: 280,
                height: 140,
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
      {/* Background Shapes */}
      <Box
        sx={{
          position: "absolute",
          top: -150,
          right: -150,
          width: "100%",
          height: "100%",
          bgcolor: "section.main",
          clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
          zIndex: 0,
          opacity: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: "100%",
          height: "100%",
          bgcolor: "backgroundSection.main",
          clipPath: "circle(35% at 20% 80%)",
          zIndex: 0,
          opacity: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "5%",
          width: 120,
          height: 120,
          bgcolor: "section.main",
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          zIndex: 0,
          opacity: 0.05,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "40%",
          right: "8%",
          width: 180,
          height: 180,
          bgcolor: "section.main",
          clipPath:
            "polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)",
          zIndex: 0,
          opacity: 0.06,
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
          Company Updates
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem" }}
        >
          Latest news and announcements
        </Typography>
      </Box>

      {/* News Container */}
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
        {data.map((announcement) => {
          const priorityInfo = getPriorityIcon(announcement.sortOrder);

          return (
            <Box
              key={announcement.id}
              sx={{
                display: "flex",
                flex: "1 1 280px",
                maxWidth: 280,
                height: 140,
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
                  href={announcement.ctaLink}
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
                          {formatDate(announcement.updatedAt)}
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
                        {announcement.title}
                      </Typography>

                      {/* Message Preview */}
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          lineHeight: 1.3,
                          color: theme.palette.text.secondary,
                          fontSize: "0.8rem",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          opacity: 0.8,
                        }}
                      >
                        {announcement.message}
                      </Typography>
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
